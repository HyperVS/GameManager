const { MessageEmbed } = require('discord.js');
const { rlColor, footer } = require('../config.json');
const global = require('./global');
const db = require('../db/orm');
const { calculateElo } = require('./mmr');

const captains = async (message, matchID, users, client) => {
    client.captain1 = users[Math.floor(Math.random()*users.length)];
    client.captain2 = users[Math.floor(Math.random()*users.length)];
    let captain1 = client.captain1;
    let captain2 = client.captain2;
    while(captain1 === captain2) captain2 = users[Math.floor(Math.random()*users.length)]; // no dupes
    let captains = users.splice(users.indexOf(captain1), 1);
    captains.push(users.splice(users.indexOf(captain2), 1)[0]);

    let embed = new MessageEmbed();
    embed.setTitle(`Match #${matchID} - Team Formation`)
        .setDescription(`:one: <@!${users[0]}>\n\n:two: <@!${users[1]}>\n\n:three: <@!${users[2]}>\n\n:four: <@!${users[3]}>`)
        .addField('Team 1', `Captain #1: <@!${captain1}>\nPlayers:`)
        .addField('Team 2', `Captain #2: <@!${captain2}>\nPlayers:`)
        .setFooter(footer)
        .setColor(rlColor);
    try {
        let msg = await message.channel.send(embed);
        await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣')
        await msg.react('4️⃣')
        client.votes.set(msg.id, captains)
        const em = new MessageEmbed().setDescription(`<@!${captain1}>, please pick 1 player.`).setColor(rlColor);
        message.channel.send(em);
        client.captains = [...client.votes.values(message.id)];
        client.team1 = [];
        client.team2 = [];
        client.voted = [];
        client.count = 0;
    } catch(error){
        console.log(error)
    }
}

const random = async (message, matchID, users) => {
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
    await handleTeams(message, team1, team2, matchID);
    //await handleMmr(message, team1, team2)
}

const balanced = async (message, matchID, users) => {
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
        await handleTeams(message, team1, team2, matchID);
        //await handleMmr(message, team1, team2, matchID);
}

const handleTeams = async (message, team1, team2, matchID) => {
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
    let channel = message.guild.channels.cache.get(c => c.name == `match-results`);
    let embed = new MessageEmbed().setColor(rlColor).setFooter(footer);
    team1.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT2, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        newMMr > mmr ? await db.addWin(userid) : await db.addLoss(userid);
        client.players.set(userid, newMmr);
        //TODO: send embed to channel match-results
        // channel.send()
    })

    team2.forEach(async userid => {
        let mmr = await db.getMmr(userid);
        let gamesPlayed = await db.getWins(userid) + await db.getLosses(userid);
        let k = 60 - (gamesPlayed*2);
        k = k<20 ? 20 : k;
        let newMmr = calculateElo(mmr, highestT1, client.result.get(userid), k);
        await db.updateMmr(userid, newMmr);
        client.players.set(userid, newMmr);
        channel.send()
        
    })

}

const handleCaptainTeams = async (message, reaction, user, players, client, matchID) => {
    let captains = client.captains;
    let team1 = client.team1;
    let team2 = client.team2;
    if(!captains[0].includes(user.id)) return reaction.users.remove(user.id);
    client.count++;
    let main = new MessageEmbed().setTitle(`Match #${matchID} - Team Formation`)
    .setDescription(`
        ${(team1.includes(players[0]) || team2.includes(players[0]) ? `:x: ~~<@!${players[0]}>~~` : `:one: <@!${players[0]}>`)}\n\n
        ${(team1.includes(players[1]) || team2.includes(players[1]) ? `:x: ~~<@!${players[1]}>~~` : `:two: <@!${players[1]}>`)}\n\n
        ${(team1.includes(players[2]) || team2.includes(players[2]) ? `:x: ~~<@!${players[2]}>~~` : `:three: <@!${players[2]}>`)}\n\n
        ${(team1.includes(players[3]) || team2.includes(players[3]) ? `:x: ~~<@!${players[3]}>~~` : `:four: <@!${players[3]}>`)}`)
    .addField('Team 1', `Captain #1: <@!${client.captain1}>\nPlayers:`)
    .addField('Team 2', `Captain #2: <@!${client.captain2}>\nPlayers:`)
    .setFooter(footer)
    .setColor(rlColor);

    if(reaction.emoji.name == '1️⃣' && reaction.count < 2 && user.id === client.captain1) {
        team1.push(players[0])
        message.edit(main);
        voted.push(1);
    }
    else if(reaction.emoji.name == '2️⃣' && reaction.count < 2 && user.id === client.captain1) {
        team1.push(players[1])
        message.edit(main);
        voted.push(2);
    }
    else if(reaction.emoji.name == '3️⃣' && reaction.count < 2 && user.id === client.captain1) {
        team1.push(players[2])
        message.edit(main);
        voted.push(3);
    }
    else if(reaction.emoji.name == '4️⃣' && reaction.count < 2 && user.id === client.captain1) {
        team1.push(players[3])
        message.edit(main);
        voted.push(4);
    }

    if (team1.length === 1){
        embed.setDescription(`<@!${client.captain2}>, please pick 2 players.`);
        message.channel.send(embed);

        if(reaction.emoji.name == '1️⃣' && reaction.count < 2 && user.id === client.captain2 && !voted.includes(1)) {
            team2.push(players[0])
            message.edit(main);
            voted.push(1);
        }
        else if(reaction.emoji.name == '2️⃣' && reaction.count < 2 && user.id === client.captain2 && !voted.includes(2)) {
            team2.push(players[1])
            message.edit(main);
            voted.push(2);
        }
        else if(reaction.emoji.name == '3️⃣' && reaction.count < 2 && user.id === client.captain2 && !voted.includes(3)) {
            team2.push(players[2])
            message.edit(main);
            voted.push(3);
        }
        else if(reaction.emoji.name == '4️⃣' && reaction.count < 2 && user.id === client.captain2 && !voted.includes(4)) {
            team2.push(players[3])
            message.edit(main);
            voted.push(4);
        }

    }
    message.channel.send(main);
    if (client.counts==4) this.handleTeams(message, team1, team2, matchID); 
}

module.exports = {
    captains: captains,
    balanced: balanced,
    random: random,
    handleTeams: handleTeams,
    handleMmr: handleMmr,
    handleCaptainTeams: handleCaptainTeams
}