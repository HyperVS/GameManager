const Queue = require('./Queue')

module.exports = class Game {
    /**
     * Creates a new Game
     * @param {String} name 
     * @param {String} channelID
     * @param {String} parentID 
     * @param {Number} maxPlayers
     * @param {String} color
     */
    constructor(name, channelID, parentID, maxPlayers, color) {
        this.name = name;
        this.channelID = channelID;
        this.parentID = parentID;
        this.maxPlayers = maxPlayers;
        this.color = color;
        this.queue = new Queue();
    }

    getName() {
        return this.name;
    }

    getChannelID() {
        return this.channelID;
    }

    getParentID() {
        return this.parentID;
    }

    getMaxPlayers() {
        return this.maxPlayers;
    }

    getColor() {
        return this.color;
    }

}