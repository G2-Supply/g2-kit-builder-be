// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: String,
    last_name: String,
    company: String,
});

// instatiating the collection with the schema we created
const Users = new mongoose.model('Users', userSchema);

// exporting the collection
module.exports = Users; 
