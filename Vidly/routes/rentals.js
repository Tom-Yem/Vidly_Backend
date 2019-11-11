const {Rental,validate} = require('../models/rental');
const {Movies}= require('../models/movies');
const {Customer}= require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async(req,res) =>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req,res) =>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customerId');

    const movie = await Movies.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movieId');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({ 
        customer: {
          _id: customer._id,
          name: customer.name, 
          phone: customer.phone
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate
        }
      });
      try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id},{
        $inc: { numberInStock: -1}})
        .run();

        res.send(rental);
      }
      catch(ex){
          res.status(500).send('Interanl server error!')
      }
      
});

module.exports = router;