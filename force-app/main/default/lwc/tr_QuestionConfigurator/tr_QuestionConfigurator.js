import { LightningElement, wire, api, track } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CATEGORY_FIELD from '@salesforce/schema/Question__c.Category__c';
import QUESTION_OBJECT from '@salesforce/schema/Question__c';
import STAGE_FIELD from '@salesforce/schema/Question__c.Stage__c';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class Tr_QuestionConfigurator extends LightningElement {
    categories = [];
    stages = [];
    error = undefined;
    isQuestionAmountGame = true;
    @api isTimeGame = false;
    @api gameDuration = 0;
    @api selectedCategories = [];
    @api selectedStages = [];

    @wire(getObjectInfo, { objectApiName: QUESTION_OBJECT })
    questionMetadata;

    @wire(getPicklistValues, { recordTypeId: '$questionMetadata.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    getCategories({error, data}) {
        if(data) {
            this.error = undefined;
            this.categories = data.values.map( category => ({label: category.label, value: category.value, checked: false}));
        } else if(error) {
            this.error = error;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$questionMetadata.data.defaultRecordTypeId', fieldApiName: STAGE_FIELD })
    getStages({error, data}) {
        if(data) {
            this.error = undefined;
            this.stages = data.values.map( stage => ({label: stage.label, value: stage.value, checked: false}));
        } else if(error) {
            this.error = error;
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
       let setting = event.currentTarget.dataset.id;
       let value = event.target.checked;
       if (setting === 'TimeGame') {
           this.isTimeGame = value;
           this.isQuestionAmountGame = !value;
       } else {
           this.isTimeGame = !value;
           this.isQuestionAmountGame = value;
       }
    }

    handleValueChange(event) {
        this.gameDuration = event.detail.value;
    }
}