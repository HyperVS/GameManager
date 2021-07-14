const { MessageEmbed } = require('discord.js');
const getGame = require('../../helpers/getGame');
const { rlColor, prefix, supportedGames } = require('../../config.json');

module.exports = {
	name: 'leave',
	aliases: ['l'],
    args: 0,
    usage: `${prefix}leave`,
	execute(client, message, args){
        
        // Prepare message
        
        let isInQueue = false;
        
        const game = getGame(client, message);
        const queue = game.queue;
        
        const embed = new MessageEmbed().setColor(game.color);

        if(queue.has(message.author.id)) isInQueue = true;
       
        if (!isInQueue) {
            embed.setDescription(`<@${message.author.id}> you are not in any queues!`)
            return message.channel.send(embed);
        }

        else {
            queue.delete(message.author.id);
            embed.addField(`${message.author.username} has left the ${game.name} queue.`, `There are now ${queue.size} in the queue.`);
            return message.channel.send(embed);
        }
    }
}