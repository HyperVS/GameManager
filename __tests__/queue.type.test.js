const Queue = require("../types/Queue");

let queue = new Queue();

describe("Queue class", () => {
    beforeEach(() => {
        queue = new Queue();
    });

    test("add player to the queue", () => {
        queue.addPlayer(123, "SeaCaptain");
        expect(queue.getLength()).toBe(1);
        expect(queue.getPlayer(123)).toBe("SeaCaptain");
    
        queue.addPlayer(456, "Hyper");
        expect(queue.getLength()).toBe(2);
        expect(queue.getPlayer(456)).toBe("Hyper");
    });
    
    test("get player from the queue", () => {
        queue.addPlayer(123, "SeaCaptain");
        expect(queue.getPlayer(123)).toBe("SeaCaptain");
    });
    
    test("remove player from the queue", () => {
        queue.addPlayer(123, "SeaCaptain");
        queue.removePlayer(123);
    
        expect(queue.getPlayers()).toStrictEqual(new Queue());
        expect(queue.getLength()).toEqual(0);
        expect(queue.getPlayer(123)).toBeUndefined();
    });
    
    test("if the queue contains the player", () => {
        expect(queue.has(123)).toBeFalsy();
    });
});