const {User}=require('../models/user');
const auth = require('../middlewares/authorization'); 
const express = require('express');
const router = express.Router();

router.get('/:name',async(req,res) =>{
    const user = await User.findOne({name:req.params.name})
    .select('name email -_id');
    if(!user) return res.status(404).send("User not found!");
    
    res.send(user);
});

router.delete('/',auth,async(req,res) =>{
     if(!req.user.isAdmin) return res.status(401).send('Unauthorized operation:\nYou do not have privilage!');
     
     const user = await User.deleteOne({email:req.body.email});
     res.send(user);
});

module.exports = router;