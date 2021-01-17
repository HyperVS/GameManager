const { MessageEmbed } = require('discord.js');
const { rlColor, prefix } = require('../../config.json');

module.exports = {
	name: 'report',
	aliases: ['r'],
	args: 1,
	usage: `${prefix}report [W/L]`,
	execute(client, message, args){
		let embed = new MessageEmbed();
		if(!client.matches.has(message.author.id)){
			embed.setColor(rlColor).setDescription("You are not in a match!");
			return message.channel.send(embed);
		};
		// let matchID = client.matches.get(message.author.id);
		let result = client.result;

		switch(args[0].toLowerCase()){
			case 'w':
				if(result.has(message.author.id)) return;
				result.set(message.author.id, 1)
				message.react('✅');
				break;
			case 'l':
				if(result.has(message.author.id)) return;
				result.set(message.author.id, 0)
				message.react('✅');
				break;
			default:
				embed.setColor(rlColor)
				.setDescription("Incorrect usage of command. Use !help report for help.")
				return message.channel.send(embed);
		}
	}
}