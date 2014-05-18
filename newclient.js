/**
 * Client side call that will send data to the server and get data back
 */
var amqp = require('amqp');
var connection = amqp.createConnection({host:"localhost"});

var newMessage = 'Hello World';

connection.on('ready', function()
{
	//Tries to connect to the server to send a message
	try
	{
		//Waits for a connection to become established
		connection.exchange('logs', {type: 'direct', autoDelete:false}, function(exchange)
		{
			connection.queue('client', {exclusive: true}, function(queue)
			{	
				//Catches all the messages
				queue.bind('logs', '');
				
				//Receives all the messages
				queue.subscribe(function(msg)
				{								
					console.log('Reply message recived:', msg.data.toString('utf-8'));
				});
			});
	
			//Sends the message out
			exchange.publish('', newMessage);
		});
		
		console.log("[x] Sent %s ", newMessage);
	}
	catch (e) 
	{
		// TODO: handle exception
		console.log("Exchange did not work");
	}
});