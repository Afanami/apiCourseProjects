// Drum Arrays
let kicks = [];
let snares = [];
let hiHats = [];
let rideCymbals = [];
const arraySize = 16;
// let memes = new Array(16).fill(false);
// console.log(memes);

for (let i = 0; i < arraySize; i++) {
    kicks.push(false);
    snares.push(false);
    hiHats.push(false);
    rideCymbals.push(false);
}

const toggleDrum = (arrayName, index) => {
    if ((arrayName === 'kicks' || 'snares' || 'hiHats' || 'rideCymbals') && (index < 16 && index >= 0)) {
        if (arrayName === 'kicks') {
            kicks[index] = !kicks[index];
        } 
    
        if (arrayName === 'snares') {
            snares[index] = !snares[index];
        }
    
        if (arrayName === 'hiHats') {
            hiHats[index] = !hiHats[index];
        }
    
        if(arrayName === 'rideCymbals') {
            rideCymbals[index] = !rideCymbals[index];
        }
    } else {
        return console.log('Please enter valid arrayName to toggle');
    }
}

// toggleDrum('hiHats', 7);
// toggleDrum('kicks', 3);
// toggleDrum('snares', 15);
// toggleDrum('rideCymbals', 10);

// console.log('Kicks: ' + kicks + '\n\nSnares: ' + snares + '\n\nHiHats: ' + hiHats + '\n\nrideCymbals: ' + rideCymbals);

const clear = (arrayName) => {
    if (arrayName === 'kicks' || 'snares' || 'hiHats' || 'rideCymbals') {
        if (arrayName === 'kicks') {
            kicks = kicks.map(kicks => kicks = false);
        } 
    
        if (arrayName === 'snares') {
            snares = snares.map(snares => snares = false);
        }
    
        if (arrayName === 'hiHats') {
            hiHats = hiHats.map(hiHats => hiHats = false);
        }
    
        if(arrayName === 'rideCymbals') {
            rideCymbals = rideCymbals.map(rideCymbals => rideCymbals = false);
        }
    } else {
        return console.log('Please enter valid arrayName to clear');
    }
}

const invert = (arrayName) => {
    if (arrayName === 'kicks' || 'snares' || 'hiHats' || 'rideCymbals') {
        if (arrayName === 'kicks') {
            kicks = kicks.map(kicks => kicks = !kicks);
        } 
    
        if (arrayName === 'snares') {
            snares = snares.map(snares => snares = !snares);
        }
    
        if (arrayName === 'hiHats') {
            hiHats = hiHats.map(hiHats => hiHats = !hiHats);
        }
    
        if(arrayName === 'rideCymbals') {
            rideCymbals = rideCymbals.map(rideCymbals => rideCymbals = !rideCymbals);
        }
    } else {
        return console.log('Please enter valid arrayName to invert');
    }
}

// clear('kicks');
// clear('snares');
// clear('hiHats');
// clear('rideCymbals');
// console.log('New Kicks Array: ' + kicks + '\n\nNew Snares Array: ' + snares + '\n\nNew HiHats Array: ' + hiHats + '\n\nNew RideCymbals Array: ' + rideCymbals);

const getNeighborPads = (x, y, size) => {
    let neighbors =[];

    if (x > size-1 || y > size-1 || x < 0 || y < 0) {
        return neighbors = [];
    }

    // Bottom left corner [up, right]
    if (x === 0 && y === 0) {
        return neighbors = [[x, y+1],[x+1, y]];
    }

    // Top left corner [down, right]
    if (x === 0 && y === size-1) {
        return neighbors = [[x, y-1], [x+1, y]];
    }

    // Bottom right corner [up, left]
    if (x === size-1 && y === 0) {
        return neighbors = [[x, y+1], [x-1, y]];
    }

    // Top right corner [down, left]
    if (x === size-1 && y === size-1) {
        return neighbors = [[x, y-1], [x-1, y]];
    }

    // Bottom edge but not corner [up, left, right];
    if (y === 0 && (x !== size-1 && x !== 0)) {
        return neighbors = [[x, y+1], [x-1, y], [x+1, y]];
    }

    // Left edge but not corner [up, down, right]
    if (x === 0 && (y !== size-1 && y !== 0)) {
        return neighbors = [[x, y+1], [x, y-1], [x+1, y]];
    }

    // Top edge but not corner [down, left, right]
    if (y === size-1 && (x !== size-1 && x !== 0)) {
        return neighbors = [[x, y-1], [x-1, y], [x+1, y]];
    }

    // Right edge but not corner [up, down, left]
    if (x === size-1 && (y !== size-1 && y !== 0)) {
        return neighbors = [[x, y+1], [x, y-1], [x-1, y]];
    }

    // Return all four neighbors [up, down, left, right]
    return neighbors = [[x, y+1], [x, y-1], [x-1, y], [x+1, y]];
}