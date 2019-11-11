const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customers',new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3 
    },
    phone: {
        type: String,
        required: true,
        minlength: 5
    },
    isGold: {
        type:Boolean,
        required: true
    }
}));

function validateCustomer(cust){
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(5).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(cust,schema)
 }

 module.exports.validateCustomer = validateCustomer;
 module.exports.Customer = Customer;