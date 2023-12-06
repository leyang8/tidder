const express = require("express");
const fs = require("fs");
const cors = require("cors");

const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootuser",
  database: "se3309_project",
  connectionLimit: 10,
});

// //Profile Page Queries

// //FOllowers list for profile page
// //Userid has to be specified in Sql IN (**)
// //followeeUserID = userID
// pool.query(`SELECT DISTINCT followerUserID FROM Followship WHERE followeeUserID = ()`, [], (err, result, fields) => {
//         if(err){
//         return console.log(err)
//     }
//     return result
//   })

// //Following List for profile page
// //Current UserId has to be called
// //FollowerUserID = UserID
// pool.query(`SELECT DISTINCT followeeUserID FROM Followship WHERE followerUserID = ()`, [], (err, result, fields) => {
//     if(err){
//     return console.log(err)
// }
// return result
// })

// //Followship Notification Query
// //receiverID = UserID
// pool.query(`SELECT DISTINCT followerUserID, timestamp FROM Followship_Notification WHERE receiverID = ()`, [], (err, result, fields) => {
//     if(err){
//     return console.log(err)
// }
// return result
// })

// //Reaction Notification
// //creatorID = currentUserID
// pool.query(`SELECT R.userID FROM Reaction R JOIN Comment C ON R.commentID = C.commentID WHERE R.isLike = TRUE AND C.creatorID = :currentUserID;`, [], (err, result, fields) => {
//     if(err){
//     return console.log(err)
// }
// return result
// })

// //List of names of all the forums UserId has created
// //Current Users userId is not specified in the SQL Query
// pool.query(`SELECT DISTINCT title, creationDate FROM Forum WHERE creatorID = ()`, [], (err, result, fields) => {
//     if(err){
//     return console.log(err)
// }
// return result
// })

// pool.query('SELECT * FROM User', [], (err, result, fields) => {
//     if(err){
//         return console.log(err)
//     }
//     return console.log(result)
// })

// Code to kill port: lsof -ti:5002 | xargs kill -9

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

app
  .route("/api/secure/follows/:firstID/:secondID")
  .get(async (req, res) => {
    const firstID = req.params.firstID;
    const secondID = req.params.secondID;
    pool.query(
      "SELECT * FROM Followship WHERE followerUserID = ? and followeeUserID = ?",
      [firstID, secondID],
      (err, result, fields) => {
        if (err) {
          return res.status(404).json({ error: "No user in the database" });
        } else {
          console.log(result);
          // Assuming result is an array, you may need to adjust accordingly
          if (!result[0]) {
            res.json(false);
          } else {
            res.json(true);
          }
        }
      }
    );
  })
  .post(async (req, res) => {
    const firstID = req.params.firstID;
    const secondID = req.params.secondID;
    const creationDate = Math.floor(new Date().getTime() / 1000);
    const follow = req.body.follow;
    if (follow) {
      pool.query(
        "INSERT INTO Followship (followerUserID, followeeUserID, creationDate) VALUES (?, ?, ?)",
        [firstID, secondID, creationDate],
        (err, result, fields) => {
          if (err) {
            console.log(err);
            return res.status(404).json({ error: "No user in the database" });
          } else {
            console.log(result);
            // Assuming result is an array, you may need to adjust accordingly
            res.json(1);
          }
        }
      );
    } else {
      pool.query(
        "DELETE FROM Followship WHERE followerUserID = ? AND followeeUserID = ?",
        [firstID, secondID],
        (err, result, fields) => {
          if (err) {
            return res.status(404).json({ error: "No user in the database" });
          } else {
            console.log(result);
            // Assuming result is an array, you may need to adjust accordingly
            res.json(0);
          }
        }
      );
    }
  });

app.route("/api/secure/comments/delete").delete((req, res) => {
  const commentID = req.body.commentID;
  pool.query(
    "DELETE FROM Comment WHERE commentID = ?",
    [commentID],
    (err, result, fields) => {
      if (err) {
        return res.status(404).json({ error: "No comment" });
      } else {
        // Assuming result is an array, you may need to adjust accordingly
        return res.status(201).json({ message: "Successful delete!" });
      }
    }
  );
});
app.route("/api/secure/comments/new").post((req, res) => {
  const forumID = req.body.forumID;
  const content = req.body.content;
  const creationDate = Math.floor(new Date().getTime() / 1000);
  const creatorID = req.body.creatorID;

  // Assuming you have a MySQL connection pool named 'pool'
  pool.query(
    "INSERT INTO Comment (content, creationDate, creatorID, forumID) VALUES (?, ?, ?, ?)",
    [content, creationDate, creatorID, forumID],
    (err, result, fields) => {
      if (err) {
        console.error("Error inserting comment:", err);
        return res.status(500).json({ error: "Failed to insert comment" });
      }

      // Assuming the commentID is an auto-increment field
      const commentID = result.insertId;
      res.json({ commentID, message: "Comment inserted successfully" });
    }
  );
});

