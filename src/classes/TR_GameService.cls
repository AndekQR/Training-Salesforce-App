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
                SELECT Id, (SELECT Id, Contact__r.Name, Contact__r.Id FROM AnsweredQuestions__r WHERE Contact__r.Id IN :playersIds)
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
}