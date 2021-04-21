const fs = require('fs');
const { prefix } = require('../../config.json');
const Game = require("../../types/Games")
require('dotenv').config();

module.exports = {
    name: 'setup',
    aliases: [],
    args: 0,
    usage: `${prefix}setup`,
    admin: true,
    async execute(client, message, args){
        if (process.env.DEV_MODE !== "TRUE") return;

        const server = message.guild;
        const channel = server.channels.cache.find(channel=> (channel.name == 'Rocket League 6mans' || channel.name == 'CSGO 10mans') && channel.type == "category")
        if(channel) return;

        const rlCategory = await server.channels.create('Rocket League 6mans', {type: 'category'});
        await server.channels.create('chat', {parent: rlCategory});
        const rlQueue = await server.channels.create('6mans-queue', {parent: rlCategory});
        await server.channels.create('game-results', {parent: rlCategory});
        await server.channels.create('6mans-updates', {parent: rlCategory});
        await server.channels.create('6 Mans', {type: 'voice', parent: rlCategory});

        const csCategory = await server.channels.create('CSGO 10mans', {type: 'category'});
        await server.channels.create('chat', {parent: csCategory});
        const csQueue = await server.channels.create('10mans-queue', {parent: csCategory});
        await server.channels.create('game-results', {parent: csCategory});
        await server.channels.create('10mans-updates', {parent: csCategory});
        await server.channels.create('10 mans', {type: 'voice', parent: csCategory});

        const valCategory = await server.channels.create('Valorant 10mans', {type: 'category'});
        await server.channels.create('chat', {parent: valCategory});
        const valQueue = await server.channels.create('10mans-queue', {parent: valCategory});
        await server.channels.create('game-results', {parent: valCategory});
        await server.channels.create('10mans-updates', {parent: valCategory});
        await server.channels.create('10 mans', {type: 'voice', parent: valCategory});
        
        fs.readFile('./config.json', (err, data) => {
            if(err) console.log(err);
            let object = JSON.parse(data);
            object.supportedGames = [
                new Game("RL", rlQueue.id, rlCategory.id, 6, "BLUE"),
                new Game("CS", csQueue.id, csCategory.id, 10, "YELLOW"),
                new Game("VAL", valQueue.id, valCategory.id, 10, "RED")
            ];
            fs.writeFileSync('./config.json', JSON.stringify(object, null, 4));
        })
    }
}