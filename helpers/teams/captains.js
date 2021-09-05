const { MessageEmbed } = require("discord.js");
const { footer } = require("../config.json");
const getGame = require("./getGame");

const captains = async (client, message, matchID, users) => {
    const game = getGame(client, message);
    let captain1 = users[Math.floor(Math.random()*users.length)];
    let captain2 = users[Math.floor(Math.random()*users.length)];
    while(captain1 === captain2) captain2 = users[Math.floor(Math.random()*users.length)]; // no dupes
    
    players = client.

    let team1cur = "";
    let team2cur = "";

    let main = new MessageEmbed().setTitle(`Match #${matchID} - Team Formation`)
        .setDescription(`
        ${(team1.includes(players[0]) || team2.includes(players[0]) ? `:x: ~~<@!${players[0]}>~~` : `:one: <@!${players[0]}>`)}\n\n
        ${(team1.includes(players[1]) || team2.includes(players[1]) ? `:x: ~~<@!${players[1]}>~~` : `:two: <@!${players[1]}>`)}\n\n
        ${(team1.includes(players[2]) || team2.includes(players[2]) ? `:x: ~~<@!${players[2]}>~~` : `:three: <@!${players[2]}>`)}\n\n
        ${(team1.includes(players[3]) || team2.includes(players[3]) ? `:x: ~~<@!${players[3]}>~~` : `:four: <@!${players[3]}>`)}`)
        .addField("Team 1", `Captain #1: <@!${captain1}>\nPlayers: ${team1cur}`)
        .addField("Team 2", `Captain #2: <@!${captain2}>\nPlayers: ${team2cur}`)
        .setColor(game.color)
        .setFooter(game.maxPlayers+footer);

    let msg = await message.channel.send(main);
    try {
        await msg.react("1️⃣");
        await msg.react("2️⃣");
        await msg.react("3️⃣");
        await msg.react("4️⃣");
    } catch(error){
        console.log(error);
    }

    const em = new MessageEmbed().setDescription(`<@!${captain1}>, please pick 1 player.`).setColor(rlColor);
    message.channel.send(em);

    const filter1 = (reaction, user) => {
        return ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name) && user.id === captain1;
    };

    const filter2 = (reaction, user) => {
        return ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name) && user.id === captain2;
    };

    let team1 = [];
    let team2 = [];
    let voted = [];

    const team1collector = msg.createReactionCollector(filter1, {max: 1});
    
    team1collector.on("collect", (reaction, user)=> {
        switch(reaction.emoji.name){
        case "1️⃣":
            team1.push(players[0]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
            msg.edit(main);
            voted.push(1);
            break;
        case "2️⃣":
            team1.push(players[1]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
            msg.edit(main);
            voted.push(2);
            break;
        case "3️⃣":
            team1.push(players[2]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
            msg.edit(main);
            voted.push(3);
            break;
        case "4️⃣":
            team1.push(players[3]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
            msg.edit(main);
            voted.push(4);
            break;
        }
    });

    team1collector.on("end", async () => {
        em.setDescription(`<@!${captain2}>, please pick 2 players.`);
        let newMsg = await message.channel.send(em);
        const team2collector = newMsg.createReactionCollector(filter2, {max: 2});
        team2collector.on("collect", (reaction, user) => {
            switch(reaction.emoji.name){
            case "1️⃣":
                if (!team1.includes(players[0])){
                    team2.push(players[0]);
                    team2.forEach(player => {
                        if (team2cur != "") team2cur += ",";
                        team2cur += `<@${player}>`;
                    });
                    msg.edit(main);
                    voted.push(1);
                }
                break;
            case "2️⃣":
                if (!team1.includes(players[1])){
                    team2.push(players[1]);
                    team2.forEach(player => {
                        if (team2cur != "") team2cur += ",";
                        team2cur += `<@${player}>`;
                    });
                    msg.edit(main);
                    voted.push(2);
                }
                break;
            case "3️⃣":
                if (!team1.includes(players[2])){
                    team2.push(players[2]);
                    team2.forEach(player => {
                        if (team2cur != "") team2cur += ",";
                        team2cur += `<@${player}>`;
                    });
                    msg.edit(main);
                    voted.push(3);
                }
                break;
            case "4️⃣":
                if (!team1.includes(players[3])){
                    team2.push(players[3]);
                    team2.forEach(player => {
                        if (team2cur != "") team2cur += ",";
                        team2cur += `<@${player}>`;
                    });
                    msg.edit(main);
                    voted.push(4);
                }
                break;
            }
        });
    });

    team2collector.on("end", () => {
        if(!voted.includes(1)){
            team1.push(players[0]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
        }

        else if(!voted.includes(2)){
            team1.push(players[1]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
        }

        else if(!voted.includes(3)){
            team1.push(players[2]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
        }

        else if(!voted.includes(4)){
            team1.push(players[3]);
            team1.forEach(player => {
                if (team1cur != "") team1cur += ",";
                team1cur += `<@${player}>`;
            });
        }

        msg.edit(main);
        handleTeams(client, message, team1, team2, matchID);
    });
};

module.exports = {
    captains: captains
};