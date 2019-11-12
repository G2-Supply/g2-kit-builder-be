// library imports 
const express = require('express'); 
const cors = require('cors'); 
const helmet = require('helmet'); 

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

// routes 
server.use('api/users', usersRoute); 

// exporting for use in index.js


module.exports = server; 