const { MessageEmbed } = require('discord.js');
const { prefix, footer, rlColor } = require('../../config.json');
const db = require('../../db/orm');

module.exports = {
	name: 'status',
	aliases: [],
    args: 0,
    usage: `${prefix}status`,
	async execute(client, message, args){
        const queue = client.queue;
        if(queue.size == 0){
            const embed = new MessageEmbed();
            embed.setColor(rlColor)
            .setDescription(`<@!${message.author.id}> there is no active queue right now.`)
            return message.channel.send(embed);
        }
        let queueMembers = '';
        for(let member of queue.keys()){
            if(queueMembers != '') queueMembers += ',';
            queueMembers += `<@${member}>`;
        };
        const queueTime = Math.floor(Math.abs((client.queueTime - new Date())/1000));
        const matchID = await db.getMatchID();
        const embed = new MessageEmbed();
        embed.setColor(rlColor);
        if(queueTime<= 60) embed.addField(`Match #${matchID+1} (Queue)`, `Queue started ${queueTime} seconds ago.`);
        else{
            let minutes = Math.floor(queueTime/60);
            let seconds = queueTime - minutes * 60;
            if(minutes == 1)
                embed.addField(`Match #${matchID+1} (Queue)`, `Queue started ${minutes} minute and ${seconds} seconds ago.`);
            else embed.addField(`Match #${matchID+1} (Queue)`, `Queue started ${minutes} minutes and ${seconds} seconds ago.`);
        }
        embed.addField('Type:', '3v3')
        embed.addField('Queue:', `${queueMembers}`)
        embed.setFooter(footer);
        return message.channel.send(embed); 
    }
}