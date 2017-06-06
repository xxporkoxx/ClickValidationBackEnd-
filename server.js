'use strict';

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
//var routes     = require('./routes');
var http 		= require('http');

var mongoose = require("mongoose");

mongoURI = 'mongodb://localhost/restdb';
mongoose.connect(process.env.MONGOLAB_URI || mongoURI);
app.use(express.static(__dirname + '/build'));
 
// express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Set port
//var port = process.env.PORT || 8080;        // set the port
 
// Define a prefix for all routes
// Can define something unique like MyRestAPI
// We'll just leave it so all routes are relative to '/'
//app.use('/', routes);

require('./routes')(app);
 
var server = http.createServer(app);
 
// Start server listening on port 8080
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

console.log('RESTAPI listening on port: ' + port);