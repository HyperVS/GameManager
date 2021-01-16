const voting = require('../processes/voting');
const { max, rlColor, footer } = require('../config.json');
const db = require('../db/orm');
const { MessageEmbed } = require('discord.js');
const { generateEmbed } = require('../commands/leaderboard');

module.exports = {
    once: false,
    async run(reaction, user, client) {
        if(user.bot) return;
        let maxIndex = Math.ceil(client.players.size/10)*10;
        let message = reaction.message;

        if(reaction.emoji.name === '◀️'){
            client.currentIndex == 0 ? client.currentIndex = maxIndex-10 : client.currentIndex -= 10;
            reaction.users.remove(user.id);
            message.edit(generateEmbed(client, message, client.currentIndex))
        }

        if(reaction.emoji.name === '▶️'){
            client.currentIndex == maxIndex-10 ? client.currentIndex = 0 : client.currentIndex += 10;
            reaction.users.remove(user.id);
            message.edit(generateEmbed(client, message, client.currentIndex))
        }

        
        let counts = client.counts;
        let matchID = await db.getMatchID()
        if(client.embeds.has(message.id)){
            if(message.reactions.cache.filter(r => r.users.cache.has(user.id)).size >= 2) reaction.users.remove(user.id);
            let users = [...client.embeds.values(message.id)];
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
            switch(mostVotes){
                case 'c':
                    voting.captains(message, matchID, users[0], client)
                    break;
                case 'r':
                    voting.random(message, matchID, users[0])
                    break;
                case 'b':
                    voting.balanced(message, matchID, users[0])
                    break;
            }
        }
        if(client.votes.has(message.id)){
            let captains = [...client.votes.values(message.id)];
            if(!captains[0].includes(user.id)) reaction.users.remove(user.id);
            let players = voting.players;
            let team1 = [];
            let team2 = [];
            let voted = [];
            const embed = new MessageEmbed().setDescription(`<@!${voting.captain1}>, please pick 1 player.`).setColor(rlColor);
            message.channel.send(embed);

            let main = new MessageEmbed().setTitle(`Match #${matchID} - Team Formation`)
            .setDescription(`
                ${(team1.includes(players[0]) || team2.includes(players[0]) ? `:x: ~~<@!${players[0]}>~~` : `:one: <@!${players[0]}>`)}\n\n
                ${(team1.includes(players[1]) || team2.includes(players[1]) ? `:x: ~~<@!${players[1]}>~~` : `:one: <@!${players[1]}>`)}\n\n
                ${(team1.includes(players[2]) || team2.includes(players[2]) ? `:x: ~~<@!${players[2]}>~~` : `:one: <@!${players[2]}>`)}\n\n
                ${(team1.includes(players[3]) || team2.includes(players[3]) ? `:x: ~~<@!${players[3]}>~~` : `:one: <@!${players[3]}>`)}`)
            .addField('Team 1', `Captain #1: <@!${captain1}>\nPlayers:`)
            .addField('Team 2', `Captain #2: <@!${captain2}>\nPlayers:`)
            .setFooter(footer)
            .setColor(rlColor);

            if(reaction.emoji.name == '1️⃣' && reaction.count < 2 && user.id === voting.captain1) {
                team1.push(players[0])
                message.edit(main);
                voted.push(1);
            }
            else if(reaction.emoji.name == '2️⃣' && reaction.count < 2 && user.id === voting.captain1) {
                team1.push(players[1])
                message.edit(main);
                voted.push(2);
            }
            else if(reaction.emoji.name == '3️⃣' && reaction.count < 2 && user.id === voting.captain1) {
                team1.push(players[2])
                message.edit(main);
                voted.push(3);
            }
            else if(reaction.emoji.name == '4️⃣' && reaction.count < 2 && user.id === voting.captain1) {
                team1.push(players[3])
                message.edit(main);
                voted.push(4);
            }

            if (team1.length === 1){
                embed.setDescription(`<@!${voting.captain2}>, please pick 2 players.`);
                message.channel.send(embed);

                if(reaction.emoji.name == '1️⃣' && reaction.count < 2 && user.id === voting.captain2 && !voted.includes(1)) {
                    team2.push(players[0])
                    message.edit(main);
                    voted.push(1);
                }
                else if(reaction.emoji.name == '2️⃣' && reaction.count < 2 && user.id === voting.captain2 && !voted.includes(2)) {
                    team2.push(players[1])
                    message.edit(main);
                    voted.push(2);
                }
                else if(reaction.emoji.name == '3️⃣' && reaction.count < 2 && user.id === voting.captain2 && !voted.includes(3)) {
                    team2.push(players[2])
                    message.edit(main);
                    voted.push(3);
                }
                else if(reaction.emoji.name == '4️⃣' && reaction.count < 2 && user.id === voting.captain2 && !voted.includes(4)) {
                    team2.push(players[3])
                    message.edit(main);
                    voted.push(4);
                }

            }

            let t1Players = '';
            let t2Players = '';
            for(let player of team1){
                if(t1Players != '') t1Players += ',';
                t1Players += `<@!${player}>`;
            };
            for(let player of team2){
                if(t2Players != '') t2Players += ',';
                t2Players += `<@!${player}>`;
            };
            // send message
            embed.setTitle(`Match #${matchID} - Team Formation`)
                .addField('Team 1', `Players: ${t1Players}`)
                .addField('Team 2', `Players: ${t2Players}`)
                .setFooter(footer)
                .setColor(rlColor);
            message.channel.send(embed);
            voting.handleTeams(message, team1, team2, matchID);
        }
    }
};