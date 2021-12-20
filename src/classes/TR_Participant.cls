public class TR_Participant {

    @AuraEnabled
    public String id { get; set; }
    @AuraEnabled
    public String name { get; set; }
    @AuraEnabled
    public String email { get; set; }

    public TR_Participant(Contact contact) {
        this.id = contact.Id;
        this.name = contact.Name;
        this.email = contact.Email;
    }

    public Boolean equals(Object obj) {
        if (obj instanceof TR_Participant) {
            TR_Participant trParticipant = (TR_Participant) obj;
            return (this.id == trParticipant.id &&
                    this.name == trParticipant.name &&
                    this.email == trParticipant.email);
        }
        return false;
    }

    public override Integer hashCode() {
        Integer tmp = 7;
        tmp = tmp & this.id.hashCode();
        if(this.name != null) {
            tmp = tmp & this.name.hashCode();
        }
        if(this.email != null) {
            tmp = tmp & this.email.hashCode();
        }
        return tmp;
    }

    public TR_Participant() {
    }

    public static List<TR_Participant> mapToParticipants(List<Contact> contacts) {
        List<TR_Participant> result = new List<TR_Participant>();
        for (Contact contact : contacts) {
            TR_Participant tmp = new TR_Participant(contact);
            result.add(tmp);
        }
        return result;
    }


    public class TR_ParticipantBuilder {

        private TR_Participant participant;

        public TR_ParticipantBuilder() {
            this.participant = new TR_Participant();
        }

        public TR_ParticipantBuilder setId(String id) {
            this.participant.id = id;
            return this;
        }

        public TR_ParticipantBuilder setName(String name) {
            this.participant.name = name;
            return this;
        }

        public TR_ParticipantBuilder setEmail(String email) {
            this.participant.email = email;
            return this;
        }

        public TR_Participant build() {
            return this.participant;
        }
    }
}