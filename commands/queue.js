
const { match } = require('assert');
const { MessageEmbed } = require('discord.js');
const { rlColor } = require("../config.json");
const { prefix, thumbnail, footer } = require('../config.json');
const { collection } = require('../db/connection');
const db = require('../db/orm');

module.exports = {
	name: 'queue',
	aliases: ['q'],
    args: false,
    usage: `${prefix}q`,
	execute(client, message, args){
        const server = message.guild;
    
        const queue = client.queue;
        if(queue.has(message.author.id)){
            return message.channel.send("You are already in the queue!");
        }
        queue.set(message.author.id, message.author.username)
        if(queue.size == 1){
            client.queueTime = new Date();
        }

        const embed = new MessageEmbed();
        embed.setColor(rlColor);
        if(queue.size == 1){
            embed.setThumbnail(thumbnail);
            embed.setTitle('1 player is in the queue')
            embed.addField('Want to join?', 'Type !q to join this 6man!')
        }
        else embed.setTitle(`${queue.size} players are in the queue`);
        embed.setDescription(`<@${message.author.id}> has joined.`);
        embed.setFooter(footer);
        message.channel.send(embed);

        if(queue.size == 1){
            const users = Array.from(queue.keys());
            let voicePerms = [{
                id: server.roles.everyone,
                deny: ['CONNECT']
            }];
            let textPerms = [{
                id: server.roles.everyone,
                deny: ['VIEW_CHANNEL']
            }];
            users.forEach(userid => {
                textPerms.push({
                    id: userid,
                    allow: ['VIEW_CHANNEL']
                })
                voicePerms.push({
                    id: userid,
                    allow: ['CONNECT']
                })
            })
            db.createMatch(queue, matchID => {
                server.channels.create(`match-${matchID}`, {type: 'category'});
                server.channels.create(`Match ${matchID} Lobby`, {
                    type: 'voice',
                    permissionOverwrites: voicePerms,
                    parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
                    userLimit: 6
                });
            })
            // .then(() => {
            // server.channels.create(`match-${matchID}`, {
            //     permissionOverwrites: textPerms,
            //     parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category")
            // })
            // .then(ch => {
            //             const embed = new MessageEmbed();
            //             embed.setColor(rlColor);
            //             embed.addField('6 Players have joined the queue!', 'Voting will now commence.');
            //             embed.addField('Votes:', '🇨 Captains\n\n🇷 Random\n\n🇧 Balanced')
            //             ch.send(embed)
            //             .then(em => {
            //                 em.react("🇨")
            //                 em.react("🇷")
            //                 em.react("🇧")
            //                 client.embeds.set(em.id, users)
            //                 client.matches.set(`match-${matchID}`, users)
            //                 queue.clear();
            //             });
            //         });
            //     }).finally(() => {
            //         server.channels.create(`Team One`, {
            //             type: 'voice',
            //             permissionOverwrites: voicePerms,
            //             parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
            //             userLimit: 3
            //         })
            //         server.channels.create(`Team Two`, {
            //             type: 'voice',
            //             permissionOverwrites: voicePerms,
            //             parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
            //             userLimit: 3
            //         })
            //     });
            // });
        }
    }
}