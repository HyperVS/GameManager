const { prefix, footer } = require("../../config.json");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    aliases: ["h"],
    args: 1,
    usage: `${prefix}help or ${prefix}help [command]`,
    execute(client, message, args, game){
        const embed = new MessageEmbed().setColor(game.color).setFooter(game.maxPlayers+footer);
        if(args.length === 1){
            const command = client.commands.get(args[0])
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if(!command){
                embed.setDescription("This command does not exist!");
                return message.channel.send(embed);
            }
            embed.setTitle(`${command.name} command`)
                .setDescription(`Command usage: ${command.usage}`);
            return message.channel.send(embed);
        }
        
        let categories = new Map();
        const commands = [...client.commands.keys()].filter(command => !client.commands.get(command).admin);
        fs.readdirSync("./commands").forEach(folder => {
            categories.set(folder, []);
            fs.readdirSync(path.resolve("commands", folder)).forEach(file => {
                categories.get(folder).push(path.basename(file, path.extname(file)));
            });
        });
        embed.setTitle("Available commands:");
        [...categories.keys()].filter(category => category != "admin").forEach(category => {
            embed.addField(category, categories.get(category));
        });
        
        return message.channel.send(embed);
        
    }
};