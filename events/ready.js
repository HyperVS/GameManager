const connection = require('../db/connection.js');
const db = require('../db/orm');
const { unrankedRole } = require('../config.json');

module.exports = {
    once: true,
    async run(client) {
        let guild = client.guilds.cache.get([...client.guilds.cache.keys()][0]);
        console.log(`${client.user.username} is online!`);
        connection.connect(async err => {
            if(err) throw err;
            console.log("Connected to SQL Database");

            db.createDatabase()
            guild.roles.cache.find(r => r.id == unrankedRole).members.map(m => m.user.id).forEach(userid => {
                db.userExists(userid, (res) => {
                    if (!res) db.createUser(userid)
                })
                let mmr = db.getMmr(userid, "RLusers");
                client.players.set(userid, mmr);
                client.players.sort((a,b) => b - a)
            })

            // db.getMatchID().then(e=>console.log(e));
            // db.getMmr('416278094530478110').then(mmr => console.log(mmr));
            // db.getWins('423937152942997514').then(wins => console.log(wins));
            // db.updateMmr('416278094530478110', 1200);
            // client.players.set('416278094530478110', 1200);
        })
    }
};