public with sharing class TR_GamesSelector {

    public static List<Game__c> selectGamesByPlayersIds(Set<String> playersIds) {
        return [
                SELECT Id, (
                        SELECT Id, Contact__r.Name, Contact__r.Id
                        FROM AnsweredQuestions__r
                        WHERE Contact__r.Id IN :playersIds
                )
                FROM Game__c
        ];
    }

    public static Integer selectArchivedGamesSize() {
        return [
                SELECT COUNT()
                FROM Game__c
                WHERE Archived__c = TRUE
        ];
    }

    public static List<Game__c> selectArchivedGames(Integer pageNumber, Integer pageSize, Set<Id> participantsIds) {
        String query = 'SELECT Id, CreatedDate, Type__c, Duration__c, (' + ' SELECT Id, Contact__c, Correct__c, ' +
                'Question__r.Id,' + ' Question__r.Question__c, Question__r.Category__c,' + ' Question__r.Stage__c, ' +
                'Contact__r.Name, Contact__r.Email, Contact__r.Id' + ' FROM AnsweredQuestions__r' +
                ' ) ' +
                'FROM Game__c';
        if(participantsIds != null && !participantsIds.isEmpty()) {
            query = query + ' WHERE Id IN :participantsIds';
        }
        query = query + ' ORDER BY CreatedDate DESC';
        if(pageNumber != null && pageSize != null) {
            Integer offset = (pageNumber - 1) * pageSize;
            query = query + ' LIMIT :pageSize OFFSET :offset';
        }
        return Database.query(query);
    }
}