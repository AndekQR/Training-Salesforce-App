import {LightningElement, api, track} from 'lwc';
import getAnsweredQuestions from '@salesforce/apex/TR_QuestionController.getAnsweredQuestions';

export default class Tr_EndGameResult extends LightningElement {

    @api
    details = {}
    @track
    playerOne = {}
    @track
    playerTwo;
    gameId = ''

    async connectedCallback() {
        let details = JSON.parse(JSON.stringify(this.details));
        if (details.playerOne) {
            this.playerOne = details.playerOne;
        }
        if (details.playerTwo) {
            this.playerTwo = details.playerTwo;
        }
        this.gameId = details.gameId;
        await this.getAnswered(this.playerOne);
        if (this.playerTwo) {
            this.getAnswered(this.playerTwo);
        }
    }

    getAnswered(player) {
        return getAnsweredQuestions({gameId: this.gameId, participantId: player.id})
            .then(result => {
                player.answeredQuestions = result;
            })
            .catch(error => console.log(error))
    }

    handleBackToMenu() {
        this.dispatchEvent(new CustomEvent('backtomenu'));
    }
}