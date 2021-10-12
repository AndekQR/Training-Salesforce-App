import {LightningElement} from 'lwc';
import noHeaderAppPage from '@salesforce/resourceUrl/noHeaderAppPage'
import {loadStyle} from 'lightning/platformResourceLoader';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import begin from '@salesforce/label/c.begin'
import number_of_participants_must_equals from '@salesforce/label/c.number_of_participants_must_equals'
import select_one_training_stage from '@salesforce/label/c.select_one_training_stage'
import select_one_category from '@salesforce/label/c.select_one_category'
import game_duration_greater_than from '@salesforce/label/c.game_duration_greater_than'
import number_participants from '@salesforce/label/c.number_participants'

const SCREENS = {
    CONFIGURATION: 'configuration',
    MAIN_SCREEN: 'main_screen',
    SUMMARY: 'summary'
}

export default class Tr_Home extends LightningElement {

    labels = {
        begin,
        number_of_participants_must_equals,
        select_one_training_stage,
        select_one_category,
        game_duration_greater_than,
        number_participants
    }
    currentScreen = SCREENS.CONFIGURATION;
    summaryDetails = {};

    connectedCallback() {
        loadStyle(this, noHeaderAppPage);
    }

    get participants() {
        let participantComponent = this.template.querySelector('c-tr-_-participants-configurator');
        if (participantComponent == null) {
            return [];
        }
        return participantComponent.selectedRows;
    }

    get questionConfiguration() {
        let questionComponent = this.template.querySelector('c-tr-_-question-configurator');
        if (questionComponent == null) {
            return {};
        }
        return {
            categories: questionComponent.selectedCategories,
            stages: questionComponent.selectedStages || [],
            gameType: questionComponent.isTimeGame ? 'Time' : 'Questions',
            gameDuration: questionComponent.gameDuration
        };
    }

    get showConfScreen() {
        return this.currentScreen === SCREENS.CONFIGURATION;
    }

    get showMainScreen() {
        return this.currentScreen === SCREENS.MAIN_SCREEN && this.participants.length === 2;
    }

    get showSummary() {
        return this.currentScreen === SCREENS.SUMMARY;
    }

    get showOnePlayerScreen() {
        return this.currentScreen === SCREENS.MAIN_SCREEN && this.participants.length === 1;
    }

    isNumberOfParticipantsGood() {
        if (this.participants.length === 2 || this.participants.length === 1) {
            return true;
        }
        return false;
    }

    configErrors() {
        if (this.questionConfiguration.categories.length === 0) {
            this.showError(this.labels.select_one_category);
            return true;
        } else if (this.questionConfiguration.gameDuration === 0) {
            this.showError(this.labels.game_duration_greater_than);
            return true;
        } else if (!this.isNumberOfParticipantsGood()) {
            this.showError(this.labels.number_participants);
            return true;
        }
        return false;
    }

    showError(title) {
        const toastEvent = new ShowToastEvent({
            title: title,
            variant: 'error'
        });
        this.dispatchEvent(toastEvent);
    }

    handleGameStart() {
        if (this.configErrors()) {
            return;
        }
        this.currentScreen = SCREENS.MAIN_SCREEN;
    }

    handleFinish(event) {
        this.summaryDetails = event.detail;
        this.currentScreen = SCREENS.SUMMARY;
    }

    handleFinishOne(event) {
        this.summaryDetails = event.detail;
        this.currentScreen = SCREENS.SUMMARY;
    }

    handleBack() {
        this.currentScreen = SCREENS.CONFIGURATION;
    }
}