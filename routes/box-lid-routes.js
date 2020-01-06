// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router();

// middlware imports;

// model imports 
const BoxLids = require('../models/box-lids-model');

// ======================== GET Requests ===========================
// GET pallets associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    BoxLids.findById(_id)
        .then(docs => {
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// GET box lids associated with a kit ID
router.get('/:kit_id', (req, res) => {
    const { kit_id } = req.params; 

    BoxLids.findById(kit_id)
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

    const boxLids = new BoxLids({
        user_id: req.params,
        kit_id: req.body.kidId,
        style_of_box_lid: req.body.styleOfBoxLid,
        board_grade: req.body.boardGrade,
        length_of_box_lid: req.body.lengthOfBoxLid,
        width_of_box_lid: req.body.widthOfBoxLid,
        height_of_box_lid: req.body.heightOfBoxLid,
        part_of_kit: req.body.partOfKit,
        joint_construction: req.body.jointConstruction,
        box_lid_print: req.body.print,
        location_of_print: req.body.print,
        box_lid_special_notes: req.body.boxLidSpecialNotes,
    });
  
    // saving the user to the users collection
    boxLids.save()
    .then(boxLid => {
        res.status(201).json({ boxLid })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
