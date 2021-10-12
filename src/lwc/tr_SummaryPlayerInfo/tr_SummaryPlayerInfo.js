import { api, LightningElement } from 'lwc';

export default class Tr_SummaryPlayerInfo extends LightningElement {
    @api
    player = {name: '', goodAnswers: 0, badAnswers: 0, answeredQuestions: []};
}