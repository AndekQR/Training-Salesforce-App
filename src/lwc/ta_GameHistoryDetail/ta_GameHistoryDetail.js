import {api, LightningElement} from 'lwc';
import {TrGameHistoryService} from "c/tr_GameHistoryService";

export default class TaGameHistoryDetail extends LightningElement {

    @api
    _gameRecord;
    gameServiceInstance;

    connectedCallback() {
        this.gameServiceInstance = new TrGameHistoryService(this.gameRecord);
    }

    @api
    get gameRecord() {
        return this._gameRecord;
    }
    set gameRecord(value) {
        this._gameRecord = value;
        this.gameServiceInstance = new TrGameHistoryService(this.gameRecord);
    }

    get sizeStyles() {
        if(this.gameServiceInstance.isTwoPlayerGame) {
            return 'slds-col slds-size_6-of-12'
        }
        return 'slds-col slds-size_12-of-12'
    }

    get gameDuration() {
        if(this.gameRecord.type === 'Questions') {
            return this.gameRecord.duration + ' questions';
        }
        return this.gameRecord.duration + ' minutes';
    }

    get numberOfPlayers() {
        return this.gameRecord.participants.length;
    }

    get numberOfQuestions() {
        return this.gameRecord.questions.length;
    }

    get firstParticipantQuestionStatistic() {
        let stats = {
            good: 0,
            bad: 0
        }
        this.gameServiceInstance.firstParticipantQuestions.forEach(element => {
            if(element.isAnswerCorrect) {
                stats.good += 1;
            } else {
                stats.bad += 1;
            }
        });
        return stats;
    }

    get secondParticipantQuestionStatistic() {
        let stats = {
            good: 0,
            bad: 0
        }
        this.gameServiceInstance.secondParticipantQuestions.forEach(element => {
            if(element.isAnswerCorrect) {
                stats.good += 1;
            } else {
                stats.bad += 1;
            }
        });
        return stats;
    }
}