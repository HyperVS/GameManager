const { prefix } = require('../../config.json');
const { MessageEmbded } = require('discord.js');

module.exports = {
    name: 'purge',
    aliases: [],
    args: 2,
    usage: `${prefix}purge [amount] or purge @user [amount] or purge @user`,
    admin: true,
    async execute(client, message, args){
        let amount = isNaN(parseInt(args[1])) ? false : parseInt(args[1]);
        if((args.length == 1 && message.mentions.users.size != 1)
        || (args.length == 1))


        if(args.length == 1){
            if(message.mentions.users.size === 1){
                let msgs = []
                let messages = await message.channel.messages.fetch({limit: amount || 100});
                messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => {
                    msgs.push(msg)
                });
                return message.channel.bulkDelete(msgs, true);
            }
            await message.channel.bulkDelete(args[0]+1, true);
        }
        else if(args.length == 2){

        }
    }
}