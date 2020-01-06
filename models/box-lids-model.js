// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const boxLidSchema = new mongoose.Schema({
    user_id: String,
    kit_id: String,
    style_of_box_lid: String,
    length_of_box_lid: String,
    width_of_box_lid: String,
    height_of_box_lid: String,
    board_grade: String,
    // order_frequency: String,
    // order_quantity: Number,
    part_of_kit: String,
    joint_construction: String,
    box_lid_print: String,
    location_of_print: String,
    box_lid_special_notes: String,
    // email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    // first_name: String,
    // last_name: String,
    // company: String,
    // phone_number: { type: String, pattern: "^([0-9]{3}-[0-9]{3}-[0-9]{4}$" }

});

// instatiating the collection with the schema we created
const BoxLids = new mongoose.model('BoxLids', boxLidSchema);

// exporting the collection
module.exports = BoxLids; 