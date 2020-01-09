// library imports 
const mongoose = require('mongoose');

// defining schema for the users collection in the database
const orderDetailsSchema = new mongoose.Schema({
    user_id: String,
    kit_id: String,
    monthly_quantity: String,
    annual_quantity: String,
    order_frequency: String,
});

// instatiating the collection with the schema we created
const OrderDetails = new mongoose.model('OrderDetails', orderDetailsSchema);

// exporting the collection
module.exports = OrderDetails; 