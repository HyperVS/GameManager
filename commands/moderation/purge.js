const { prefix, rlColor } = require('../../config.json');
const { MessageEmbed } = require('discord.js');



module.exports = {
    name: 'purge',
    aliases: [],
    args: 2,
    usage: `${prefix}purge [amount] / @user / @user [amount]`,
    admin: true,
    async execute(client, message, args){
        const limit = 50;
        const checkLimit = (amount) => {
            if (amount > limit) {
                return false;
            }
        }

        const embed = new MessageEmbed().setColor(rlColor);
        if(args.length == 1){
            let amount = parseInt(args[0]);
            if (!checkLimit(amount)) {
                embed.setDescription("Maximum purge allowed is 50 messages")
                return message.channel.send(embed);
            };
            if(message.mentions.users.size === 1){
                let msgs = []
                let messages = await message.channel.messages.fetch({limit: 100});
                messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => {
                    msgs.push(msg)
                });
                return message.channel.bulkDelete(msgs, true);
            }
            else if(args[0] == amount){
                await message.channel.bulkDelete(amount+1, true);
            }
            else{
                embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
                return message.channel.send(embed);
            }
        }
        else if(args.length == 2){
            let amount = parseInt(args[1]);
            if (!checkLimit(amount)) {
                embed.setDescription("Maximum purge allowed is 50 messages")
                return message.channel.send(embed);
            };

            if(message.mentions.users.size === 1 && args[1] == amount){
                let msgs = []
                let count = 0;
                let messages = await message.channel.messages.fetch({limit: 100});
                messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => {
                    if(count <= amount){
                        msgs.push(msg)
                        count++;
                    }
                });
                return message.channel.bulkDelete(msgs, true);
            }
            else{
                embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
                return message.channel.send(embed);
            }
        }
        else{
            embed.setDescription(`<@!${message.author.id}> wrong usage of command! Correct usage: ${this.usage}`)
            return message.channel.send(embed);
        }
    }
}