const { MessageEmbed } = require('discord.js');
const { rlColor, prefix } = require('../../config.json');

module.exports = {
	name: 'leave',
	aliases: ['l'],
    args: 0,
    usage: `${prefix}leave`,
	execute(client, message, args){
        

        let isInQueue = false;
        let queue;
        let queueGame;
        try {
            client.queues.each((value, key) => {
                if (value.has(message.author.id)) {
                    isInQueue = true;
                    queue = value
                    queueGame = key.replace("queue", "");
                    throw "breakLoop";
                }
            })
        } catch (e) {
            console.log(e)
            if (e != "breakLoop") throw e;
        }

        if (!isInQueue) {
            const embed = new MessageEmbed();
            embed.setColor(rlColor)
            .setDescription(`<@${message.author.id}> you are not in any queues!`)
            return message.channel.send(embed);
        }

        else {
            queue.delete(message.author.id);
            const embed = new MessageEmbed();
            embed.setColor(rlColor)
            .addField(`${message.author.username} has left the ${queueGame} queue.`, `There are now ${queue.size} in the queue.`);
            return message.channel.send(embed);
        }
    }
}