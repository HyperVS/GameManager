const global = {
    parseMatchId: (name) => {
        return name.split('-')[1];
    },
    findInMap: (map, val) => {
        for(let [k, v] of map) {
            if(v.includes(val)) return true;
        }
        return false;
    },
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = global;