const connection = require('../db/connection.js');
const db = require('../db/orm');

module.exports = {
    once: true,
    async run(client) {
        console.log(`${client.user.username} is online!`);
        connection.connect(err => {
            if(err) throw err;
            console.log("Connected to SQL Database");
        
            db.createDatabase();
            db.getMatchID(res => {
                console.log(res);
            })
        })
    }
};