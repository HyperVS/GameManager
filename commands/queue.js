const { MessageEmbed } = require('discord.js');
const { rlColor } = require("../config.json");
const { prefix, thumbnail } = require('../config.json');
const { collection } = require('../db/connection');
module.exports = {
	name: 'queue',
	aliases: ['q'],
    args: false,
    usage: `${prefix}q`,
	execute(client, message, args){
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
        embed.setFooter('6mans | Twisted\'s Tweakers');
        
        return message.channel.send(embed);
    }
}