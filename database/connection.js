const mysql2 = require('mysql2')

const conn = mysql2.createConnection({
    port : "3366",
    host: "console.aws.relist.dev",
    user: "mark",
    password: "C-sZ0RMSY@q8RLQB",
    database: "mark_project"
  });

module.exports = { conn }