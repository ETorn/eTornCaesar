var l = require('debug')('etorn:caesar:index');
l('WELCOME');

// BASE SETUP
// =============================================================================

var config = require('./config');

// Require dependencies
var mqtt = require('mqtt');
var express    = require('express');
var app        = express();
var cors = require("cors");

var mongoose   = require('mongoose');
l('Connecting to mongo...');
mongoose.connect('mongodb://' + config.mongodb.address + '/etorn_caesar');
l('Connected.')

var mqttClient = mqtt.connect(config.mqtt.address, {clientId: 'mqtt_local'});

// configure app to use bodyParser()
// this will let us get the data from a POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------
require ('./routes/events') (router, mqttClient);
require ('./routes/time') (router, mqttClient);
//require ('./routes/eventType') (router, mqttClient);
app.use('/', router);

// REGISTER OUR MIDDLEWARES -------------------------------
app.use(function(req, res, next) {
    res.status(404).send('Not Found');
    next(); // make sure we go to the next routes and don't stop here
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});


// START THE SERVER
// =============================================================================
app.listen(config.node.port);
l('Express listening on ' + config.node.port);
