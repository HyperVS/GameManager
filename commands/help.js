const { prefix, rlColor, footer } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    args: 1,
    usage: `${prefix}help or ${prefix}help [command]`,
    execute(client, message, args){
        if(args.length === 1){
            const command = client.commands.get(args[0])
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if(!command){
                const embed = new MessageEmbed();
                embed.setDescription('This command does not exist!')
                .setColor(rlColor)
                .setFooter(footer);
                return message.channel.send(embed);
            }
            const embed = new MessageEmbed();
            embed.setTitle(`${command} command`)
            .setDescription(`Command usage: ${command.usage}`)
            .setColor(rlColor)
            .setFooter(footer);
            return message.channel.send(embed);
        }
        let msg = '';
        const commands = Array.from(client.commands.keys());
        commands[0].forEach(command => {
            msg+= `${command}\n`
        })
        const embed = new MessageEmbed();
        embed.setTitle('Available commands:')
        .setDescription(msg)
        .setColor(rlColor)
        .setFooter(footer);
        return message.channel.send(embed);
    }
}