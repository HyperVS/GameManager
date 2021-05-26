const { MessageEmbed } = require('discord.js');
const { rlColor, footer } = require('../config.json');
const global = require('./global');
const db = require('../db/orm');
const { calculateElo } = require('./mmr');
const { getMatch } = require('./global');

const captains = async (client, message, matchID, users) => {
    let captain1 = users[Math.floor(Math.random()*users.length)];
    let captain2 = users[Math.floor(Math.random()*users.length)];
    while(captain1 === captain2) captain2 = users[Math.floor(Math.random()*users.length)]; // no dupes
    
    let team1cur = '';
    let team2cur = '';

    let main = new MessageEmbed().setTitle(`Match #${matchID} - Team Formation`)
    .setDescription(`
        ${(team1.includes(players[0]) || team2.includes(players[0]) ? `:x: ~~<@!${players[0]}>~~` : `:one: <@!${players[0]}>`)}\n\n
        ${(team1.includes(players[1]) || team2.includes(players[1]) ? `:x: ~~<@!${players[1]}>~~` : `:two: <@!${players[1]}>`)}\n\n
        ${(team1.includes(players[2]) || team2.includes(players[2]) ? `:x: ~~<@!${players[2]}>~~` : `:three: <@!${players[2]}>`)}\n\n
        ${(team1.includes(players[3]) || team2.includes(players[3]) ? `:x: ~~<@!${players[3]}>~~` : `:four: <@!${players[3]}>`)}`)
    .addField('Team 1', `Captain #1: <@!${captain1}>\nPlayers: ${team1cur}`)
    .addField('Team 2', `Captain #2: <@!${captain2}>\nPlayers: ${team2cur}`)
    .setFooter(footer)
    .setColor(rlColor);

    let msg = await message.channel.send(main);
    try {
        await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣')
        await msg.react('4️⃣')
    } catch(error){
        console.log(error)
    }

    const em = new MessageEmbed().setDescription(`<@!${captain1}>, please pick 1 player.`).setColor(rlColor);
    message.channel.send(em);

    const filter1 = (reaction, user) => {
        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name) && user.id === captain1;
    }

    const filter2 = (reaction, user) => {
        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name) && user.id === captain2;
    }

    let team1 = [];
    let team2 = [];
    let voted = [];

    const team1collector = msg.createReactionCollector(filter1, {max: 1});
    
    team1collector.on('collect', (reaction, user)=> {
        switch(reaction.emoji.name){
            case '1️⃣':
                team1.push(players[0])
                team1.forEach(player => {
                    if (team1cur != '') team1cur += ',';
                    team1cur += `<@${player}>`;
                })
                msg.edit(main);
                voted.push(1);
                break;
            case '2️⃣':
                team1.push(players[1])
                team1.forEach(player => {
                    if (team1cur != '') team1cur += ',';
                    team1cur += `<@${player}>`;
                })
                msg.edit(main);
                voted.push(2);
                break;
            case '3️⃣':
                team1.push(players[2])
                team1.forEach(player => {
                    if (team1cur != '') team1cur += ',';
                    team1cur += `<@${player}>`;
                })
                msg.edit(main);
                voted.push(3);
                break;
            case '4️⃣':
                team1.push(players[3])
                team1.forEach(player => {
                    if (team1cur != '') team1cur += ',';
                    team1cur += `<@${player}>`;
                })
                msg.edit(main);
                voted.push(4);
                break;
        }
    })

    team1collector.on('end', async () => {
        em.setDescription(`<@!${captain2}>, please pick 2 players.`)
        let newMsg = await message.channel.send(em);
        const team2collector = newMsg.createReactionCollector(filter2, {max: 2});
        team2collector.on('collect', (reaction, user) => {
            switch(reaction.emoji.name){
                case '1️⃣':
                    if (!team1.includes(players[0])){
                        team2.push(players[0])
                        team2.forEach(player => {
                            if (team2cur != '') team2cur += ',';
                            team2cur += `<@${player}>`;
                        })
                        msg.edit(main);
                        voted.push(1);
                    }
                    break;
                case '2️⃣':
                    if (!team1.includes(players[1])){
                        team2.push(players[1])
                        team2.forEach(player => {
                            if (team2cur != '') team2cur += ',';
                            team2cur += `<@${player}>`;
                        })
                        msg.edit(main);
                        voted.push(2);
                    }
                    break;
                case '3️⃣':
                    if (!team1.includes(players[2])){
                        team2.push(players[2])
                        team2.forEach(player => {
                            if (team2cur != '') team2cur += ',';
                            team2cur += `<@${player}>`;
                        })
                        msg.edit(main);
                        voted.push(3);
                    }
                    break;
                case '4️⃣':
                    if (!team1.includes(players[3])){
                        team2.push(players[3])
                        team2.forEach(player => {
                            if (team2cur != '') team2cur += ',';
                            team2cur += `<@${player}>`;
                        })
                        msg.edit(main);
                        voted.push(4);
                    }
                    break;
            }
        })
    })

    team2collector.on('end', () => {
        if(!voted.includes(1)){
            team1.push(players[0])
            team1.forEach(player => {
                if (team1cur != '') team1cur += ',';
                team1cur += `<@${player}>`;
            })
        }

        else if(!voted.includes(2)){
            team1.push(players[1])
            team1.forEach(player => {
                if (team1cur != '') team1cur += ',';
                team1cur += `<@${player}>`;
            })
        }

        else if(!voted.includes(3)){
            team1.push(players[2])
            team1.forEach(player => {
                if (team1cur != '') team1cur += ',';
                team1cur += `<@${player}>`;
            })
        }

        else if(!voted.includes(4)){
            team1.push(players[3])
            team1.forEach(player => {
                if (team1cur != '') team1cur += ',';
                team1cur += `<@${player}>`;
            })
        }

        msg.edit(main);
        handleTeams(client, message, team1, team2, matchID);
    })
}

