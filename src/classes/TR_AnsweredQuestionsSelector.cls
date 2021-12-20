public with sharing class TR_AnsweredQuestionsSelector {

    public static List<AnsweredQuestion__c> selectAnsweredQuestionsByGameAndParticipant(String gameId, String participantId) {
        return [
                SELECT Id, Question__r.Id, Question__r.Question__c, Question__r.Category__c, Question__r.Stage__c,
                        Contact__c, Correct__c, Question__r.Answer__c
                FROM AnsweredQuestion__c
                WHERE Game__c = :gameId AND Contact__c = :participantId
        ];
    }

    public static Set<String> selectGamesIdsWithoutAnsweredQuestions() {
        List<AggregateResult> aggregateResults = [
                SELECT Game__r.Id, COUNT(Id)
                FROM AnsweredQuestion__c
                GROUP BY Game__r.Id
                HAVING COUNT(Id) = 0
        ];
        Set<String> gamesIds = new Set<String>();
        for (AggregateResult aggregateResult : aggregateResults) {
            gamesIds.add(aggregateResult.Id);
        }
        return gamesIds;
    }
}