const express = require('express');
const amqp = require('amqplib');

const app = express();
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';
const PORT = 5001;

async function processMessage(msg) {
	console.log(msg.content.toString());
}

(async () => {
	const connection = await amqp.connect(amqpUrl, 'heartbeat=60');
	const channel = await connection.createChannel();
	channel.prefetch(10);
	const queue = 'hoanglh.test';
	process.once('SIGINT', async () => {
		console.log('got sigint, closing connection');
		await channel.close();
		await connection.close();
		process.exit(0);
	});

	await channel.assertQueue(queue, { durable: true });
	await channel.consume(
		queue,
		async (msg) => {
			console.log('processing messages');
			await processMessage(msg);
			await channel.ack(msg);
		},
		{
			noAck: false,
			consumerTag: 'email_consumer',
		},
	);
	console.log(' [*] Waiting for messages. To exit press CTRL+C');
})();

app.listen(PORT, () => {
	console.log(`Server connected on port: ${PORT}`);
});
