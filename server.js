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
const boxRoutes = require('./routes/box-routes'); 
const boxLidRoutes = require('./routes/box-lid-routes'); 
const foamRoutes = require('./routes/foam-routes'); 
const dividerRoutes = require('./routes/divider-routes'); 
const orderDetailsRoutes = require('./routes/order-detail-routes'); 
const kitRoutes = require('./routes/kit-routes'); 

// mongoose config 
mongoose.connect(process.env.URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

// routes 
server.use('/api/users', userRoutes); 
server.use('/api/pallets', palletRoutes); 
server.use('/api/boxes', boxRoutes); 
server.use('/api/box-lids', boxLidRoutes); 
server.use('/api/foam', foamRoutes); 
server.use('/api/dividers', dividerRoutes); 
server.use('/api/order-details', orderDetailsRoutes);
server.use('/api/kits', kitRoutes); 

// exporting for use in index.js


module.exports = server; 