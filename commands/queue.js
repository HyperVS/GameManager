const { MessageEmbed } = require('discord.js');
const { rlColor, max } = require("../config.json");
const { prefix, thumbnail, footer } = require('../config.json');
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
        if(queue.size == 1) client.queueTime = new Date();
        
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

        if(queue.size == max){    
            client.usersArray = Array.from(queue.keys());
            let voicePerms = [{
                id: server.roles.everyone,
                deny: ['CONNECT']
            }];
            let textPerms = [{
                id: server.roles.everyone,
                deny: ['VIEW_CHANNEL']
            }];
            client.usersArray.forEach(userid => {
                textPerms.push({
                    id: userid,
                    allow: ['VIEW_CHANNEL']
                })
                voicePerms.push({
                    id: userid,
                    allow: ['CONNECT']
                })
            });
            let queueMembers = '';
            for(let member of queue.keys()){
                if(queueMembers != '') queueMembers += ',';
                queueMembers += `<@${member}>`;
            };
            db.createMatch(queue, matchID => {
                queue.clear();
                server.channels.create(`match-${matchID}`, {type: 'category'})
                .then(() => {
                    server.channels.create(`Match ${matchID} Lobby`, {
                        type: 'voice',
                        permissionOverwrites: voicePerms,
                        parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
                        userLimit: 6
                    })
                    .then(async channel => {
                        let voiceChannelID = channel.id;
                        let redirectLink = await channel.createInvite({
                            maxAge: 120, // 2 minutes
                            maxUses: 6 // 6 players
                        })
                        server.channels.create(`match-${matchID}`, {
                            permissionOverwrites: textPerms,
                            parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category")
                        })
                        .then((textChannel) => {
                            client.channelIDS.set(voiceChannelID, textChannel);
                            const embed = new MessageEmbed();
                            embed.setColor(rlColor)
                                .setTitle('6 Players have joined the queue!')
                                .setDescription(`Voting will begin once all players have joined the lobby! \n[Click here to join the game lobby!](${redirectLink})`)
                                .addField('Players:', `${queueMembers}`)
                                .setFooter(footer)
                                .setThumbnail(thumbnail);
                            message.channel.send(embed);
                            client.usersArray.forEach(userid => {
                                client.users.cache.get(userid).send(embed);
                            })
                        });
                    });
                });
            });
        };
    }
}
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