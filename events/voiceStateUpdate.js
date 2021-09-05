const { getGameByName } = require("../helpers/getGame");
const getMatch = require("../helpers/getMatch.js");
const isLobbyReady = require("../helpers/lobby/isLobbyReady");
const sendVotingMessage = require("../helpers/lobby/sendVotingMessage");

module.exports = {
    once: false,
    async run(oldMember, newMember, client) {
        if(!client.channelIDS.has(newMember.channelID) 
            || (oldMember.voiceChannel !== undefined || newMember.channelID === oldMember.channelID)) return;

        // Get the match object
        const match = getMatch(client, parseInt(newMember.channel.name.slice(6, -6)));

        const game = getGameByName(client, match.getGameName());

        if (isLobbyReady(client, newMember, game.getMaxPlayers())); {
            sendVotingMessage(client, newMember, game.getColor(), match);
        }
    }
};