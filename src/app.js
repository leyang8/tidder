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
app.use(express.json()); // for parsing application/json
app.use(cors());


// Get username off of userID
app.route('/api/secure/users/:id')
    .get((req, res) => {
        const userID = req.params.id
        var usernameResult = ''
        
        pool.query('SELECT * FROM User WHERE userID = ?', [userID], (err, result, fields) => {
            if (err) {
                return res.status(404).json({ error: 'No user in the database' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                usernameResult = result[0].username
                console.log(result)
                res.json(usernameResult);
            }
        });
    });

app.route('/api/secure/forums')
    .get((req, res) => {
        const results = [];
        
        pool.query('SELECT * FROM Forum ORDER BY RAND() LIMIT 6', [], (err, result, fields) => {
            if (err) {
                return res.status(404).json({ error: 'No forums in the database' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                results.push(...result);
                res.json(results);
            }
        });
    });
    app.route('/api/secure/forums/:forumID/comments')
    .get((req, res) => {
        const results = [];
        const forumID = req.params.forumID
        
        pool.query(`SELECT * FROM Comment WHERE forumID = ?`, [forumID], (err, result, fields) => {
            if (err) {
                return res.status(404).json({ error: 'No forums in the database' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                results.push(...result);
                res.json(results);
            }
        });
    });
    app.route('/api/secure/comments/:commentID/children')
    .get((req, res) => {
        const results = [];
        const commentID = req.params.commentID
        
        pool.query(`SELECT * FROM Comment WHERE parentCommentID = ?`, [commentID], (err, result, fields) => {
            if (err) {
                return res.status(404).json({ error: 'No children comment' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                results.push(...result);
                res.json(results);
            }
        });
    });

// POST route for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM User WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Incorrect email or password, please try again!' });
        }
        const user = results[0];

        const isMatch = password === user.password; // Assuming plaintext comparison for simplicity
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect email or password, please try again!' });
        }

        // Passwords match, login successful
        res.json({ user });
    });
});


app.listen(5002, () => console.log('Listening on port 5002'));