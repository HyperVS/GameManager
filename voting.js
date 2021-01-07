const { MessageEmbed } = require('discord.js');
const { rlColor, footer } = require('./config.json');

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

exports.random = () => {
    //TODO: random teams
}

exports.balanced = () => {
    //TODO: balanced teams
}