import {LightningElement, api} from 'lwc';
import getQuestion from '@salesforce/apex/TR_QuestionService.getQuestion'

export default class Tr_QuestionCard extends LightningElement {

    isFlipped = false;

    connectedCallback() {
        this.getQuestions();
    }

    question = {id: '', question: '', answer: '', category: ''};
    @api
    categories;
    @api
    stages;
    questions = [];

    goodAnswer() {
        if (this.isFlipped) {
            this.flip();
        }
        this.dispatchEvent(new CustomEvent('goodanswer', {detail: this.question.id}));
        this.getNextQuestion();
    }

    badAnswer() {
        if (this.isFlipped) {
            this.flip();
        }
        this.dispatchEvent(new CustomEvent('badanswer', {detail: this.question.id}));
        this.getNextQuestion();
    }

    getNextQuestion() {
        this.question = this.questions.pop();
    }

    getQuestions() {
        if (this.categories && this.stages) {
            getQuestion({categories: Array.from(this.categories), stages: Array.from(this.stages)})
                .then(result => {
                    this.questions = result;
                    this.shuffleQuestions();
                    this.getNextQuestion();
                })
                .catch(error => console.log(error));
        }
    }

    shuffleQuestions() {
        this.questions = this.questions.sort((a, b) => 0.5 - Math.random());
    }

    flip() {
        if (this.isFlipped) {
            this.handleFlipBack();
        } else {
            this.handleFlip();
        }
        this.isFlipped = !this.isFlipped;
    }

    handleFlip() {
        let divblock = this.template.querySelector('[data-id="flipCard"]');
        if (divblock) {
            const style = document.createElement('style');
            style.innerText = `
              .flip-card-inner {
                transform: rotateY(180deg);
              }`;
            this.template.querySelector('[data-id="flipCard"]').appendChild(style);
        }
    }

    handleFlipBack() {
        let divblock = this.template.querySelector('[data-id="flipCard"]');
        if (divblock) {
            const style = document.createElement('style');
            style.innerText = `
              .flip-card-inner {
                transform: rotateY(360deg);
              }`;
            this.template.querySelector('[data-id="flipCard"]').appendChild(style);
        }
    }
}