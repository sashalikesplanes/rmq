#! /usr/bin/env node

const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) throw error0;
  
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;

    const queue = 'hello';
    const message = 'hello wrold';
    
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent: ${message}`);
  });
  
  setTimeout(() => {
    connection.close();
    process.exit()
  }, 500);
});