const { findMatch, getMatch } = require('../../processes/global');
const { MessageEmbed, Collection } = require('discord.js');
const { rlColor, prefix } = require('../../config.json');

module.exports = {
	name: 'report',
	aliases: ['r'],
	args: 1,
	usage: `${prefix}report [W/L]`,
	execute(client, message, args){
		let embed = new MessageEmbed().setColor(rlColor);
		if(!client.matches.has(message.author.id)){
			embed.setDescription("You are not in a match!");
			return message.channel.send(embed);
		};
		
		let results = client.results;
		let matchID = client.matches.get(message.author.id);

		if(!findMatch(results, matchID)) client.results.push({matchID: matchID, collection: new Collection()});
		let match = getMatch(results, matchID);

		switch(args[0].toLowerCase()){
			case 'w':
				match.collection.set(message.author.id, 'win')
				embed.setDescription(`<@${message.author.id}> voted WIN.`)
				message.channel.send(embed)
				break;
			case 'l':
				match.collection.set(message.author.id, 'loss')
				embed.setDescription(`<@${message.author.id}> voted LOSS.`)
				message.channel.send(embed)
				break;
			default:
				embed.setDescription("Incorrect usage of command. Use !help report for help.")
				return message.channel.send(embed);
		}

		if(match.collection.size == 6){
			
		}
	}
}