public with sharing class TR_QuestionController {

    @AuraEnabled
    public static List<TR_Question> getQuestion(String[] categories, String[] stages) {
        return TR_QuestionService.getInstance().getQuestion(categories, stages);
    }

    @AuraEnabled
    public static void saveAnsweredQuestion(String questionId, String participantId, String gameId, Boolean isCorrect) {
        TR_QuestionService.getInstance().saveAnsweredQuestion(questionId, participantId, gameId, isCorrect);
    }

    @AuraEnabled
    public static List<TR_Question> getAnsweredQuestions(String gameId, String participantId) {
        return TR_QuestionService.getInstance().getAnsweredQuestions(gameId, participantId);
    }

    @AuraEnabled
    public static void sendSummaryEmail(String participantId, List<AnsweredQuestion__c> questions) {
        TR_QuestionService.getInstance().sendSummaryEmail(participantId, questions);
    }
}