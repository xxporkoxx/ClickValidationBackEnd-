var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var routes     = require('./routes');

var mongoose = require("mongoose");

mongoURI = 'mongodb://localhost/restdb';
mongoose.connect(process.env.MONGODB_URI || mongoURI);

//MOGODB_URI:
//mongoose.connect("mongodb://heroku_frcr5b76:algam1kphefimb149iis04400k@ds141098.mlab.com:41098/heroku_frcr5b76");

//MONGODB_URI
//mongoose.connect("mongodb://heroku_porko:td20129395@ds161931.mlab.com:61931/heroku_k62d4cjg");

console.log("MONGODB_URI: " +process.env.MONGODB_URI);
console.log("MOGODB_URI: " + process.env.MOGODB_URI);
console.log("MOGO_URI: " + mongoURI);
 
// express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Set port
//var port = process.env.PORT || 8080;        // set the port
 
// Define a prefix for all routes
// Can define something unique like MyRestAPI
// We'll just leave it so all routes are relative to '/'
app.use('/', routes);
 
// Start server listening on port 8080
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});