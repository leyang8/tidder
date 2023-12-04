const express = require('express');
const fs = require('fs');
const cors = require('cors');

// Code to kill port: lsof -ti:5002 | xargs kill -9
 
const app = express();

app.use(cors());

app.use(express.json());

