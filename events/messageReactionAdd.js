// const voting = require("../processes/voting");
const { getGameByName } = require("../helpers/getGame.js");

module.exports = {
    once: false,
    async run(reaction, user, client) {
        if(user.bot) return;
        const message = reaction.message;
        const match = client.matches.find((match) => match.votes.getEmbedID() == message.id);
        const game = getGameByName(client, match.getGameName());
        if(match) {
            // Handle adding votes
            if(message.reactions.cache.filter(r => r.users.cache.has(user.id)).size >= 2) reaction.users.remove(user.id);
            if(!match.players.includes(user.id)) reaction.users.remove(user.id);
            if(reaction.emoji.name == "🇨" && reaction.count > 1) match.votes.incrementCaptains();
            if(reaction.emoji.name == "🇷" && reaction.count > 1) match.votes.incrementRandom();
            if(reaction.emoji.name == "🇧" && reaction.count > 1) match.votes.incrementBalanced();
            if(match.votes.getCaptains() + match.votes.getRandom() +match.votes.getBalanced() != game.getMaxPlayers()) return;

            // Check highest vote count



            switch(mostVotes){
            case "c":
                voting.captains(client, message, matchID, users[0]);
                break;
            case "r":
                voting.random(client, message, matchID, users[0]);
                break;
            case "b":
                voting.balanced(client, message, matchID, users[0]);
                break;
            }
        }
    }
};