const random = async (client, message, matchID, users) => {
    // generate random teams
    let players = global.shuffleArray(users);
    let half = players.length/2;
    let team1 = players.splice(0, half);
    let team2 = players.splice(-half);
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
    let embed = new MessageEmbed();
    embed.setTitle(`Match #${matchID} - Team Formation`)
        .addField('Team 1', `Players: ${t1Players}`)
        .addField('Team 2', `Players: ${t2Players}`)
        .setFooter(footer)
        .setColor(rlColor);
    message.channel.send(embed);
    handleTeams(client, message, team1, team2, matchID);
}

const balanced = async (client, message, matchID, users) => {
        //TODO: balanced teams
        let players = [];
        users.forEach(async userid => {
            players.push({
                mmr: await db.getMmr(userid),
                userid: userid
            })
        })
        players.sort((a,b) => b.mmr - a.mmr); //descending order
        let team1 = [players[0].userid, players[3].userid, players[4].userid];
        let team2 = [players[1].userid, players[2].userid, players[5].userid];
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
        let embed = new MessageEmbed();
        embed.setTitle(`Match #${matchID} - Team Formation`)
            .addField('Team 1', `Players: ${t1Players}`)
            .addField('Team 2', `Players: ${t2Players}`)
            .setFooter(footer)
            .setColor(rlColor);
        message.channel.send(embed);
        handleTeams(client, message, team1, team2, matchID);
}

const handleTeams = async (client, message, team1, team2, matchID) => {
    // save teams
    let teams = client.teams;
    teams.set(matchID, {team1: team1, team2: team2});
    
    // set permissions and move players to respective channels
    let perms = await setPerms(message, team1, team2);
    let t1perms = perms[0];
    let t2perms = perms[1];
    let channel1 = await message.guild.channels.create(`Team One`, {
        type: 'voice',
        permissionOverwrites: t1perms,
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    })
    team1.forEach(userID => {
        message.guild.members.cache.get(userID).voice.setChannel(channel1);
    })
   
    let channel2 = await message.guild.channels.create(`Team Two`, {
        type: 'voice',
        permissionOverwrites: t2perms,
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    })
    team2.forEach(userID => {
        message.guild.members.cache.get(userID).voice.setChannel(channel2)
    })
}

const setPerms = async (message, team1, team2) => {
    let t1perms = [{
        id: message.guild.roles.everyone,
        deny: ['CONNECT']
    }];
    let t2perms = [{
        id: message.guild.roles.everyone,
        deny: ['CONNECT']
    }];
    team1.forEach(userid => {
        t1perms.push({
            id: userid,
            allow: ['CONNECT']
        })
    })
    team2.forEach(userid => {
        t2perms.push({
            id: userid,
            allow: ['CONNECT']
        })
    })
    return [t1perms, t2perms];
}

const handleMmr = async (message, team1, team2, matchID) => {
    team1.sort(async (a,b) => await db.getMmr(b) - await db.getMmr(a));
    team2.sort(async (a,b) => await db.getMmr(b) - await db.getMmr(a));
    let highestT1 = await db.getMmr(team1[0]);
    let highestT2 = await db.getMmr(team2[0]);
    let channel = message.guild.channels.cache.get(c => c.name == `game-results`);
    let embed = new MessageEmbed().setColor(rlColor).setFooter(footer);
    team1.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT2, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        newMMr > mmr ? await db.addWin(userid) : await db.addLoss(userid);
        //TODO: send embed to channel game-results
        channel.send()
    })

    team2.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT1, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        newMMr > mmr ? await db.addWin(userid) : await db.addLoss(userid);
        channel.send()
    })

}


module.exports = {
    captains: captains,
    balanced: balanced,
    random: random,
    handleTeams: handleTeams,
    handleMmr: handleMmr,
}