app.route("/api/secure/comments/reply").post((req, res) => {
  const forumID = req.body.forumID;
  const parentCommentID = req.body.parentCommentID;
  const content = req.body.content;
  const creationDate = Math.floor(new Date().getTime() / 1000);
  const creatorID = req.body.creatorID;

  // Assuming you have a MySQL connection pool named 'pool'
  pool.query(
    "INSERT INTO Comment (parentCommentID, content, creationDate, creatorID, forumID) VALUES (?, ?, ?, ?, ?)",
    [parentCommentID, content, creationDate, creatorID, forumID],
    (err, result, fields) => {
      if (err) {
        console.error("Error inserting comment:", err);
        return res.status(500).json({ error: "Failed to insert comment" });
      }

      // Assuming the commentID is an auto-increment field
      const commentID = result.insertId;
      res.json({ commentID, message: "Comment inserted successfully" });
    }
  );
});

// Get username and profile pic off of userID
app.route("/api/secure/users/:id").get(async (req, res) => {
  const userID = req.params.id;
  var usernameResult = "";

  pool.query(
    "SELECT * FROM User WHERE userID = ?",
    [userID],
    (err, result, fields) => {
      if (err) {
        return res.status(404).json({ error: "No user in the database" });
      } else {
        // Assuming result is an array, you may need to adjust accordingly
        usernameResult = result[0].username;
        console.log(result);
        res.json(usernameResult);
      }
    }
  );
});

app.route("/api/secure/forums/creator/:username").get(async (req, res) => {
  const username = req.params.username;
  const results = [];

  // Use a JOIN to select forums based on the matching creatorID and username
  const sql = `
                  SELECT Forum.*
                  FROM Forum
                  INNER JOIN User ON Forum.creatorID = User.userID
                  WHERE User.username LIKE ?
                  LIMIT 6
              `;

  pool.query(sql, [`%${username}%`], (err, result, fields) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    } else {
      // Assuming result is an array, you may need to adjust accordingly
      console.log(result);
      results.push(...result);
      res.json(results);
    }
  });
});

app
  .route("/api/secure/forums")
  .get(async (req, res) => {
    const results = [];
    pool.query(
      "SELECT * FROM Forum ORDER BY RAND() LIMIT 6",
      [],
      (err, result, fields) => {
        if (err) {
          return res.status(404).json({ error: "No forums in the database" });
        } else {
          // Assuming result is an array, you may need to adjust accordingly
          results.push(...result);
          console.log(result);
          res.json(results);
        }
      }
    );
  })
  .delete((req, res) => {
    const forumID = req.body.forumID;
    pool.query(
      "DELETE FROM Forum WHERE forumID = ?",
      [forumID],
      (err, result, fields) => {
        if (err) {
          return res.status(404).json({ error: "No forums in the database" });
        } else {
          // Assuming result is an array, you may need to adjust accordingly
          return res.status(201).json({ message: "Successful delete!" });
        }
      }
    );
  });
app.route("/api/secure/forums/:forumID/comments").get(async (req, res) => {
  const results = [];
  const forumID = req.params.forumID;

  pool.query(
    `SELECT * FROM Comment WHERE forumID = ? AND parentCommentID IS NULL`,
    [forumID],
    (err, result, fields) => {
      if (err) {
        return res.status(404).json({ error: "No forums in the database" });
      } else {
        // Assuming result is an array, you may need to adjust accordingly
        results.push(...result);
        res.json(results);
      }
    }
  );
});
// Tells if the user has already reacted to a comment
app
  .route("/api/secure/comments/:id/:commentID/reacted")
  .get(async (req, res) => {
    const userID = req.params.id;
    const commentID = req.params.commentID;
    pool.query(
      `SELECT * FROM Reaction WHERE commentID = ? AND userID = ?`,
      [commentID, userID],
      (err, result, fields) => {
        if (err) {
          return res.status(404).json({ error: "No reactions for comment" });
        } else {
          console.log(result);
          if (!result[0]) {
            res.json(false);
          } else {
            res.json(result);
          }
        }
      }
    );
  });

app
  .route("/api/secure/comments/:id/reactions")
  .get(async (req, res) => {
    const commentID = req.params.id;
    var likeResults = 0;
    var dislikeResults = 0;

    pool.query(
      `SELECT * FROM Reaction WHERE commentID = ?`,
      [commentID],
      (err, result, fields) => {
        if (err) {
          return res.status(404).json({ error: "No reactions for comment" });
        } else {
          result.forEach((result) => {
            console.log(result);
            if (result.isLike == 1) {
              likeResults += 1;
            } else {
              dislikeResults += 1;
            }
          });
          res.json({ likes: likeResults, dislikes: dislikeResults });
        }
      }
    );
  })
  .post(async (req, res) => {
    const commentID = req.params.id;
    const isLike = req.body.isLike;
    const userID = req.body.userID;
    const alreadyReacted = req.body.alreadyReacted;
    console.log(alreadyReacted);
    if (alreadyReacted == true) {
      pool.query(
        `UPDATE Reaction SET isLike = ? WHERE userID = ? AND commentID = ?`,
        [isLike, userID, commentID],
        (err, result, fields) => {
          console.log(err);
          console.log("reached");
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "No reactions updated" });
            } else {
              return res.status(200).json({ message: "Successful update!" });
            }
          }
        }
      );
    } else {
      pool.query(
        `INSERT INTO Reaction (isLike, userID, commentID) VALUES (?, ?, ?)`,
        [isLike, userID, commentID],
        (err, result, fields) => {
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            return res.status(201).json({ message: "Successful insert!" });
          }
        }
      );
    }
  });

