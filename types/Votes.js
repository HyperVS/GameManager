module.exports = class Votes {
    constructor() {
        this.embedID = undefined;
        this.voted = undefined;
        this.captains = 0;
        this.random = 0;
        this.balanced = 0;
    }

    setEmbedID(embedID) {
        this.embedID = embedID;
    }

    getEmbedID() {
        return this.embedID;
    }

    setVoted(voted) {
        this.voted = voted;
    }

    getVoted() {
        return this.voted;
    }

    getMostVotes() {
        if (this.getCaptains() > this.getRandom() && this.getCaptains() > this.getBalanced()) return "captains";
        if (this.getRandom() > this.getCaptains() && this.getRandom() > this.getBalanced()) return "random";
        if (this.getBalanced() > this.getCaptains() && this.getBalanced() > this.getRandom()) return "balanced";
    }

    getCaptains() {
        return this.captains;
    }

    getRandom() {
        return this.random;
    }

    getBalanced() {
        return this.balanced;
    }

    incrementCaptains() {
        this.captains++;
    }

    decrementCaptains() {
        this.captains--;
    }

    incrementRandom() {
        this.random++;
    }

    decrementRandom() {
        this.random--;
    }

    incrementBalanced() {
        this.balanced++;
    }

    decrementBalanced() {
        this.balanced--;
    }
};