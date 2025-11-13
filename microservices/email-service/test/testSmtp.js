import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../.env') });
import nodemailer from 'nodemailer';

async function testSmtpConnection() {
  console.log('🧪 Testing SMTP Connection...\n');

  console.log('Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  Secure:', process.env.SMTP_SECURE === 'true');
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error('Error:', error.message);
  }
}

testSmtpConnection();
