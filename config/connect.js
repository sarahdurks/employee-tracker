
const mysql = require('mysql2');

class Database {
        constructor(config) {
            this.connection = mysql.createConnection()
