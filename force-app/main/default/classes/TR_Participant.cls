public class TR_Participant {

    @AuraEnabled
    public String id {get; set;}
    @AuraEnabled
    public String name {get; set;}
    @AuraEnabled
    public String email {get; set;}

    public TR_Participant(Contact contact) {
        this.id = contact.Id;
        this.name = contact.Name;
        this.email = contact.Email;
    }

    public TR_Participant(){}

    public static List<TR_Participant> mapToParticipants(List<Contact> contacts) {
        List<TR_Participant> result = new List<TR_Participant>();
        for (Contact contact : contacts) {
            TR_Participant tmp = new TR_Participant(contact);
            result.add(tmp);
        }
        return result;
    }
}
