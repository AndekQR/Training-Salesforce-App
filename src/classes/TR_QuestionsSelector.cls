public with sharing class TR_QuestionsSelector {

    public static List<Question__c> selectQuestionsByCategoryAndStage(String[] categories, String[] stages) {
        String query = 'SELECT Id, Question__c, Answer__c, Category__c, Stage__c FROM Question__c WHERE ' +
                'Category__c IN :categories';
        if (stages != null & !stages.isEmpty()) {
            query = query + ' AND (Stage__c IN :stages OR Stage__c = NULL)';
        }
        return Database.query(query);
    }
}