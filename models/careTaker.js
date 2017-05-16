var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var careTakerSchema   = new Schema({
  name: {
  	type: String,
  	required: true,
  	unique: true
  	}
});
 
module.exports = mongoose.model('CareTaker', careTakerSchema);