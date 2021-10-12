import {api, LightningElement} from 'lwc';
import {TrGameHistoryService} from "c/tr_GameHistoryService";

export default class TrGameHistoryListItem extends LightningElement {

    @api
    gameRecord;
    gameServiceInstance;
    @api
    selectedRecordId

    get itemContainerClasses() {
        if(this.selectedRecordId === this.gameRecord.id) {
            return 'itemContainer selected'
        }
        return 'itemContainer'
    }

    connectedCallback() {
        this.gameServiceInstance = new TrGameHistoryService(this.gameRecord);
    }

    handleItemClick() {
        const event = new CustomEvent('clickitem', {detail: this.gameRecord.id});
        this.dispatchEvent(event);
    }
}