const { MessageEmbed } = require('discord.js');
const { prefix, rlColor } = require('../../config.json');
const db = require('../../db/orm');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb', 'leaderboards'],
	args: 0,
	usage: `${prefix}leaderboard`,
	async execute (client, message, args){
		let msg = await message.channel.send(this.generateEmbed(client, message.author.id, 0));
		await msg.react('◀️');
		await msg.react('▶️');
		client.currentIndex = 0;
	},
	generateEmbed: (client, userID, index) => {
		let players = [...client.players.keys()];
        let current = players.slice(index, index+10);
        const embed = new MessageEmbed()
        .setColor(rlColor)
        .setFooter(`${Math.floor(index/10)+1}/${Math.ceil(players.length/10)}`)
		.setTitle("Leaderboard");
        let desc = '';
        current.forEach((player) => {
            desc+= `${players.indexOf(player)+1}: <@!${player}> - ${client.players.get(player)}\n`
		})
		desc+= `----------------------------------------------------\n`;
		desc+= `${players.indexOf(userID)+1}: <@!${userID}> - ${client.players.get(userID)}\n`
        embed.setDescription(desc);
        return embed;
    }
}


