const {validateCustomer,Customer}= require('../models/customer');
const express = require('express');
const router = express.Router();


router.get('/', async (req,res) =>{
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.post('/', async (req,res) =>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const {name,phone,isGold} = req.body;
    const customer = new Customer({ name,phone,isGold });
    await customer.save();
    res.send(customer);
});

router.put('/:id',async (req,res) =>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const {name,phone,isGold} = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        { name,phone,isGold },
        {new: true});
    if (!customer) return res.status(400).send('This customer with the given id is not availabale!');
    
    res.send(customer);
});

router.delete('/:id', async(req,res) =>{
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(400).send('This customer with the given id is not availabale!');

    res.send(customer);
});

router.get('/:id', async (req,res) =>{
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(400).send('This customer with the given id is not availabale!');

    res.send(customer);
});
 
 module.exports = router;