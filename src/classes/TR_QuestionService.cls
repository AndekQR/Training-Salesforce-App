public with sharing class TR_QuestionService {

    private static TR_QuestionService instance;

    public static TR_QuestionService getInstance() {
        if (instance == null) {
            instance = new TR_QuestionService();
        }
        return instance;
    }

    public List<TR_Question> getQuestion(String[] categories, String[] stages) {
        List<Question__c> questions = TR_QuestionsSelector.selectQuestionsByCategoryAndStage(categories, stages);
        List<TR_Question> questionsWrapper = new List<TR_Question>();
        for (Question__c question : questions) {
            TR_Question trQuestion = new TR_Question.TR_QuestionBuilder()
                    .setId(question.Id)
                    .setQuestion(question.Question__c)
                    .setAnswer(question.Answer__c)
                    .setCategory(question.Category__c)
                    .setStage(question.Stage__c)
                    .build();
            questionsWrapper.add(trQuestion);
        }
        return questionsWrapper;
    }

    public void saveAnsweredQuestion(String questionId, String participantId, String gameId, Boolean isCorrect) {
        AnsweredQuestion__c anQuestion = new AnsweredQuestion__c();
        anQuestion.Contact__c = participantId;
        anQuestion.Game__c = gameId;
        anQuestion.Question__c = questionId;
        anQuestion.Correct__c = isCorrect;
        insert anQuestion;
    }

    public List<TR_Question> getAnsweredQuestions(String gameId, String participantId) {
        List<AnsweredQuestion__c> questions = TR_AnsweredQuestionsSelector.selectAnsweredQuestionsByGameAndParticipant(gameId, participantId);
        sendSummaryEmail(participantId, questions);
        List<TR_Question> result = new List<TR_Question>();
        for (AnsweredQuestion__c answeredQuestion : questions) {
            TR_Question trQuestion = new TR_Question.TR_QuestionBuilder()
                    .setId(answeredQuestion.Question__r.Id)
                    .setQuestion(answeredQuestion.Question__r.Question__c)
                    .setAnswer(answeredQuestion.Question__r.Answer__c)
                    .setCategory(answeredQuestion.Question__r.Category__c)
                    .setStage(answeredQuestion.Question__r.Stage__c)
                    .setAnsweredBy(answeredQuestion.Contact__c)
                    .setIsAnswerCorrect(answeredQuestion.Correct__c)
                    .build();
            result.add(trQuestion);
        }
        return result;
    }

    public void sendSummaryEmail(String participantId, List<AnsweredQuestion__c> questions) {
        List<Contact> contacts = TR_ContactsSelector.selectContactById(participantId);
        try {
            Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
            message.setTargetObjectId(contacts[0].Id);
            message.optOutPolicy = 'FILTER';
            message.subject = 'Game Summary';
            String body = '<html><body>' + parseQuestions(questions) + '</body></html>';
            message.setHtmlBody(body);
            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>{
                    message
            };
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
    }

    private String parseQuestions(List<AnsweredQuestion__c> questions) {
        String result = '<ul>';
        for (AnsweredQuestion__c question : questions) {
            result += '<li style="font-size: 16px; color: #000000;">' + question.Question__r.Question__c + '&nbsp;';
            if (question.Correct__c) {
                result += '<span style="color: #00FF00;font-size:20px">&#10003;<span>';
            } else {
                result += '<span style="color: #FF0000;font-size:20px">&#10005;<span>';
            }
            result += '</l1>';
        }
        result += '</ul>';
        return result;
    }
}