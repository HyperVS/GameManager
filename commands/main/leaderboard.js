const { MessageEmbed } = require('discord.js');
const { prefix, rlColor } = require('../../config.json');
const db = require('../../db/orm');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb', 'leaderboards'],
	args: 0,
	usage: `${prefix}leaderboard`,
	async execute (client, message, args){
		let msg = await message.channel.send(await this.generateEmbed(message.author.id, 0));
		await msg.react('◀️');
		await msg.react('▶️');
		client.currentIndex = 0;
	},
	generateEmbed: async (userID, index) => {
		let players = await db.getAllUsers('RLusers');
		let current = players.slice(index, index+10);
		let counter = 0;
        const embed = new MessageEmbed()
        .setColor(rlColor)
        .setFooter(`${Math.floor(index/10)+1}/${Math.ceil(players.length/10)}`)
		.setTitle("Leaderboard");
        let desc = '';
        current.forEach(async (player, i, array) => {
			let mmr = await db.getMmr(player, 'RLusers')
			desc+= `${players.indexOf(player)+1}: <@!${player}> - ${mmr}\n`
			if (++counter == array.length) desc+= `----------------------------------------------------\n`;
		})
		let userMmr = await db.getMmr(userID, 'RLusers');
		desc+= `${players.indexOf(userID)+1}: <@!${userID}> - ${userMmr}\n`
        embed.setDescription(desc);
        return embed;
    }
}


