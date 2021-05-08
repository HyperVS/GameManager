const { MessageEmbed, Collection } = require('discord.js');
const { footer, prefix } = require('../../config.json');
const { handleMmr } = require('../../processes/voting');

module.exports = {
	name: 'report',
	aliases: ['r'],
	args: 0,
	usage: `${prefix}report`,
	async execute(client, message, args, game){
		let embed = new MessageEmbed().setColor(game.color).setFooter(game.maxPlayers+footer);

		if(!client.matches.has(message.author.id)){
			embed.setDescription("You are not in a match!");
			return message.channel.send(embed);
		};
		
		let results = client.results;
		let matchID = client.matches.get(message.author.id);
		
		let team1 = client.teams.get(matchID).team1;
		let team2 = client.teams.get(matchID).team2;
	
		embed.setDescription(`<@${message.author.id}>, please react to indicate the outcome of the game"`);

		let msg = await message.channel.send(embed);
		try{
			msg.react('🇼');
			msg.react('🇱');
		} catch(error){
			console.log(error);
		}

		const filter = (reaction, user) => {
			return ['🇼', '🇱'].includes(reaction.emoji.name) && user.id === message.author.id;
		}

		const collector = msg.createReactionCollector(filter, {max: 1});

		collector.on('collect', (reaction, user) => {
			switch(reaction.emoji.name){
				case '🇼':
					results.set(user.id, "win")
					break;
				case '🇱':
					results.set(user.id, "loss")
					break;
			}
		})

		let r = [...results.keys()];
		if(r.some(userid => team1.includes(userid)) && r.some(userid => team2.includes(userid))){

			let res = [];
			for(let userid of r){
				res.push(results.get(userid))
			}

			if(res.includes("win") && res.includes("loss")){
				// no need for all players to report
				if(team1.includes(res[0]) && results.get(res[0]) == "win"){
					// team1 won
					team1.forEach(userid => {
						results.set(userid, "win")
					})
					team2.forEach(userid => {
						results.set(userid, "loss")
					})
				} else{
					// team2 won
					team2.forEach(userid => {
						results.set(userid, "win")
					})
					team1.forEach(userid => {
						results.set(userid, "loss")
					})
				}

				handleMmr(message, team1, team2, matchID);

			} else {
				// all players need to report
				embed.setDescription("@everyone, please react to indicate the outcome of the game")
				let newMsg = await message.channel.send(embed);
				try{
					newMsg.react('🇼');
					newMsg.react('🇱');
				} catch(error){
					console.log(error);
				}

				const collector2 = newMsg.createReactionCollector(filter);

				collector2.on('collect', (reaction, user) => {
					switch(reaction.emoji.name){
						case '🇼':
							results.set(user.id, "win")
							break;
						case '🇱':
							results.set(user.id, "loss")
							break;
					}
				})
			}
		};
	}
}