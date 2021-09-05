const { MessageEmbed } = require("discord.js");

/**
 * Sends the voting message
 * @param {*} client 
 * @param {*} newMember Last member to join the channel
 * @param {*} gameColor Game color to format the message
 * @param {Match} match 
 * @returns 
 */
const sendVotingMessage = async (client, newMember, gameColor, match) => {
    const textChannel = client.channelIDS.get(newMember.channelID);

    const embed = new MessageEmbed();
    embed.setColor(gameColor)
        .addField("6 Players have joined the lobby!", "Voting will now commence.")
        .addField("Votes:", "🇨 Captains\n\n🇷 Random\n\n🇧 Balanced");

    try{
        let msg = await textChannel.send(embed);
        match.votes.setEmbedID(msg.id);
        await msg.react("🇨");
        await msg.react("🇷");
        await msg.react("🇧");
    } catch (error){
        console.log(error);
        return error;
    }
};

module.exports = sendVotingMessage;