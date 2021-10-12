public class TR_PaginationRequest {
    @AuraEnabled
    public Integer pageNumber { get; set; }
    @AuraEnabled
    public Integer pageSize { get; set; }
    @AuraEnabled
    public String searchQuery { get; set; }
}