// Drum Arrays
let kicks = [];
let snares = [];
let hiHats = [];
let rideCymbals = [];
const arraySize = 16;

for (let i = 0; i < arraySize; i++) {
    kicks.push(false);
    snares.push(false);
    hiHats.push(false);
    rideCymbals.push(false);
}

const toggleDrum = (arrayName, index) => {
    if (arrayName === 'kicks' || 'snares' || 'hiHats' || 'rideCymbals') {
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