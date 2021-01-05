const { MessageEmbed } = require('discord.js');
const { rlColor, prefix } = require('../config.json');
const global = require('../global');
const db = require('../db/orm');

module.exports = {
	name: 'report',
	aliases: [],
	args: true,
	usage: `${prefix}report [W/L]`,
	execute(client, message, args){
		if(!global.findInMap(client.matches, message.author.id)) return; 
		//TODO: this needs to search the specifc game the user is in
		//TODO: currently it checks if a user is in a game
		//let matchID = parseInt(global.parseMatchId(message.channel.name));
		let count = client.matches.get(message.channel.name);
		let players = Array.from(count.entries());
	}
}