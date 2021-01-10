const voting = require('../processes/voting');

module.exports = {
    once: false,
    run(reaction, user, client) {
        if(user.bot) return;
        let message = reaction.message, emoji  = reaction.emoji;
        let counts = client.counts;
        if(client.embeds.has(message.id)) {
            if(message.reactions.cache.filter(r => r.users.cache.has(user.id)).size >= 2) reaction.users.remove(user.id);
            let users = Array.from(client.embeds.values(message.id));
            if(!users[0].includes(user.id)) reaction.users.remove(user.id);
            let mostVotes = '';
            if(reaction.emoji.name == '🇨' && reaction.count > 1) counts.get('c').count++;
            if(reaction.emoji.name == '🇷' && reaction.count > 1) counts.get('r').count++;
            if(reaction.emoji.name == '🇧' && reaction.count > 1) counts.get('b').count++;
            if(counts.get('c').count + counts.get('r').count + counts.get('b').count == max){
                for(let name of counts.keys()){
                    if(mostVotes !== '' && counts.get(name).count > counts.get(mostVotes).count) mostVotes = name; 
                    else if(mostVotes === '') mostVotes = name;
                }
                counts.clear();
            }
            db.getMatchID(matchID => {
                switch(mostVotes){
                    case 'c':
                        voting.captains(message, matchID, users)
                        break;
                    case 'r':
                        voting.random(message, matchID, users)
                        break;
                    case 'b':
                        voting.balanced(client, message, matchID, users)
                        break;
                }
            })
        }
    }
};