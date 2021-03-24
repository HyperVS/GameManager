module.exports = {
    once: false,
    run(member, client){
        const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
        if (!channel) return;
        return channel.send(`Hey ${member}, welcome to **${member.guild.name}**!`)
    } 
}