public class TR_AnsweredQuestion {

    @AuraEnabled
    public String question { get; set; }
    @AuraEnabled
    public Boolean correct { get; set; }
    @AuraEnabled
    public String id { get; set; }

    public TR_AnsweredQuestion() {
    }

    public TR_AnsweredQuestion(AnsweredQuestion__c question) {
        this.id = question.Id;
        this.question = question.Question__r.Question__c;
        this.correct = question.Correct__c;
    }

    public static List<TR_AnsweredQuestion> mapToAnsweredQuestions(List<AnsweredQuestion__c> questions) {
        List<TR_AnsweredQuestion> result = new List<TR_AnsweredQuestion>();
        for (AnsweredQuestion__c question : questions) {
            TR_AnsweredQuestion tmp = new TR_AnsweredQuestion(question);
            result.add(tmp);
        }
        return result;
    }
}