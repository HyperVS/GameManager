const { MessageEmbed } = require('discord.js');
const { stat } = require('fs');
const { rlColor, footer, prefix } = require('../config.json');
const db = require('../db/orm');

module.exports = {
	name: 'profile',
	aliases: ['p'],
	args: 0,
	usage: `${prefix}profile`,
	async execute(client, message, args){
		let wins = await db.getWins('416278094530478110');
		let losses = await db.getLosses('416278094530478110');
		const embed = new MessageEmbed();
		embed.setTitle(`${message.author.username}'s Profile`)
		.setThumbnail(message.author.avatarURL())
		.addField('Games played:', `${wins + losses}`)
		.addField('Wins:', `${wins}`)
		.addField('Losses:', `${losses}`)
		.addField('W/L:', `${Math.round(((wins/losses) + Number.EPSILON) * 100) / 100}`)
		.setColor(rlColor)
		.setFooter(footer);
		return message.channel.send(embed);
    }
}