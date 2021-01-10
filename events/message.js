const isCool = require("../processes/isCool");
const { prefix, rlColor } = require('../config.json');

module.exports = {
    once: false,
    run(message, client) {
        if (!message.guild || message.author.bot) return;
        isCool(message);
        if(!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return console.log(`ERROR: Command ${commandName} does not exist!`);
        if((command.args == 0 && args.length != 0) || (command.args > 0 && args.length > command.args)){
            const embed = new Discord.MessageEmbed();
            embed.setColor(rlColor);
            embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${command.usage}`)
            return message.channel.send(embed);
        }
        // Command handler
        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
};