var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Patient		= require('./patient');
 
var CentralSchema   = new Schema({
  firebase_id: {
  	type: String,
  	required: true,
  	unique: true
  	}
});
 
module.exports = mongoose.model('Central', CentralSchema);