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


//Profile Page Queries

//FOllowers list for profile page
//Userid has to be specified in Sql IN (**)
//followeeUserID = userID
pool.query(`SELECT DISTINCT followerUserID FROM Followship WHERE followeeUserID = ()`, [], (err, result, fields) => {
        if(err){
        return console.log(err)
    }
    return result
  })

//Following List for profile page
//Current UserId has to be called  
//FollowerUserID = UserID
pool.query(`SELECT DISTINCT followeeUserID FROM Followship WHERE followerUserID = ()`, [], (err, result, fields) => {
    if(err){
    return console.log(err)
}
return result
})

//Followship Notification Query 
//receiverID = UserID
pool.query(`SELECT DISTINCT followerUserID, timestamp FROM Followship_Notification WHERE receiverID = ()`, [], (err, result, fields) => {
    if(err){
    return console.log(err)
}
return result
})

//Reaction Notification
//creatorID = currentUserID
pool.query(`SELECT R.userID FROM Reaction R JOIN Comment C ON R.commentID = C.commentID WHERE R.isLike = TRUE AND C.creatorID = :currentUserID;`, [], (err, result, fields) => {
    if(err){
    return console.log(err)
}
return result
})

//List of names of all the forums UserId has created
//Current Users userId is not specified in the SQL Query
pool.query(`SELECT DISTINCT title, creationDate FROM Forum WHERE creatorID = ()`, [], (err, result, fields) => {
    if(err){
    return console.log(err)
}
return result
})










pool.query('SELECT * FROM User', [], (err, result, fields) => {
    if(err){
        return console.log(err)
    }
    return console.log(result)
})
// Code to kill port: lsof -ti:5002 | xargs kill -9
 
const app = express();

app.use(cors());

app.use(express.json());

app.route('api/users/:user')
    .get(async (req, res) => {
        
        pool.query(`SELECT * FROM User`, [], (err, result, fields) => {
            if(err){
                return console.log(err)
            }
            return console.log(result)
        })

    })