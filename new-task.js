#! /usr/bin/env node

const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) throw error0;
  
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;

    const queue = 'task-queue';
    const message = process.argv.slice(2).join(' ') || 'Hello';
    
    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Sent: ${message}`);
  });
  
  setTimeout(() => {
    connection.close();
    process.exit()
  }, 100);
});