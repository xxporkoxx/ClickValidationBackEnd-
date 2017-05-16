var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var patientSchema   = new Schema({
  name:    {
  	type: String,
  	required: true,
  	unique: true
  	},
  age:     { type: Number, min: 18, max: 100 },
  gender: {type: String, enum: ['m','f']},
  disease: String,
  patientdegree: Number,
  caretakers: [{ type: Schema.Types.ObjectId, ref: 'CareTaker' }],
  calls: [{ type: Schema.Types.ObjectId, ref: 'Call' }]
});
 
module.exports = mongoose.model('Patient', patientSchema);