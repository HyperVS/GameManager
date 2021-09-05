const mysql = require("mysql");
const host = process.env.HOST || "96.58.110.215";

var connection = mysql.createConnection({
    host: host,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports = connection;