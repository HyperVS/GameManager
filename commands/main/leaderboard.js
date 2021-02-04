const { MessageEmbed } = require('discord.js');
const { prefix, rlColor, footer } = require('../../config.json');
const db = require('../../db/orm');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb', 'leaderboards'],
	args: 0,
	usage: `${prefix}leaderboard`,
	async execute (client, message, args){
		let players = await db.getAllUsers('RLusers');
		let current = players.slice(0, 10);
		let counter = 0;
        const embed = new MessageEmbed()
        .setColor(rlColor)
        .setFooter(`${footer}`)
		.setTitle("Leaderboard");
        let desc = '';
        current.forEach(async (player, i, array) => {
			let mmr = await db.getMmr(player, 'RLusers')
			desc+= `${players.indexOf(player)+1}: <@!${player}> - ${mmr}\n`
			if (++counter == array.length) desc+= `----------------------------------------------------\n`;
		})
		let userMmr = await db.getMmr(message.author.id, 'RLusers');
		desc+= `${players.indexOf(message.author.id)+1}: <@!${message.author.id}> - ${userMmr}\n`
        embed.setDescription(desc);
		message.channel.send(embed);
	}
}


