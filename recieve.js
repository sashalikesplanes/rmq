#! /usr/bin/env node

const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) throw error0;
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;
    const queue  = 'hello';
    channel.assertQueue(queue, { durable: false });
    
    console.log(`Listening for messages in queue: ${queue}`);
    channel.consume(queue, function(msg) {
      console.log(`Recieved message: ${msg.content.toString()}`);
    }, { noAck: true });
  })
})