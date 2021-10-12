const WINNER_ICON = 'standard:opportunity';
const LOOSER_ICON = 'standard:goals';

class TrGameHistoryService {

    gameRecord;

    constructor(gameRecord) {
        this.gameRecord = gameRecord;
    }

    get isTwoPlayerGame() {
        return this.gameRecord.participants.length === 2;
    }

    get firstUserIcon() {
        if (this.winner == null || this.winner.id === this.firstParticipant.id) {
            return WINNER_ICON;
        }
        return LOOSER_ICON;
    }

    get secondUserIcon() {
        if (this.isTwoPlayerGame) {
            if (this.winner == null || this.winner.id === this.secondParticipant.id) {
                return WINNER_ICON;
            }
            return LOOSER_ICON;
        }
    }

    get firstParticipant() {
        if (this.gameRecord != null) {
            return this.gameRecord.participants[0];
        }
        return null;
    }

    get secondParticipant() {
        if (this.gameRecord != null) {
            return this.gameRecord.participants[1];
        }
        return null;
    }

    /**
     * Return null if draw
     */
    get winner() {
        let firstUserCorrectAnswers = this.gameRecord.questions.reduce((acumulator, current,) => {
            if (current.answeredBy === this.firstParticipant.id && current.isAnswerCorrect) {
                return ++acumulator;
            }
            return acumulator;
        }, 0);
        if(!this.isTwoPlayerGame) {
            return this.firstParticipant;
        }
        let secondUserCorrectAnswers = this.gameRecord.questions.reduce((acumulator, current,) => {
            if (current.answeredBy === this.secondParticipant.id && current.isAnswerCorrect) {
                return ++acumulator;
            }
            return acumulator;
        }, 0);

        if(firstUserCorrectAnswers > secondUserCorrectAnswers) {
            return this.firstParticipant;
        } else if(firstUserCorrectAnswers < secondUserCorrectAnswers) {
            return this.secondParticipant;
        }
        return null;
    }

    get firstParticipantQuestions() {
        return this.gameRecord.questions.filter(element => element.answeredBy === this.firstParticipant.id);
    }

    get secondParticipantQuestions() {
        if(this.isTwoPlayerGame) {
            return this.gameRecord.questions.filter(element => element.answeredBy === this.secondParticipant.id);
        }
        return [];
    }
}

export {TrGameHistoryService}