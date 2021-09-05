const Votes = require("./Votes");

module.exports = class Match {
    /**
     * Creates a new Match
     * @param {Number} matchID
     * @param {Array} players
     * @param {String} gameName 
     */
    constructor(matchID, players, gameName) {
        this.matchID = matchID;
        this.gameName = gameName;
        this.players = players;
        this.votes = new Votes();
    }

    getMatchID() {
        return this.matchID;
    }

    getGameName() {
        return this.gameName;
    }

    getPlayers() {
        return this.players;
    }

};

