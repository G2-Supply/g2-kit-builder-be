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
const userRoutes = require('./routes/user-routes'); 
const palletRoutes = require('./routes/pallet-routes'); 

// mongoose config 
mongoose.connect(process.env.URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

// routes 
server.use('/api/users', userRoutes); 
server.use('/api/pallets', palletRoutes)

// exporting for use in index.js


module.exports = server; 