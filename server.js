#! /usr/bin/env node

const amqp = require("amqplib");

async function main() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const requestQueueName = "rpc_queue";

    await channel.assertQueue(requestQueueName, { durable: false });
    channel.prefetch(1);
    console.log("awaiting requests");

    channel.consume(requestQueueName, (msg) => {
      const n = parseInt(msg.content.toString());
      console.log(`Recieved requests for n: ${n}`);
      const r = fib(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId,
      });

      channel.ack(msg);
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}

main();

function fib(n) {
  if (n == 0 || n == 1) return n;
  return fib(n - 1) + fib(n - 2);
}
