import amqp from 'amqplib';
import config from './config/env.js';

async function sendTestEmail() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();

    const queue = config.rabbitmq.emailQueue;
    await channel.assertQueue(queue, { durable: true });

    const message = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email from your email microservice.',
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('✅ Test email message sent to queue');
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error('❌ Error sending test email:', err);
  }
}

sendTestEmail();
