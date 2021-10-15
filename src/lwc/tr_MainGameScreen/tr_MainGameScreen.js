import {api, LightningElement, track, wire} from 'lwc';
import countGamesBetweenPlayers from '@salesforce/apex/TR_GameService.countGamesBetweenPlayers';
import good_answers from '@salesforce/label/c.good_answers';
import bad_answers from '@salesforce/label/c.bad_answers';
import all_answers from '@salesforce/label/c.all_answers';
import pkt from '@salesforce/label/c.pkt';
import {callCreateGame, callFinishGame, callSaveAnsweredQuestion, isShowingTime, getParticipantDefinition} from "c/tr_GameService";

export default class Tr_MainGameScreen extends LightningElement {

    @api
    participants;
    @api
    questionConfig;
    labels = {good_answers, bad_answers, all_answers, pkt};
    game;
    duration;
    showingTime = false;
    @track
    firstParticipant = getParticipantDefinition();
    @track
    secondParticipant = getParticipantDefinition();
    loading = false;

    get participantsIds() {
        if (this.participants != null) {
            return [this.participants[0].id, this.participants[1].id];
        }
        return [];
    }

    @wire(countGamesBetweenPlayers, {playersIds: '$participantsIds'})
    gameNumber;

    get activeParticipant() {
        if (this.firstParticipant.active) {
            return this.firstParticipant;
        }
        return this.secondParticipant;
    }

    toggleActiveParticipant() {
        this.firstParticipant.active = !this.firstParticipant.active;
        this.secondParticipant.active = !this.secondParticipant.active;
        this.toggleColor();
    }

    toggleColor() {
        if (this.firstParticipant.active) {
            this.template.querySelector('[data-id="leftPanel"]').classList.add('selected');
            this.template.querySelector('[data-id="rightPanel"]').classList.remove('selected');
        } else {
            this.template.querySelector('[data-id="leftPanel"]').classList.remove('selected');
            this.template.querySelector('[data-id="rightPanel"]').classList.add('selected');
        }
    }

    async connectedCallback() {
        const firstPlayerData = this.participants[0];
        this.firstParticipant.id = firstPlayerData.id;
        this.firstParticipant.name = firstPlayerData.name;
        this.firstParticipant.email = firstPlayerData.email;
        this.firstParticipant.active = true;

        const secondParticipantData = this.participants[1];
        this.secondParticipant.id = secondParticipantData.id;
        this.secondParticipant.name = secondParticipantData.name;
        this.secondParticipant.email = secondParticipantData.email;

        this.game = await callCreateGame(this.questionConfig.gameType, this.questionConfig.gameDuration);
        this.showingTime = isShowingTime(this.questionConfig.gameType);
        this.duration = Number(this.questionConfig.gameDuration);
    }

    disconnectedCallback() {
        this.terminateStopWatch();
        callFinishGame(this.game.id);
    }

    terminateStopWatch() {
        const stopWatchComponent = this.template.querySelector('c-tr-_-stop-watch');
        if(stopWatchComponent != null) {
            stopWatchComponent.forceStop();
        }
    }

    tryReduceRemainingQuestions() {
        if (this.duration === 1 && !this.showingTime) {
            this.handleFinish();
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
        this.activeParticipant.goodAnswers++;
        callSaveAnsweredQuestion(event.detail, true, this.activeParticipant.id, this.game.id)
            .then(() => {
                this.tryReduceRemainingQuestions();
                this.turnOffLoading()
            })
        this.toggleActiveParticipant();
    }

    handleBadAnswer(event) {
        this.turnOnLoading();
        this.activeParticipant.badAnswers++;
        callSaveAnsweredQuestion(event.detail, false, this.activeParticipant.id, this.game.id)
            .then(() => {
                this.tryReduceRemainingQuestions();
                this.turnOffLoading()
            })
        this.toggleActiveParticipant();
    }

    handleFinish() {
        callFinishGame(this.game.id);
        let detail = {
            playerOne: this.firstParticipant,
            playerTwo: this.secondParticipant,
            gameId: this.game.id
        }
        this.dispatchEvent(new CustomEvent('finish', {detail}));
    }
}