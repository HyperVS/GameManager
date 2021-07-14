const Discord = require('discord.js');
const queue = require("../commands/main/queue");
const leave = require("../commands/main/leave");
const Game = require("../types/Game");
const { client, message, db } = require("../__mocks__");

jest.mock("../db/orm.js")

describe("Queue command", () => {

    beforeEach(async () => {
        jest.clearAllMocks();
        client.games.set("RL", new Game("RL",
            "864799110720520192",
            "864799109213585438",
            6,
            "BLUE"
        ));
        message.channel.id = "864799110720520192";
        message.author.id = 1
        message.author.username = "SeaCaptain"
        await queue.execute(client, message);
    });

    test("when one person in the queue", async () => {
        expect(client.games.get("RL").queue.getLength()).toBe(1);
        expect(message.channel.send).toBeCalled();
    });

    test("when someone leaves the queue", async () => {
        await leave.execute(client, message)
        expect(client.games.get("RL").queue.getLength()).toBe(0);
        expect(message.channel.send).toBeCalled();

        await queue.execute(client, message)
        expect(client.games.get("RL").queue.getLength()).toBe(1);

        await leave.execute(client, message)
        expect(client.games.get("RL").queue.getLength()).toBe(0);
        expect(message.channel.send).toBeCalled();
    });

    test(("when two people are in the queue"), async () => {
        // Two people with id's 1 and 2 joining the queue
        for (i = 0; i < 2; ++i) {
            await queue.execute(client, message)
            message.author.id = i
        }

        expect(client.games.get("RL").queue.getLength()).toBe(2);
        expect(message.channel.send).toBeCalled();
    })

    test("when queue is ready", async () => {
        // Five people with id's 0, 1, 2, 3, 4, joining the queue
        for (i = 0; i < 5; ++i) {
            message.author.id = i
            client.users.cache.set(i, "username")
            await queue.execute(client, message)
        }
        expect(client.games.get("RL").queue.getLength()).toBe(5);

        message.author.id = 5
        client.users.cache.set("6", "username")

        await queue.execute(client, message)
        //expect(db.createMatches).toHaveBeenCalled()
        expect(client.games.get("RL").queue.getLength()).toBe(0);
        expect(message.channel.send).toBeCalled();
    })
});
