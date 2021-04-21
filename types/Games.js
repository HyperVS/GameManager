module.exports = class Game {
    /**
     * 
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
    }
}