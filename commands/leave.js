const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'leave',
	aliases: ['l'],
	args: false,
	execute(client, message, args){
        const queue = client.queue;
        if(!queue.has(message.author.id)){
            return message.channel.send("You are not in the queue!");
        }
        queue.delete(message.author.id);
        return message.channel.send(`You have left the queue. There are now ${queue.size} in the queue.`)
    }
}