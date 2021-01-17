const { prefix, rlColor, footer } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    args: 1,
    usage: `${prefix}help or ${prefix}help [command]`,
    execute(client, message, args){
        const embed = new MessageEmbed();
        if(args.length === 1){
            const command = client.commands.get(args[0])
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if(!command){
                embed.setDescription('This command does not exist!')
                .setColor(rlColor)
                .setFooter(footer);
                return message.channel.send(embed);
            }
            embed.setTitle(`${command.name} command`)
            .setDescription(`Command usage: ${command.usage}`)
            .setColor(rlColor)
            .setFooter(footer);
            return message.channel.send(embed);
        }
        let msg = '';
        const commands = [...client.commands.keys()].filter(command => !client.commands.get(command).private);
        commands.forEach(command => {
            msg+= `${command}\n`
        })
        embed.setTitle('Available commands:')
        .setDescription(msg)
        .setColor(rlColor)
        .setFooter(footer);
        return message.channel.send(embed);
    }
}