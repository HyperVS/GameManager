const { MessageEmbed } = require('discord.js');
const { rlColor, prefix, supportedGames } = require('../../config.json');

module.exports = {
	name: 'leave',
	aliases: ['l'],
    args: 0,
    usage: `${prefix}leave`,
	execute(client, message, args){
        
        const embed = new MessageEmbed().setColor(rlColor);
        let isInQueue = false;
        let queue;
        let queueGame;

        for(game of supportedGames){
            queue = client.queues.get(game);
            queueGame = game.name;
            if(queue.has(message.author.id)){
                isInQueue = true;
                break;
            }
        }
       
        if (!isInQueue) {
            embed.setColor(rlColor)
            .setDescription(`<@${message.author.id}> you are not in any queues!`)
            return message.channel.send(embed);
        }

        else {
            queue.delete(message.author.id);
            embed.addField(`${message.author.username} has left the ${queueGame} queue.`, `There are now ${queue.size} in the queue.`);
            return message.channel.send(embed);
        }
    }
}