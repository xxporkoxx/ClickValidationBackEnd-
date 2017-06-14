var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Patient		= require('./patient');
 
var CentralSchema   = new Schema({
  name: {type: String, unique: true, required: true},
  firebase_id: {
  	type: String,
  	required: true,
  	unique: true
  	},
  socket_id: String,
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
});
 
module.exports = mongoose.model('Central', CentralSchema);