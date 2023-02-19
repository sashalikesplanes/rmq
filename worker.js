#! /usr/bin/env node

const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) throw error0;
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1;
    const queue  = 'task-queue';
    channel.assertQueue(queue, { durable: true });
    
    console.log(`Listening for messages in queue: ${queue}`);
    channel.consume(queue, function(msg) {
      const seconds = msg.content.toString().split('.').length - 1;
      console.log(`Recieved message: ${msg.content.toString()}`);
      setTimeout(() => {console.log(`Done`); channel.ack(msg)}, seconds * 1000);
    }, { noAck: false });
  })
})