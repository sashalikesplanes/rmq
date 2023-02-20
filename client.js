#! /usr/bin/env node

const amqp = require("amqplib");
const uuid = require("uuid");

async function main() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const requestQueueName = "rpc_queue";

    const responseQueueName = (
      await channel.assertQueue("", { exclusive: true })
    ).queue;

    await channel.assertQueue(requestQueueName, { durable: false });

    const correlationId = uuid.v4();

    channel.consume(
      responseQueueName,
      (msg) => {
        if (msg.properties.correlationId !== correlationId) return;
        console.log(`Got response: ${msg.content.toString()}`);
        setTimeout(() => {
          connection.close();
          process.exit();
        });
      },
      { noAck: true }
    );

    channel.sendToQueue(
      requestQueueName,
      Buffer.from(parseInt(process.argv[2]).toString()),
      {
        replyTo: responseQueueName,
        correlationId,
      }
    );
  } catch (e) {
    console.error(e);
    process.exit();
  }
}

main();
