const express = require("express");
const fs = require("fs");
const cors = require("cors");

const { createPool } = require("mysql2");

const pool = createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'cyt81ljc123',
    database: 'tidder',
    connectionLimit: 10

})
 
const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

app.route('/api/secure/comments/new')
    .post((req, res) => {
        const forumID = req.body.forumID;
        const content = req.body.content;
        const creationDate = Math.floor(new Date().getTime() / 1000);
        const creatorID = req.body.creatorID;

        // Assuming you have a MySQL connection pool named 'pool'
        pool.query(
            'INSERT INTO Comment (content, creationDate, creatorID, forumID) VALUES (?, ?, ?, ?)',
            [content, creationDate, creatorID, forumID],
            (err, result, fields) => {
                if (err) {
                    console.error('Error inserting comment:', err);
                    return res.status(500).json({ error: 'Failed to insert comment' });
                }

                // Assuming the commentID is an auto-increment field
                const commentID = result.insertId;
                res.json({ commentID, message: 'Comment inserted successfully' });
            }
        );
    });

app.route('/api/secure/comments/reply')
    .post((req, res) => {
        const forumID = req.body.forumID;
        const parentCommentID = req.body.parentCommentID;
        const content = req.body.content;
        const creationDate = Math.floor(new Date().getTime() / 1000);
        const creatorID = req.body.creatorID;

        // Assuming you have a MySQL connection pool named 'pool'
        pool.query(
            'INSERT INTO Comment (parentCommentID, content, creationDate, creatorID, forumID) VALUES (?, ?, ?, ?, ?)',
            [parentCommentID, content, creationDate, creatorID, forumID],
            (err, result, fields) => {
                if (err) {
                    console.error('Error inserting comment:', err);
                    return res.status(500).json({ error: 'Failed to insert comment' });
                }

                // Assuming the commentID is an auto-increment field
                const commentID = result.insertId;
                res.json({ commentID, message: 'Comment inserted successfully' });
            }
        );
    });


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


app.post("/api/createForum", (req, res) => {
    const { title, creationDate, creatorID } = req.body;

    // Select a random adminID between 1 and 5
    const randomAdmin = Math.floor(Math.random() * 5) + 1; 

    // Using prepared statement for security
    const query = 'INSERT INTO Forum (title, creationDate, creatorID, adminID) VALUES (?, ?, ?, ?)';
    const values = [title, creationDate, creatorID, randomAdmin];

    pool.query(query, values, (err, result, fields) => {
        if (err) {
            // Return a more appropriate error message
            console.error(err); // Log the error for debugging
            return res.status(500).json({ message: "An error occurred while creating the forum." });
        }
        // Success message
        return res.status(200).json({ message: "Forum created successfully." });
    });
});


