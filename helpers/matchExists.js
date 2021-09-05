
/**
 * Checks if a match exists in the array
 * @param {array} array 
 * @param {string} matchID 
 * @returns True if exists, false if it doesn't
 */
const matchExists = (array, matchID) => {
    for(let i=0; i<array.length; i++) {
        if(array[i].matchID === matchID) return true;
    }
    return false;
};

module.exports = {
    matchExists: matchExists
};