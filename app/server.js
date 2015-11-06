'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    app = express();

// Configure app to work json requests body
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// log for all requests
app.use(morgan('dev'));

// Set the port
app.set('port', (process.env.PORT || 3000));

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/nodyx');
mongoose.Promise = require('bluebird');

// Home page for api status check
app.get('/', function (req, res) {
    res.status(200).json({
        'Room' : 1408
    });
});

app.use('/api/v1/rooms', require('./routes/rooms'));
app.use('/api/v1/users', require('./routes/users'));

// Start the server
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
