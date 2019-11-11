const bcrypt = require('bcrypt');
const {User,validateUser} = require('../models/user');
const auth = require('../middlewares/authorization');
const express = require('express');
const router = express.Router();


router.post('/me',auth,async(req,res) =>{
    console.log(req.user._id)
    let user = await User.findById(req.user._id);
    console.log(user)
    res.send(`Here is what your profile looks like:\n
    name:${user.name}\n
    email:${user.email}`)
});

router.post('/',async(req,res) =>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    let user = await User.findOne({ email:req.body.email});
    if(user) return res.status(400).send('User is already registered!');

    user = new User({ 
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    if(user.email == 'alazarhashelit@gmail.com') user.isAdmin = true;
    await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(`Welcome:${user.name},You are registered!\n
--> use the "x-auth-token" header for accesing your json web token`);
});

module.exports = router;