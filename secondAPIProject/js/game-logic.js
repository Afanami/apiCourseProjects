// All code should be written in this file.
let playerOneMoveOneType = undefined;
let playerOneMoveTwoType = undefined;
let playerOneMoveThreeType = undefined;
let playerTwoMoveOneType = undefined; 
let playerTwoMoveTwoType = undefined;
let playerTwoMoveThreeType = undefined;
let playerOneMoveOneValue = undefined;
let playerOneMoveTwoValue = undefined;
let playerOneMoveThreeValue = undefined;
let playerTwoMoveOneValue = undefined;
let playerTwoMoveTwoValue = undefined;
let playerTwoMoveThreeValue = undefined;
let playerOneWin = 0;
let playerTwoWin = 0;

const selectMove = () => {
    let move = Math.floor(Math.random()*3);
    if (move === 0) {
        return 'rock';
    } else if (move === 1) {
        return 'scissors';
    } else {
        return 'paper';
    }
}

const chooseValue = () => {
    let initialVal = Math.floor(Math.random()*99);
    if(initialVal <= 99 && initialVal > 0) {
        playerTwoMoveOneValue = initialVal;
    }
    
    if(playerTwoMoveOneValue <= 99) {
        playerTwoMoveTwoValue = Math.floor(Math.random()*(99-playerTwoMoveOneValue));
    }
    
    if(playerTwoMoveTwoValue+playerTwoMoveOneValue <= 99) {
        playerTwoMoveThreeValue = Math.floor(Math.random()*(99-playerTwoMoveTwoValue));
    }
}

const setPlayerMoves = (player, moveOneType, moveOneValue, moveTwoType, moveTwoValue, moveThreeType, moveThreeValue) => {
    let threshold = moveOneValue+moveTwoValue+moveThreeValue;

    if (player === 'Player One') {
        if ((moveOneType === 'rock' || moveOneType === 'paper' || moveOneType === 'scissors') && (moveTwoType === 'rock' || moveTwoType === 'paper' || moveTwoType === 'scissors' )&& (moveThreeType === 'rock' || moveThreeType === 'paper' || moveThreeType === 'scissors')) {
            playerOneMoveOneType = moveOneType;
            playerOneMoveTwoType = moveTwoType;
            playerOneMoveThreeType = moveThreeType;
            if (moveOneValue > 0 && moveTwoValue > 0 && moveThreeValue > 0 && threshold <= 99 &&  moveOneValue !== undefined && moveTwoValue !== undefined && moveThreeValue !== undefined) {
                playerOneMoveOneValue = moveOneValue;
                playerOneMoveTwoValue = moveTwoValue;
                playerOneMoveThreeValue = moveThreeValue;
            } else {
                return;
            }
        } else {
            return;
        }
    } else if (player === 'Player Two') {
        if ((moveOneType === 'rock' || moveOneType === 'paper' || moveOneType === 'scissors') && (moveTwoType === 'rock' || moveTwoType === 'paper' || moveTwoType === 'scissors' )&& (moveThreeType === 'rock' || moveThreeType === 'paper' || moveThreeType === 'scissors')) {
            playerTwoMoveOneType = moveOneType;
            playerTwoMoveTwoType = moveTwoType;
            playerTwoMoveThreeType = moveThreeType;
            if(moveOneValue > 0 && moveTwoValue > 0 && moveThreeValue > 0 && threshold <= 99 && moveOneValue <= moveOneValue !== undefined && moveTwoValue !== undefined && moveThreeValue !== undefined) {
                playerTwoMoveOneValue = moveOneValue;
                playerTwoMoveTwoType = moveTwoValue;
                playerTwoMoveThreeType = moveThreeValue;
            } else {
                return;
            }
        } else {
            return;
        }
    } else {
        return;
    }
}

const getRoundWinner = (roundNumber) => {
    if(roundNumber === 1 || 2 || 3) {
        if((playerOneMoveOneType === 'rock' && playerTwoMoveOneType === 'scissors') || (playerOneMoveOneType === 'scissors' && playerTwoMoveOneType === 'paper') || (playerOneMoveOneType === 'paper' && playerTwoMoveOneType === 'rock')) {
            playerOneWin++;
            return 'Player One';
        } else if ((playerOneMoveOneType === 'rock' && playerTwoMoveOneType === 'paper') || (playerOneMoveOneType === 'scissors' && playerTwoMoveOneType === 'rock') || (playerOneMoveOneType === 'paper' && playerTwoMoveOneType === 'scissors')) {
            playerTwoWin++;
            return 'Player Two';
        } else if (playerOneMoveOneType === playerTwoMoveOneType || playerOneMoveTwoType === playerTwoMoveTwoType || playerOneMoveThreeType === playerTwoMoveThreeType){
            if (playerOneMoveOneValue > playerTwoMoveOneValue || playerOneMoveTwoValue > playerTwoMoveTwoValue || playerOneMoveThreeValue > playerTwoMoveThreeValue) {
                playerOneWin++;
                return 'Player One';
            } else if (playerOneMoveOneValue < playerTwoMoveOneValue || playerOneMoveTwoValue < playerTwoMoveTwoValue || playerOneMoveThreeValue < playerTwoMoveThreeValue) {
                playerTwoWin++;
                return 'Player Two';
            } else {
                return 'Tie';
            } 
        } else {
            return null;
        }
    } else {
        return null;
    }
}

const getGameWinner = () => { 
    if (playerOneWin > playerTwoWin) {
        return 'Player One';
    } else if (playerOneWin < playerTwoWin) {
        return 'Player Two';
    } else {
        return 'Tie';
    }
}

const setComputerMoves = () => {
    playerTwoMoveOneType = selectMove();
    playerTwoMoveTwoType = selectMove();
    playerTwoMoveThreeType = selectMove();
    chooseValue();
}

