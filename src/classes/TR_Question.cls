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
    @AuraEnabled
    public String answeredBy { get; set; }
    @AuraEnabled
    public Boolean isAnswerCorrect { get; set; }

    public TR_Question() {
    }

    public TR_Question(AnsweredQuestion__c answeredQuestion) {
        this.id = answeredQuestion.Question__r?.Id;
        this.question = answeredQuestion.Question__r?.Question__c;
        this.answer = answeredQuestion.Id;
        this.category = answeredQuestion.Question__r?.Category__c;
        this.stage = answeredQuestion.Question__r?.Stage__c;
        this.answeredBy = answeredQuestion.Contact__c;
        this.isAnswerCorrect = answeredQuestion.Correct__c;
    }

    public static List<TR_Question> mapToTrQuestions(List<AnsweredQuestion__c> answeredQuestions) {
        List<TR_Question> trQuestions = new List<TR_Question>();
        for (AnsweredQuestion__c answeredQuestion : answeredQuestions) {
            TR_Question trQuestion = new TR_Question(answeredQuestion);
            trQuestions.add(trQuestion);
        }
        return trQuestions;
    }

    public class TR_QuestionBuilder {

        private TR_Question question;

        public TR_QuestionBuilder() {
            this.question = new TR_Question();
        }

        public TR_QuestionBuilder setId(String id) {
            this.question.id = id;
            return this;
        }

        public TR_QuestionBuilder setQuestion(String question) {
            this.question.question = question;
            return this;
        }

        public TR_QuestionBuilder setAnswer(String answer) {
            this.question.answer = answer;
            return this;
        }

        public TR_QuestionBuilder setCategory(String category) {
            this.question.category = category;
            return this;
        }

        public TR_QuestionBuilder setStage(String stage) {
            this.question.stage = stage;
            return this;
        }

        public TR_QuestionBuilder setAnsweredBy(String answeredBy) {
            this.question.answeredBy = answeredBy;
            return this;
        }

        public TR_QuestionBuilder setIsAnswerCorrect(Boolean isAnswerCorrect) {
            this.question.isAnswerCorrect = isAnswerCorrect;
            return this;
        }

        public TR_Question build() {
            return this.question;
        }
    }
}