require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.embeds = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();
client.matches = new Discord.Collection();
client.channelIDS = new Discord.Collection();
client.muted = new Discord.Collection();
client.counts = new Discord.Collection();
client.mmrs = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
});

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
