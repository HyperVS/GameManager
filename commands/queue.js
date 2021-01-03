const { MessageEmbed } = require('discord.js');
const { rlColor } = require("../config.json");
const { prefix, thumbnail, footer } = require('../config.json');
const { collection } = require('../db/connection');
module.exports = {
	name: 'queue',
	aliases: ['q'],
    args: false,
    usage: `${prefix}q`,
	execute(client, message, args){
        let server = message.guild;
        if(args.length != 0){
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
            return message.channel.send(embed);
        }
        const queue = client.queue;
        if(queue.has(message.author.id)){
            return message.channel.send("You are already in the queue!");
        }
        queue.set(message.author.id, queue.size+1)
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
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.addField('6 Players have joined the queue!', 'Voting will now commence.');
            embed.addField('Votes:', '🇨 Captains\n\n🇷 Random\n\n🇧 Balanced')
            // CREATE TEMP CATEGORY
            let category = server.channel.create('')
            // CREATE TEMP CHANNEL
            let tempChannel = server.channel.create(`voting_${Math.floor(Math.random(9999))}`, {
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
            });
            // CREATE TEMP VOICE CHANNELS
            let voiceOne = server.channel.create('Team 1');
            let voiceTwo = server.channel.create('Team 2');
            message.channel.send(embed)
            .then(em => {
                em.react("🇨")
                em.react("🇷")
                em.react("🇧")
                client.embeds.set(em.id, users)
                queue.clear();
            });
        }
    }
}