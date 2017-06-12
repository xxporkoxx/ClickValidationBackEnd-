var express = require('express');

var server = require('./server');
// Get the router
var router = express.Router();

var Patient    	= require('./models/patient');
var CareTaker   = require('./models/careTaker');
var Call    	= require('./models/call');

 
function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}
 
// Middleware for all this routers requests
router.use(function timeLog(req, res, next) {
  console.log('Request Received: ', dateDisplayed(Date.now()));
  next();
});
 
// Welcome message for a GET at http://localhost:8080/restapi
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the REST API' });   
});




//PATIENTS ROUTES
	router.route('/patients').get(
		function(req,res){
			Patient.find(function(err, patients){
				if(err)
					res.send(err);
				res.json(patients);
			});
		});

	function findPatientFromName(patientName, res){
		Patient.findOne({'name': { $regex : new RegExp( patientName, "i") }},function(error, patient){
			if(patient){
				console.log("Patient "+patient);
				res(patient);
			}
			else{
				console.log("Errl "+error)
				res(error);
			}
			});	
	}

    router.route('/patients/:patient_name').get(
		function(req,res){		
			findPatientFromName(req.params.patient_name, function(patientObj){
				if(patientObj != null)
					res.send(patientObj)
				else
					res.json({message: "Patient Not Found"});
			});
		});


/*ARGSkey 	name: patient name 						STRING -> REQUIRED AND UNIQUE
			age: patient age 						NUMBER
			disease: disease that the patient have 	STRING
			gender: gender of the patient 			STRING -> m or f
			patientdegree: degree of care 			NUMBER -> 
*/
	router.route('/patients').post(
		function(req,res){
			var patient = new Patient();

			patient.name 	= req.body.name;
			patient.age 	= req.body.age;
			patient.disease = req.body.disease;
			patient.gender 	= req.body.gender;
			patient.patientdegree = req.body.patientdegree;

			patient.save(function(error){
				if (error)
      				res.json({error: "Error creating patient: Name must be unique and required "});
    			else
					res.json(patient);		
			});
	})


//ARGS:    	patientName: Nome do Paciente
//			careTakerName: nome do cuidador
//	A função conecta os dois, colocando o cuidador dentro do model do paciente
	.put(
		function(req, res){
			Patient.findOne({'name': { $regex : new RegExp( req.body.patientName, "i") }},function(error, patient){
			if(error || patient == null)
				res.json({message: "Patient not found"});
			else{
				//console.log("caretakername "+req.body.careTakerName+"patient OBJ:"+patient)
				findCareTakerFromName(req.body.careTakerName, function(careTakerObj){
					if(careTakerObj!=null){
						console.log("careTaker "+careTakerObj._id);
						patient.caretakers.push(careTakerObj._id);
						patient.save(function(error){
							if(error)
								res.json({message: "Error saving the push to caretakers"});
							else
								res.json(patient);
						});
					}
					else
						res.json({message: "CareTaker Not Found"});
				});
			}
			});	
		});

	function findCareTakerFromName(careTakerName, res){
		CareTaker.findOne({'name': { $regex : new RegExp( careTakerName, "i") }},function(error, careTaker){
			if(careTaker)
				res( careTaker);
			else
				res (error);
			});	
	}

	//ARGSkey: "caretaker_id": id of the caretaker 
	router.route('/patients/:patient_id')
		.delete(function(req, res){
			Patient.findOneAndRemove({'_id': req.params.patient_id}, function(err, patient) {
			    if(patient){
			    	patient.remove();
			    	res.json({message: "Patient removed Successfully"});
			    }
			    else
			    	res.json({message: "Error: patient not find"});
			});
	});



