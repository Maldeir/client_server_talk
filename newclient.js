/**
 * Client side call that will send data to the server and get data back
 */
var amqp = require('amqp');
var connection = amqp.createConnection({host:"localhost"});
var newMessage = 'Hello World';

//Creates a random unique id
var id = Math.random().toString();

var publishOptions = { replyTo: id};

connection.on('ready', function()
{
	//Waits for a connection to become established
	connection.exchange('logs', {type: 'direct', autoDelete:false}, function(exchange)
	{
		connection.queue(id, {exclusive: true}, function(queue)
		{	
			//Receives all the messages
			queue.subscribe(function(msg)
			{								
				console.log('Reply message recived:', msg.data.toString('utf-8'));
			});
		});

		//Sends the message out and Id of the return address
		exchange.publish('', newMessage, publishOptions);
	});
	
	//Prints the unique Id and the message that was sent
	console.log('Clients unique ID is: ', id);
	console.log("[x] Sent %s ", newMessage);
});
