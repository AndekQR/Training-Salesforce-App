public class TR_Game {
    @AuraEnabled
    public String id { get; set; }
    @AuraEnabled
    public String type { get; set; }
    @AuraEnabled
    public Decimal duration { get; set; }
    @AuraEnabled
    public List<TR_Question> questions { get; set; }
    @AuraEnabled
    public List<TR_Participant> participants { get; set; }
    @AuraEnabled
    public Datetime createdTime { get; set; }

    public TR_Game() {
    }

    public TR_Game(Game__c game) {
        this.id = game.Id;
        this.type = game.Type__c;
        this.duration = game.Duration__c;
    }

    public static TR_Game createFullObject(Game__c game) {
        TR_Game trGame = new TR_Game();
        trGame.id = game.Id;
        trGame.type = game.Type__c;
        trGame.duration = game.Duration__c;
        trGame.createdTime = game.CreatedDate;
        trGame.questions = TR_Question.mapToTrQuestions(game.AnsweredQuestions__r);
        Set<Contact> contacts = getContactsWithoutDuplicates(game);
        trGame.participants = TR_Participant.mapToParticipants(new List<Contact>(contacts));
        return trGame;
    }

    private static Set<Contact> getContactsWithoutDuplicates(Game__c game) {
        Set<Contact> contacts = new Set<Contact>();
        for (AnsweredQuestion__c answeredQuestion : game.AnsweredQuestions__r) {
            contacts.add(answeredQuestion.Contact__r);
        }
        return contacts;
    }

    public static List<TR_Game> mapToTrGames(List<Game__c> games) {
        List<TR_Game> trGames = new List<TR_Game>();
        for (Game__c game : games) {
            trGames.add(createFullObject(game));
        }
        return trGames;
    }
}