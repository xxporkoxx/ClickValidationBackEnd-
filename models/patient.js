var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Call 		= require('./call');
 
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

patientSchema.pre('remove',function(next){
	for(var i=0; i < this.calls.length ;i++){
		Call.find({ _id: this.calls[i]}).remove().exec();
	}
});
 
module.exports = mongoose.model('Patient', patientSchema);