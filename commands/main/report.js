const { MessageEmbed, Collection } = require('discord.js');
const { rlColor, prefix } = require('../../config.json');

module.exports = {
	name: 'report',
	aliases: ['r'],
	args: 0,
	usage: `${prefix}report`,
	execute(client, message, args){
		let embed = new MessageEmbed().setColor(rlColor);
		if(!client.matches.has(message.author.id)){
			embed.setDescription("You are not in a match!");
			return message.channel.send(embed);
		};
		
		let results = client.results;
		let matchID = client.matches.get(message.author.id);

		embed.setDescription("Please react to indicate the outcome of the game");

		let msg = message.channel.send(embed);
		try{
			msg.react('emoji1');
			msg.react('emoji2');
		} catch(error){
			console.log(error);
		}

		const filter1 = (reaction, user) => {
			return ['emojii1', 'emoji2'].includes(reaction.emoji.name) && user.id == captain1;
		}

		const filter2 = (reaction, user) => {
			return ['emoji1', 'emoji2'].includes(reaction.emoji.name) && user.id == captain2;
		}

		const collector1 = msg.createReactionCollector(filter1);

		collector1.on('collect', collected => {
			let reaction = collected.first();
			switch(reaction.emoji.name){
				case 'emoji1':
					results.set(user)
					break;
				case 'emoji2':
					
					break;
				}
		})
	
		collector.on('end', () => {
			
		})
	


		// if(!findMatch(results, matchID)) client.results.push({matchID: matchID, collection: new Collection()});
		// let match = getMatch(results, matchID);
		// switch(args[0].toLowerCase()){
		// 	case 'w':
		// 		match.collection.set(message.author.id, 'win')
		// 		embed.setDescription(`<@${message.author.id}> voted WIN.`)
		// 		message.channel.send(embed)
		// 		break;
		// 	case 'l':
		// 		match.collection.set(message.author.id, 'loss')
		// 		embed.setDescription(`<@${message.author.id}> voted LOSS.`)
		// 		message.channel.send(embed)
		// 		break;
		// 	default:
		// 		embed.setDescription("Incorrect usage of command. Use !help report for help.")
		// 		return message.channel.send(embed);
		// }

		// if(match.collection.size == 6){
			
		// }
	}
}