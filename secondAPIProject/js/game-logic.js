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
    let initialVal = Math.floor(Math.random()*97+1);
    if(initialVal <= 99 && initialVal > 0) {
        playerTwoMoveOneValue = initialVal;
        playerTwoMoveTwoValue = Math.floor(Math.random()*(98-playerTwoMoveOneValue))+1;
        playerTwoMoveThreeValue = (99-(playerTwoMoveTwoValue+playerTwoMoveOneValue));
        initialVal = 0;
        console.log('Move One Val: ' + playerTwoMoveOneValue + ' Move Two Val: ' + playerTwoMoveTwoValue + ' Move Three Val: ' + playerTwoMoveThreeValue);
    }
}

const setPlayerMoves = (player, moveOneType, moveOneValue, moveTwoType, moveTwoValue, moveThreeType, moveThreeValue) => {
    let threshold = moveOneValue+moveTwoValue+moveThreeValue;

    if (moveOneType !== undefined && moveTwoType !== undefined && moveThreeType !== undefined && moveOneValue !== undefined && moveTwoValue !== undefined && moveThreeValue !== undefined && (moveOneType === 'rock' || moveOneType === 'paper' || moveOneType === 'scissors') && (moveTwoType === 'rock' || moveTwoType === 'paper' || moveTwoType === 'scissors' ) && (moveThreeType === 'rock' || moveThreeType === 'paper' || moveThreeType === 'scissors') && moveOneValue > 0 && moveTwoValue > 0 && moveThreeValue > 0 && threshold <= 99) {
        if (player === 'Player One') {
            playerOneMoveOneType = moveOneType;
            playerOneMoveTwoType = moveTwoType;
            playerOneMoveThreeType = moveThreeType;
            playerOneMoveOneValue = moveOneValue;
            playerOneMoveTwoValue = moveTwoValue;
            playerOneMoveThreeValue = moveThreeValue;
        } else if (player === 'Player Two') {
            playerTwoMoveOneType = moveOneType;
            playerTwoMoveTwoType = moveTwoType;
            playerTwoMoveThreeType = moveThreeType;
            playerTwoMoveOneValue = moveOneValue;
            playerTwoMoveTwoValue = moveTwoValue;
            playerTwoMoveThreeValue = moveThreeValue;
        }
    }
}

