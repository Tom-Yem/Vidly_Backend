require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movie = require('./routes/movie');
const rentals = require('./routes/rentals');
const register = require('./routes/register');
const login = require('./routes/login');
const error= require('./middlewares/errorHandler');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('db'),{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true})
.then( () => console.log('Connected to mongodb.'))
.catch( () => console.log('Failed to connect.')) 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/genres',  genres);
app.use('/customers', customers);
app.use('/movies', movie);
app.use('/rentals', rentals);
app.use('/register', register);
app.use('/login', login);


app.use(error);  //error handler middleware

const port = process.env.PORT || 3000;
server = app.listen(port,() => console.log(`listening on port ${port}`));

module.exports = server;