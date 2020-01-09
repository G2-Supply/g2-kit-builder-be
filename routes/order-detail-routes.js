// library imports
// a 1 liner short cut for creating a router with express
const router = require('express').Router();

// middleware imports;

// model imports 
const OrderDetails = require('../models/order-details-model');

// ======================== GET Requests ===========================
// GET boxes associated with a users ID
router.get('/:_id', (req, res) => {
    const { _id } = req.params; 

    OrderDetails.findById(_id)
        .then(docs => {
            res.status(200).json({ data: docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// GET boxes associated with a kit id
router.get('/:kit_id', (req, res) => {
    const { kit_id } = req.params; 

    OrderDetails.findById(kit_id)
        .then(docs => {
            res.status(200).json({ docs }); 
        })
        .catch(err => {
            res.status(500).json({ error: err }); 
        }); 
}); 

// ======================== POST Requests ===========================
// create new box for a specific user
router.post('/:_id', (req, res) => {
    console.log(req.body); 

    const orderDetails = new OrderDetails({
        user_id: req.params,
        kit_id: req.body.kitId,
        monthly_quantity: req.body.monthlyQuantity,
        annual_quantity: req.body.annualQuantity,
        order_frequency: req.body.orderFrequency,
    });
  
    // saving the user to the users collection
    orderDetails.save()
    .then(orderDetails => {
        res.status(201).json({ orderDetails })
    })
    .catch(err => {
        res.status(500).json({ error: `${err}` })
    });
});

// ======================== PUT Requests ===========================

// ======================== DELETE Requests ===========================

module.exports = router; 
