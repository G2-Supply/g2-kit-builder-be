// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const kitSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
});

// instantiation the collection with the schema we created
const Kits = new mongoose.model('Kits', kitSchema);

// exporting the collection
module.exports = Kits; 