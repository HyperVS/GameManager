const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { prefix } = require('../config.json');
require('dotenv').config();

module.exports = {
    name: 'delete',
    aliases: ['d'],
    args: 1,
    usage: `${prefix}d [category name / all]`,
    async execute(client, message, args) {
        let server = message.guild;

        if(!message.member.roles.cache.find(r => r.name == "Developer")) return message.channel.send(`${message.author}, you are not authorized to use that command.`)
        try {
            // Dev mode: delete all lobby channels
            if (process.env.DEV_MODE == "TRUE" && args[0].toLowerCase() == "all") {
                server.channels.cache.forEach((channel) => {
                    if (channel.name.startsWith("match-") && channel.type == "category") {
                        channel.children.forEach((child) =>  child.delete());
                        channel.delete();
                    }
                })
            }
            else {
                let cat = await server.channels.cache.find(c => c.name.toLowerCase() == `match-${args[0].toLowerCase()}` && c.type == "category");
                cat.children.forEach(ch => ch.delete());
                cat.delete();
            }
        }
        catch {
            message.channel.send(`ERROR: Failed to delete ${args[0]}`);
        }
    }
}