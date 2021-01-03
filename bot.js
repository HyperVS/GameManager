require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const client = new Discord.Client();
const connection = require('./db/connection.js');
const db = require('./db/orm.js');

client.embeds = new Discord.Collection();
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

client.on('messageReactionAdd', (reaction, user) => {
	if(user.bot) return;
	let message = reaction.message, emoji  = reaction.emoji;

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

	if (!command) return console.log(`ERROR: Command ${commandName} was used but not found.`);
	
    // dynamic command handling
	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.BOT_TOKEN);

connection.once('open', (err, cli) =>{
	if(!err) console.log('Connected to the Mongo Database.');
	else if (err) throw err;
});

connection.connect(err => {
	if(err) throw err;
	console.log("Connected to SQL Database");

	db.createDatabase();
	//db.createUser('Mercenary', 500, 0, 9999);
	db.userExists('Mercenary', res => console.log(res));
	//db.createMatch(JSON.stringify({'38495734985748': 'Mercenary', '3498573948759835': 'Hyper'}));
})