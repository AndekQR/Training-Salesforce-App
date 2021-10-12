import {api, LightningElement} from 'lwc';

const ANSWER_CORRECT_ICON_NAME = 'standard:task2';
const ANSWER_INCORRECT_ICON_NAME = 'standard:first_non_empty';

export default class TrQuestionItem extends LightningElement {

    @api
    question

    get answerCorrectIcon() {
        return ANSWER_CORRECT_ICON_NAME;
    }

    get answerIncorrectIcon() {
        return ANSWER_INCORRECT_ICON_NAME;
    }
}