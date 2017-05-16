var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var callSchema   = new Schema({
  calltype: Number,
  updated: { type: Date, default: Date.now },
  callstatus: Number
});
 
module.exports = mongoose.model('Call', callSchema);