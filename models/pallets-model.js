// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const palletSchema = new mongoose.Schema({
    user_id: String,
    style_of_stringer: String,
    length_of_stringer: String,
    qty_of_stringers: Number,
    side_access: String,
    stringer_wood_quality: String,
    required_pallet_certifications: String,
    stringer_special_notes: String,
    style_of_top_boards: String, 
    qty_of_top_boards: String,
    length_of_deck_boards: String,
    style_of_bottom_boards: String,
    qty_of_bottom_boards: Number,
    deck_board_wood_quality: String,
    deck_board_special_notes: String,
    // email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    // first_name: String,
    // last_name: String,
    // company: String,
    // phone_number: { type: String, pattern: "^([0-9]{3}-[0-9]{3}-[0-9]{4}$" }

});

// instatiating the collection with the schema we created
const Pallets = new mongoose.model('Pallets', palletSchema);

// exporting the collection
module.exports = Pallets; 