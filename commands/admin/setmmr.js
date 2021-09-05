const { prefix, rlColor } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const db = require("../../db/orm");

module.exports = {
    name: "setmmr",
    aliases: [],
    args: 2,
    usage: `${prefix}setmmr @user <newMMR>`,
    admin: true,
    async execute(client, message, args){
        let newMmr = isNaN(parseInt(args[1])) ? false : parseInt(args[1]);
        const embed = new MessageEmbed().setColor(rlColor);
        if(!message.mentions || message.mentions.users.size > 1 || !newMmr){
            embed.setDescription("Invalid use of command. Use !help setmmr for more info.");
            return message.channel.send(embed);
        }
        let userID = message.mentions.users.first().id;
    
        if(!db.userExists(userID)){
            embed.setDescription("This user does not exist!");
            return message.channel.send(embed);
        }
        try {
            let oldMmr = await db.getMmr(userID, "RLusers");
            await db.updateMmr(userID, "RLusers", newMmr);
            embed.setDescription(`Set mmr from ${oldMmr} to ${newMmr} for <@${userID}>!`);
            return message.channel.send(embed);
        } catch(error){
            console.log(error);
        }
    }
};