app.route("/api/secure/comments/:commentID/children").get(async (req, res) => {
  const results = [];
  const commentID = req.params.commentID;

  pool.query(
    `SELECT * FROM Comment WHERE parentCommentID = ?`,
    [commentID],
    (err, result, fields) => {
      if (err) {
        return res.status(404).json({ error: "No children comment" });
      } else {
        // Assuming result is an array, you may need to adjust accordingly
        results.push(...result);
        res.json(results);
      }
    }
  );
});

//Route For Profile Follower List
app.route("/api/profile/:userID").get((req, res) => {
  const userID = req.params.userID;

  pool.query(
    `SELECT U.username
      FROM User U
      JOIN Followship F ON U.userID = F.followerUserID
      WHERE F.followeeUserID = ?`,
    [userID],
    (err, result, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const followersUsernames = result.map((row) => row.username);
      console.log(followersUsernames);
      res.json(followersUsernames);
    }
  );
});

//Route for profile following list
app.route("/api/profile/following/:userID").get((req, res) => {
  const userID = req.params.userID;

  pool.query(
    `SELECT U.username
      FROM User U
      JOIN Followship F ON U.userID = F.followeeUserID
      WHERE F.followerUserID = ?;`,
    [userID],
    (err, result, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const followingsUsernames = result.map((row) => row.username);
      console.log(followingsUsernames);
      res.json(followingsUsernames);
    }
  );
});

// Route for finding all the forums a user has created
app.route("/api/profile/forumCreated/:userID").get((req, res) => {
  const userID = req.params.userID;
  pool.query(
    `SELECT title
       FROM Forum
       WHERE creatorID = ?`,
    [userID],
    (err, result, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const forumTitles = result.map((row) => row.title);
      console.log(forumTitles);
      res.json(forumTitles);
    }
  );
});

// Route for Finding Reaction Notifications
app.route("/api/profile/reaction/:userID").get((req, res) => {
  const userID = req.params.userID;

  pool.query(
    `SELECT DISTINCT U.username
        FROM Reaction_Notification R
        JOIN User U ON R.userID = U.userID
        WHERE R.receiverID = ?`,
    [userID],
    (err, result, fields) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const likerUsernames = result.map((row) => row.username);
      console.log(likerUsernames);
      res.json(likerUsernames);
    }
  );
});

//Post Route for Edit Profile
app.route("/api/profile/editProfile/:userID").post((req, res) => {
  const userID = req.params.userID;
  const {
    firstName,
    middleName,
    lastName,
    username,
    email,
    phoneNumber,
    password,
  } = req.body;

  // You should perform validation and sanitation on the input data before updating the database

  // Construct the SQL query
  const sql = `
      UPDATE User
      SET
        firstName = ?,
        middleName = ?,
        lastName = ?,
        username = ?,
        email = ?,
        phoneNumber = ?,
        password = ?
      WHERE userID = ?
    `;

  // Execute the SQL query
  pool.query(
    sql,
    [
      firstName,
      middleName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      userID,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if the update was successful
      if (result.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Profile updated successfully",
        });
      } else {
        return res
          .status(404)
          .json({ error: "User not found or no changes made" });
      }
    }
  );
});

// POST route for login
app.post("/api/login", async (req, res) => {
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
      // Determine if user is admin
      pool.query(
        `SELECT * FROM Admin WHERE aUserID = ${user.userID}`,
        [],
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          if (result.length === 0) {
            return res.status(200).json({ user: user, isAdmin: false });
          } else {
            return res.status(200).json({ user: user, isAdmin: true });
          }
        }
      );
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

app.route("/api/secure/createForum").post((req, res) => {
  const { title, creatorID } = req.body;
  // Select a random adminID between 1 and 5
  const randomAdmin = Math.floor(Math.random() * 5) + 1;
  const creationDate = 1701822493;

  // Using prepared statement for security
  pool.query(
    "INSERT INTO Forum (title, creationDate, creatorID, adminID) VALUES (?, ?, ?, ?)",
    [title, creationDate, creatorID, randomAdmin],
    (err, result) => {
      if (err) {
        console.error("Error creating forum:", err);
        return res.status(500).json({ error: "Failed to create forum" });
      }
      // Assuming the forumID is an auto-increment field
      const forumID = result.insertId;
      res.json({ forumID: forumID, message: "Forum created successfully" });
    }
  );
});
