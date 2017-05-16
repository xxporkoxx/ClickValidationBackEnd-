var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Patient		= require('./patient');
 
var careTakerSchema   = new Schema({
  name: {
  	type: String,
  	required: true,
  	unique: true
  	}
});

careTakerSchema.pre('remove', function(next){
	Patient.findOneAndUpdate({caretakers: this._id}, {$pull: {caretakers: this._id}}).exec();
});
 
module.exports = mongoose.model('CareTaker', careTakerSchema);