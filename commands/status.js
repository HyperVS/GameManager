const { MessageEmbed } = require('discord.js');
const { prefix, footer, rlColor } = require('../config.json');

module.exports = {
	name: 'status',
	aliases: [],
    args: false,
    usage: `${prefix}status`,
	execute(client, message, args){
        if(args.length != 0){
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
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
        if(queueTime<= 60)
            embed.addField(`Game #${gameNumber} (Queue)`, `Queue started ${queueTime} seconds ago.`);
        else{
            let minutes = Math.floor(queueTime/60);
            let seconds = queueTime - minutes * 60;
            if(minutes == 1)
                embed.addField(`Game #${gameNumber} (Queue)`, `Queue started ${minutes} minute and ${seconds} seconds ago.`);
            else embed.addField(`Game #${gameNumber} (Queue)`, `Queue started ${minutes} minutes and ${seconds} seconds ago.`);
        }
        embed.addField('Type:', '3v3')
        embed.addField('Queue:', `${queueMembers}`)
        embed.setFooter(footer);
        
        return message.channel.send(embed);
        
    }
}