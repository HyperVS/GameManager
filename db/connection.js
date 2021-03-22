const mysql = require('mysql');

var connection = mysql.createConnection({
    host: '70.119.140.92',
    user: 'access',
    password: 'Qsaq0H2C8Qx711DZ'
});

module.exports = connection;