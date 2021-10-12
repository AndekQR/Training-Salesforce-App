public with sharing class TR_ParticipantService {

    @AuraEnabled(Cacheable=true)
    public static List<TR_Participant> getAllParticipants() {
        List<Contact> contacts = [
                SELECT Id, Name, Email
                FROM Contact
                ORDER BY Name
        ];
        return TR_Participant.mapToParticipants(contacts);
    }
}