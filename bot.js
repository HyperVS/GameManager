require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const connection = require('./db/connection');
const { prefix } = require('./config.json');
const client = new Discord.Client();
const user = require('./db/models/user');

client.commands = new Discord.Collection();
client.queue = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}	

client.on('ready', () => {
	console.log(`${client.user.username} is online!`);
})


client.on('message', message =>{
    if (!message.guild) return;
    // const channel = member.guild.channels.cache.find(ch => ch.name === 'birthdays'); // change this to the channel name you want to send the greeting to
    // if (!channel) return;
    
	// checking if command is used
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	
    // dynamic command handling
	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.BOT_TOKEN);

connection.once('open', ()=>{
	console.log('connected to db');
});