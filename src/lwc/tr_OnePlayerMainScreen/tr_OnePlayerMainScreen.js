import {api, LightningElement, track} from 'lwc';
import good_answers from '@salesforce/label/c.good_answers';
import bad_answers from '@salesforce/label/c.bad_answers';
import all_answers from '@salesforce/label/c.all_answers';
import pkt from '@salesforce/label/c.pkt';
import {callCreateGame, callFinishGame, callSaveAnsweredQuestion, isShowingTime, getParticipantDefinition} from "c/tr_GameService";

export default class Tr_OnePlayerMainScreen extends LightningElement {

    @api
    participants;
    @api
    questionConfig;
    @track
    participant = getParticipantDefinition();
    labels = {good_answers, bad_answers, all_answers, pkt};
    game;
    duration;
    showingTime = false;
    loading = false;

    async connectedCallback() {
        let firstPlayerData = this.participants[0];
        this.participant.id = firstPlayerData.id;
        this.participant.name = firstPlayerData.name;
        this.participant.email = firstPlayerData.email;
        this.participant.active = true;

        this.game = await callCreateGame(this.questionConfig.gameType, this.questionConfig.gameDuration);
        this.showingTime = isShowingTime(this.questionConfig.gameType);
        this.duration = Number(this.questionConfig.gameDuration);
    }

    disconnectedCallback() {
        this.terminateStopWatch();
    }

    terminateStopWatch() {
        const stopWatchComponent = this.template.querySelector('c-tr-_-stop-watch');
        if(stopWatchComponent != null) {
            stopWatchComponent.forceStop();
        }
    }

    tryReduceRemainingQuestions() {
        if (this.duration === 1 && !this.showingTime) {
            this.handleFinishOne();
            return;
        }
        if (!this.showingTime) {
            this.duration--;
        }
    }

    turnOnLoading() {
        this.loading = true;
    }

    turnOffLoading() {
        this.loading = false;
    }

    handleGoodAnswer(event) {
        this.turnOnLoading();
        this.participant.goodAnswers++;
        callSaveAnsweredQuestion(event.detail, true, this.participant.id, this.game.id)
            .then(() => {
                this.tryReduceRemainingQuestions();
                this.turnOffLoading()
            })
    }

    handleBadAnswer(event) {
        this.turnOnLoading();
        this.participant.badAnswers++;
        callSaveAnsweredQuestion(event.detail, false, this.participant.id, this.game.id)
            .then(() => {
                this.tryReduceRemainingQuestions();
                this.turnOffLoading()
            })
    }

    handleFinishOne() {
        callFinishGame(this.game.id);
        let player = JSON.parse(JSON.stringify(this.participant));
        let detail = {
            playerOne: player,
            gameId: this.game.id
        }
        const finish = new CustomEvent('finishone', {detail});
        this.dispatchEvent(finish);
    }
}