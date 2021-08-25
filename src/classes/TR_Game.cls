public class TR_Game {
    @AuraEnabled
    public String id { get; set; }
    @AuraEnabled
    public String type { get; set; }
    @AuraEnabled
    public Decimal duration { get; set; }

    public TR_Game() {
    }

    public TR_Game(Game__c game) {
        this.id = game.Id;
        this.type = game.Type__c;
        this.duration = game.Duration__c;
    }
}