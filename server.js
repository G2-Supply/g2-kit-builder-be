// library imports 
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const helmet = require('helmet'); 
require('dotenv').config(); 

//instantiating server 
const server = express(); 

// middleware instantiation 
server.use(express.json());
// security things, google for more info
server.use(helmet()); 
server.use(cors({
    origin: '*'
})); 

// route imports 
const usersRoute = require('./routes/users-route'); 

// mongoose config 
mongoose.connect(process.env.URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

// routes 
server.use('/api/users', usersRoute); 

// exporting for use in index.js


module.exports = server; 