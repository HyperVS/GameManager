const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'delete',
    aliases: ['d'],
    args: true,
    usage: `${prefix}d [category name]`,
    async execute(client, message, args) {
        let server = message.guild;

        if(!message.member.roles.cache.find(r => r.name == "Developer")) return message.channel.send(`${message.author}, you are not authorized to use that command.`)
        try {
            let cat = await server.channels.cache.find(c => c.name.toLowerCase() == `match-${args[0].toLowerCase()}` && c.type == "category");
            cat.children.forEach(ch => ch.delete());
            cat.delete();
        }
        catch {
            message.channel.send(`ERROR: Failed to delete ${args[0]}`);
        }
    }
}