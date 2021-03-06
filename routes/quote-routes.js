// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router();
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const Base64 = require('js-base64').Base64;


// middleware imports;

// model imports 
const Kits = require('../models/kits-model');
const Pallets = require('../models/pallets-model');
const Boxes = require('../models/boxes-model');
const BoxLids = require('../models/box-lids-model');
const Dividers = require('../models/dividers-model');
const Foam = require('../models/foam-model');
const OrderDetails = require('../models/order-details-model');


const TOKEN_PATH = 'token.json';
// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

let oAuth2Client;

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    
    
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
            console.log(`- ${label.name}`);
        });
        } else {
        console.log('No labels found.');
        }
    });
}

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
    console.log(req.body)
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
                                    console.log(kitArr)
                                    
                                    const pallet = kitArr[0]; 
                                    const box = kitArr[1]; 
                                    const boxLid = kitArr[2]; 
                                    const divider = kitArr[3]; 
                                    const foam = kitArr[4]; 
                                    const orderDetails = kitArr[5]; 

                                    let body = req.body

                                    function sendEmail(auth, body, pallet, box, boxLid, divider, foam, orderDetails) {
                                        const gmail = google.gmail({ version: 'v1', auth });
                                    
                                        let baseMessage = `
                                        Pallet Specifications
                                        ----------------------------
                                        
                                        ------ Wood -------
                                        Stringer Style: ${pallet.wood.style_of_stringer}
                                        Length of Stringer: ${pallet.wood.length_of_stringer}
                                        Quantity of Stringers: ${pallet.wood.qty_of_stringers}
                                        Side Access?: ${pallet.wood.side_access}
                                        Stringer Wood Quality: ${pallet.wood.stringer_wood_quality}
                                        Required Pallet Certifications: ${pallet.wood.required_pallet_certifications}
                                        Special Notes for Stringer: ${pallet.wood.stringer_special_notes}
                                        Top Board Style: ${pallet.wood.style_of_top_boards}
                                        Quantity of Top Boards: ${pallet.wood.qty_of_top_boards}
                                        Length of Deck Boards: ${pallet.wood.length_of_deck_boards}
                                        Style of Bottom Boards: ${pallet.wood.style_of_bottom_boards}
                                        Quantity of Bottom Boards: ${pallet.wood.qty_of_bottom_boards}
                                        Deck Board Wood Quality: ${pallet.wood.deck_board_wood_quality}
                                        Deck Board Special Notes: ${pallet.wood.deck_board_special_notes}
                                    
                                        ------ Plastic ------
                                        Type Of Plastic: ${pallet.plastic.style_of_pallet},
                                        Length Of Pallet: ${pallet.plastic.length_of_pallet},
                                        Width Of Pallet: ${pallet.plastic.width_of_pallet},
                                        Height Of Pallet: ${pallet.plastic.height_of_pallet},
                                    
                                    
                                        Box Specifications
                                        ----------------------------
                                        Box Style: ${box.style_of_box}
                                        Length of Box: ${box.length_of_box}
                                        Width of Box: ${box.width_of_box}
                                        Height of Box: ${box.height_of_box}
                                        Corrugated Grade: ${box.grade_of_corrugated}
                                        Special Notes for Box: ${box.box_special_notes}
                                        Box Print: ${box.box_print}
                                        Joint Construction: ${box.box_joint}
                                        Location of Print: ${box.location_of_print}
                                    
                                    
                                        Box Lid Specifications
                                        ---------------------------
                                        Style of Box Lid: ${boxLid.style_of_box_lid}
                                        Length of Box Lid: ${boxLid.length_of_box_lid}
                                        Width of Box Lid: ${boxLid.width_of_box_lid}
                                        Height of Box Lid: ${boxLid.height_of_box_lid}
                                        Box Lid Corrugated Grade: ${boxLid.board_grade}
                                        Box Lid Joint Construction: ${boxLid.joint_construction}
                                        Box Lid Print: ${boxLid.box_lid_print}
                                        Location of Print: ${boxLid.location_of_print}
                                        Box Lid Special Notes: ${boxLid.box_lid_special_notes}
                                        
                                    
                                        Divider Specifications
                                        --------------------------
                                        
                                        ----- Corrugated -----
                                        
                                        Divider Corrugated Grade: ${divider.corrugated.boardGrade}
                                        Length of Box: ${divider.corrugated.lengthOfBox}
                                        Width of Box: ${divider.corrugated.widthOfBox}
                                        Height of Box: ${divider.corrugated.heightOfBox}
                                        Number of Cells: ${divider.corrugated.numberOfCells}
                                        Air Pockets: ${divider.corrugated.airPockets}
                                        All Cells Used?: ${divider.corrugated.allCellsUsed}
                                        
                                        ----- Paper -----
                                        Length of Box: ${divider.paper.lengthOfBox}
                                        Width of Box: ${divider.paper.widthOfBox}
                                        Height of Box: ${divider.paper.heightOfBox}
                                        Number of Cells: ${divider.paper.numberOfCells}
                                        Air Pockets: ${divider.paper.airPockets}
                                        Coated: ${divider.paper.coated}
                                        
                                        ----- Cloth -----
                                        Length of Box: ${divider.cloth.lengthOfBox}
                                        Width of Box: ${divider.cloth.widthOfBox}
                                        Height of Box: ${divider.cloth.heightOfBox}
                                        Number of Cells: ${divider.cloth.numberOfCells}
                                        Air Pockets: ${divider.cloth.airPockets}
                                        Cloth: ${divider.cloth.material}
                                        
                                        ----- Pcorr -----
                                        Length of Box: ${divider.pcorr.lengthOfBox}
                                        Width of Box: ${divider.pcorr.widthOfBox}
                                        Height of Box: ${divider.pcorr.heightOfBox}
                                        Number of Cells: ${divider.pcorr.numberOfCells}
                                        Air Pockets: ${divider.pcorr.airPockets}
                                        Coated: ${divider.pcorr.coated}
                                        
                                        
                                        Foam Specifications
                                        -------------------------
                                        Length of Foam: ${foam.lengthOfFoam}
                                        Width of Foam: ${foam.widthOfFoam}
                                        Height of Foam: ${foam.heightOfFoam}
                                        Type of Foam: ${foam.material}
                                        Color: ${foam.color}
                                        Density: ${foam.density}
                                        Lb per Cubic Foot: ${foam.lbPerCubicFoot}
                                        Die cut?: ${foam.dieCut}
                                        Drawing Available?: ${foam.drawingAvailable}
                                        
                                        
                                        Order Details Specifications
                                        -----------------------------------
                                        Monthly Quantity: ${orderDetails.monthly_quantity}
                                        Annual Quanitity: ${orderDetails.annual_quantity}
                                        Order Frequency: ${orderDetails.order_frequency}
                                        `
                                        console.log(process.env.RECEIVING_EMAIL)
                                        var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
                                        "MIME-Version: 1.0\n",
                                        "Content-Transfer-Encoding: 7bit\n",
                                        "to: ", process.env.RECEIVING_EMAIL, "\n",
                                        "from: ", body.userEmail, "\n",
                                        "subject: ", "G2 Kit Builder Quote Request from " + body.userCompany, "\n\n",
                                        baseMessage
                                        ].join('');
                                    
                                        var encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
                                    
                                        gmail.users.messages.send({
                                            userId: 'me',
                                            resource: {
                                                raw: encodedMail,
                                            }
                                        }, function(err, response) {
                                            if(err) {
                                                res.status(500).json({ err })
                                            }
                                            res.status(201).json({ response })
                                        })
                                    }

                                    sendEmail(oAuth2Client, body, pallet, box, boxLid, divider, foam, orderDetails)

                                    
                                    // const transporter = nodemailer.createTransport({
                                    //     service: 'Outlook',
                                    //     auth: {
                                    //         user: `${process.env.EMAIL_ADDRESS}`,
                                    //         pass: `${process.env.EMAIL_PASSWORD}`
                                    //     }
                                    // });


                                    // const mailOptions = {
                                        // from: `${process.env.EMAIL_ADDRESS}`,
                                        // to: `elijahmckay10@gmail.com`,
                                        // subject: `G2 Kit Builder - Quote Request From ${req.body.userCompany}`,
                                        // text: `
                                        // Quote request from: ${req.body.userCompany}
                                        // Email: ${req.body.userEmail}
                                        
                                        // Pallet Specifications
                                        // ----------------------------
                                        
                                        // ------ Wood -------
                                        // Stringer Style: ${pallet.wood.style_of_stringer}
                                        // Length of Stringer: ${pallet.wood.length_of_stringer}
                                        // Quantity of Stringers: ${pallet.wood.qty_of_stringers}
                                        // Side Access?: ${pallet.wood.side_access}
                                        // Stringer Wood Quality: ${pallet.wood.stringer_wood_quality}
                                        // Required Pallet Certifications: ${pallet.wood.required_pallet_certifications}
                                        // Special Notes for Stringer: ${pallet.wood.stringer_special_notes}
                                        // Top Board Style: ${pallet.wood.style_of_top_boards}
                                        // Quantity of Top Boards: ${pallet.wood.qty_of_top_boards}
                                        // Length of Deck Boards: ${pallet.wood.length_of_deck_boards}
                                        // Style of Bottom Boards: ${pallet.wood.style_of_bottom_boards}
                                        // Quantity of Bottom Boards: ${pallet.wood.qty_of_bottom_boards}
                                        // Deck Board Wood Quality: ${pallet.wood.deck_board_wood_quality}
                                        // Deck Board Special Notes: ${pallet.wood.deck_board_special_notes}

                                        // ------ Plastic ------
                                        // Type Of Plastic: ${pallet.plastic.style_of_pallet},
                                        // Length Of Pallet: ${pallet.plastic.length_of_pallet},
                                        // Width Of Pallet: ${pallet.plastic.width_of_pallet},
                                        // Height Of Pallet: ${pallet.plastic.height_of_pallet},


                                        // Box Specifications
                                        // ----------------------------
                                        // Box Style: ${box.style_of_box}
                                        // Length of Box: ${box.length_of_box}
                                        // Width of Box: ${box.width_of_box}
                                        // Height of Box: ${box.height_of_box}
                                        // Corrugated Grade: ${box.grade_of_corrugated}
                                        // Special Notes for Box: ${box.box_special_notes}
                                        // Box Print: ${box.box_print}
                                        // Joint Construction: ${box.box_joint}
                                        // Location of Print: ${box.location_of_print}


                                        // Box Lid Specifications
                                        // ---------------------------
                                        // Style of Box Lid: ${boxLid.style_of_box_lid}
                                        // Length of Box Lid: ${boxLid.length_of_box_lid}
                                        // Width of Box Lid: ${boxLid.width_of_box_lid}
                                        // Height of Box Lid: ${boxLid.height_of_box_lid}
                                        // Box Lid Corrugated Grade: ${boxLid.board_grade}
                                        // Box Lid Joint Construction: ${boxLid.joint_construction}
                                        // Box Lid Print: ${boxLid.box_lid_print}
                                        // Location of Print: ${boxLid.location_of_print}
                                        // Box Lid Special Notes: ${boxLid.box_lid_special_notes}
                                        

                                        // Divider Specifications
                                        // --------------------------
                                        
                                        // ----- Corrugated -----
                                        
                                        // Divider Corrugated Grade: ${divider.corrugated.boardGrade}
                                        // Length of Box: ${divider.corrugated.lengthOfBox}
                                        // Width of Box: ${divider.corrugated.widthOfBox}
                                        // Height of Box: ${divider.corrugated.heightOfBox}
                                        // Number of Cells: ${divider.corrugated.numberOfCells}
                                        // Air Pockets: ${divider.corrugated.airPockets}
                                        // All Cells Used?: ${divider.corrugated.allCellsUsed}
                                        
                                        // ----- Paper -----
                                        // Length of Box: ${divider.paper.lengthOfBox}
                                        // Width of Box: ${divider.paper.widthOfBox}
                                        // Height of Box: ${divider.paper.heightOfBox}
                                        // Number of Cells: ${divider.paper.numberOfCells}
                                        // Air Pockets: ${divider.paper.airPockets}
                                        // Coated: ${divider.paper.coated}
                                        
                                        // ----- Cloth -----
                                        // Length of Box: ${divider.cloth.lengthOfBox}
                                        // Width of Box: ${divider.cloth.widthOfBox}
                                        // Height of Box: ${divider.cloth.heightOfBox}
                                        // Number of Cells: ${divider.cloth.numberOfCells}
                                        // Air Pockets: ${divider.cloth.airPockets}
                                        // Cloth: ${divider.cloth.material}
                                        
                                        // ----- Pcorr -----
                                        // Length of Box: ${divider.pcorr.lengthOfBox}
                                        // Width of Box: ${divider.pcorr.widthOfBox}
                                        // Height of Box: ${divider.pcorr.heightOfBox}
                                        // Number of Cells: ${divider.pcorr.numberOfCells}
                                        // Air Pockets: ${divider.pcorr.airPockets}
                                        // Coated: ${divider.pcorr.coated}
                                        
                                        
                                        // Foam Specifications
                                        // -------------------------
                                        // Length of Foam: ${foam.lengthOfFoam}
                                        // Width of Foam: ${foam.widthOfFoam}
                                        // Height of Foam: ${foam.heightOfFoam}
                                        // Type of Foam: ${foam.material}
                                        // Color: ${foam.color}
                                        // Density: ${foam.density}
                                        // Lb per Cubic Foot: ${foam.lbPerCubicFoot}
                                        // Die cut?: ${foam.dieCut}
                                        // Drawing Available?: ${foam.drawingAvailable}
                                        
                                        
                                        // Order Details Specifications
                                        // -----------------------------------
                                        // Monthly Quantity: ${orderDetails.monthly_quantity}
                                        // Annual Quanitity: ${orderDetails.annual_quantity}
                                        // Order Frequency: ${orderDetails.order_frequency}
                                        
                                    //     `
                                    // }

                                    // console.log('test')
                                    
                                    // transporter.sendMail(mailOptions) 
                                    // .then(res => {
                                    //     // console.log('this is in the transporter', res); 
                                    //     // res.status(201).json({ kitArr })
                                    //     console.log(res)
                                    // })
                                    // .catch(err => {
                                    //     console.log('this is in the transporter', err); 
                                    //     // res.status(500).json(err)
                                    // })
                                })
                                .catch(err => {
                                    // res.status(500).json({ error: err });
                                    console.log(err)
                                })


                                    // res.status(201).json({ kitArr })
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        })
                        .catch(err => {
                            // res.status(500).json({ error: err });
                            console.log(err)
                        })
                    })
                    .catch(err => {
                        // res.status(500).json({ error: err });
                        console.log(err)
                    })
                })
                .catch(err => {
            // res.status(500).json({ error: err });
            console.log(err)
        })
    })
    .catch(err => {
        // res.status(500).json({ error: err });
        console.log(err)
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