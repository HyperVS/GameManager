const { MessageEmbed } = require('discord.js');
const { rlColor } = require('../config.json');

module.exports = {
	name: 'leave',
	aliases: ['l'],
	args: false,
	execute(client, message, args){
        const queue = client.queue;
        if(!queue.has(message.author.id)){
            const embed = new MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@${message.author.id}> you are not in the queue!`)
            return message.channel.send(embed);
        }
        queue.delete(message.author.id);
        const embed = new MessageEmbed();
        embed.setColor(rlColor);
        embed.addField(`${message.author.username} has left the queue.`, `There are now ${queue.size} in the queue.`)
        return message.channel.send(embed);
    }
}