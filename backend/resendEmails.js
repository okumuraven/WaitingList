const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const { parse } = require('pg-connection-string');
const dns = require('dns');
require('dotenv').config();

// FIX: Force Node.js to use IPv4
dns.setDefaultResultOrder('ipv4first');

// Ensure Environment Variables are set locally
if (!process.env.DATABASE_URL || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("ERROR: Missing DATABASE_URL, EMAIL_USER, or EMAIL_PASS in your local .env file.");
  process.exit(1);
}

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  pool: true, // Use pooled connections for bulk sending
  maxConnections: 1, // Prevent Google rate limits
  maxMessages: 100,
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.trim(),
  }
});

// Database Setup
let url = process.env.DATABASE_URL.trim();
if (url.includes('sslmode=require')) {
  url = url.replace('sslmode=require', 'sslmode=verify-full');
} else if (!url.includes('sslmode=')) {
  url += (url.includes('?') ? '&' : '?') + 'sslmode=verify-full';
}
const config = parse(url);
const poolConfig = {
  user: config.user,
  password: config.password,
  host: config.host,
  port: parseInt(config.port || '5432'),
  database: config.database,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(poolConfig);

const sendWelcomeEmail = async (userEmail) => {
  const mailOptions = {
    from: `"ComradeMarket Kenya" <${process.env.EMAIL_USER.trim()}>`,
    to: userEmail.trim(),
    subject: 'You\'re In! Welcome to the New Student Economy 🇰🇪',
    text: `You're In! Welcome to ComradeMarket Kenya!\n\nYou've just secured your spot on the waitlist for Kenya's most advanced student ecosystem. We're building the infrastructure for your hustle.\n\n© 2026 The Comrade Market Bureau`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #1a1a1a;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-block; background-color: #E53E3E; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
             <span style="font-size: 24px;">🔥</span>
          </div>
          <h1 style="color: #E53E3E; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0;">Comrade<span style="color: #ffffff;">Market</span></h1>
          <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: #4a4a4a; margin-top: 8px;">The Student Standard</p>
        </div>
        
        <h2 style="font-size: 26px; font-weight: 900; text-transform: uppercase; font-style: italic; margin-bottom: 24px; line-height: 1.1;">Welcome to the <span style="color: #E53E3E;">Movement.</span></h2>
        
        <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          You've just secured your spot on the waitlist for Kenya's most advanced student ecosystem. We're building more than just a marketplace—we're building the infrastructure for your hustle.
        </p>
        
        <div style="background-color: #141414; padding: 30px; border-radius: 24px; margin-bottom: 35px; border: 1px solid #262626;">
          <h3 style="color: #ffffff; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; color: #E53E3E;">Upcoming Features:</h3>
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffffff; font-size: 14px;">🛍️ Elite Student Stores</strong>
            <p style="color: #808080; font-size: 13px; margin: 4px 0 0 24px;">Professional storefronts for your campus business.</p>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffffff; font-size: 14px;">🚀 Uber-Style Bidding</strong>
            <p style="color: #808080; font-size: 13px; margin: 4px 0 0 24px;">Real-time delivery logistics powered by Comrades.</p>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #ffffff; font-size: 14px;">🏠 Verified Stays</strong>
            <p style="color: #808080; font-size: 13px; margin: 4px 0 0 24px;">Safe, verified student hostels and rentals.</p>
          </div>
          <div>
            <strong style="color: #ffffff; font-size: 14px;">⚖️ Regional Leadership</strong>
            <p style="color: #808080; font-size: 13px; margin: 4px 0 0 24px;">Lead and moderate the economy in your campus.</p>
          </div>
        </div>
        
        <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin-bottom: 40px; text-align: center;">
          We'll notify you as soon as we drop in your region. <br/><strong>Get ready to own your hustle.</strong>
        </p>
        
        <div style="text-align: center; border-top: 1px solid #1a1a1a; padding-top: 30px;">
          <p style="font-size: 11px; color: #404040; margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 The Comrade Market Bureau</p>
          <p style="font-size: 9px; color: #E53E3E; font-weight: 900; text-transform: uppercase; margin-top: 8px; letter-spacing: 2px;">Nairobi, Kenya</p>
        </div>
      </div>
    `,
    headers: {
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER.trim()}?subject=unsubscribe>`,
      'X-Entity-Ref-ID': Date.now().toString()
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ SUCCESS: Resent email to ${userEmail}`);
  } catch (error) {
    console.error(`❌ FAILURE: Could not send to ${userEmail}:`, error.message);
  }
};

const resendToAll = async () => {
  console.log("Connecting to Database...");
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT email FROM waitlist');
    client.release();

    const emails = result.rows.map(row => row.email);
    console.log(`Found ${emails.length} users in the database.`);
    
    if (emails.length === 0) {
      console.log("No emails found to resend to.");
      process.exit(0);
    }

    console.log("Starting bulk resend...\n");
    for (const email of emails) {
      await sendWelcomeEmail(email);
      // Wait 1 second between emails to prevent Google rate-limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n🎉 All emails have been resent!");
    process.exit(0);
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  }
};

resendToAll();
