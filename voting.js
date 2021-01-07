const { MessageEmbed } = require('discord.js');
const { rlColor, footer } = require('./config.json');
const global = require('./global');
const db = require('./db/orm');

exports.captains = (message, matchID, users) => {
    let players = users[0];
    let captain1 = players[Math.floor(Math.random()*players.length)];
    let captain2 = players[Math.floor(Math.random()*players.length)];
    while(captain1 === captain2) captain2 = players[Math.floor(Math.random()*players.length)]; // no dupes
    players.splice(players.indexOf(captain1), 1);
    players.splice(players.indexOf(captain2), 1);

    let embed = new MessageEmbed();
    embed.setTitle(`Match #${matchID} - Team Formation`)
        .setDescription(`:one: <@!${players[0]}>\n\n:two: <@!${players[1]}>\n\n:three: <@!${players[2]}>\n\n:four: <@!${players[3]}>`)
        .addField('Team 1', `Captain #1: <@!${captain1}>\nPlayers:`)
        .addField('Team 2', `Captain #2: <@!${captain2}>\nPlayers:`)
        .setFooter(footer)
        .setColor(rlColor);
    message.channel.send(embed).then(em => {
        em.react('1️⃣')
        .then(em.react('2️⃣'))
        .then(em.react('3️⃣'))
        .then(em.react('4️⃣'));
    });
}

exports.random = (message, matchID, users) => {
    // generate random teams
    let players = global.shuffleArray(users[0]);
    let team1 = players.splice(0, Math.ceil(players.length/2));
    let team2 = players.splice(-Math.ceil(players.length/2));
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
    handleTeams(message, team1, team2, matchID);
}

exports.balanced = (client, message, matchID, users) => {
    //TODO: balanced teams
    let players = users[0];
    let mmrs = [];
    players.forEach(userid => {
        db.getMmr(userid, (mmr) => {
            mmrs.push(mmr);
            client.mmrs.set(mmr, userid);
        })
    })
    mmrs.sort((a,b) => {return b-a}); //descending order
    let team1 = [client.mmrs.get(mmrs[0]), client.mmrs.get(mmrs[3]), client.mmrs.get(mmrs[4])];
    let team2 = [client.mmrs.get(mmrs[1]), client.mmrs.get(mmrs[2]), client.mmrs.get(mmrs[5])];
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
    client.mmrs.clear();
    // send message
    let embed = new MessageEmbed();
    embed.setTitle(`Match #${matchID} - Team Formation`)
        .addField('Team 1', `Players: ${t1Players}`)
        .addField('Team 2', `Players: ${t2Players}`)
        .setFooter(footer)
        .setColor(rlColor);
    message.channel.send(embed);
    handleTeams(message, team1, team2, matchID);
}

const handleTeams = (message, team1, team2, matchID) => {
    // set permissions and move players to respective channels
    let perms = setPerms(message, team1, team2);
    let t1perms = perms[0];
    let t2perms = perms[1];
    message.guild.channels.create(`Team One`, {
        type: 'voice',
        permissionOverwrites: t1perms,
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    }).then(channel => {
        team1.forEach(userID => {
            message.guild.members.cache.get(userID).voice.setChannel(channel);
        })
    })
    message.guild.channels.create(`Team Two`, {
        type: 'voice',
        permissionOverwrites: t2perms,
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    }).then(channel => {
        team2.forEach(userID => {
            message.guild.members.cache.get(userID).voice.setChannel(channel)
        })
    })
}

const setPerms = (message, team1, team2) => {
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