const { MessageEmbed } = require('discord.js');
const { prefix, footer, rlColor } = require('../config.json');
const db = require('../db/orm');

module.exports = {
	name: 'timer',
	aliases: [],
    args: true,
    usage: `${prefix}timer`,
	execute(client, message, args){
        client.timer = null;
        try {
            switch(args[1]) {
                case "seconds":
                    client.timer = setTimeout(() => {
                        message.channel.send(`The timer has expired!`);
                    }, parseInt(args[0]) * 1000);
                    break;
                case "minutes":
                    client.timer = setTimeout(() => {
                        message.channel.send(`The timer has expired!`);
                    }, parseInt(args[0]) * 1000 * 60);
                    break;
                case "hours":
                    client.timer = setTimeout(() => {
                        message.channel.send(`The timer has expired!`);
                    }, parseInt(args[0]) * 1000 * 60 * 60);
                    break;
                default:
                    message.channel.send("Please select a time-frame (seconds | minutes | hours)")
            }
            message.channel.send(`A timer has been started, ending in ${args[0]} ${args[1]}`);
        }
        catch {
            message.channel.send("ERROR: Unable to set a timer.");
        }
    }
}