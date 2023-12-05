const express = require("express");
const fs = require("fs");
const cors = require("cors");

const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "20030702OnOn!",
  database: "se3309_project",
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

app.use(cors());

app.use(express.json());

app.route("api/users/:user").get(async (req, res) => {
  pool.query(`SELECT * FROM User`, [], (err, result, fields) => {
    if (err) {
      return console.log(err);
    }
    return console.log(result);
  });
});

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
        return res.status(500).send(err);
      }
      return res.status(200).send("Account Created, Please Login");
    }
  );
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
