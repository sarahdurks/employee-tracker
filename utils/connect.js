const mysql = require('mysql2');

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   port: 3306,
   password: 'password',
   database: "employee_database"
});

module.exports = connection;
