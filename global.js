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
}

module.exports = global;