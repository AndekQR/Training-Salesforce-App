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

    public class TR_GameBuilder {

        private TR_Game game;

        public TR_GameBuilder() {
            this.game = new TR_Game();
        }

        public TR_GameBuilder setId(String id) {
            this.game.id = id;
            return this;
        }

        public TR_GameBuilder setType(String type) {
            this.game.type = type;
            return this;
        }

        public TR_GameBuilder setDuration(Decimal duration) {
            this.game.duration = duration;
            return this;
        }

        public TR_GameBuilder setQuestions(List<TR_Question> questions) {
            this.game.questions = questions;
            return this;
        }

        public TR_GameBuilder setParticipants(List<TR_Participant> participants) {
            this.game.participants = participants;
            return this;
        }

        public TR_GameBuilder setCreatedTime(Datetime createdTime) {
            this.game.createdTime = createdTime;
            return this;
        }

        public TR_Game build() {
            return this.game;
        }
    }
}