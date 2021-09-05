/**
 * Checks if the users is trying to queue in the appropriate  channel
 * @param {Game} game 
 * @param {*} message 
 * @returns {Boolean} true if the channel is correct
 */
const checkChannel = (game, message) => {
    return (game == undefined || message.channel.id != game.channelID);
};

module.exports = checkChannel;