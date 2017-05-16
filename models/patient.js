var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var patientSchema   = new Schema({
  name:    {
  	type: String,
  	required: true,
  	unique: true
  	},
  age:     { type: Number, min: 18, max: 100 },
  disease: String,
  caretakers: [{ type: Schema.Types.Mixed, ref: 'CareTaker' }],
  calls: [{ type: Schema.Types.Mixed, ref: 'Call' }]
});
 
module.exports = mongoose.model('Patient', patientSchema);