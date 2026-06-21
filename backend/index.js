const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const { parse } = require('pg-connection-string');
const dns = require('dns');
// FIX: Force Node.js to use IPv4. Render struggles with IPv6 SMTP (ENETUNREACH).
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow all origins for Vercel/Render compatibility
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());
// Email Transporter Setup
const transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 1,
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').trim(),
  },
  lookup: (hostname, options, callback) => {
    // Ultimate Render Fix: Force IPv4 directly at the socket level
    dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP VERIFICATION ERROR:', error.message);
    console.error('FULL ERROR INFO:', error);
  } else {
    console.log('SMTP Server is ready to send emails.');
  }
});

const sendWelcomeEmail = async (userEmail) => {
  const mailOptions = {
    from: `"Okumu from ComradeMarket" <${(process.env.EMAIL_USER || '').trim()}>`,
    to: userEmail.trim(),
    subject: 'Welcome to the ComradeMarket waitlist 👋',
    text: `Hey there!\n\nThis is Okumu, the founder of ComradeMarket. I just saw you joined our waitlist, and I wanted to personally welcome you.\n\nWe're working day and night to build Kenya's ultimate student ecosystem.\n\nReply to this email and let me know which campus you are from! I try to read every single reply.\n\nOkumu Joseph • ComradeMarket Kenya`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #1a1a1a;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="display: inline-block; background-color: #E53E3E; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
             <span style="font-size: 24px;">🔥</span>
          </div>
          <h1 style="color: #E53E3E; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0;">Comrade<span style="color: #ffffff;">Market</span></h1>
        </div>
        
        <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 24px; line-height: 1.2;">Hey there!</h2>
        
        <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          This is Okumu, the founder of ComradeMarket. I just saw you joined our waitlist, and I wanted to personally welcome you.<br><br>
          We're working day and night to build Kenya's ultimate student ecosystem—from professional student storefronts to verified campus rentals.
        </p>
        
        <div style="background-color: #141414; padding: 25px; border-radius: 20px; margin-bottom: 35px; border: 1px solid #262626;">
          <p style="color: #e0e0e0; font-size: 15px; line-height: 1.6; margin: 0;">
            We'll notify you as soon as we drop in your region.<br><br>
            <strong>P.S. Reply to this email and let me know which campus you are from! I try to read every single reply.</strong>
          </p>
        </div>
        
        <div style="text-align: left; border-top: 1px solid #1a1a1a; padding-top: 30px;">
          <p style="font-size: 13px; color: #808080; margin: 0;"><strong>Okumu Joseph</strong><br>Founder, ComradeMarket Kenya</p>
        </div>
      </div>
    `,
    headers: {
      'List-Unsubscribe': `<mailto:${(process.env.EMAIL_USER || '').trim()}?subject=unsubscribe>`,
      'X-Entity-Ref-ID': Date.now().toString()
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`SUCCESS: Email sent to ${userEmail}. ID: ${info.messageId}`);
  } catch (error) {
    console.error('EMAIL FAILURE:', error.message);
  }
};

// Database Setup (Neon)
let poolConfig = {};
if (process.env.DATABASE_URL) {
  let url = process.env.DATABASE_URL.trim();
  if (url.includes('sslmode=require')) {
    url = url.replace('sslmode=require', 'sslmode=verify-full');
  } else if (!url.includes('sslmode=')) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=verify-full';
  }
  const config = parse(url);
  poolConfig = {
    user: config.user,
    password: config.password,
    host: config.host,
    port: parseInt(config.port || '5432'),
    database: config.database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    max: 10
  };
}

const pool = new Pool(poolConfig);

const initDb = async () => {
  console.log('Initializing Database...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL.');
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        user_type TEXT DEFAULT 'Buyer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    console.log('Schema verified.');
  } catch (err) {
    console.error('Database Connection Error:', err.message);
  }
};

initDb();

// API Routes
app.post('/api/join', async (req, res) => {
  const { email, userType } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const query = `INSERT INTO waitlist (email, user_type) VALUES ($1, $2) RETURNING id`;
  try {
    const result = await pool.query(query, [email, userType || 'Buyer']);
    // Send email for new signups
    sendWelcomeEmail(email);
    res.status(201).json({ message: 'Successfully joined!', id: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') {
      // EVEN IF THEY EXIST, let's send them the welcome email again so the user can verify it works
      sendWelcomeEmail(email);
      return res.status(200).json({ message: 'Already on the list! Resending your welcome email.', alreadyExists: true });
    }
    console.error('Insert Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

// Administrative Metrics API
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const stats = { total: 0, last24h: 0, topUniversities: [], recentSignups: [], segments: {} };
    const queries = [
      pool.query("SELECT COUNT(*) as count FROM waitlist").then(res => stats.total = parseInt(res.rows[0].count)),
      pool.query("SELECT user_type, COUNT(*) as count FROM waitlist GROUP BY user_type").then(res => {
        res.rows.forEach(r => stats.segments[r.user_type] = parseInt(r.count));
      }),
      pool.query("SELECT COUNT(*) as count FROM waitlist WHERE created_at >= NOW() - INTERVAL '1 day'").then(res => stats.last24h = parseInt(res.rows[0].count))
    ];
    await Promise.all(queries);
    res.json(stats);
  } catch (err) {
    console.error('Metrics Error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.get('/', (req, res) => {
  res.send('ComradeMarket Backend API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
