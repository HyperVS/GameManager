const { MessageEmbed } = require("discord.js");
const { footer, rlColor } = require("../config.json");
const db = require("../db/orm");

const balanced = async (client, message, matchID, users) => {
    let players = [];
    users.forEach(async userid => {
        players.push({
            mmr: await db.getMmr(userid),
            userid: userid
        });
    });

    // Sort players by MMR in descending order
    players.sort((a,b) => b.mmr - a.mmr); //descending order

    let team1 = [players[0].userid, players[3].userid, players[4].userid];
    let team2 = [players[1].userid, players[2].userid, players[5].userid];
    let t1Players = "";
    let t2Players = "";

    for(let player of team1){
        if(t1Players != "") t1Players += ",";
        t1Players += `<@!${player}>`;
    }
    for(let player of team2){
        if(t2Players != "") t2Players += ",";
        t2Players += `<@!${player}>`;
    }

    // send message
    let embed = new MessageEmbed();
    embed.setTitle(`Match #${matchID} - Team Formation`)
        .addField("Team 1", `Players: ${t1Players}`)
        .addField("Team 2", `Players: ${t2Players}`)
        .setFooter(footer)
        .setColor(rlColor);
    message.channel.send(embed);
    handleTeams(client, message, team1, team2, matchID);
};