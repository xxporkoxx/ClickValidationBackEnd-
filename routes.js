var express = require('express');

var server = require('./server');
// Get the router
var router = express.Router();

var Message    	= require('./models/message');
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

// GET all messages (using a GET at http://localhost:8080/messages)
router.route('/messages').get(
	function(req,res){
		Message.find(function(err, messages){
			if(err)
				res.send(err);
			res.json(messages);
		});
	});

router.route('/messages').post(
	function(req,res){
		var message = new Message();

		message.text = req.body.text;
		message.user = req.body.user;

		message.save(function(err){
			if(err)
				res.send(err);
			res.json({message: 'Message created sucessfull'});
		});
	});

router.route('/messages/:message_id')
    // GET message with id (using a GET at http://localhost:8080/messages/:message_id)
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    })
 
    // Update message with id (using a PUT at http://localhost:8080/messages/:message_id)
    .put(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            // Update the message text
	    message.text = req.body.text;
            message.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Message successfully updated!' });
            });
 
        });
    })
 
    // Delete message with id (using a DELETE at http://localhost:8080/messages/:message_id)
    .delete(function(req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function(err, message) {
            if (err)
                res.send(err);
 
            res.json({ message: 'Successfully deleted message!' });
        });
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

	/*router.route('/patients/:patient_id')
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    });*/

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
				if (error){
      				res.json({error: "Error creating careTaker: Name must be unique and required "});
      				console.log("caretaker error",error);}

    			else
					res.json({message: "CareTaker created"});		
			});
	})
	


//CALL ROUTES
	router.route('/calls').get(
		function(req,res){
			Call.find(function(err, calls){
				if(err)
					res.send(err);
				res.json(calls);
			});
		})

/*ARGSkey: 	"updated": data da chamada
			"calltype": numero que identifica o tipo de chamada : 1-SOS / 2-BANHEIRO / 3-ASSISTENCIA / 4-SEDE
			"callstatus": numero que identifica 
			o status atual da chamada :	CALL_STATUS_INITIALIZATION = 0;    
										CALL_STATUS_WATING_TO_SERVE = 1;    
										CALL_STATUS_ON_THE_WAY = 2;    
										CALL_STATUS_SERVED = 3;
			"patient_id": id do paciente que esta fazendo a chamada*/

	.post(function(req,res){
		var call = new Call();

		call.updated = req.body.updated;
		call.calltype = req.body.calltype;
		call.callstatus = req.body.callstatus;

		call.save(function(error){
			if (error)
      			res.json({error: "Error creating call"});
    		else{
    			Patient.findById(req.body.patientid,function(error,patient){
					if(error)
						res.json({message: "Could not found patient ID: "+req.body.patientid});
					else{
						patient.calls.push(call._id);
						patient.save(function(error){
						if(error)
							res.json({message: "Error saving the push to calls"});
						else
							res.json(patient);
						});
					}
				});
    		}
		});
	})

//ARGSkey: "call_id": id of the call 
	router.route('/calls/:call_id')
		.delete(function(req, res){
/*			Call.findById(req.params.call_id, function(error, call){
				if(error)
					res.send(error)
				else{
					call.remove();
					res.json({ message: 'Successfully deleted message!' });
				}	
			});
*/
			Call.findOneAndRemove({'_id': req.params.call_id}, function(err, call) {
				//console.log("CALL INSTANCE "+call)
			    if(call){
			    	call.remove();
			    	res.json({message: "Call removed Successfully"});
			    }
			    else
			    	res.json({message: "Call not find"});
			});

		    /*Call.remove( {_id: req.params.call_id}, function(err, call) {
            if (err)
                res.send(err);
 			else
            	res.json({ message: 'Successfully deleted message!' });
        });*/
	});


module.exports = router;