const mysql = require('mysql2');
const pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   port: 3306,
   password: 'password',
   database: "employee_database"
});
const databasePool = pool.promise();
module.exports = databasePool;