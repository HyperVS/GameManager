const Perms = require("../../types/Perms");

const handleTeams = async (client, message, team1, team2, matchID) => {
    const server = message.guild;

    // save teams
    let teams = client.teams;
    teams.set(matchID, {team1: team1, team2: team2});
    
    // set permissions
    let t1perms = new Perms(server, team1).addVoicePerms();
    let t2perms = new Perms(server, team2).addVoicePerms();

    // create team 1 voice channel and apply perms
    let channel1 = await message.guild.channels.create("Team One", {
        type: "voice",
        permissionOverwrites: t1perms.getVoicePerms(),
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    });

    // move team 1 members to their voice channel
    team1.forEach(userID => {
        message.guild.members.cache.get(userID).voice.setChannel(channel1);
    });
   
    // create team 2 voice channel and apply perms 
    let channel2 = await message.guild.channels.create("Team Two", {
        type: "voice",
        permissionOverwrites: t2perms.getVoicePerms(),
        parent: message.guild.channels.cache.find(c => c.name == `match-${matchID}` && c.type == "category"),
        userLimit: 3
    });

    // move team 2 members to their voice channel
    team2.forEach(userID => {
        message.guild.members.cache.get(userID).voice.setChannel(channel2);
    });
};

module.exports = handleTeams;