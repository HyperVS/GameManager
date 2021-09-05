const { MessageEmbed } = require("discord.js");
const db = require("../../db/orm");
const Match = require("../../types/Match");
const Perms = require("../../types/Perms");
const { getGame } = require("../../helpers/getGame");
const { 
    prefix, 
    thumbnail, 
    footer
} = require("../../config.json");
const checkChannel = require("../../helpers/queue/checkChannel");

module.exports = {
    name: "queue",
    aliases: ["q"],
    args: 0,
    usage: `${prefix}queue`,
    async execute(client, message){
        const server = message.guild;

        // Find the game the user is trying to queue
        const game = getGame(client, message);
        if(checkChannel()) return message.reply("please use this command in the specified channels.");
        const queue = game.queue;

        // Prepare message
        const embed = new MessageEmbed().setColor(game.color).setFooter(game.maxPlayers+footer);

        // Checks if user is already in a queue
        if(queue.has(message.author.id)){
            embed.setDescription(`<@!${message.author.id}> you are already in the queue!`);
            return message.channel.send(embed);
        }
        // Checks if a user is already in a match
        if(client.matches.has(message.author.id)){
            embed.setDescription(`<@!${message.author.id}> you are already in a match!`);
            return message.channel.send(embed);
        } 
        
        // Adds the player to the queue
        queue.addPlayer(message.author.id, message.author.username);
        
        if(queue.getLength() == 1){
            embed.setThumbnail(thumbnail);
            embed.setTitle(`1 player is in the ${game.name} queue`);
            embed.addField("Want to join?", `Type !q to join this ${game.maxPlayers}man!`);
            // FIXME: fix status and queuetime
            client.queueTime = new Date();
        }
        else embed.setTitle(`${queue.getLength()} players are in the queue`);
        embed.setDescription(`<@${message.author.id}> has joined.`);
        message.channel.send(embed);

        // If q is not ready to go, stop here and wait
        if(queue.getLength() != game.maxPlayers) return;

        // Set perms for the new channels
        let perms = new Perms(server, Array.from(queue.keys())).addTextPerms().addVoicePerms();

        // Prepare embed message
        let queueMembers = "";
        for(let member of queue.keys()){
            if(queueMembers != "") queueMembers += ",";
            queueMembers += `<@${member}>`;
        }

        //FIXME db.createMatch() ??
        let matchID = await db.createMatch(queue);
        queue.clear();
        await server.channels.create(`match-${matchID}`, {type: "category"});

        let channel = await server.channels.create(`Match ${matchID} Lobby`, {
            type: "voice",
            permissionOverwrites: perms.getVoicePerms(),
            parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
            userLimit: game.maxPlayers
        });
        let redirectLink = await channel.createInvite({
            maxAge: 120, // 2 minutes
            maxUses: game.maxPlayers
        });
        let textChannel = await server.channels.create(`match-${matchID}`, {
            permissionOverwrites: perms.getTextPerms(),
            parent: server.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category")
        });    

        client.channelIDS.set(channel.id, textChannel);
        embed.setColor(game.color)
            .setTitle(`${game.maxPlayers} Players have joined the queue!`)
            .setDescription(`Voting will begin once all players have joined the lobby! \n[Click here to join the game lobby!](${redirectLink})`)
            .addField("Players:", `${queueMembers}`)
            .setFooter(game.maxPlayers+footer)
            .setThumbnail(thumbnail);
        message.channel.send(embed);
        
        // DM each user when queue is full
        Array.from(queue.keys()).forEach(userid => {
            client.users.cache.get(userid).send(embed);
        });
        client.matches.set(matchID, new Match(matchID, Array.from(queue.keys()), game.name));
    }
};