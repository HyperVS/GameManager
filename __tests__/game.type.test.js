const Game = require("../types/Game");

const game = new Game("Rocket League", "123", "abc", 6, "blue");

describe("Game class", () => {
    test("get name of the game", () => {
        expect(game.getName()).toBe("Rocket League");
    });

    test("get channelID", () => {
        expect(game.getChannelID()).toBe("123");
    });

    test("get parent ID", () => {
        expect(game.getParentID()).toBe("abc");
    });

    test("get max players", () => {
        expect(game.getMaxPlayers()).toBe(6);
    });

    test("get color", () => {
        expect(game.getColor()).toBe("blue");
    });
});