import amqp, { Connection, Channel } from 'amqplib';

export async function connectRabbitMQ(): Promise<Connection> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    console.log('Connected to RabbitMQ');
    return connection;
  } catch (error) {
    console.log(`Failed to connect to RabbitMQ: ${error}`);
    process.exit(1);
  }
}

export async function createChannel(connection: Connection): Promise<Channel> {
  try {
    const channel = await connection.createChannel();
    console.log('Channel created successfully');
    return channel;
  } catch (error) {
    console.log(`Failed to create channel: ${error}`);
    process.exit(1);
  }
}

export async function sendMessage(queue: string, message: any) {
  const connection = await connectRabbitMQ();
  const channel = await createChannel(connection);
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`Message sent successfully to ${queue}`);
}

export async function receiveMessage(queue: string, handleMessage: (message: any) => any) {
  const connection = await connectRabbitMQ();
  const channel = await createChannel(connection);
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, (message) => {
    const content = JSON.parse(message?.content.toString() || '{}');
    console.log(`Message received from queue ${queue}: ${content}`);
    handleMessage(content);
  }, { noAck: true });
}
