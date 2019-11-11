const {Movies,validateMovie} = require('../models/movies');
const express = require('express');
const router = express.Router();

router.post('/',async(req,res) =>{
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const movie = new Movies({
        title: req.body.title,
        genre: req.body.genreId,
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock
    });
    await movie.save();
    res.send(movie);
});

router.get('/', async(req,res) =>{
    const movie = await Movies.find()
    .populate('genre','-__v');
    res.send(movie);
 });

module.exports = router;