//CARETAKERS ROUTES

	router.route('/caretakers').get(
		function(req,res){
			CareTaker.find(function(err, careTakers){
				if(err)
					res.send(err);
				res.json(careTakers);
			});
		});

	router.route('/caretakers').post(
		function(req,res){
			var careTaker = new CareTaker();

			careTaker.name 	= req.body.name;

			careTaker.save(function(error){
				if (error)
      				res.json({error: "Error: creating careTaker Name must be unique and required "});
    			else
					res.json({message: "CareTaker created"});		
			});
	})

	//ARGSkey: "caretaker_id": id of the caretaker 
	router.route('/caretakers/:caretaker_id')
		.delete(function(req, res){
			CareTaker.findOneAndRemove({'_id': req.params.caretaker_id}, function(err, caretaker) {
			    if(caretaker){
			    	caretaker.remove();
			    	res.json({message: "CareTaker removed Successfully"});
			    }
			    else
			    	res.json({message: "Error: careTaker not find"});
			});
		})
		.get(function(req, res){
			findCareTakerFromID({'_id':req.params.caretaker_id},function(caretakerObj){
				if(caretakerObj!=null){
					res.json(caretakerObj);
					//TRatar o erro que cai nesse if do sucesso mas nao retorna o cuidador
					/*{
				  "stack": "Error\n    at MongooseError.CastError (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\error\\cast.js:18:16)\n    at ObjectId.cast (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\schema\\objectid.js:134:13)\n    at ObjectId.castForQuery (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\schema\\objectid.js:187:17)\n    at module.exports (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\cast.js:205:32)\n    at Query.cast (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\query.js:2492:10)\n    at Query.findOne (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\query.js:1237:10)\n    at Function.findOne (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\mongoose\\lib\\model.js:1160:13)\n    at findCareTakerFromID (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\routes.js:193:13)\n    at C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\routes.js:180:4\n    at Layer.handle [as handle_request] (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\route.js:137:13)\n    at next (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\route.js:131:14)\n    at Route.dispatch (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\route.js:112:3)\n    at Layer.handle [as handle_request] (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\index.js:281:22\n    at param (C:\\Users\\DiegoMello\\Documents\\ClickValidationBackEnd\\node_modules\\express\\lib\\router\\index.js:354:14)",
				  "message": "Cast to ObjectId failed for value \"591b062cbb16b8ff60445f5\" at path \"_id\"",
				  "name": "CastError",
				  "kind": "ObjectId",
				  "value": "591b062cbb16b8ff60445f5",
				  "path": "_id"
				}*/
				}
				else
					res.json({message: "CareTaker Not Found"});		
			});
		});
	
	function findCareTakerFromID(careTakerId, res){
		CareTaker.findOne(careTakerId ,function (err, caretaker){
			if(caretaker)
				res(caretaker);
			else
				res(err);
		});
	}


//CALL ROUTES
	router.route('/calls').get(
		function(req,res){
			Call.find(function(err, calls){
				if(err)
					res.send(err);
				res.json(calls);
			});
		})

/*ARGSkey: 	"created_at": data da chamada
			"calltype": numero que identifica o tipo de chamada : 1-SOS / 2-BANHEIRO / 3-ASSISTENCIA / 4-SEDE
			"callstatus": numero que identifica 
			o status atual da chamada :	CALL_STATUS_INITIALIZATION = 0;    
										CALL_STATUS_WATING_TO_SERVE = 1;    
										CALL_STATUS_ON_THE_WAY = 2;    
										CALL_STATUS_SERVED = 3;
			"patientid": id do paciente que esta fazendo a chamada*/

	.post(function(req,res){
		var call = new Call();

		call.created_at = Date.now();
		call.calltype = req.body.calltype;
		call.callstatus = req.body.callstatus;

		call.save(function(error){
			if (error)
      			res.json({error: "Error: saving the call"});
    		else{
    			Patient.findById(req.body.patientid,function(error,patient){
					if(error || patient == null)
						res.json({message: "Error: Could not found patient ID: "+req.body.patientid});
					else{
						patient.calls.push(call._id);
						patient.save(function(error){
						if(error)
							res.json({message: "Error: saving the push to calls"});
						else
							res.json(patient);
						});
					}
				});
    		}
		});
	});


/*ARGSKEYS:  callid:  id sa chamada a ser atualizada
			callstatus:  "callstatus": numero que identifica 
			o status atual da chamada :	CALL_STATUS_INITIALIZATION = 0;    
										CALL_STATUS_WATING_TO_SERVE = 1;    
										CALL_STATUS_ON_THE_WAY = 2;    
										CALL_STATUS_SERVED = 3;*/
	router.route('/solvecall')
	.post(function(req,res){
		console.log("CALLID" + req.body.callid)
		Call.findOneAndUpdate(
		   { "_id": req.body.callid },
		   { "$set": {  "callstatus": req.body.callstatus, "call_solved_at": Date.now()}},
		   {new:true},
		   function(err,doc) {
		     // work here
		     if(err)
		     	res.json({message:"Error: Failed to update call "+req.body.callid})
		     else
		     	res.json(doc);
		   }
		);
	})

	router.route('/calls/:call_id').get(
		function(req,res){	
		Call.findOne({'_id': req.params.call_id}, function(err, call){
			if(call){
			    res.json(call);
			}
			else
			   	res.json({message: "Error: call not find"});
		});
	});

	function findCallFromID(callId, res){
		Call.findOne(callId ,function (err, call){
			if(call)
				res(call);
			else
				res(err);
		});
	}

//ARGSkey: "call_id": id of the call 
	router.route('/calls/:call_id')
		.delete(function(req, res){
			Call.findOneAndRemove({'_id': req.params.call_id}, function(err, call) {
			    if(call){
			    	call.remove();
			    	res.json({message: "Call removed Successfully"});
			    }
			    else
			    	res.json({message: "Error: call not find"});
			});
	});


module.exports = router;