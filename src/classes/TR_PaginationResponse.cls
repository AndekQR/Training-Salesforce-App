public class TR_PaginationResponse {
    @AuraEnabled
    public Integer pageNumber { get; set; }
    @AuraEnabled
    public Integer pageSize { get; set; }
    @AuraEnabled
    public Integer allItemsSize { get; set; }
    @AuraEnabled
    public List<TR_Game> data { get; set; }

    public TR_PaginationResponse(Integer pageNumber, Integer pageSize, Integer allItemsSize, List<TR_Game> data) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.allItemsSize = allItemsSize;
        this.data = data;
    }
}