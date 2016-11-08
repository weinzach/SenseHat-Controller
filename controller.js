"use strict";
//var Publisher = require('cote').Publisher;
var Publisher = require('cote')({'broadcast': '10.0.255.255'}).Publisher;
const sense = require("sense-hat-led");
let nodeimu = require('nodeimu');
let IMU = new nodeimu.IMU()

var bot = "driveJames";
var currentState = ""; 
var ready = 0;

var X = [255, 0, 0];  // Red 
var O = [255, 255, 255];  // White 

// Instantiate a new Publisher component. 
var randomPublisher = new Publisher({
    name: 'jamesController', 
    broadcasts: ['robot']
});
 
// Wait for the publisher to find an open port and listen on it. 
randomPublisher.on('ready', function() {
    ready = 1;
});

var downArrow = [
O, O, O, X, X, O, O, O,
O, O, X, X, X, X, O, O,
O, X, O, X, X, O, X, O,
X, O, O, X, X, O, O, X,
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O
];
 
var upArrow = [
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O,
O, O, O, X, X, O, O, O,
X, O, O, X, X, O, O, X,
O, X, O, X, X, O, X, O,
O, O, X, X, X, X, O, O,
O, O, O, X, X, O, O, O
];

var rightArrow = [
O, O, O, X, O, O, O, O,
O, O, X, O, O, O, O, O,
O, X, O, O, O, O, O, O,
X, X, X, X, X, X, X, X,
X, X, X, X, X, X, X, X,
O, X, O, O, O, O, O, O,
O, O, X, O, O, O, O, O,
O, O, O, X, O, O, O, O
];

var leftArrow = [
O, O, O, O, X, O, O, O,
O, O, O, O, O, X, O, O,
O, O, O, O, O, O, X, O,
X, X, X, X, X, X, X, X,
X, X, X, X, X, X, X, X,
O, O, O, O, O, O, X, O,
O, O, O, O, O, X, O, O,
O, O, O, O, X, O, O, O
];


function getSensorData() {
  let data = IMU.getValueSync();
  return data.accel;
}

setInterval(function() {
    let state;
    var val = getSensorData();
	if(val.x>0.2){
          state = "a";
	  sense.setPixels(leftArrow);
	}
	else if(val.x<-0.2){

	  state = "d";
	  sense.setPixels(rightArrow);
	}
	else if(val.y>0.2){
	  state = "w";
	  sense.setPixels(upArrow);
	}
	else if(val.y<-0.2){
          state = "s";
	  sense.setPixels(downArrow);
	}
	else{
	  state = "x";	
	  sense.clear();  // no adrguments defaults to off 
	}
	if(state!=currentState){
		if(ready==1){
			randomPublisher.publish(bot, state);
			console.log("Emitted: "+state);		
		}
		currentState = state;	
	}
}, 500); 
