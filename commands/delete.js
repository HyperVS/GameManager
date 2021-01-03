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

        let cat = await server.channels.cache.find(c => c.name.toLowerCase() == args[0].toLowerCase() && c.type == "category");
        cat.children.forEach(ch => ch.delete());
        cat.delete();
    }
}