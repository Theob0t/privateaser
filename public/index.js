'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

//Step 1 - Euro-People

function bookingPrice (){
var timeComp; //time component: the number of booked time multiplied by the bar price per hour
var peopleComp; //people component: the number of persons multiplied by the bar price per person
	
	for(var i=0; i<bars.length; i++){
		for (var j=0; j<events.length; j++){
			
			if (bars[i].id == events[j].barId){
			timeComp = bars[i].pricePerHour * events[j].time;
			peopleComp = bars[i].pricePerPerson * events[j].persons;
			events[j].price = timeComp + peopleComp;	
			}
		}
	}
}

//Step 2 - Send more, pay less

/*decreases by 10% after 10 persons
decreases by 30% after 20 persons
decreases by 50% after 60 persons*/

function decreasesPrice(){
	 
	for (var j=0; j<events.length; j++){ 
		if (events[j].persons >10 && events[j].persons <= 20) events[j].price = events[j].price*0.9;
		if (events[j].persons >20 && events[j].persons <= 60) events[j].price = events[j].price*0.7;
		if (events[j].persons >60) events[j].price = events[j].price*0.5;
	}		
}

//Step 3 - Give me all your money

/*There is a 30% commission on the booking price to cover the costs.

The commission is split like this:
	insurance: half of commission
	the Treasury: 1€ by person
	Privateaser: the rest*/

function commissionPrice(){
	var commission;
	for (var j=0; j<events.length; j++){ 
		commission = events[j].price*0.3;
		events[j].commission.insurance = commission*0.5;
		events[j].commission.treasury = 1;
		events[j].commission.privateaser = events[j].price - events[j].commission.insurance - events[j].commission.treasury;
	}
	
}


//Step 4 - The famous deductible

/*In case of an accident/theft, Privateaser applies a 5000€ deductible.

The booker can reduce the deductible amount from 5000€ to 200€ with a deductible option for a few more euros per person.

The deductible
The booker is charged an additional 1€/person when he chooses the deductible reduction option.

The additional charge goes to Privateaser, not to the bar.*/

function deductibleTrue(){
	var nbperson;
	for (var j=0; j<events.length; j++){ 
		if (events[j].options.deductibleReduction) {events[j].price = events[j].price + events[j].persons};
	}
}

bookingPrice();
decreasesPrice();
commissionPrice();
deductibleTrue();
console.log(bars);
console.log(events);
console.log(actors);
