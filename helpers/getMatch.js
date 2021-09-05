/**
 * Gets a match fom the matchID
 * @param {*} client 
 * @param {string} matchID 
 * @returns Match
 */
const getMatch = (client, matchID) => {
    return client.matches.get(matchID);
};

module.exports = getMatch;
