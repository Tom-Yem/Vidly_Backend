const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

function validate(user){
    const schema = {
        email: Joi.string().min(5).required().email(),
        password: Joi.string().required()
    }
    return Joi.validate(user,schema);
}

router.post('/',async(req,res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email:req.body.email}); 
    if(!user) return res.status(400).send("Invalid email or password.");

    let validPassword = await bcrypt.compare(req.body.password,user.password); 
    if(!validPassword) return res.status(400).send("Invalid email or password.");
    
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(`Welcome:${user.name},You are logged in!\n
--> use the "x-auth-token" header for accesing your json web token
    `);
});

module.exports = router;