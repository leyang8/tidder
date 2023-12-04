const express = require('express');
const fs = require('fs');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const {MongoClient} = require('mongodb')
const bcrypt = require('bcrypt');
const fuzzy = require('fuzzy')
const saltRounds = 10;
// Code to kill port: lsof -ti:5002 | xargs kill -9
 

