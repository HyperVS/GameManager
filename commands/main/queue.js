const { MessageEmbed } = require('discord.js');
const db = require('../../db/orm');
const { 
    prefix, 
    thumbnail, 
    footer
} = require('../../config.json');

module.exports = {
	name: 'queue',
	aliases: ['q'],
    args: 0,
    usage: `${prefix}queue`,
	async execute(client, message, args){
        const game = client.games.find((game) => message.channel.id == game.channelID)
        const queue = game.queue;
        
        const embed = new MessageEmbed().setColor(game.color).setFooter(game.maxPlayers+footer);
        if(queue == undefined) return message.reply('please use this command in the specified channels.');
        
        if(queue.has(message.author.id)){
            embed.setDescription(`<@!${message.author.id}> you are already in the queue!`);
            return message.channel.send(embed);
        }
        if(client.matches.has(message.author.id)){
            embed.setDescription(`<@!${message.author.id}> you are already in a match!`);
            return message.channel.send(embed);
        }
        queue.set(message.author.id, message.author.username)
        if(queue.size == 1) client.queueTime = new Date();
        
        if(queue.size == 1){
            embed.setThumbnail(thumbnail);
            embed.setTitle(`1 player is in the ${game.name} queue`)
            embed.addField('Want to join?', `Type !q to join this ${game.maxPlayers}man!`)
        }
        else embed.setTitle(`${queue.size} players are in the queue`);
        embed.setDescription(`<@${message.author.id}> has joined.`);
        message.channel.send(embed);
        if(queue.size != game.maxPlayers) return;

        client.usersArray = Array.from(queue.keys());
        let voicePerms = [{
            id: server.roles.everyone,
            deny: ['CONNECT']
        }];
        let textPerms = [{
            id: server.roles.everyone,
            deny: ['VIEW_CHANNEL']
        }];
        client.usersArray.forEach(userid => {
            textPerms.push({
                id: userid,
                allow: ['VIEW_CHANNEL']
            })
            voicePerms.push({
                id: userid,
                allow: ['CONNECT']
            })
        });
        let queueMembers = '';
        for(let member of queue.keys()){
            if(queueMembers != '') queueMembers += ',';
            queueMembers += `<@${member}>`;
        };
        let matchID = await db.createMatch(queue);
        queue.clear();
        await server.channels.create(`match-${matchID}`, {type: 'category'})
        let channel = await server.channels.create(`Match ${matchID} Lobby`, {
            type: 'voice',
            permissionOverwrites: voicePerms,
            parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
            userLimit: game.maxPlayers
        })
        let redirectLink = await channel.createInvite({
            maxAge: 120, // 2 minutes
            maxUses: game.maxPlayers
        })
        let textChannel = await server.channels.create(`match-${matchID}`, {
            permissionOverwrites: textPerms,
            parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category")
        })    
        client.channelIDS.set(channel.id, textChannel);
        embed.setColor(game.color)
            .setTitle(`${game.maxPlayers} Players have joined the queue!`)
            .setDescription(`Voting will begin once all players have joined the lobby! \n[Click here to join the game lobby!](${redirectLink})`)
            .addField('Players:', `${queueMembers}`)
            .setFooter(game.maxPlayers+footer)
            .setThumbnail(thumbnail);
        message.channel.send(embed);
        client.usersArray.forEach(userid => {
            client.users.cache.get(userid).send(embed);
            client.matches.set(userid, matchID);
        })
    }
}