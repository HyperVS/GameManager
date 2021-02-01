const voting = require('../processes/voting');
const { max, rlColor, footer } = require('../config.json');
const db = require('../db/orm');
const { MessageEmbed } = require('discord.js');
const { generateEmbed } = require('../commands/main/leaderboard');

module.exports = {
    once: false,
    async run(reaction, user, client) {
        if(user.bot) return;
        let maxIndex = Math.ceil(client.players.size/10)*10;
        let message = reaction.message;

        if(reaction.emoji.name === '◀️'){
            client.currentIndex == 0 ? client.currentIndex = maxIndex-10 : client.currentIndex -= 10;
            reaction.users.remove(user.id);
            message.edit(generateEmbed(client, user.id, client.currentIndex))
        }

        if(reaction.emoji.name === '▶️'){
            client.currentIndex == maxIndex-10 ? client.currentIndex = 0 : client.currentIndex += 10;
            reaction.users.remove(user.id);
            message.edit(generateEmbed(client, user.id, client.currentIndex))
        }

        
        let counts = client.counts;
        let matchID = await db.getMatchID();
        let users = [...client.embeds.values(message.id)];
        if(client.embeds.has(message.id)){
            if(message.reactions.cache.filter(r => r.users.cache.has(user.id)).size >= 2) reaction.users.remove(user.id);
            if(!users[0].includes(user.id)) reaction.users.remove(user.id);
            let mostVotes = '';
            if(reaction.emoji.name == '🇨' && reaction.count > 1) counts.get('c').count++;
            if(reaction.emoji.name == '🇷' && reaction.count > 1) counts.get('r').count++;
            if(reaction.emoji.name == '🇧' && reaction.count > 1) counts.get('b').count++;
            if(counts.get('c').count + counts.get('r').count + counts.get('b').count != max) return;
            for(let name of counts.keys()){
                if(mostVotes !== '' && counts.get(name).count > counts.get(mostVotes).count) mostVotes = name; 
                else if(mostVotes === '') mostVotes = name;
            }
            counts.clear();
            client.embeds.clear();
            switch(mostVotes){
                case 'c':
                    voting.captains(message, matchID, users[0])
                    break;
                case 'r':
                    voting.random(message, matchID, users[0])
                    break;
                case 'b':
                    voting.balanced(message, matchID, users[0])
                    break;
            }
        }
    }
};