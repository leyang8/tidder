const express = require("express");
const fs = require("fs");
const cors = require("cors");

const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootuser",
  database: "new_schema",
  connectionLimit: 10,
});

// pool.query("SELECT * FROM User", [], (err, result, fields) => {
//   if (err) {
//     return console.log(err);
//   }
//   return console.log(result);
// });
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

app.route('/api/secure/forums/creator/:username')
    .get((req, res) => {
        const username = req.params.username;
        const results = [];
        
        // Use a JOIN to select forums based on the matching creatorID and username
        const sql = `
            SELECT Forum.*
            FROM Forum
            INNER JOIN User ON Forum.creatorID = User.userID
            WHERE User.username LIKE ?
            ORDER BY RAND()
            LIMIT 6
        `;

        pool.query(sql, [`%${username}%`], (err, result, fields) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            } else {
                // Assuming result is an array, you may need to adjust accordingly
                console.log(result)
                results.push(...result);
                res.json(results);
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
                console.log(result)
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
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  pool.query(
    "SELECT * FROM User WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Incorrect email or password, please try again!" });
      }
      const user = results[0];

      const isMatch = password === user.password; // Assuming plaintext comparison for simplicity
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Incorrect email or password, please try again!" });
      }

      // Passwords match, login successful
      res.json({ user });
    }
  );
});

app.listen(5002, () => console.log("Listening on port 5002"));

app.post("/api/register", (req, res) => {
  const {
    email,
    username,
    password,
    firstname,
    middlename,
    lastname,
    phoneNumber,
  } = req.body;

  const randomAdmin = Math.floor(Math.random() * 5) + 1;

  pool.query(
    `INSERT INTO User (email, username, password, firstname, middlename, lastname, phoneNumber, adminID) VALUES ('${email}', '${username}', '${password}', '${firstname}', '${middlename}', '${lastname}', '${phoneNumber}', '${randomAdmin}' )`,
    [],
    (err, result, fields) => {
      if (err) {
        return res.status(409).json({ message: "Email already been use" });
      }
      return res.status(200).json({ message: "Account Created, Please Login" });
    }
  );
});
