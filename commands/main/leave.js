const { MessageEmbed } = require('discord.js');
const { rlColor, prefix, supportedGames } = require('../../config.json');

module.exports = {
	name: 'leave',
	aliases: ['l'],
    args: 0,
    usage: `${prefix}leave`,
	execute(client, message, args, game){
        
        const embed = new MessageEmbed();
        let isInQueue = false;
        let queue = client.queues.get(game);
        if(queue.has(message.author.id)) isInQueue = true;
    
        embed.setColor(game.color);
       
        if (!isInQueue) {
            embed.setColor(game.color)
            .setDescription(`<@${message.author.id}> you are not in any queues!`)
            return message.channel.send(embed);
        }

        else {
            queue.delete(message.author.id);
            embed.addField(`${message.author.username} has left the ${game.name} queue.`, `There are now ${queue.size} in the queue.`);
            return message.channel.send(embed);
        }
    }
}