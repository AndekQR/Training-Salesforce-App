public with sharing class TR_ContactsSelector {

    public static List<Contact> selectContactById(String contactId) {
        return [
                SELECT Email, Id
                FROM Contact
                WHERE Id = :contactId
        ];
    }

    public static List<Contact> selectAllContacts() {
        return [
                SELECT Id, Name, Email
                FROM Contact
                ORDER BY Name
        ];
    }

    public static List<Contact> selectContactsByName(String name) {
        String query = name + '%';
        return [
                SELECT Id, (SELECT Id, Game__c FROM AnsweredQuestions__r)
                FROM Contact
                WHERE Name LIKE :query
        ];
    }
}