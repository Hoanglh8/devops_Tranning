const express = require('express');
const mqtt = require('mqtt');
const amqp = require('amqplib');

const app = express();
const PORT = 5000;

const MQTT_CLIENT_ID = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';

const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

async function connectRabbitMQ(mqttMessage) {
	const connection = await amqp.connect(amqpUrl, 'heartbeat=60');
	const channel = await connection.createChannel();
	try {
		console.log('Publishing');
		const exchange = 'hoanglh.exchange';
		const queue = 'hoanglh.test';
		const routingKey = 'test';

		await channel.assertExchange(exchange, 'fanout', { durable: true });
		await channel.assertQueue(queue, { durable: true });
		await channel.bindQueue(queue, exchange, routingKey);

		await channel.publish(exchange, routingKey, new Buffer.from(mqttMessage));
	} catch (e) {
		console.error('Error in publishing message', e);
	}
}

const client = mqtt.connect(connectUrl, {
	clientId: MQTT_CLIENT_ID,
	clean: true,
	connectTimeout: 4000,
	username: 'emqx',
	password: 'public',
	reconnectPeriod: 1000,
});

const topic = '/hoanglh/mqtt';

client.on('connect', () => {
	console.log('mqtt connected');
	client.subscribe([topic], () => {
		console.log(`Subscribe to topic '${topic}'`);
	});
});

client.on('message', (topic, payload) => {
	if (JSON.parse(payload).battery < 10) {
		const mqttMessage = `${topic}: Cảnh báo an toàn phòng cháy mức thấp: 10%`;
		connectRabbitMQ(mqttMessage);
	}
});

client.on('error', (error) => {
	console.log(error);
});

app.listen(PORT, () => {
	console.log(`Server connected on port: ${PORT}`);
});
