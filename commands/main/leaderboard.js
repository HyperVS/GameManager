const { MessageEmbed } = require("discord.js");
const { prefix, footer, supportedGames } = require("../../config.json");
const db = require("../../db/orm");

module.exports = {
    name: "leaderboard",
    aliases: ["lb", "leaderboards"],
    args: 0,
    usage: `${prefix}leaderboard`,
    async execute (client, message, args, game){
        let players = await db.getAllUsers("RLusers");
        let current = players.slice(0, 10);
        let counter = 0;
        const embed = new MessageEmbed()
            .setColor(game.color)
            .setFooter(`${game.maxPlayers}`+footer)
            .setTitle("Leaderboard");
        let desc = "";
        current.forEach(async (player, i, array) => {
            let mmr = await db.getMmr(player, "RLusers");
            if(counter == 0){
                client.users.fetch(player).then(user => embed.setThumbnail(user.displayAvatarURL({ dynamic: true })));
                desc+= `${players.indexOf(player)+1}: <@!${player}> - ${mmr} :star:\n`;
            }
            else{
                desc+= `${players.indexOf(player)+1}: <@!${player}> - ${mmr}\n`;
            }
            if (++counter == array.length) desc+= "----------------------------------------------------\n";
        });
        let userMmr = await db.getMmr(message.author.id, "RLusers");
        desc+= `${players.indexOf(message.author.id)+1}: <@!${message.author.id}> - ${userMmr}\n`;
        embed.setDescription(desc);
        return message.channel.send(embed);
    }
};


