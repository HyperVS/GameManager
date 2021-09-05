const sqlConn = require("./connection.js");
 
const functions = {
    /**
     * Deletes all tables
    */
    deleteDatabase: () => {
        sqlConn.query("USE `game-manager`;");
        sqlConn.query("DROP TABLE IF EXISTS `RLusers`");
        sqlConn.query("DROP TABLE IF EXISTS `CSusers`");
        sqlConn.query("DROP TABLE IF EXISTS `users`;");
        sqlConn.query("DROP TABLE IF EXISTS `matches`;");
    },
    createDatabase: () => {
        sqlConn.query("CREATE DATABASE IF NOT EXISTS `game-manager`;");
        sqlConn.query("USE `game-manager`;");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `users` (`id` INT PRIMARY KEY AUTO_INCREMENT, `userid` VARCHAR(64) NOT NULL); ");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `RLusers` (`id` INT PRIMARY KEY, `wins` INT DEFAULT 0 NOT NULL, `losses` INT DEFAULT 0 NOT NULL, `mmr` INT DEFAULT 1000 NOT NULL, FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE)");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `CSusers` (`id` INT PRIMARY KEY, `wins` INT DEFAULT 0 NOT NULL, `losses` INT DEFAULT 0 NOT NULL, `mmr` INT DEFAULT 1000 NOT NULL, FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE)");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `matches` (`id` INT PRIMARY KEY AUTO_INCREMENT, `users` VARCHAR(256) NOT NULL, `date` DATE DEFAULT CURRENT_TIMESTAMP);");
    },
    /**
     * Checks if a user exists in the table by querying it's user ID
     * @param {*} userID 
    */
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
            });
        });
    },
    /**
     * Creates a user in all game tables
     * @param {String} userID 
    */
    createUser: (userID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("INSERT INTO `users` (`userid`) VALUES (?)", [userID], (err) => {
                if(err) reject(err);
                sqlConn.query("SELECT id FROM `users` WHERE `userID` = ?", [userID], (err, res) => {
                    if(err) reject(err);
                    sqlConn.query("INSERT INTO `RLusers` (`id`) VALUES (?)", [res[0].id], (err) => {
                        if(err) reject(err);
                    });
                    sqlConn.query("INSERT INTO `CSusers` (`id`) VALUES (?)", [res[0].id], (err) => {
                        if(err) reject(err);
                    });
                    resolve();
                });
            });
        });
    },
    /**
     * Queries a specific table for a user's mmr
     * @param {String} userID 
     * @param {String} table 
    */
    getMmr: (userID, table) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT `mmr` FROM `" + table + "` NATURAL JOIN `users` WHERE `userid` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].mmr);
            });
        });
    },
    /**
     * Adds a win to the player record
     * @param {String} userID
     * @param {String} table  
    */
    addWin: (userID, table) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("UPDATE `" + table + "` SET `wins` = `wins`+1 WHERE `id` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].wins);
            });
        });
    },
    /**
     * Adds a loss to the player record
     * @param {String} userID
     * @param {String} table 
    */
    addLoss: (userID, table) => {
        return new Promise((resolve, reject) => {
            sqlConn.query("UPDATE `" + table + "` SET `losses` = `losses`+1 WHERE `id` = ?", [userID], (err, res) => {
                if(err) reject(err);
                resolve(res[0].losses);
            });
        });
    },
    /**
     * Updates mmr value for a user
     * @param {String} userID 
     * @param {String} table 
     * @param {Number} value 
    */
    updateMmr: (userID, table, value) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT id FROM `users` WHERE `userID` = ?", [userID], (err, res) => {
                if(err) reject(err);
                sqlConn.query("UPDATE `" + table + "` SET `mmr` = ? WHERE `id` = ?", [value, res[0].id], (err) => {
                    if(err) reject(err);
                    resolve();
                });
            });
        });
    },
    /**
     * @param {Map} users
     */
    createMatch: (users) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("INSERT INTO `matches` (`users`) VALUES (?)", [JSON.stringify(Array.from(users.entries()))], (err, res) => {
                if(err) reject(err);
                resolve(res.insertId);
            });
        });
    },
    /**
     * Gets a match from ID
     * @param {Number} matchID 
     */
    getMatch: (matchID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches` WHERE `id` = ?", [matchID], (err, res) => {
                if(err) reject(err);
                if(res.length > 0) {
                    let result = {
                        id: res[0].id,
                        users: new Map(JSON.parse(res[0].users)),
                        date: res[0].date
                    };
                    resolve(result);
                }
            });
        });
    },
    /**
     * Deletes a match from record
     * @param {Number} matchID 
     */
    deleteMatch: (matchID) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("DELETE FROM `matches` WHERE `id` = ?", [matchID], (err) => {
                if(err) reject(err);
                resolve();
            });
        });
    },
    
    /**
     * Gets the match a user is in
     * @param {String} userID 
     */
    getMatchByUser: (userid) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches` WHERE ? IN (`users`)", [userid], (err, res) => {
                if(err) reject(err);
                if(res.length > 0) {
                    let matches = new Map();
                    res.forEach(r => {
                        matches.set(r.id, new Map(JSON.parse(r.users)));
                    });
                    resolve(matches);
                }
            });
        });
    },
    /**
     * Gets all match IDs
     * @param {Function} cb 
     */
    getMatchID: () => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `matches`", (err, res) => {
                if(err) reject(err);
                resolve(res.length);
            });
        });
    },
    /**
     * Get number of wins of a player
     * @param {String} userid 
     * @param {String} table
     */
    getWins: (userid, table) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT `wins` FROM `" + table + "` NATURAL JOIN `users` WHERE `userid` = ?", [userid], (err, res) => {
                if(err) reject(err);
                resolve(res[0].wins);
            });
        });
    },
    /**
     * Get number of losses of a plyer
     * @param {String} userid 
     * @param {String} table
     */
    getLosses: (userid, table) => {
        return new Promise((resolve, reject) => {
            sqlConn.query("SELECT `losses` FROM `" + table + "` NATURAL JOIN `users` WHERE `userid` = ?", [userid], (err, res) => {
                if(err) reject(err);
                resolve(res[0].losses);
            });
        });
    },
    /**
     * Get an array of all userids in a table ordered by descending mmr
     * @param {String} table
     */
    getAllUsers: (table) => {
        return new Promise((resolve, reject) =>{
            sqlConn.query("SELECT * FROM `" + table + "` NATURAL JOIN `users` ORDER BY `mmr` DESC", (err, res) => {
                if(err) reject(err);
                let users = [];
                res.forEach(user => users.push(user.userid));
                resolve(users);
            });
        });
    }
};
 
module.exports = functions;