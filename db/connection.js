const mysql = require('mysql');

var connection = mysql.createConnection({
    host: '192.168.1.78',
    user: 'access',
    password: 'zKuh7Wfb'
});

module.exports = connection;