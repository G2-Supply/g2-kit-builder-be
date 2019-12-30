// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const palletSchema = new mongoose.Schema({
    typeOfDivider: String,
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
const Pallets = new mongoose.model('Pallets', palletSchema);

// exporting the collection
module.exports = Pallets; 