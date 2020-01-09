// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 

// middleware imports;

// model imports 
const Kits = require('../models/kits-model');
const Pallets = require('../models/pallets-model');
const Boxes = require('../models/boxes-model');
const BoxLids = require('../models/box-lids-model');
const Dividers = require('../models/dividers-model');
const Foam = require('../models/foam-model');
const OrderDetails = require('../models/order-details-model');

// ======================== GET Requests ===========================
// GET kit associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    Kits.findById(_id)
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
});

router.post('/:_id', (req, res) => {

    const kitId = req.body.kitId; 
    console.log(req.body);  
    Pallets.findById(kitId) 
    .then(docs => {
        res.status(200).json({ docs }); 
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 
})

// ======================== POST Requests ===========================
// create new kit for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body.kitId); 

    const kit = new Kits({
        user_id: req.params,
    });
  
    // saving the user to the users collection
    kit.save()
    .then(kit => {
        res.status(201).json({ kit })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});


// send a kit to G2 for quoting
router.post('/:_id', (req, res) => {
    const kitId = req.body.kitId; 

    Kits.findById(kitId) 
    .then(docs => {
        res.status(200).json({ docs }); 
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 
})
// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
