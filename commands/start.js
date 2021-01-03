const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'start',
    aliases: ['s'],
    args: false,
    execute(client, message, args) {
        let server = message.guild;
        server.channels.create('Temporary Voice', {
            type: 'category',
            permissionOverwrites: [
                {
                    id: server.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        }).then(() => {
            server.channels.create('testicle', { 
                type: 'voice',
                parent: server.channels.cache.find(cat => cat.name === "Temporary Voice")
            });
        })
    }
}