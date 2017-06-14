var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Patient		= require('./patient');
 
var hospitalSchema   = new Schema({
  name: {
  	type: String,
  	required: true,
  	unique: true
  	}
  centrals: [{ type: Schema.Types.ObjectId, ref: 'Central' }],
});
 
module.exports = mongoose.model('Hospital', hospitalSchema);