const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

const sendWelcomeEmail = async (userEmail) => {
  const mailOptions = {
    from: {
      name: 'ComradeMarket Kenya',
      address: process.env.EMAIL_USER.trim()
    },
    to: userEmail.trim(),
    subject: 'You\'re In! Welcome to the New Student Economy 🇰🇪',
    text: `You're In! Welcome to ComradeMarket Kenya!\n\nYou've just secured your spot on the waitlist for Kenya's most advanced student ecosystem. We're building the infrastructure for your hustle.\n\nUpcoming Features:\n- Elite Student Stores\n- Uber-Style Bidding\n- Verified Stays\n- Regional Leadership\n\nWe'll notify you as soon as we drop in your region.\n\n© 2026 The Comrade Market Bureau`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`SUCCESS: Email sent to ${userEmail}. MessageID: ${info.messageId}`);
  } catch (error) {
    console.error('CRITICAL EMAIL FAILURE:', error);
  }
};

// SQLite Database Setup
const dbPath = path.resolve(__dirname, 'waitlist.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      user_type TEXT DEFAULT 'Buyer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// API Routes
app.post('/api/join', (req, res) => {
  const { email, userType } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const query = `INSERT INTO waitlist (email, user_type) VALUES (?, ?)`;
  db.run(query, [email, userType || 'Buyer'], async function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(200).json({ 
          message: 'You are already on the waiting list! Stay tuned.',
          alreadyExists: true 
        });
      }
      return res.status(500).json({ error: 'Internal server error.' });
    }
    
    // Send Welcome Email asynchronously
    sendWelcomeEmail(email);

    res.status(201).json({ 
      message: 'Successfully joined the waiting list! Check your inbox.',
      id: this.lastID 
    });
  });
});

// For health checks
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve frontend in production (optional for now, but good to have)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Administrative Metrics API (For Investor Pitching)
app.get('/api/admin/metrics', (req, res) => {
  const stats = {
    total: 0,
    last24h: 0,
    topUniversities: [],
    recentSignups: [],
    segments: {}
  };

  const queries = [
    // Total signups
    new Promise((resolve) => {
      db.get("SELECT COUNT(*) as count FROM waitlist", (err, row) => {
        stats.total = row ? row.count : 0;
        resolve();
      });
    }),
    // User Segments breakdown
    new Promise((resolve) => {
      db.all("SELECT user_type, COUNT(*) as count FROM waitlist GROUP BY user_type", (err, rows) => {
        (rows || []).forEach(r => {
          stats.segments[r.user_type] = r.count;
        });
        resolve();
      });
    }),
    // Last 24 hours
    new Promise((resolve) => {
      db.get("SELECT COUNT(*) as count FROM waitlist WHERE created_at >= datetime('now', '-1 day')", (err, row) => {
        stats.last24h = row ? row.count : 0;
        resolve();
      });
    }),
    // Domain breakdown (Universities)
    new Promise((resolve) => {
      db.all("SELECT SUBSTR(email, INSTR(email, '@') + 1) as domain, COUNT(*) as count FROM waitlist GROUP BY domain ORDER BY count DESC LIMIT 5", (err, rows) => {
        stats.topUniversities = rows || [];
        resolve();
      });
    }),
    // Recent activity (Last 5, masked for privacy)
    new Promise((resolve) => {
      db.all("SELECT email, created_at, user_type FROM waitlist ORDER BY created_at DESC LIMIT 5", (err, rows) => {
        stats.recentSignups = (rows || []).map(r => ({
          maskedEmail: r.email.split('@')[0].substring(0, 3) + '***@' + r.email.split('@')[1],
          time: r.created_at,
          userType: r.user_type
        }));
        resolve();
      });
    })
  ];

  Promise.all(queries).then(() => {
    res.json(stats);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
