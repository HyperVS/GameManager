/**
 * Gets the game the user is trying to join/leave queue based on the channel that the message was sent
 * @param {*} client 
 * @param {*} message 
 * @returns {Game} Game
 */
const getGame = (client, message) => {
    return client.games.find((game) => message.channel.parentID == game.parentID);
};

/**
 * Get a game by name from game's list
 * @param {*} client 
 * @param {*} gameName 
 * @returns {Game} Game name
 */
const getGameByName = (client, gameName) => {
    return client.games.get(gameName);
};

module.exports = {
    getGame: getGame,
    getGameByName: getGameByName
} ;