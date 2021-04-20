module.exports = class Game {
    /**
     * 
     * @param {String} name 
     * @param {String} channelID 
     * @param {Number} maxPlayers 
     */
    constructor(name, channelID, maxPlayers) {
        this.name = name;
        this.channelID = channelID;
        this.maxPlayers = maxPlayers;
    }
}