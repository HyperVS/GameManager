const isCool = require("../processes/isCool");
const { prefix, rlColor, supportedGames } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    once: false,
    run(message, client) {
        if (!message.guild || message.author.bot) return;
        isCool(message);
        if(!message.content.startsWith(prefix)) return;
        const embed = new MessageEmbed().setColor(rlColor);
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return console.log(`ERROR: Command ${commandName} does not exist!`);
        if(command.admin && !message.member.hasPermission('ADMINISTRATOR')){
            embed.setDescription('You do not have permissions to execute this command!');
            return message.channel.send(embed);
        }
        if((command.args == 0 && args.length != 0) || (command.args > 0 && args.length > command.args)){
            embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${command.usage}`)
            return message.channel.send(embed);
        }

        let game
		for(Game of supportedGames){
			if(message.channel.parent.id == game.parentID){
				game = Game;
			}
		}

        // Command handler
        try {
            command.execute(client, message, args, game);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
};