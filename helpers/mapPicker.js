const { run } = require("../events/ready");

const { MessageEmbed } = require("discord.js");
const db = require("../db/orm");

module.exports = {
    async run(client, channel) {
        channel.send("a");
    }
};