// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router();

// middleware imports;

// model imports 
const Dividers = require('../models/dividers-model');

// ======================== GET Requests ===========================
// GET pallets associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Dividers.findById(_id)
        .then(docs => {
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// GET divider associated with a kit ID
router.get('/:kit_id', (req, res) => {
    const { kit_id } = req.params; 

    Dividers.findById(kit_id)
        .then(docs => {
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== POST Requests ===========================
// create new divider for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body); 

    const divider = new Dividers({
        typeOfDivider: null,
        kit_id: req.body.kidId,
        corrugated: {
            boardGrade: req.body.boardGrade,
            lengthOfBox: req.body.lengthOfBox,
            widthOfBox: req.body.widthOfBox,
            heightOfBox: req.body.heightOfBox,
            numberOfCells: req.body.numberOfCells,
            airPockets: req.body.airPockets,
            allCellsUsed: req.body.allCellsUsed,
        },
        paper: {
            lengthOfBox: req.body.lengthOfBox,
            widthOfBox: req.body.widthOfBox,
            heightOfBox: req.body.heightOfBox,
            numberOfCells: req.body.numberOfCells,
            airPockets: req.body.airPockets,
            coated: req.body.coated,
        },
        cloth: {
            lengthOfBox: req.body.lengthOfBox,
            widthOfBox: req.body.widthOfBox,
            heightOfBox: req.body.heightOfBox,
            numberOfCells: req.body.numberOfCells,
            airPockets: req.body.airPockets,
            material: req.body.material,
        },
        pcorr: {
            lengthOfBox: req.body.lengthOfBox,
            widthOfBox: req.body.widthOfBox,
            heightOfBox: req.body.heightOfBox,
            numberOfCells: req.body.numberOfCells,
            airPockets: req.body.airPockets,
            coated: req.body.coated,
        }
    });
  
    // saving the user to the users collection
    divider.save()
    .then(divider => {
        res.status(201).json({ divider })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
