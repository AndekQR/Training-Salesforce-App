public with sharing class TR_GameController {

    @AuraEnabled
    public static TR_Game createGame(String type, Decimal duration) {
        return TR_GameService.getInstance().createGame(type, duration);
    }

    @AuraEnabled
    public static void finishGame(String gameId) {
        TR_GameService.getInstance().finishGame(gameId);
    }

    @AuraEnabled(Cacheable = true)
    public static Integer countGamesBetweenPlayers(List<String> playersIds) {
        return TR_GameService.getInstance().countGamesBetweenPlayers(playersIds);
    }

    @AuraEnabled
    public static TR_PaginationResponse getArchivedGames(TR_PaginationRequest paginationRequest) {
        return TR_GameService.getInstance().getArchivedGames(paginationRequest);
    }

    @AuraEnabled(Cacheable=true)
    public static List<TR_Participant> getAllParticipants() {
        return TR_GameService.getInstance().getAllParticipants();
    }
}