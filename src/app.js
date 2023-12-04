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
    database: 'new_schema',
    connectionLimit: 10

})


// Code to kill port: lsof -ti:5002 | xargs kill -9
 
const app = express();

app.use(cors());



app.route('/api/secure/forums')
    .get((req, res) => {
        const results = [];
        
        pool.query('SELECT * FROM Forum', [], (err, result, fields) => {
            if (err) {
                return res.status(404).json({ error: 'No forums in the database' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                results.push(...result);
                res.json(results);
            }
        });
    });


app.listen(5002, () => console.log('Listening on port 5002'));