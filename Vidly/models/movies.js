const { Genre }= require('./genre');
const mongoose = require('mongoose');
const Joi = require('joi');

const Movies = mongoose.model('Movies',new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3 
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    dailyRentalRate: {
        type:Number,
        default: 0,
        required: true
    },
    numberInStock: {
        type:Number,
        default: 0,
        required: true
    }

}));

function validateMovie(genre){
    const schema = {
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        dailyRentalRate: Joi.number(),
        numberInStock: Joi.number()
    }
    return Joi.validate(genre,schema)
 }

module.exports.Movies = Movies;
module.exports.validateMovie = validateMovie;