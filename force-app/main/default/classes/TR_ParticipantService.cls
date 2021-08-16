public with sharing class TR_ParticipantService {
    
    @AuraEnabled(cacheable=true)
    public static List<TR_Participant> getAllParticipants(){
        List<Contact> contacts = [
            SELECT Id, Name, Email 
            FROM Contact
            WHERE CreatedDate >= :Date.parse('15/08/2021')
            ORDER BY CreatedDate
            LIMIT 30
        ];
        return TR_Participant.mapToParticipants(contacts);
    }
}
