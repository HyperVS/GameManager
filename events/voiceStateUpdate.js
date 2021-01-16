const db = require('../db/orm.js');
const { rlColor, max } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    once: false,
    async run(oldMember, newMember, client) {
        if(!client.channelIDS.has(newMember.channelID) 
            || (oldMember.voiceChannel !== undefined || newMember.channelID === oldMember.channelID)) return;
        let voiceChannel = client.channels.cache.get(newMember.channelID);
        let textChannel = client.channelIDS.get(newMember.channelID);
        if(voiceChannel.members.size != max) return;
        let matchID = await db.getMatchID();
        const embed = new MessageEmbed();
        embed.setColor(rlColor)
        .addField('6 Players have joined the lobby!', 'Voting will now commence.')
        .addField('Votes:', '🇨 Captains\n\n🇷 Random\n\n🇧 Balanced');
        try{
            let msg = await textChannel.send(embed)
            client.embeds.set(msg.id, client.usersArray)
            client.matches.set(`match-${matchID}`, client.usersArray)
            client.counts.set('c', {count: 0})
            client.counts.set('r', {count: 0})
            client.counts.set('b', {count: 0})
            await msg.react("🇨");
            await msg.react("🇷");
            await msg.react("🇧");       
        } catch (error){
            console.log(error)
            return error;
        }
    }
};