// testProducer.js
import dotenv from 'dotenv';
import path from 'path';
import amqp from 'amqplib';

dotenv.config({ path: path.resolve('../.env') }); // load your email-service .env

async function testSendWelcomeEmail() {
  try {
    console.log('🧪 Testing Welcome Email with Credentials...\n');

    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert queue with DLX and routing key matching your real queue
    await channel.assertQueue(process.env.EMAIL_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',                     // DLX
        'x-dead-letter-routing-key': process.env.EMAIL_DLQ // DLQ
      }
    });

    // Test data - simulate a new user
    const testUser = {
      type: 'welcome-credentials',
      to: 'your.email@example.com',  // change to your test email
      firstName: 'John',
      lastName: 'Doe',
      matricule: 'MAT001',
      temporaryPassword: 'TempPass123!',
      userId: 'test-user-id-123',
      metadata: {
        userId: 'test-user-id-123',
        matricule: 'MAT001',
        type: 'welcome-credentials',
        timestamp: new Date().toISOString()
      }
    };

    // Send message to queue
    channel.sendToQueue(
      process.env.EMAIL_QUEUE,
      Buffer.from(JSON.stringify(testUser)),
      { persistent: true }
    );

    console.log('✓ Welcome email queued successfully!');
    console.log('📧 Email will be sent to:', testUser.to);
    console.log('👤 User:', `${testUser.firstName} ${testUser.lastName}`);
    console.log('🔑 Matricule:', testUser.matricule);
    console.log('🔐 Temporary Password:', testUser.temporaryPassword);
    console.log('\n📊 Check email service logs to see processing...');

    // Close connection after short delay
    setTimeout(() => {
      connection.close();
      console.log('\n✓ Test completed!');
      process.exit(0);
    }, 500);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSendWelcomeEmail();
