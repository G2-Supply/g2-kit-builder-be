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
                                    // console.log(kitArr[5])
                                    res.status(201).json({ kitArr })

                                    const pallet = kitArr[0]; 
                                    const box = kitArr[1]; 
                                    const boxLid = kitArr[2]; 
                                    const divider = kitArr[3]; 
                                    const foam = kitArr[4]; 
                                    const orderDetails = kitArr[5]; 

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

                                        ------ Wood -------
                                        Stringer Style: ${pallet.wood.style_of_stringer || 'not provided'}
                                        Length of Stringer: ${pallet.wood.length_of_stringer || 'not provided'}
                                        Quantity of Stringers: ${pallet.wood.qty_of_stringers || 'not provided'}
                                        Side Access?: ${pallet.wood.side_access || 'not provided'}
                                        Stringer Wood Quality: ${pallet.wood.stringer_wood_quality || 'not provided'}
                                        Required Pallet Certifications: ${pallet.wood.required_pallet_certifications || 'not provided'}
                                        Special Notes for Stringer: ${pallet.wood.stringer_special_notes || 'not provided'}
                                        Top Board Style: ${pallet.wood.style_of_top_boards || 'not provided'}
                                        Quantity of Top Boards: ${pallet.wood.qty_of_top_boards || 'not provided'}
                                        Length of Deck Boards: ${pallet.wood.length_of_deck_boards || 'not provided'}
                                        Style of Bottom Boards: ${pallet.wood.style_of_bottom_boards || 'not provided'}
                                        Quantity of Bottom Boards: ${pallet.wood.qty_of_bottom_boards || 'not provided'}
                                        Deck Board Wood Quality: ${pallet.wood.deck_board_wood_quality || 'not provided'}
                                        Deck Board Special Notes: ${pallet.wood.deck_board_special_notes || 'not provided'}

                                        ------ Plastic ------
                                        Type Of Plastic: ${pallet.plastic.style_of_pallet || 'not provided'},
                                        Length Of Pallet: ${pallet.plastic.length_of_pallet || 'not provided'},
                                        Width Of Pallet: ${pallet.plastic.width_of_pallet || 'not provided'},
                                        Height Of Pallet: ${pallet.plastic.height_of_pallet || 'not provided'},


                                        Box Specifications
                                        ----------------------------
                                        Box Style: ${box.style_of_box || 'not provided'}
                                        Length of Box: ${box.length_of_box || 'not provided'}
                                        Width of Box: ${box.width_of_box || 'not provided'}
                                        Height of Box: ${box.height_of_box || 'not provided'}
                                        Corrugated Grade: ${box.grade_of_corrugated || 'not provided'}
                                        Special Notes for Box: ${box.box_special_notes || 'not provided'}
                                        Box Print: ${box.box_print || 'not provided'}
                                        Joint Construction: ${box.box_joint || 'not provided'}
                                        Location of Print: ${box.location_of_print || 'not provided'}


                                        Box Lid Specifications
                                        ---------------------------
                                        Style of Box Lid: ${boxLid.style_of_box_lid || 'not provided'}
                                        Length of Box Lid: ${boxLid.length_of_box_lid || 'not provided'}
                                        Width of Box Lid: ${boxLid.width_of_box_lid || 'not provided'}
                                        Height of Box Lid: ${boxLid.height_of_box_lid || 'not provided'}
                                        Box Lid Corrugated Grade: ${boxLid.board_grade || 'not provided'}
                                        Box Lid Joint Construction: ${boxLid.joint_construction || 'not provided'}
                                        Box Lid Print: ${boxLid.box_lid_print || 'not provided'}
                                        Location of Print: ${boxLid.location_of_print || 'not provided'}
                                        Box Lid Special Notes: ${boxLid.box_lid_special_notes || 'not provided'}


                                        Divider Specifications
                                        --------------------------

                                        ----- Corrugated -----

                                        Divider Corrugated Grade: ${divider.corrugated.boardGrade || 'not provided'}
                                        Length of Box: ${divider.corrugated.lengthOfBox || 'not provided'}
                                        Width of Box: ${divider.corrugated.widthOfBox || 'not provided'}
                                        Height of Box: ${divider.corrugated.heightOfBox || 'not provided'}
                                        Number of Cells: ${divider.corrugated.numberOfCells || 'not provided'}
                                        Air Pockets: ${divider.corrugated.airPockets || 'not provided'}
                                        All Cells Used?: ${divider.corrugated.allCellsUsed || 'not provided'}

                                        ----- Paper -----
                                        Length of Box: ${divider.paper.lengthOfBox || 'not provided'}
                                        Width of Box: ${divider.paper.widthOfBox || 'not provided'}
                                        Height of Box: ${divider.paper.heightOfBox || 'not provided'}
                                        Number of Cells: ${divider.paper.numberOfCells || 'not provided'}
                                        Air Pockets: ${divider.paper.airPockets || 'not provided'}
                                        Coated: ${divider.paper.coated || 'not provided'}

                                        ----- Cloth -----
                                        Length of Box: ${divider.cloth.lengthOfBox || 'not provided'}
                                        Width of Box: ${divider.cloth.widthOfBox || 'not provided'}
                                        Height of Box: ${divider.cloth.heightOfBox || 'not provided'}
                                        Number of Cells: ${divider.cloth.numberOfCells || 'not provided'}
                                        Air Pockets: ${divider.cloth.airPockets || 'not provided'}
                                        Cloth: ${divider.cloth.material || 'not provided'}

                                        ----- Pcorr -----
                                        Length of Box: ${divider.pcorr.lengthOfBox || 'not provided'}
                                        Width of Box: ${divider.pcorr.widthOfBox || 'not provided'}
                                        Height of Box: ${divider.pcorr.heightOfBox || 'not provided'}
                                        Number of Cells: ${divider.pcorr.numberOfCells || 'not provided'}
                                        Air Pockets: ${divider.pcorr.airPockets || 'not provided'}
                                        Coated: ${divider.pcorr.coated || 'not provided'}


                                        Foam Specifications
                                        -------------------------
                                        Length of Foam: ${foam.lengthOfFoam || 'not provided'}
                                        Width of Foam: ${foam.widthOfFoam || 'not provided'}
                                        Height of Foam: ${foam.heightOfFoam || 'not provided'}
                                        Type of Foam: ${foam.material || 'not provided'}
                                        Color: ${foam.color || 'not provided'}
                                        Density: ${foam.density || 'not provided'}
                                        Lb per Cubic Foot: ${foam.lbPerCubicFoot || 'not provided'}
                                        Die cut?: ${foam.dieCut || 'not provided'}
                                        Drawing Available?: ${foam.drawingAvailable || 'not provided'}


                                        Order Details Specifications
                                        -----------------------------------
                                        Monthly Quantity: ${orderDetails.monthly_quantity || 'not provided'}
                                        Annual Quanitity: ${orderDetails.annual_quantity || 'not provided'}
                                        Order Frequency: ${orderDetails.order_frequency || 'not provided'}

                                        `
                                    }

                                    transporter.sendMail(mailOptions) 
                                        .then(res => {
                                            console.log('this is in the transporter', res); 
                                        })
                                        .catch(err => {
                                            console.log('this is in the transporter', err); 
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
    .catch(err => {
        res.status(500).json({ error: err });
    })
})
// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 

// Length of Box: ${divider.paper.lengthOfBox}
// Width of Box: ${divider.paper.widthOfBox}
// Height of Box: ${divider.paper.heightOfBox}
// Number of Cells: ${divider.paper.numberOfCells}
// Air Pockets: ${divider.paper.airPockets}
// Coated: ${divider.paper.coated}


// Pallet Specifications
// ----------------------------
// ${kitArr[0]}

// Box Specifications
// ----------------------------
// ${kitArr[1]}


// Box Lid Specifications
// ----------------------------
// Box Lid Style: ${kitArr[2].style_of_box_lid}
// Box Lid Length: ${kitArr[2].length_of_box_lid}
// Box Lid Width: ${kitArr[2].width_of_box_lid}
// Box Lid Height: ${kitArr[2].height_of_box_lid}
// Box Lid Corrugated Grade: ${kitArr[2].board_grade}
// Part of Kit?: ${kitArr[2].part_of_kit}
// Box Lid Joint Construction: ${kitArr[2].joint_construction}
// Box Lid Print: ${kitArr[2].box_lid_print}
// Location of Print: ${kitArr[2].location_of_print}
// Box Lid Special Notes: ${kitArr[2].box_lid_special_notes}

// Divider Specifications
// ----------------------------
// Corrugated divider: ${kitArr[3].corrugated}

// Paper divider: ${kitArr[3].paper}

// Cloth divider: ${kitArr[3].cloth}

// Pcorr divider: ${kitArr[3].pcorr}


// Foam specifications
// ----------------------------
// ${kitArr[4]}

// Order Details
// ----------------------------
// ${kitArr[5]}