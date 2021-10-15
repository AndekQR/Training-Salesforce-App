import { LightningElement, wire, api, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CATEGORY_FIELD from '@salesforce/schema/Question__c.Category__c';
import QUESTION_OBJECT from '@salesforce/schema/Question__c';
import STAGE_FIELD from '@salesforce/schema/Question__c.Stage__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const GAME_TYPES = ['Time', 'Questions'];

export default class Tr_QuestionConfigurator extends LightningElement {
    categories = [];
    stages = [];
    error = undefined;
    isQuestionAmountGame = true;
    initialGameType = GAME_TYPES[1];
    @api isTimeGame = false;
    @api gameDuration = 0;
    @api selectedCategories = [];
    @api selectedStages = [];

    get gameTypesOptions() {
        return GAME_TYPES.map(element => {
            return {
                label: element,
                value: element
            }
        });
    }

    get gameDurationInputLabel() {
        if(this.isTimeGame) {
            return 'Time (minutes)';
        } else {
            return 'Number Of Questions'
        }
    }

    @wire(getObjectInfo, { objectApiName: QUESTION_OBJECT })
    questionMetadata;

    @wire(getPicklistValues, { recordTypeId: '$questionMetadata.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    getCategories({error, data}) {
        if(data) {
            this.error = undefined;
            this.categories = data.values.map( category => ({label: category.label, value: category.value, checked: false}));
        } else if(error) {
            this.error = error;
            this.categories = undefined;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$questionMetadata.data.defaultRecordTypeId', fieldApiName: STAGE_FIELD })
    getStages({error, data}) {
        if(data) {
            this.error = undefined;
            this.stages = data.values.map( stage => ({label: stage.label, value: stage.value, checked: false}));
        } else if(error) {
            this.error = error;
            this.stages = undefined;
        }
    }

    handleCategoryChange(event) {
       let selectedCategory = event.currentTarget.dataset.id;
       let value = event.target.checked;
       if (value === true ) {
            this.selectedCategories.push(selectedCategory);
       } else {
            this.selectedCategories = this.selectedCategories.filter( category => category !== selectedCategory);
       }
    }

    handleStageChange(event) {
       let selectedStage = event.currentTarget.dataset.id;
       let value = event.target.checked;
       if (value === true ) {
            this.selectedStages.push(selectedStage);
       } else {
            this.selectedStages = this.selectedStages.filter( stage => stage !== selectedStage);
       }
    }

    handleGameSettingsChange(event) {
        if(event.target.value === 'Time') {
                this.isTimeGame = true;
                this.isQuestionAmountGame = false;
        } else {
            this.isTimeGame = false;
            this.isQuestionAmountGame = true;
        }
    }

    handleValueChange(event) {
        this.gameDuration = event.detail.value;
    }
}