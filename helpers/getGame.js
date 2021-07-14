const Game = require("../types/Game");

/**
 * Gets the game the user is trying to join/leave queue based on the channel that the message was sent
 * @param {*} client 
 * @param {*} message 
 * @returns {Game} Game
 */
const getGame = (client, message) => {
    return client.games.find((game) => message.channel.id == game.channelID);
};

module.exports = getGame