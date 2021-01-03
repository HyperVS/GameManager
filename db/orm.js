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
        sqlConn.query("CREATE TABLE IF NOT EXISTS `users` (`id` INT PRIMARY KEY AUTO_INCREMENT, `userid` VARCHAR(64) NOT NULL, `wins` INT DEFAULT 0 NOT NULL, `losses` INT DEFAULT 0 NOT NULL, `mmr` INT DEFAULT 0 NOT NULL); ");
        sqlConn.query("CREATE TABLE IF NOT EXISTS `matches` (`id` INT PRIMARY KEY AUTO_INCREMENT, `users` VARCHAR(256) NOT NULL, `date` DATE DEFAULT CURRENT_TIMESTAMP);")
    },
    createUser: (userID, wins, losses, mmr, cb) => {
        sqlConn.query("INSERT INTO `users` (`userid`, `wins`, `losses`, `mmr`) VALUES (?, ?, ?, ?)", [userID, wins, losses, mmr], (err, res) => {
            if(err) throw err;
            if(cb) cb(res);
        })
    },
    createMatch: (users, cb) => {
        sqlConn.query("INSERT INTO `matches` (`users`) VALUES (?)", [users], (err, res) => {
            if(err) throw err;
            if(cb) cb(res);
        })
    }
}

module.exports = functions;