const { MessageEmbed } = require('discord.js');
const { prefix, thumbnail, rlColor } = require('../config.json');

module.exports = {
	name: 'status',
	aliases: [],
    args: false,
    usage: `${prefix}status`,
	execute(client, message, args){
        if(args.length != 0){
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
            return message.channel.send(embed);
        }

        if(client.queue.size == 0){
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@!${message.author.id}> there is no active queue right now.`)
            return message.channel.send(embed);
        }
        const queue = client.queue;
        var queueMembers = '';
        for(let member of queue.keys()){
            if(queueMembers != '') queueMembers += ',';
            queueMembers += `<@${member}>`;
        };
        const queueTime = Math.floor(Math.abs((client.queueTime - new Date())/1000));
        const gameNumber = 1;
        //TODO: Dynamically retrieve game number
        const embed = new MessageEmbed();
        embed.setColor(rlColor);
        embed.addField(`Game #${gameNumber} (Queue)`, `Queue started ${queueTime} seconds ago.`)
        embed.addField('Type:', '3v3')
        embed.addField('Queue:', `${queueMembers}`)
        embed.setFooter('6mans | Twisted\'s Tweakers');
        
        return message.channel.send(embed);
        

    }
}