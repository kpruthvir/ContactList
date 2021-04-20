var mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'contacts',
    
    multipleStatements: true
});

module.exports = con