const getRoundWinner = (roundNumber) => {
    // if(roundNumber === 1 || roundNumber === 2 || roundNumber === 3) {
        if (roundNumber === 1) {
            if (playerOneMoveOneType === undefined || playerTwoMoveOneType === undefined || playerOneMoveOneValue === undefined || playerTwoMoveOneValue === undefined) {
                return null;
            } else {
                if((playerOneMoveOneType === 'rock' && playerTwoMoveOneType === 'scissors') || (playerOneMoveOneType === 'scissors' && playerTwoMoveOneType === 'paper') || (playerOneMoveOneType === 'paper' && playerTwoMoveOneType === 'rock')) {
                    playerOneWin++;
                    return 'Player One';
                } else if ((playerOneMoveOneType === 'rock' && playerTwoMoveOneType === 'paper') || (playerOneMoveOneType === 'scissors' && playerTwoMoveOneType === 'rock') || (playerOneMoveOneType === 'paper' && playerTwoMoveOneType === 'scissors')) {
                    playerTwoWin++;
                    return 'Player Two';
                } else if (playerOneMoveOneType === playerTwoMoveOneType) {
                    if (playerOneMoveOneValue > playerTwoMoveOneValue) {
                        playerOneWin++;
                        return 'Player One';
                    } else if (playerOneMoveOneValue < playerTwoMoveOneValue) {
                        playerTwoWin++;
                        return 'Player Two';
                    } else {
                        return 'Tie';
                    } 
                }  
            }
        } if (roundNumber === 2) {
            if (playerOneMoveTwoType === undefined || playerTwoMoveTwoType === undefined || playerOneMoveTwoValue === undefined || playerTwoMoveTwoValue === undefined) {
                return null;
            } else {
                if((playerOneMoveTwoType === 'rock' && playerTwoMoveTwoType === 'scissors') || (playerOneMoveTwoType === 'scissors' && playerTwoMoveTwoType === 'paper') || (playerOneMoveTwoType === 'paper' && playerTwoMoveTwoType === 'rock')) {
                    playerOneWin++;
                    return 'Player One';
                } else if ((playerOneMoveTwoType === 'rock' && playerTwoMoveTwoType === 'paper') || (playerOneMoveTwoType === 'scissors' && playerTwoMoveTwoType === 'rock') || (playerOneMoveTwoType === 'paper' && playerTwoMoveTwoType === 'scissors')) {
                    playerTwoWin++;
                    return 'Player Two';
                } else if (playerOneMoveTwoType === playerTwoMoveTwoType) {
                    if (playerOneMoveTwoValue > playerTwoMoveTwoValue) {
                        playerOneWin++;
                        return 'Player One';
                    } else if (playerOneMoveTwoValue < playerTwoMoveTwoValue) {
                        playerTwoWin++;
                        return 'Player Two';
                    } else {
                        return 'Tie';
                    } 
                }  
            }
        } if (roundNumber === 3) {
            if (playerOneMoveThreeType === undefined || playerTwoMoveThreeType === undefined || playerOneMoveThreeValue === undefined || playerTwoMoveThreeValue === undefined) {
                return null;
            } else {
                if((playerOneMoveThreeType === 'rock' && playerTwoMoveThreeType === 'scissors') || (playerOneMoveThreeType === 'scissors' && playerTwoMoveThreeType === 'paper') || (playerOneMoveThreeType === 'paper' && playerTwoMoveThreeType === 'rock')) {
                    playerOneWin++;
                    return 'Player One';
                } else if ((playerOneMoveThreeType === 'rock' && playerTwoMoveThreeType === 'paper') || (playerOneMoveThreeType === 'scissors' && playerTwoMoveThreeType === 'rock') || (playerOneMoveThreeType === 'paper' && playerTwoMoveThreeType === 'scissors')) {
                    playerTwoWin++;
                    return 'Player Two';
                } else if (playerOneMoveThreeType === playerTwoMoveThreeType) {
                    if (playerOneMoveThreeValue > playerTwoMoveThreeValue) {
                        playerOneWin++;
                        return 'Player One';
                    } else if (playerOneMoveThreeValue < playerTwoMoveThreeValue) {
                        playerTwoWin++;
                        return 'Player Two';
                    } else {
                        return 'Tie';
                    } 
                }  
            }
        } 
        if(roundNumber !== 1 || roundNumber !== 2 || roundNumber !== 3) {
            return null;
        }
}

const getGameWinner = () => { 
    playerOneWin = 0;
    playerTwoWin = 0;
    if (playerOneMoveOneType === undefined || playerTwoMoveOneType === undefined || playerOneMoveOneValue === undefined || playerTwoMoveOneValue === undefined || playerOneMoveTwoType === undefined || playerTwoMoveTwoType === undefined || playerOneMoveTwoValue === undefined || playerTwoMoveTwoValue === undefined || playerOneMoveThreeType === undefined || playerTwoMoveThreeType === undefined || playerOneMoveThreeValue === undefined || playerTwoMoveThreeValue === undefined) {
        return null;
    }
    
    getRoundWinner(1);
    getRoundWinner(2);
    getRoundWinner(3);

    if (playerOneWin > playerTwoWin) {
        return 'Player One';
    } 
    if (playerOneWin < playerTwoWin) {
        return 'Player Two';
    } 
    if(playerOneWin === playerTwoWin) {
        return 'Tie';
    }
}

const setComputerMoves = () => {
    playerTwoMoveOneType = selectMove();
    playerTwoMoveTwoType = selectMove();
    playerTwoMoveThreeType = selectMove();
    chooseValue();
}

