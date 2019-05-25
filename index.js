'use strict';

//import dependencies and set up http server
const 
	express = require('express'),
	bodyParser = require('body-parser'),
	app = express().use(bodyParser.json()); //create express http server
app.listen(process.env.PORT || 1337,() => console.log('webhook is listening'));


//create the endpoint for our webhook
app.post('/webhook',(req,res) =>{
	let body = req.body;
	//check this is an event from a page subscription
	if(body.object === 'page'){
		//iterates over each entry - there may be multiple if batched
		body.entry.forEach(function(entry){
			//get the message/ entry.messaging is an array, but will only ever contain one message, so we get index 0
			let webhook_event = entry.messaging[0];
			console.log(webhook_event);
		});

		//returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED');
	}
	else{
		// returns a '404 not found' if envet is not from a page subscription
		res.sendStatus(404);
	}
});

//adds support for GRT requests to our webhook
app.get('/webhook', (req,res)=>{

	//your verify token, should be a random string.
	let VERIFY_TOKEN = 'lyhoangducthuquynhtrang'

	//parse the query params
	let mode =req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	// check if  a token and mode í in the qure string ò the request
	if (mode && token) {

		//checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			// Responds with the challenger token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		}
		else{
			//responds with '403 forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});