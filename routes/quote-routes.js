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
    // console.log(req.body
    Pallets.find({ kit_id })
        .then(palletDocs => {
            kitArr.push(palletDocs[0]);

            // console.log(kitArr[0].stringer_wood_quality)
            Boxes.find({ kit_id })
            .then(boxesDocs => {
                kitArr.push(boxesDocs[0]);
                
                BoxLids.find({ kit_id })
                .then(boxLidsDocs => {
                    kitArr.push(boxLidsDocs[0]);

                    Dividers.find({ kit_id })
                    .then(dividersDocs => {
                        kitArr.push(dividersDocs[0]);
                        
                        Foam.find({ kit_id })
                        .then(foamDocs => {
                            kitArr.push(foamDocs[0]);

                            OrderDetails.find({ kit_id })
                                .then(orderDetailsDocs => {
                                    kitArr.push(orderDetailsDocs[0]);
                                    console.log(kitArr[5])
                                    res.status(201).json({ kitArr })

                                    const transporter = nodemailer.createTransport({
                                        service: 'Outlook365',
                                        auth: {
                                            user: `${process.env.EMAIL_ADDRESS}`,
                                            pass: `${process.env.EMAIL_PASSWORD}`
                                        }
                                    });

                                    const mailOptions = {
                                        from: `${process.env.EMAIL_ADDRESS}`,
                                        to: `elijahmckay10@gmail.com`,
                                        subject: `G2 Kit Builder - Quote Request From ${req.body.userCompany}`,
                                        text: `
                                        Quote request from: ${req.body.userCompany}
                                        Email: ${req.body.userEmail}

                                        Pallet Specifications
                                        ----------------------------
                                        ${kitArr[0]}

                                        Box Specifications
                                        ----------------------------
                                        ${kitArr[1]}


                                        Divider Specifications
                                        ----------------------------
                                        Corrugated divider: ${kitArr[3].corrugated}

                                        Paper divider: ${kitArr[3].paper}

                                        Cloth divider: ${kitArr[3].cloth}

                                        Pcorr divider: ${kitArr[3].pcorr}
                                        

                                        Foam specifications
                                        ----------------------------
                                        ${kitArr[4]}

                                        Order Details
                                        ----------------------------
                                        ${kitArr[5]}
                                        `
                                    }

                                    transporter.sendMail(mailOptions, function (err, response) {
                                        if (err) {
                                            console.error('There was an issue: ', err);
                                        } else {
                                            // console.log('Response: ', response);
                                        }
                                        });
                                })
                                .catch(err => {
                                    res.status(500).json({ error: err });
                                })
                        })
                        .catch(err => {
                            res.status(500).json({ error: err });
                        })
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    })
                })
                .catch(err => {
                    res.status(500).json({ error: err });
                })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
    })
    .catch(err => {
        res.status(500).json({ error: err });
    })
})
// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
