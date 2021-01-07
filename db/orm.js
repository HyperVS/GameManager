const sqlConn = require('./connection.js');

const functions = {
    userExists: (userID, cb) => {
        sqlConn.query("SELECT * FROM `users` WHERE `userid` = ?", [userID], (err, res) => {
            if(err) throw err;
            if(res.length > 0) {
                if(cb) cb(true);
            }
            else {
                if(cb) cb(false);
            }
        })
    },
    createDatabase: () => {
        sqlConn.query("USE `game-manager`;");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `users` (`id` INT PRIMARY KEY AUTO_INCREMENT, `userid` VARCHAR(64) NOT NULL, `wins` INT DEFAULT 0 NOT NULL, `losses` INT DEFAULT 0 NOT NULL, `mmr` INT DEFAULT 1000 NOT NULL, `queue` BOOLEAN DEFAULT FALSE); ");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `matches` (`id` INT PRIMARY KEY AUTO_INCREMENT, `users` VARCHAR(256) NOT NULL, `date` DATE DEFAULT CURRENT_TIMESTAMP);")
    },
    createUser: (userID, cb) => {
        sqlConn.query("INSERT INTO `users` (`userid`) VALUES (?)", [userID], (err, res) => {
            if(err) throw err;
            if(cb) cb(res);
        })
    },
    getUserInMatch: (userID, result) => {
        sqlConn.query("SELECT `queue` FROM `users` WHERE `userid` = ?", [userID], (err, res) => {
            if(err) throw err;
            result(!!res[0].queue);
        })
    },
    updateUserInMatch: (userID, value) => {
        sqlConn.query("UPDATE `users` SET `queue` = ? WHERE `userid` = ?", [value, userID], (err, res) => {
            if(err) throw err;
        })
    },
    getMmr: (userID, cb) => {
        sqlConn.query("SELECT `mmr` FROM `users` WHERE `userid` = ?", [userID], (err, res) => {
            if(err) throw err;
            if(cb) cb(res[0].mmr);
        })
    },
    addWin: (userID) => {
        sqlConn.query("UPDATE `users` SET `wins` = `wins`+1 WHERE `userid` = ?", [userID], (err, res) => {
            if(err) throw err;
        })
    },
    addLoss: (userID) => {
        sqlConn.query("UPDATE `users` SET `losses` = `losses`+1 WHERE `userid` = ?", [userID], (err, res) => {
            if(err) throw err;
        })
    },
    updateMmr: (userID, value) => {
        sqlConn.query("UPDATE `users` SET `mmr` = ? WHERE `userid` = ?", [value, userID], (err, res) => {
            if(err) throw err;
        })
    },
    /**
     * @param {Map} users
     * @param {Function} matchID
     */
    createMatch: (users, matchID) => {
        sqlConn.query("INSERT INTO `matches` (`users`) VALUES (?)", [JSON.stringify(Array.from(users.entries()))], (err, res) => {
            if(err) throw err;
            if(matchID) matchID(res.insertId);
        })
    },
    getMatch: (matchID, cb) => {
        sqlConn.query("SELECT * FROM `matches` WHERE `id` = ?", [matchID], (err, res) => {
            if(err) throw err;
            if(cb && res.length > 0) {
                let result = {
                    id: res[0].id,
                    users: new Map(JSON.parse(res[0].users)),
                    date: res[0].date
                }
                cb(result);
            }
        })
    },
    deleteMatch: (matchID) => {
        sqlConn.query("DELETE FROM `matches` WHERE `id` = ?", [matchID], (err, _) => {
            if(err) throw err;
        })
    },
    getMatchByUser: (userid, cb) => {
        sqlConn.query("SELECT * FROM `matches` WHERE ? IN (`users`)", [userid], (err, res) => {
            if(err) throw err;
            console.log(res);
            if(cb && res.length > 0) {
                let matches = new Map();
                res.forEach(r => {
                    matches.set(r.id, new Map(JSON.parse(r.users)));
                })
                cb(matches);
            }
        })
    },
    getMatchID: (cb) => {
        sqlConn.query("SELECT * FROM `matches`", (err, res) => {
            if(err) throw err;
            if(cb) cb(res.length);
        })
    }
}

module.exports = functions;