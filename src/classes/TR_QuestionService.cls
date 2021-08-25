public with sharing class TR_QuestionService {
    @AuraEnabled
    public static TR_Question getQuestion(String[] categories, String[] stages) {
        Integer count = [
                SELECT COUNT()
                FROM Question__c
                WHERE Category__c IN :categories AND Stage__c IN :stages
        ];
        Integer rand = Math.floor(Math.random() * count).intValue();
        Question__c question = [
                SELECT Id, Question__c, Answer__c, Category__c, Stage__c
                FROM Question__c
                WHERE Category__c IN :categories AND Stage__c IN :stages
                LIMIT 1
                OFFSET :rand
        ];
        return new TR_Question(question);
    }

    @AuraEnabled
    public static void saveAnsweredQuestion(String questionId, String participantId, String gameId, Boolean isCorrect) {
        AnsweredQuestion__c anQuestion = new AnsweredQuestion__c();
        anQuestion.Contact__c = participantId;
        anQuestion.Game__c = gameId;
        anQuestion.Question__c = questionId;
        anQuestion.Correct__c = isCorrect;
        insert anQuestion;
    }

    @AuraEnabled
    public static List<TR_AnsweredQuestion> getAnsweredQuestions(String gameId, String participantId) {
        List<AnsweredQuestion__c> questions = [
                SELECT Id, Correct__c, Question__r.Question__c
                FROM AnsweredQuestion__c
                WHERE Game__c = :gameId AND Contact__c = :participantId
        ];
        return TR_AnsweredQuestion.mapToAnsweredQuestions(questions);
    }
}