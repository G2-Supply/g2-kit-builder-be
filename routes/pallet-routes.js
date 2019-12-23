// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 
const bcrypt = require('bcryptjs'); 

// middlware imports;

// model imports 
const Pallets = require('../models/pallets-model');

// ======================== GET Requests ===========================
// GET pallets associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Pallets.findById(_id)
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== POST Requests ===========================
// create new pallet for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body); 

    const pallet = new Pallets({
        user_id: req.params,
        style_of_stringer: req.body.styleOfStringer,
        length_of_stringer: req.body.lengthOfStringer,
        qty_of_stringers: req.body.qtyOfStringers,
        side_access: req.body.sideAccess,
        stringer_wood_quality: req.body.stringerWoodQuality,
        required_pallet_certifications: req.body.requiredPalletCertifications,
        stringer_special_notes: req.body.stringerSpecialNotes,
        style_of_top_boards: req.body.styleOfTopBoards,
        qty_of_top_boards: req.body.qtyOfTopBoards,
        length_of_deck_boards: req.body.lengthOfDeckBoards,
        style_of_bottom_boards: req.body.styleOfBottomBoards,
        qty_of_bottom_boards: req.body.qtyOfBottomBoards,
        deck_board_wood_quality: req.body.deckBoardWoodQuality,
        deck_board_special_notes: req.body.deckBoardSpecialNotes,
    });
  
    // saving the user to the users collection
    pallet.save()
    .then(pallet => {
        res.status(201).json({ pallet })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
