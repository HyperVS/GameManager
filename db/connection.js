const mysql = require('mysql');

var connection = mysql.createConnection({
    host: '70.119.133.158',
    user: 'access',
    password: 'Qsaq0H2C8Qx711DZ'
});

module.exports = connection;