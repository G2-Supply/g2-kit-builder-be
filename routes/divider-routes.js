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

// ======================== POST Requests ===========================
// create new pallet for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body); 

    const divider = new Dividers({
        typeOfDivider: null,
        corrugated: {
            boardGrade: '',
            lengthOfBox: '',
            widthOfBox: '',
            heightOfBox: '',
            numberOfCells: '',
            airPockets: '',
            allCellsUsed: '',
            coatings: '',
            assembled: '',
            partOfKit: '',
            qtyPerKit: '',
        },
        paper: {
            lengthOfBox: '',
            widthOfBox: '',
            heightOfBox: '',
            numberOfCells: '',
            airPockets: '',
            coated: '',
        },
        cloth: {
            lengthOfBox: '',
            widthOfBox: '',
            heightOfBox: '',
            numberOfCells: '',
            airPockets: '',
            material: '',
        },
        pcorr: {
            lengthOfBox: '',
            widthOfBox: '',
            heightOfBox: '',
            numberOfCells: '',
            airPockets: '',
            coated: '',
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
