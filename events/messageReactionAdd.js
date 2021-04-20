const voting = require('../processes/voting');
const { max, rlColor, footer } = require('../config.json');
const db = require('../db/orm');

module.exports = {
    once: false,
    async run(reaction, user, client) {
        if(user.bot) return;
        let message = reaction.message;
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
                    voting.captains(client, message, matchID, users[0])
                    break;
                case 'r':
                    voting.random(client, message, matchID, users[0])
                    break;
                case 'b':
                    voting.balanced(client, message, matchID, users[0])
                    break;
            }
        }
    }
};