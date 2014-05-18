/**
 * Server side call that will get data from the client and send data back
 */

var amqp = require('amqp');
var connection = amqp.createConnection({host:'localhost'});

//Test for relay
connection.on('ready', function()
{
	try
	{
		//Waits for a connection to become established
		connection.exchange('logs', {type: 'direct', autoDelete: false}, function(exchange)
		{
			connection.queue('server', {exclusive: true}, function(queue)
			{
				//Catches all the messages
				queue.bind('logs', '');
				
				console.log('[*] Waiting for logs. To exit press CTRL + C');
	
				//Receives all the messages
				queue.subscribe(function(msg)
				{
					//Unbinds the exchanges so it can be reset for another use
					queue.unbind('logs','');
					
					console.log(' [x] %s', msg.data.toString('utf-8'));
					
					var replyMessage = msg.data.toString('utf-8');
				
					console.log('Reply message sent:', replyMessage);
			
					//Sends the message out
					exchange.publish('', replyMessage);
				});
			});
		});
	}
	catch (e)
	{
		// TODO: handle exception
		console.log('Server could not establish a connection.');
	}
});

