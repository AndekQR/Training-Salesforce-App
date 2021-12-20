import createGame from "@salesforce/apex/TR_GameController.createGame";
import saveAnsweredQuestion from "@salesforce/apex/TR_QuestionController.saveAnsweredQuestion";
import finishGame from "@salesforce/apex/TR_GameController.finishGame";

const callCreateGame = (gameType, gameDuration) => {
    return createGame({type: gameType, duration: gameDuration})
        .then(result => {
            return result;
        })
        .catch(error => console.log(error));
};

const callSaveAnsweredQuestion = (questionId, isCorrect, participantId, gameId) => {
    return saveAnsweredQuestion({
        questionId: questionId,
        participantId: participantId,
        gameId: gameId,
        isCorrect: isCorrect
    })
        .catch(error => console.log(error));
}

const callFinishGame = (gameId) => {
    finishGame({gameId: gameId})
        .catch(error => console.log(error));
}

const isShowingTime = (gameType) => {
    return gameType === 'Time';
}

const getParticipantDefinition = () => {
    return {
        active: false,
        goodAnswers: 0,
        badAnswers: 0,

        get allAnswersNumber() {
            return this.goodAnswers + this.badAnswers;
        }
    }
}

export {
    callCreateGame,
    callFinishGame,
    callSaveAnsweredQuestion,
    isShowingTime,
    getParticipantDefinition
}