var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Patient    	= require('./patient');
 
var callSchema   = new Schema({
  calltype: Number,
  updated: { type: Date, default: Date.now },
  callstatus: Number
});

callSchema.pre('remove', function(next){
	Patient.findOneAndUpdate({calls: this._id}, {$pull: {calls: this._id}}).exec();
});
 
module.exports = mongoose.model('Call', callSchema);