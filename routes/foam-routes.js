// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 

// middleware imports;

// model imports 
const Foam = require('../models/foam-model');

// ======================== GET Requests ===========================
// GET foam associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Foam.findById(_id)
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== POST Requests ===========================
// create new foam for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body.kitId); 

    const foam = new Foam({
        user_id: req.params,
        kit_id: req.body.kitId,
        lengthOfFoam: req.body.lengthOfFoam,
        widthOfFoam: req.body.widthOfFoam,
        heightOfFoam: req.body.heightOfFoam,
        material: req.body.material,
        color: req.body.color,
        density: req.body.density,
        lbPerCubicFoot: req.body.lbPerCubicFoot,
        dieCut: req.body.dieCut,
        drawingAvailable: req.body.drawingAvailable,
    });
  
    // saving the user to the users collection
    foam.save()
    .then(foam => {
        res.status(201).json({ foam })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
