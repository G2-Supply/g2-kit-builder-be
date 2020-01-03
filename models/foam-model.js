// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const foamSchema = new mongoose.Schema({
    user_id: String,
    lengthOfFoam: String,
    widthOfFoam: String,
    heightOfFoam: String,
    material: String,
    color: String,
    density: String,
    lbPerCubicFoot: String,
    dieCut: String,
    drawingAvailable: String,

});

// instatiating the collection with the schema we created
const Foam = new mongoose.model('Foam', foamSchema);

// exporting the collection
module.exports = Foam; 