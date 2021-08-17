import { LightningElement, track } from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import { loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import begin from '@salesforce/label/c.begin'
import number_of_participants_must_equals from '@salesforce/label/c.number_of_participants_must_equals'

const NUMBER_OF_PLAYERS = 2;

export default class Tr_Home extends LightningElement {

    labels = {begin, number_of_participants_must_equals}
    @track
    showGameScreen = false;

    connectedCallback() {
       loadStyle(this, noHeaderAppPage);
    }

    get participants() {
        let participantComponent = this.template.querySelector('c-tr-_-participants-configurator');
        if(participantComponent == null) {
            return [];
        }
        return participantComponent.selectedRows;
    }

    get questionConfiguration() {
        let questionComponent = this.template.querySelector('c-tr-_-question-configurator');
        if(questionComponent == null) {
            return 0;
        }
        return { 
            categories: questionComponent.selectedCategories,
            stages: questionComponent.selectedStages,
            gameType: questionComponent.isTimeGame ? 'Time' : 'Questions',
            gameDuration: questionComponent.gameDuration
        };
    }

    isNumberOfParticipantsGood() {
        if(this.participants.length == NUMBER_OF_PLAYERS) {
            return true;
        }
        return false;
    }

    handleGameStart() {
        console.log('config', this.questionConfiguration)
        if(!this.isNumberOfParticipantsGood()) {
            const toastEvent = new ShowToastEvent({
                title: 'Number of participants must equals '+NUMBER_OF_PLAYERS,
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
            return;
        }
        this.showGameScreen = true;
    }
}