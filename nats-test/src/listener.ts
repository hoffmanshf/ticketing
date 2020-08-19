import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// client to connect to nats streaming
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // by setting manualAckMode to true,
  // node-nats-streaming will not automatically tell the streaming service event is acknowledged
  const options = stan
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName('accounting-service');

  const subscription = stan.subscribe(
      'ticket:created',
      'queue-group-name',
      options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// intercept terminate requests(Ctrl+C) and close NATS connection before program exits
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
