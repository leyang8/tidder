const express = require('express');
const fs = require('fs');
const cors = require('cors');

const {
    createPool
} = require('mysql2')

const pool = createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootuser',
    database: 'sys',
    connectionLimit: 10

})

// pool.query('SELECT * FROM User', [], (err, result, fields) => {
//     if(err){
//         return console.log(err)
//     }
//     return console.log(result)
// })
// Code to kill port: lsof -ti:5002 | xargs kill -9
 
const app = express();

app.use(cors());

app.use(express.json());

