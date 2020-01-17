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

            Boxes.find({ kit_id })
            .then(boxesDocs => {
                kitArr.push(boxesDocs[0]);
                
                BoxLids.find({ kit_id })
                .then(boxLidsDocs => {
                    kitArr.push(boxLidsDocs[0]);
                    console.log(kitArr[2])
                    Dividers.find({ kit_id })
                    .then(dividersDocs => {
                        kitArr.push(dividersDocs[0]);
                        
                        Foam.find({ kit_id })
                        .then(foamDocs => {
                            kitArr.push(foamDocs[0]);

                            OrderDetails.find({ kit_id })
                                .then(docs => {
                                    kitArr.push(docs[0]);
                                    // res.status(201).json({ kitArr }) 
                                    res.status(201).json({ kitArr })
                                    // console.log(kitArr); 

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
                                        Stringer Style: ${kitArr[0].style_of_stringer}
                                        Stringer Length: ${kitArr[0].length_of_stringer}
                                        Stringer Quantity: ${kitArr[0].qty_of_stringers}
                                        Side Acess: ${kitArr[0].side_access}
                                        Stringer Wood Quality: ${kitArr[0].stringer_wood_quality}
                                        Required Pallet Certifications: ${kitArr[0].required_pallet_certifications}
                                        Special Notes for Stringer: ${kitArr[0].stringer_special_notes}
                                        Top Board Style: ${kitArr[0].style_of_top_boards}
                                        Quantity of Top Boards: ${kitArr[0].qty_of_top_boards}
                                        Bottom Board Style: ${kitArr[0].style_of_bottom_boards}
                                        Quantity of Bottom Boards: ${kitArr[0].qty_of_bottom_boards}
                                        Length of Deck Boards: ${kitArr[0].length_of_deck_boards}
                                        Deck Board Wood Quality: ${kitArr[0].deck_board_wood_quality}
                                        Special Notes for Deck Boards: ${kitArr[0].deck_board_special_notes}


                                        Box Specifications
                                        ----------------------------
                                        Box Style: ${kitArr[1].style_of_box}
                                        Box Length: ${kitArr[1].length_of_box}
                                        Box Width: ${kitArr[1].width_of_box}
                                        Box Height: ${kitArr[1].height_of_box}
                                        Corrugate Grade: ${kitArr[1].grade_of_corrugated}
                                        Special Notes for Box: ${kitArr[1].box_special_notes}
                                        Box Usage: ${kitArr[1].box_use}
                                        Box Print: ${kitArr[1].box_print}
                                        Location of Print: ${kitArr[1].box_joint}
                                        Box Joint Construction: ${kitArr[1].location_of_print}


                                        Box Lid Specifications
                                        -----------------------------
                                        Box Lid Style: ${kitArr[2].style_of_box_lid}
                                        Box Lid Length: ${kitArr[2].length_of_box_lid}
                                        Box Lid Width: ${kitArr[2].width_of_box_lid}
                                        Box Lid Height: ${kitArr[2].height_of_box_lid}
                                        Corrugate Grade: ${kitArr[2].board_grade}
                                        Box Lid Joint Construction: ${kitArr[2].joint_construction}
                                        Box Lid Print: ${kitArr[2].box_lid_print}
                                        Location of Print: ${kitArr[2].location_of_print}
                                        Box Lid Special Notes: ${kitArr[2].box_lid_special_notes}
                                        `
                                    }

                                    transporter.sendMail(mailOptions, function (err, response) {
                                        if (err) {
                                            console.error('There was an issue: ', err);
                                        } else {
                                            console.log('Response: ', response);
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
