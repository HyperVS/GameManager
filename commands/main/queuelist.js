const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
require('dotenv').config();

module.exports = {
    name: 'queuelist',
    aliases: ['ql'],
    args: 0,
    usage: `${prefix}ql`,
    admin: false,
    async execute(client, message, args) {
        const server = message.guild;
        const games = client.games

        const gameQueueList = [];

        games.forEach((game) => {
            if (game.queue.size != 0) {
                gameQueueList.push(game.queue);
            }
        })

        if (gameQueueList.length == 0) {
            return message.channel.send("No one is queueing right now.")
        }

        else {
            let msg = "";
            gameQueueList.forEach((queue) => {
                queue.forEach((player) => {
                    console.log(player)
                    msg += player;
                })
            })
            console.log(msg)
            return message.channel.send(msg)
        }
    } 
}