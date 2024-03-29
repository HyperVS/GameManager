const { MessageEmbed } = require("discord.js");
const { footer, prefix } = require("../../config.json");
const db = require("../../db/orm");

module.exports = {
    name: "profile",
    aliases: ["p"],
    args: 0,
    usage: `${prefix}profile`,
    async execute(client, message, args, game){
        let wins = await db.getWins(message.author.id, "RLusers");
        let losses = await db.getLosses(message.author.id, "RLusers");
        const embed = new MessageEmbed().setColor(game.color).setFooter(game.maxPlayers+footer)
            .setTitle(`${message.author.username}'s Profile`)
            .setThumbnail(message.author.avatarURL())
            .addField("Games played:", `${wins + losses}`)
            .addField("Wins:", `${wins}`)
            .addField("Losses:", `${losses}`)
            .addField("W/L:", `${Math.round(((wins/losses) + Number.EPSILON) * 100) / 100}`);
        return message.channel.send(embed);
    }
};