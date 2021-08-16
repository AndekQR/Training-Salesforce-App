import { LightningElement } from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import { loadStyle } from 'lightning/platformResourceLoader';

const NUMBER_OF_PLAYERS = 2;

export default class Tr_Home extends LightningElement {

    connectedCallback() {
       loadStyle(this, noHeaderAppPage);
    }

    isNumberOfParticipantsGood() {
        let participantComponent = this.template.querySelector('c-tr-_-participants-configurator');
        if(participantComponent.selectedRows.length == NUMBER_OF_PLAYERS) {
            console.log('good');
            return true;
        }
        return false;
    }

    getQuestionConfiguration() {
        let questionComponent = this.template.querySelector('c-tr-_-question-configurator');
        return { categories: questionComponent.selectedCategories, stages: questionComponent.selectedStages }; 
    }

    handleGameStart() {
        console.log('handleGameStart');
        console.log(this.isNumberOfParticipantsGood());
        console.log('categories', this.getQuestionConfiguration());
    }
}