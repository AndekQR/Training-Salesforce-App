public class TR_PaginationResponse {
    @AuraEnabled
    public Integer pageNumber { get; set; }
    @AuraEnabled
    public Integer pageSize { get; set; }
    @AuraEnabled
    public Integer allItemsSize { get; set; }
    @AuraEnabled
    public List<Object> data { get; set; }

    public TR_PaginationResponse(){}

    public class TR_PaginationResponseBuilder {

        private TR_PaginationResponse response;

        public TR_PaginationResponseBuilder() {
            this.response = new TR_PaginationResponse();
        }

        public TR_PaginationResponseBuilder setPageNumber(Integer pageNumber) {
            this.response.pageNumber = pageNumber;
            return this;
        }

        public TR_PaginationResponseBuilder setPageSize(Integer size) {
            this.response.pageSize = size;
            return this;
        }

        public TR_PaginationResponseBuilder setAllItemsSize(Integer size) {
            this.response.allItemsSize = size;
            return this;
        }

        public TR_PaginationResponseBuilder setData(List<Object> data) {
            this.response.data = data;
            return this;
        }

        public TR_PaginationResponse build() {
            return response;
        }
    }
}