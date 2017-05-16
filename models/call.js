var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var callSchema   = new Schema({
  type: Number,
  updated: { type: Date, default: Date.now },
  status: Number
});
 
module.exports = mongoose.model('Call', callSchema);