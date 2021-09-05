const { MessageEmbed } = require("discord.js");
const { footer, rlColor } = require("../config.json");
const shuffleArray = require("./shuffleArray.js");
const handleTeams = require("./handleTeams.js");

const random = async (client, message, matchID, users) => {
    // generate random teams
    let players = shuffleArray(users);
    let half = players.length/2;
    let team1 = players.splice(0, half);
    let team2 = players.splice(-half);
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

module.exports = random;