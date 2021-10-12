public with sharing class TR_QuestionService{
	@AuraEnabled
	public static List<TR_Question> getQuestion(String[] categories, String[] stages){
		String query = 'SELECT Id, Question__c, Answer__c, Category__c, Stage__c FROM Question__c WHERE ' +
				'Category__c IN :categories';
		if(stages != null & !stages.isEmpty()) {
			query = query + ' AND Stage__c IN :stages';
		}
//		List<Question__c> questions = [SELECT Id, Question__c, Answer__c, Category__c, Stage__c
//		                               FROM Question__c
//		                               WHERE Category__c IN :categories AND Stage__c IN :stages];
		List<Question__c> questions = Database.query(query);
		List<TR_Question> questionsWrapper = new List<TR_Question>();
		for (Question__c question : questions){
			TR_Question wrapper = new TR_Question(question);
			questionsWrapper.add(wrapper);
		}
		return questionsWrapper;
	}

	@AuraEnabled
	public static void saveAnsweredQuestion(String questionId, String participantId, String gameId, Boolean isCorrect){
		AnsweredQuestion__c anQuestion = new AnsweredQuestion__c();
		anQuestion.Contact__c = participantId;
		anQuestion.Game__c = gameId;
		anQuestion.Question__c = questionId;
		anQuestion.Correct__c = isCorrect;
		insert anQuestion;
	}

	@AuraEnabled
	public static List<TR_AnsweredQuestion> getAnsweredQuestions(String gameId, String participantId){
		List<AnsweredQuestion__c> questions = [SELECT Id, Correct__c, Question__r.Question__c
		                                       FROM AnsweredQuestion__c
		                                       WHERE Game__c = :gameId AND Contact__c = :participantId];
		sendSummaryEmail(participantId, questions);
		return TR_AnsweredQuestion.mapToAnsweredQuestions(questions);
	}

	@AuraEnabled
	public static void sendSummaryEmail(String participantId, List<AnsweredQuestion__c> questions){
		Contact contact = [SELECT Email, Id FROM Contact WHERE Id = :participantId];
		try{
			Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
			message.setTargetObjectId(contact.Id);
			message.optOutPolicy = 'FILTER';
			message.subject = 'Game Summary';
			String body = '<html><body>' + parseQuestions(questions)+'</body></html>';
			message.setHtmlBody(body);
			Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>{message};
			Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
		} catch (Exception e) {
			System.debug(e.getMessage());
		}
	}

	private static String parseQuestions(List<AnsweredQuestion__c> questions){
		String result = '<ul>';
		for (AnsweredQuestion__c question : questions){
			result += '<li style="font-size: 16px; color: #000000;">' + question.Question__r.Question__c + '&nbsp;';
			if (question.Correct__c){
				result += '<span style="color: #00FF00;font-size:20px">&#10003;<span>';
			} else{
				result += '<span style="color: #FF0000;font-size:20px">&#10005;<span>';
			}
			result += '</l1>';
		}
		result += '</ul>';
		return result;
	}
}