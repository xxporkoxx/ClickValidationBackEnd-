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


//PATIENT ROUTES
	router.route('/patients').get(
		function(req,res){
			Patient.find(function(err, patients){
				if(err)
					res.send(err);
				res.json(patients);
			});
		});

    router.route('/patients/:patient_name').get(
		function(req,res){
		Patient.findOne({'name': { $regex : new RegExp( req.params.patient_name, "i") }},function(error, patients){
			if(error)
				res.send(err);
			else
				res.json(patients);
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

			patient.save(function(error){
				if (error)
      				res.json({error: "Error creating patient: Name must be unique and required "});
    			else
					res.json({message: "Patient created"});		
			});
	})

//Ainda não foi testada essa função  <-------------- EM LOOP INFINITO
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
						console.log("careTaker "+careTakerObj);
						patient.caretakers.push(careTakerObj);
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
//<-------------------------------------------------- LOOP INFINITO


	function findCareTakerFromName(careTakerName, res){
		CareTaker.findOne({'name': { $regex : new RegExp( careTakerName, "i") }},function(error, careTaker){
			if(careTaker)
				res( careTaker);
			else
				res (error);
			});	
	}



			//var careTakerId = findCareTakerIdFromName( req.body.careTakerName);




//CARETAKERS

	router.route('/caretakers').get(
		function(req,res){
			CareTaker.find(function(err, careTakers){
				if(err)
					res.send(err);
				res.json(careTakers);
			});
		});

//Concertar essa função
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
	


module.exports = router;