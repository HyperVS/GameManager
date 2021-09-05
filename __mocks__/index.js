const Discord = require("discord.js");

const client = {
    games: new Discord.Collection(),
    matches: new Discord.Collection(),
    channelIDS: new Discord.Collection(),
    users: {
        cache: {
            get: jest.fn(() => {
                return {send: jest.fn()};
            }),
            set: jest.fn()
        }
    }
};

const message = ({
    channel: {
        parentID: "864799109213585438",
        send: jest.fn(),
    },
    content: "",
    author: {
        bot: false,
    },
    guild: {
        roles: {
            everyone: {}
        },
        channels: {
            cache: {
                find: jest.fn()
            },
            create: jest.fn(() => {
                return {createInvite: jest.fn()};
                
            })
        }
    },
    reply: jest.fn()
});

module.exports = {
    client: client,
    message: message
};