// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const orderDetailsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    kit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kits' },
    monthly_quantity: String,
    annual_quantity: String,
    order_frequency: String,
});

// instantiation the collection with the schema we created
const OrderDetails = new mongoose.model('OrderDetails', orderDetailsSchema);

// exporting the collection
module.exports = OrderDetails; 