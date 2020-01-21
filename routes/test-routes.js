// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 

router.get('/',(req, res) => {
    res.status(200).json("Working!")
})

module.exports = router; 