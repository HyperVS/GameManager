require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, rlColor } = require('./config.json');
const client = new Discord.Client();
const connection = require('./db/connection.js');
const db = require('./db/orm.js');
const global = require('./global');
const isCool = require("./isCool")

client.embeds = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();
client.matches = new Discord.Collection();
client.muted = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}	

client.on('ready', () => {
	console.log(`${client.user.username} is online!`);
})

client.on('messageReactionAdd', (reaction, user) => {
	if(user.bot) return;
	let message = reaction.message, emoji  = reaction.emoji;
	if(message.reactions.cache.filter(r => r.users.cache.has(user.id)).size >= 2) {
		reaction.users.remove(user.id);
	}

	if(client.embeds.has(message.id)) {
		let tmp = Array.from(client.embeds.values(message.id));
		if(!tmp[0].includes(user.id)) {
			reaction.users.remove(user.id);
			user.send("You are not in that queue!").then(() => {});
		}

		else {
			if(message.reactions.cache.size == 4) {
				console.log('penis')
			}
		}
	}
})

client.on('message', message => {
	if (!message.guild || message.author.bot) return;
	
	isCool(message);

	// chat logger
	let log = `${message.member.user.tag} (${message.member.user.id}): ${message}`;
	fs.appendFile('chat.txt', log + '\n', err => {
		if(err) throw err;
		console.log(log);
	})

	if(!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return console.log(`ERROR: Command ${commandName} does not exist!`);
	
	if((command.args == false && args.length != 0) || (command.args == true && args.length < 1)){
		const embed = new Discord.MessageEmbed();
		embed.setColor(rlColor);
		embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${command.usage}`)
		return message.channel.send(embed);
	}

    // dynamic command handling
	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.BOT_TOKEN);

const originalValue = new Map([[6636, 'Mercenary']]);
connection.connect(err => {
	if(err) throw err;
	console.log("Connected to SQL Database");

	db.createDatabase();
	//db.getMatchByUser('6636', res => console.log(res));
	//db.createUser('6636');
	db.getUserInMatch('6636', res => {
		console.log(res);
	})
})