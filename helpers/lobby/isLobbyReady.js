/**
 * Checks if a lobby is ready (all players joined) to start voting
 * @param {*} client 
 * @param {*} newMember Last member to join the channel
 * @param {Match} match 
 * @returns Boolean, true if ready to start, false if not
 */
const isLobbyReady = (client, newMember, gameMaxPlayers) => {
    const voiceChannel = client.channels.cache.get(newMember.channelID);

    // Check if all players joined the lobby
    return (voiceChannel.members.size == gameMaxPlayers);
};

module.exports = isLobbyReady;