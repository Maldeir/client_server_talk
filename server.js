/**
 * Server side call that will get data from the client and send data back
 */
var amqp = require('amqp');
var connection = amqp.createConnection({host:'localhost'});

connection.on('ready', function()
{
	connection.queue('server', {exclusive: true}, function(queue)
	{
		//Catches all the messages
		queue.bind('logs', '');

		console.log('[*] Waiting for logs. To exit press CTRL + C');

		//Receives all the messages
		queue.subscribe(function(msg, header, deliveryInfo, messageOptions)
		{
			console.log(' [x] %s', msg.data.toString('utf-8'));

			var replyMessage = msg.data.toString('utf-8');

			console.log('Reply message sent:', replyMessage);

			//Sends the message out
			connection.publish(deliveryInfo.replyTo,'Message received.');
		});
	});
});
