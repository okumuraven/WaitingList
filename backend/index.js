
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const { parse } = require('pg-connection-string');
const dns = require('dns');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.json());

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SMTPS
  auth: {
    user: (process.env.EMAIL_USER || '').trim(),
    pass: (process.env.EMAIL_PASS || '').trim(),
  },
  // EXPERT FIX: Force IPv4 via custom DNS lookup to avoid Render IPv6 issues
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
    console.log('TIP: Ensure your Gmail App Password is correct and 2FA is enabled.');
  } else {
    console.log('SMTP Server is ready.');
  }
});

const sendWelcomeEmail = async (userEmail) => {
  const mailOptions = {
    from: `"ComradeMarket Kenya" <${(process.env.EMAIL_USER || '').trim()}>`,
    to: userEmail.trim(),
    subject: 'You\'re In! Welcome to the New Student Economy 🇰🇪',
    text: `You're In! Welcome to ComradeMarket Kenya!\n\nYou've just secured your spot on the waitlist for Kenya's most advanced student ecosystem. We're building the infrastructure for your hustle.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #1a1a1a;">
        <h1 style="color: #E53E3E;">ComradeMarket</h1>
        <p>Welcome to the movement. You're on the list.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`SUCCESS: Email sent to ${userEmail}`);
  } catch (error) {
    console.error('EMAIL FAILURE:', error.message);
  }
};

// Database Setup (Neon / Generic PostgreSQL)
let poolConfig = {};

if (process.env.DATABASE_URL) {
  let url = process.env.DATABASE_URL.trim();

  // SILENCE SSL WARNING: Explicitly set sslmode to verify-full
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
    ssl: {
      rejectUnauthorized: false,
    },
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
    sendWelcomeEmail(email);
    res.status(201).json({ message: 'Successfully joined!', id: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') return res.status(200).json({ message: 'Already exists.', alreadyExists: true });
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

// Root Route
app.get('/', (req, res) => {
  res.send('ComradeMarket Backend API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
