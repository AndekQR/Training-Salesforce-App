public with sharing class TR_GameService {
    @AuraEnabled
    public static TR_Game createGame(String type, Decimal duration) {
        Game__c game = new Game__c();
        game.Archived__c = false;
        game.Duration__c = duration;
        game.Type__c = type;
        insert game;
        return new TR_Game(game);
    }

    @AuraEnabled
    public static void finishGame(String gameId) {
        Game__c game = new Game__c();
        game.Id = gameId;
        game.Archived__c = true;
        update game;
    }

    @AuraEnabled(Cacheable = true)
    public static Integer countGamesBetweenPlayers(List<String> playersIds) {
        List<Game__c> allGamesWithTheseIds = [
                SELECT Id, (
                        SELECT Id, Contact__r.Name, Contact__r.Id
                        FROM AnsweredQuestions__r
                        WHERE Contact__r.Id IN :playersIds
                )
                FROM Game__c
        ];
        Integer result = 1;
        for (Game__c game : allGamesWithTheseIds) {
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

    private static Set<Id> getGamesByParticipantName(String name) {
        Set<Id> gamesIds = new Set<Id>();
        String query = name + '%';
        List<Contact> contacts = [
                SELECT Id, (SELECT Id, Game__c FROM AnsweredQuestions__r)
                FROM Contact
                WHERE Name LIKE :query
        ];
        for (Contact contact : contacts) {
            for (AnsweredQuestion__c answeredQuestion : contact.AnsweredQuestions__r) {
                gamesIds.add(answeredQuestion.Game__c);
            }
        }
        return gamesIds;
    }

    private static Integer getAllArchivedGamesSize() {
        return [
                SELECT COUNT()
                FROM Game__c
                WHERE Archived__c = TRUE
        ];
    }

    private static List<TR_Game> getAllArchivedGames(Integer pageNumber, Integer pageSize) {
        Integer offset = (pageNumber - 1) * pageSize;
        List<Game__c> archivedGames = [
                SELECT Id, CreatedDate, Type__c, Duration__c, (
                        SELECT Id, Contact__c, Correct__c, Question__r.Id,
                                Question__r.Question__c, Question__r.Category__c,
                                Question__r.Stage__c, Contact__r.Name, Contact__r.Email, Contact__r.Id
                        FROM AnsweredQuestions__r
                )
                FROM Game__c
                ORDER BY CreatedDate DESC
                LIMIT :pageSize
                OFFSET :offset
        ];
        return TR_Game.mapToTrGames(archivedGames);
    }

    private static List<TR_Game> getArchivedGamesByParticipants(Integer pageNumber, Integer pageSize, Set<Id> ids) {
        Integer offset = (pageNumber - 1) * pageSize;
        List<Game__c> archivedGames = [
                SELECT Id, CreatedDate, Type__c, Duration__c, (
                        SELECT Id, Contact__c, Correct__c, Question__r.Id,
                                Question__r.Question__c, Question__r.Category__c,
                                Question__r.Stage__c, Contact__r.Name, Contact__r.Email, Contact__r.Id
                        FROM AnsweredQuestions__r
                )
                FROM Game__c
                WHERE Id IN :ids
                ORDER BY CreatedDate DESC
                LIMIT :pageSize
                OFFSET :offset
        ];
        return TR_Game.mapToTrGames(archivedGames);
    }

    @AuraEnabled
    public static TR_PaginationResponse getArchivedGames(TR_PaginationRequest paginationRequest) {
        removeBadGameRecords();
        List<TR_Game> trGames = new List<TR_Game>();
        if (String.isNotBlank(paginationRequest.searchQuery)) {
            Set<Id> ids = getGamesByParticipantName(paginationRequest.searchQuery);
            trGames = getArchivedGamesByParticipants(paginationRequest.pageNumber, paginationRequest.pageSize, ids);
            return new TR_PaginationResponse(
                    paginationRequest.pageNumber,
                    paginationRequest.pageSize,
                    ids.size(),
                    trGames
            );
        } else {
            trGames = getAllArchivedGames(paginationRequest.pageNumber, paginationRequest.pageSize);
            return new TR_PaginationResponse(
                    paginationRequest.pageNumber,
                    paginationRequest.pageSize,
                    getAllArchivedGamesSize(),
                    trGames
            );
        }
    }

    private static void removeBadGameRecords() {
        List<Game__c> games = [SELECT Id, (SELECT Id FROM AnsweredQuestions__r) FROM Game__c];
        List<Game__c> gamesToDelete = new List<Game__c>();
        for (Game__c game : games) {
            if(game.AnsweredQuestions__r.size() == 0) {
                gamesToDelete.add(game);
            }
        }
        delete gamesToDelete;
    }
}