import {LightningElement, api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getQuestion from '@salesforce/apex/TR_QuestionService.getQuestion'

const questionDegrees = 360;
const answerDegrees = 180;

export default class Tr_QuestionCard extends LightningElement {

    isCardShowingQuestion = true;
    question = {id: '', question: '', answer: '', category: ''};
    @api
    categories;
    @api
    stages;
    questions = [];

    connectedCallback() {
        this.getQuestions();
    }

    goodAnswer(event) {
        this.handleFlip(questionDegrees);
        this.dispatchEvent(new CustomEvent('goodanswer', {detail: this.question.id}));
        this.getNextQuestion();
        event.stopPropagation();
    }

    badAnswer(event) {
        this.handleFlip(questionDegrees);
        this.dispatchEvent(new CustomEvent('badanswer', {detail: this.question.id}));
        this.getNextQuestion();
        event.stopPropagation();
    }

    getNextQuestion() {
        setTimeout(() => {
            this.question = this.questions.pop();
        }, 600);
    }

    getQuestions() {
        if (this.categories && this.stages) {
            getQuestion({categories: Array.from(this.categories), stages: Array.from(this.stages)})
                .then(result => {
                    this.questions = result;
                    if (this.questions && this.questions.length > 0) {
                        this.shuffleQuestions();
                        this.getNextQuestion();
                    } else {
                        const toastEvent = new ShowToastEvent({
                            title: 'No Questions From Combination Of Chosen Categories And Stages',
                            variant: 'error'
                        });
                        this.dispatchEvent(toastEvent);
                    }
                })
                .catch(error => console.log(error));
        }
    }

    shuffleQuestions() {
        this.questions = this.questions.sort(() => 0.5 - Math.random());
    }

    flip() {
        if (this.isCardShowingQuestion) {
            this.handleFlip(answerDegrees);
        } else {
            this.handleFlip(questionDegrees);
        }
    }

    handleFlip(degrees) {
        if (this.isCardShowingQuestion && (degrees === questionDegrees)) {
            return;
        }
        this.isCardShowingQuestion = (degrees === questionDegrees);
        let cardContainer = this.template.querySelector('[data-id="flipCard"]');
        if (cardContainer) {
            const style = document.createElement('style');
            style.innerText = `
              .flip-card-inner {
                transform: rotateY(${degrees}deg);
                transition: transform 0.6s;
              }`;
            this.template.querySelector('[data-id="flipCard"]').appendChild(style);
        }
    }
}