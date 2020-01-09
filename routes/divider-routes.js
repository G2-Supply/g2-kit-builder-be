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
        typeOfDivider: req.body.typeOfDivider,
        kit_id: req.body.kitId,
        corrugated: {
            boardGrade: req.body.corrugated.boardGrade,
            lengthOfBox: req.body.corrugated.lengthOfBox,
            widthOfBox: req.body.corrugated.widthOfBox,
            heightOfBox: req.body.corrugated.heightOfBox,
            numberOfCells: req.body.corrugated.numberOfCells,
            airPockets: req.body.corrugated.airPockets,
            allCellsUsed: req.body.corrugated.allCellsUsed,
        },
        paper: {
            lengthOfBox: req.body.paper.lengthOfBox,
            widthOfBox: req.body.paper.widthOfBox,
            heightOfBox: req.body.paper.heightOfBox,
            numberOfCells: req.body.paper.numberOfCells,
            airPockets: req.body.paper.airPockets,
            coated: req.body.paper.coated,
        },
        cloth: {
            lengthOfBox: req.body.cloth.lengthOfBox,
            widthOfBox: req.body.cloth.widthOfBox,
            heightOfBox: req.body.cloth.heightOfBox,
            numberOfCells: req.body.cloth.numberOfCells,
            airPockets: req.body.cloth.airPockets,
            material: req.body.cloth.material,
        },
        pcorr: {
            lengthOfBox: req.body.pcorr.lengthOfBox,
            widthOfBox: req.body.pcorr.widthOfBox,
            heightOfBox: req.body.pcorr.heightOfBox,
            numberOfCells: req.body.pcorr.numberOfCells,
            airPockets: req.body.pcorr.airPockets,
            coated: req.body.pcorr.coated,
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
