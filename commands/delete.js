const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'delete',
    aliases: ['d'],
    args: false,
    async execute(client, message, args) {
        let server = message.guild;

        let cat = await server.channels.cache.find(c => c.name.toLowerCase() == args[0].toLowerCase() && c.type == "category");
        cat.children.forEach(ch => ch.delete());
        cat.delete();
    }
}