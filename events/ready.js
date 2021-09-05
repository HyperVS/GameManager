const connection = require("../db/connection.js");
const db = require("../db/orm");
const { unrankedRole } = require("../config.json");


module.exports = {
    once: true,
    async run(client) {
        let guild = client.guilds.cache.get([...client.guilds.cache.keys()][0]);
        console.log(`${client.user.username} is online!`);

        connection.connect(async err => {
            if(err) throw err;
            console.log("Connected to SQL Database");

            db.createDatabase();
            guild.roles.cache.find(r => r.id == unrankedRole).members.map(m => m.user.id).forEach(userid => {
                db.userExists(userid).then(res => {
                    if(!res) db.createUser(userid);
                });
            });
        });
    }
};