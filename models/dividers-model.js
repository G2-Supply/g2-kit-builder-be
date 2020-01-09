// // library imports 
// const mongoose = require('mongoose');

// // defining schema for the users collection in the database
// const dividerSchema = new mongoose.Schema({
//     user_id: String,
//     style_of_box_lid: String,
//     length_of_box_lid: String,
//     width_of_box_lid: String,
//     height_of_box_lid: String,
//     grade_of_corrugated: String,
//     order_frequency: String,
//     order_quantity: Number,
//     box_lid_special_notes: String,
//     box_lid_use: String,
//     box_lid_print: String,
//     box_lid_joint: String,
//     box_lid_print: String,
// });

// // instantiation the collection with the schema we created
// const Dividers = new mongoose.model('Dividers', dividerSchema);

// // exporting the collection
// module.exports = Dividers; 

// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const dividerSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    typeOfDivider: String,
    kit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },
    corrugated: { 
        boardGrade: String,
        lengthOfBox: String,
        widthOfBox: String,
        heightOfBox: String,
        numberOfCells: String,
        airPockets: String,
        allCellsUsed: String,
        coatings: String,
        assembled: String,
        partOfKit: String,
        qtyPerKit: String,
    },
    paper: {
        lengthOfBox: String,
        widthOfBox: String,
        heightOfBox: String,
        numberOfCells: String,
        airPockets: String,
        coated: String,
    },
    cloth: {
        lengthOfBox: String,
        widthOfBox: String,
        heightOfBox: String,
        numberOfCells: String,
        airPockets: String,
        material: String,
    },
    pcorr: {
        lengthOfBox: String,
        widthOfBox: String,
        heightOfBox: String,
        numberOfCells: String,
        airPockets: String,
        coated: String,
    }
});

// instatiating the collection with the schema we created
const Dividers = new mongoose.model('Dividers', dividerSchema);

// exporting the collection
module.exports = Dividers; 