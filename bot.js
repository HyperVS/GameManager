require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');

client.embeds = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();
client.matches = new Discord.Collection();
client.channelIDS = new Discord.Collection();
client.muted = new Discord.Collection();
client.counts = new Discord.Collection();
client.players = new Discord.Collection();

fs.readdirSync('./commands').forEach(folder => {
	fs.readdirSync(path.join('commands', folder)).forEach(file => {
		const command = require(path.resolve(path.join('commands', folder, file)));
		client.commands.set(command.name, command);
	})
})

// Event handler
fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const eventFunction = require(`./events/${file}`); 
		const event = file.split('.')[0]; 
		try {
			client[eventFunction.once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args, client));
		} catch (error) {
			console.error(error);
		}
	});
});

client.login(process.env.BOT_TOKEN);
