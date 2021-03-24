const mysql = require('mysql');

var connection = mysql.createConnection({
    host: '96.58.110.215',
    user: 'access',
    password: 'zKuh7Wfb'
});

module.exports = connection;