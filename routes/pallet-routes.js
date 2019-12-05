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
// create new pallet
router.post('/', (req, res) => {
    console.log(req.body); 
    const pallet = new Pallets(req.body);
  
    // saving the user to the users collection
    pallet.save()
    .then(pallet => {
        res.status(201).json({ data: pallet })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
