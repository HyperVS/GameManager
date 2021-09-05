const Votes = require("../types/Votes");

let votes = new Votes();
beforeEach(() => {
    votes = new Votes();
});

describe("Votes class", () => {
    test("Captains most voted", () => {
        votes.incrementCaptains();
        expect(votes.getCaptains()).toBe(1);
        expect(votes.getMostVotes()).toBe("captains");
    });
    test("Random most voted", () => {
        votes.incrementRandom();
        expect(votes.getRandom()).toBe(1);
        expect(votes.getMostVotes()).toBe("random");
    });
    test("Balanced most voted", () => {
        votes.incrementBalanced();
        expect(votes.getBalanced()).toBe(1);
        expect(votes.getMostVotes()).toBe("balanced");
    });
});