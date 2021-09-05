/**
 * Shuffles an array randomly
 * @param {array} array 
 * @returns Randomized array
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports = {
    shuffleArray: shuffleArray
};