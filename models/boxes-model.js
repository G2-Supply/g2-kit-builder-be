// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const boxSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    kit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kits' },
    style_of_box: String,
    length_of_box: String,
    width_of_box: String,
    height_of_box: String,
    grade_of_corrugated: String,
    // order_frequency: String,
    // order_quantity: Number,
    box_special_notes: String,
    box_use: String,
    box_print: String,
    box_joint: String,
    box_print: String,
    location_of_print: String,
    // email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    // first_name: String,
    // last_name: String,
    // company: String,
    // phone_number: { type: String, pattern: "^([0-9]{3}-[0-9]{3}-[0-9]{4}$" }

});

// instatiating the collection with the schema we created
const Boxes = new mongoose.model('Boxes', boxSchema);

// exporting the collection
module.exports = Boxes; 