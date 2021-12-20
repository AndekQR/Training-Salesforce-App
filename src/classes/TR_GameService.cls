public with sharing class TR_GameService {

    private static TR_GameService instance;

    public static TR_GameService getInstance() {
        if (instance == null) {
            instance = new TR_GameService();
        }
        return instance;
    }

    public TR_Game createGame(String type, Decimal duration) {
        Game__c game = new Game__c();
        game.Archived__c = false;
        game.Duration__c = duration;
        game.Type__c = type;
        insert game;
        return new TR_Game.TR_GameBuilder()
                .setId(game.Id)
                .setType(game.Type__c)
                .setDuration(game.Duration__c)
                .build();
    }

    public void finishGame(String gameId) {
        Game__c game = new Game__c();
        game.Id = gameId;
        game.Archived__c = true;
        update game;
    }

    public Integer countGamesBetweenPlayers(List<String> playersIds) {
        List<Game__c> playersGames = TR_GamesSelector.selectGamesByPlayersIds(new Set<String>(playersIds));
        Integer result = 1;
        for (Game__c game : playersGames) {
            Set<String> participantsIds = new Set<String>();
            for (AnsweredQuestion__c ansQu : game.AnsweredQuestions__r) {
                participantsIds.add(ansQu.Contact__r.Id);
            }
            if (participantsIds.size() == 2) {
                result++;
            }
        }
        return result;
    }

    private Set<Id> getGamesByParticipantName(String name) {
        Set<Id> gamesIds = new Set<Id>();
        List<Contact> contacts = TR_ContactsSelector.selectContactsByName(name);
        for (Contact contact : contacts) {
            for (AnsweredQuestion__c answeredQuestion : contact.AnsweredQuestions__r) {
                gamesIds.add(answeredQuestion.Game__c);
            }
        }
        return gamesIds;
    }

    private List<TR_Game> getAllArchivedGames(Integer pageNumber, Integer pageSize) {
        return this.getArchivedGamesByParticipants(pageNumber, pageSize, null);
    }

    private List<TR_Game> getArchivedGamesByParticipants(Integer pageNumber, Integer pageSize, Set<Id> ids) {
        List<Game__c> archivedGames = TR_GamesSelector.selectArchivedGames(pageNumber, pageSize, ids);
        List<TR_Game> result = new List<TR_Game>();
        for (Game__c game : archivedGames) {
            List<TR_Participant> trParticipants = this.getContactsWithoutDuplicates(game);
            List<TR_Question> trQuestions = TR_Question.mapToTrQuestions(game.AnsweredQuestions__r);
            TR_Game trGame = new TR_Game.TR_GameBuilder()
                    .setId(game.Id)
                    .setCreatedTime(game.CreatedDate)
                    .setType(game.Type__c)
                    .setDuration(game.Duration__c)
                    .setQuestions(trQuestions)
                    .setParticipants(trParticipants)
                    .build();
            result.add(trGame);
        }
        return result;
    }


    public TR_PaginationResponse getArchivedGames(TR_PaginationRequest paginationRequest) {
        removeBadGameRecords();
        List<TR_Game> trGames = new List<TR_Game>();
        if (String.isNotBlank(paginationRequest.searchQuery)) {
            Set<Id> ids = getGamesByParticipantName(paginationRequest.searchQuery);
            trGames = getArchivedGamesByParticipants(paginationRequest.pageNumber, paginationRequest.pageSize, ids);
            return new TR_PaginationResponse.TR_PaginationResponseBuilder()
                    .setAllItemsSize(ids.size())
                    .setPageNumber(paginationRequest.pageNumber)
                    .setPageSize(paginationRequest.pageSize)
                    .setData(trGames)
                    .build();
        } else {
            trGames = getAllArchivedGames(paginationRequest.pageNumber, paginationRequest.pageSize);
            return new TR_PaginationResponse.TR_PaginationResponseBuilder()
                    .setAllItemsSize(TR_GamesSelector.selectArchivedGamesSize())
                    .setPageNumber(paginationRequest.pageNumber)
                    .setPageSize(paginationRequest.pageSize)
                    .setData(trGames)
                    .build();
        }
    }

    public void removeBadGameRecords() {
        Set<String> gamesIds = TR_AnsweredQuestionsSelector.selectGamesIdsWithoutAnsweredQuestions();
        List<Game__c> gamesToDelete = new List<Game__c>();
        for (String str : gamesIds) {
            gamesToDelete.add(new Game__c(Id = str));
        }
        delete gamesToDelete;
    }

    public List<TR_Participant> getAllParticipants() {
        List<Contact> contacts = TR_ContactsSelector.selectAllContacts();
        return TR_Participant.mapToParticipants(contacts);
    }

    private List<TR_Participant> getContactsWithoutDuplicates(Game__c game) {
        Set<TR_Participant> participants = new Set<TR_Participant>();
        for (AnsweredQuestion__c answeredQuestion : game.AnsweredQuestions__r) {
            TR_Participant participant = new TR_Participant.TR_ParticipantBuilder()
                    .setId(answeredQuestion.Contact__r.Id)
                    .setName(answeredQuestion.Contact__r.Name)
                    .setEmail(answeredQuestion.Contact__r.Email)
                    .build();
            participants.add(participant);
        }
        return new List<TR_Participant>(participants);
    }
}