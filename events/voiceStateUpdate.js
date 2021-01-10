const db = require('../db/orm.js');
const { rlColor, max } = require('../config.json');

module.exports = {
    once: false,
    run(oldMember, newMember, client) {
        if(!client.channelIDS.has(newMember.channelID) 
            || (oldMember.voiceChannel !== undefined || newMember.channelID === oldMember.channelID)) return;
        let voiceChannel = client.channels.cache.get(newMember.channelID);
        let textChannel = client.channelIDS.get(newMember.channelID);
        if(voiceChannel.members.size != max) return;
        db.getMatchID(matchID => {
            const embed = new Discord.MessageEmbed();
            embed.setColor(rlColor)
            .addField('6 Players have joined the lobby!', 'Voting will now commence.')
            .addField('Votes:', '🇨 Captains\n\n🇷 Random\n\n🇧 Balanced');
            textChannel.send(embed)
            .then(embed => {
                client.embeds.set(embed.id, client.usersArray)
                client.matches.set(`match-${matchID}`, client.usersArray)
                client.counts.set('c', {count: 0})
                client.counts.set('r', {count: 0})
                client.counts.set('b', {count: 0})
                embed.react("🇨")
                .then(embed.react("🇷"))
                .then(embed.react("🇧"))
            .catch(err => console.log(err));
            });
        })
    }
};