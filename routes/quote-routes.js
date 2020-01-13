// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router(); 
require('dotenv').config(); 
const nodemailer = require('nodemailer'); 

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


// ======================== POST Requests ===========================
// create new kit for a specific user
// router.post('/:_id', (req, res) => {
//     console.log(req.body.kitId); 

//     const kit = new Kits({
//         user_id: req.params,
//     });
  
//     // saving the user to the users collection
//     kit.save()
//     .then(kit => {
//         res.status(201).json({ kit })
//     })
//     .catch(err => {
//         res.status(500).json({ error: `${err}` })
//     });
// });


// send a kit to G2 for quoting
router.post('/:_id', (req, res) => {
    const kit_id = req.body.kitId; 

    const kitArr = []

    Pallets.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr })
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 

    Boxes.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr })
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 

    BoxLids.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr })
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 

    Dividers.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr }) 
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 

    Foam.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr })
    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 

    OrderDetails.find({ kit_id })
    .then(docs => {
        kitArr.push(docs[0]); 
        // res.status(201).json({ kitArr }) 
        res.status(201).json({ kitArr })

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass: `${process.env.EMAIL_PASSWORD}`
            }
        }); 

        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `elijahmckay10@gmail.com`,
            subject: 'G2 Kit Builder - Quote',
            text: `
              You are receiving a quote ${kitArr}
            `
        }

        transporter.sendMail(mailOptions, function(err, response) {
            if (err) {
                console.error('There was an issue: ', err); 
            } else {
                console.log('Response: ', response); 
            }
        }); 

    })
    .catch(err => { 
        res.status(500).json({ error: err }); 
    }); 
})
// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
