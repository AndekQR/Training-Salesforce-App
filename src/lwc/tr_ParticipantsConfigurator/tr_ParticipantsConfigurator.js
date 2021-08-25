import {api, LightningElement, wire} from 'lwc';
import getAllParticipants from '@salesforce/apex/TR_ParticipantService.getAllParticipants';
import {refreshApex} from '@salesforce/apex';
import participants from '@salesforce/label/c.participants'

const columns = [
    {label: 'Name', fieldName: 'name', type: 'text'},
    {label: 'Email', fieldName: 'email', type: 'email'}
];

export default class Tr_ParticipantsConfigurator extends LightningElement {

    labels = {participants}
    participants = [];
    columns = columns;
    error = undefined;
    isModalOpen = false;
    allParticipantsResult;

    @api
    get selectedRows() {
        let table = this.template.querySelector('lightning-datatable');
        return table.getSelectedRows();
    }

    @wire(getAllParticipants)
    allParticipants(result) {
        this.allParticipantsResult = result;
        if (result.data) {
            this.participants = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.participants = undefined;
            console.log(this.error);
        }
    }

    onNewParticipant() {
        this.openModal();
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    onCreateParticipant() {
        refreshApex(this.allParticipantsResult);
    }
}