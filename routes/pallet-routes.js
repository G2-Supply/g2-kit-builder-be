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
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

router.get('/:kit_id', (req, res) => {
    const { kit_id } = req.params; 

    Pallets.findById(kit_id)
        .then(docs => {
            res.status(200).json({ docs }); 
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
        kit_id: req.body.kitId,
        wood: {
            style_of_stringer: req.body.wood.styleOfStringer,
            length_of_stringer: req.body.wood.lengthOfStringer,
            qty_of_stringers: req.body.wood.qtyOfStringers,
            side_access: req.body.wood.sideAccess,
            stringer_wood_quality: req.body.wood.runnerWoodQuality,
            required_pallet_certifications: req.body.wood.requiredPalletCertifications,
            stringer_special_notes: req.body.wood.runnerSpecialNotes,
            style_of_top_boards: req.body.wood.styleOfTopBoards,
            qty_of_top_boards: req.body.wood.qtyOfTopBoards,
            length_of_deck_boards: req.body.wood.lengthOfDeckBoards,
            style_of_bottom_boards: req.body.wood.styleOfBottomBoards,
            qty_of_bottom_boards: req.body.wood.qtyOfBottomBoards,
            deck_board_wood_quality: req.body.wood.deckBoardWoodQuality,
            deck_board_special_notes: req.body.wood.deckBoardSpecialNotes,
        },
        plastic: {
            type_of_plastic: req.body.plastic.typeOfPlastic,
            length_of_pallet: req.body.plastic.lengthOfPallet,
            width_of_pallet: req.body.plastic.widthOfPallet,
            height_of_pallet: req.body.plastic.heightOfPallet,
        }
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
