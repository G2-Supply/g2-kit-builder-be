// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const palletSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    kit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kits' },
    wood: {
        style_of_stringer: String,
        length_of_stringer: String,
        qty_of_stringers: String,
        side_access: String,
        stringer_wood_quality: String,
        required_pallet_certifications: String,
        stringer_special_notes: String,
        style_of_top_boards: String,
        qty_of_top_boards: String,
        length_of_deck_boards: String,
        style_of_bottom_boards: String,
        qty_of_bottom_boards: String,
        deck_board_wood_quality: String,
        deck_board_special_notes: String,
    },
    plastic: {
        style_of_pallet: String,
        length_of_pallet: String,
        width_of_pallet: String,
        height_of_pallet: String,
    }

});

// instatiating the collection with the schema we created
const Pallets = new mongoose.model('Pallets', palletSchema);

// exporting the collection
module.exports = Pallets; 