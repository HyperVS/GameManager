/**
 * Set perms for text/voice channel
 * @param {*} server
 * @param {Array} users
 */
const setPerms = async (server, users) => {
    const textPerms = [{
        id: server.roles.everyone,
        deny: ["VIEW_CHANNEL"]
    }];
    const voicePerms = [{
        id: server.roles.everyone,
        deny: ["CONNECT"]
    }];
    users.forEach((userid) => {
        textPerms.push({
            id: userid,
            allow: ["VIEW_CHANNEL"]
        });
        voicePerms.push({
            id: userid,
            allow: ["CONNECT"]
        });
    });
};

module.exports = setPerms;