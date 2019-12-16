// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router();

// middlware imports;

// model imports 
const Boxes = require('../models/boxes-model');

// ======================== GET Requests ===========================
// GET pallets associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Boxes.findById(_id)
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

    const box = new Boxes({
        user_id: req.params,
        style_of_box: req.body.styleOfBox,
        length_of_box: req.body.lengthOfBox,
        width_of_box: req.body.widthOfBox,
        height_of_box: req.body.heightOfBox,
        grade_of_corrugated: req.body.boardGrade,
        // order_frequency:req.body. ,
        // order_quantity:req.body. ,
        part_of_kit: req.body.partOfKit,
        box_joint: req.body.jointConstruction,
        box_print: req.body.print,
        location_of_print: req.body.locationOfPrint,
        box_special_notes: req.body.boxSpecialNotes,
    });
  
    // saving the user to the users collection
    box.save()
    .then(box => {
        res.status(201).json({ box })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
