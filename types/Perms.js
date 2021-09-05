module.exports = class Perms {
    /**
     * Creates a new set of Perms
     * @param {*} server
     * @param {Array} users
     */
    constructor(server, users){
        this.users = users;
        this.voice = [{
            id: server.roles.everyone,
            deny: ["CONNECT"]
        }];
        this.text = [{
            id: server.roles.everyone,
            deny: ["VIEW_CHANNEL"]
        }];
    }

    getUsers(){
        return this.users;
    }

    getVoicePerms(){
        return this.voice;
    }

    getTextPerms(){
        return this.text;
    }

    addVoicePerms(){
        this.users.forEach(userID => {
            this.voice.push({
                id: userID,
                allow: ["CONNECT"]
            });
        });
    }

    addTextPerms(){
        this.users.forEach(userID => {
            this.text.push({
                id: userID,
                allow: ["VIEW_CHANNEL"]
            });
        });
    }
};