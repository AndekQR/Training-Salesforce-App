import { LightningElement } from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import { loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const NUMBER_OF_PLAYERS = 2;

export default class Tr_Home extends LightningElement {

    connectedCallback() {
       loadStyle(this, noHeaderAppPage);
    }

    isNumberOfParticipantsGood() {
        let participantComponent = this.template.querySelector('c-tr-_-participants-configurator');
        if(participantComponent.selectedRows.length == NUMBER_OF_PLAYERS) {
            return true;
        }
        return false;
    }

    handleGameStart() {
        if(!this.isNumberOfParticipantsGood()) {
            const toastEvent = new ShowToastEvent({
                title: 'Number of participants must equals '+NUMBER_OF_PLAYERS,
                varient: 'error'
            });
            this.dispatchEvent(toastEvent);
            return;
        }
        
    }
}