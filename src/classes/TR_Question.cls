public class TR_Question {
    @AuraEnabled
    public String id { get; set; }
    @AuraEnabled
    public String question { get; set; }
    @AuraEnabled
    public String answer { get; set; }
    @AuraEnabled
    public String category { get; set; }
    @AuraEnabled
    public String stage { get; set; }

    public TR_Question() {
    }

    public TR_Question(Question__c question) {
        this.id = question.Id;
        this.question = question.Question__c;
        this.answer = question.Answer__c;
        this.category = question.Category__c;
        this.stage = question.Stage__c;
    }
}