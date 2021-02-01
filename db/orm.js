const { resolve } = require('path');
const sqlConn = require('./connection.js');

const functions = {
    deleteDatabase: () => {
        sqlConn.query("USE `game-manager`;");
        sqlConn.query("DROP TABLE IF EXISTS `users`;")
        sqlConn.query("DROP TABLE IF EXISTS `matches`;")
    },
    createDatabase: () => {
        sqlConn.query("USE `game-manager`;");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `users` (`id` INT PRIMARY KEY AUTO_INCREMENT, `userid` VARCHAR(64) NOT NULL UNIQUE, `wins` INT DEFAULT 0 NOT NULL, `losses` INT DEFAULT 0 NOT NULL, `mmr` INT DEFAULT 1000 NOT NULL); ", () => {
        sqlConn.query("CREATE TABLE IF NOT EXISTS `matches` (`id` INT PRIMARY KEY AUTO_INCREMENT, `users` VARCHAR(256) NOT NULL, `date` DATE DEFAULT CURRENT_TIMESTAMP);");
        })
    },
    userExists: (userID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `users` WHERE `userid` = ?", [userID], (err, res) => {
                if(err) reject(err);
                if(res.length > 0) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
        })
    },
    createUser: (userID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("INSERT IGNORE INTO `users` (`userid`) VALUES (?)", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        })
    },
    getMmr: (userID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT `mmr` FROM `users` WHERE `userid` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].mmr);
            })
        })
    },
    addWin: (userID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("UPDATE `users` SET `wins` = `wins`+1 WHERE `userid` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].wins);
            })
        })
    },
    addLoss: (userID) => {
        return new Promise((resolve, reject) => {
            sqlConn.query("UPDATE `users` SET `losses` = `losses`+1 WHERE `userid` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].losses);
            })
        })
    },
    updateMmr: (userID, value) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("UPDATE `users` SET `mmr` = ? WHERE `userid` = ?", [value, userID], (err, res) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    /**
     * @param {Map} users
     * @param {Function} matchID
     */
    createMatch: (users) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("INSERT INTO `matches` (`users`) VALUES (?)", [JSON.stringify(Array.from(users.entries()))], (err, res) => {
                if(err) reject(err);
                resolve(res.insertId);
            })
        })
    },
    getMatch: (matchID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches` WHERE `id` = ?", [matchID], (err, res) => {
                if(err) reject(err);
                if(res.length > 0) {
                    let result = {
                        id: res[0].id,
                        users: new Map(JSON.parse(res[0].users)),
                        date: res[0].date
                    }
                    resolve(result);
                }
            })
        })
    },
    deleteMatch: (matchID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("DELETE FROM `matches` WHERE `id` = ?", [matchID], (err, _) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    getMatchByUser: (userid) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches` WHERE ? IN (`users`)", [userid], (err, res) => {
                if(err) reject(err);
                if(res.length > 0) {
                    let matches = new Map();
                    res.forEach(r => {
                        matches.set(r.id, new Map(JSON.parse(r.users)));
                    })
                    resolve(matches);
                }
            })
        })
    },
    getMatchID: () => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches`", (err, res) => {
                if(err) reject(err);
                resolve(res.length);
            })
        })
    },
    getWins: (userid) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT `wins` FROM `users` WHERE `userid` = ?", [userid], (err, res) => {
                if(err) reject(err);
                resolve(res[0].wins);
            })
        })
    },
    getLosses: (userid) => {
        return new Promise((resolve, reject) => {
            sqlConn.query("SELECT `losses` FROM `users` WHERE `userid` = ?", [userid], (err, res) => {
                if(err) reject(err);
                resolve(res[0].losses);
            })
        })
    }
}

module.exports = functions;