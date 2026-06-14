const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// API Routes
app.post('/api/join', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const query = `INSERT INTO waitlist (email) VALUES (?)`;
  db.run(query, [email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(200).json({ 
          message: 'You are already on the waiting list! Stay tuned.',
          alreadyExists: true 
        });
      }
      return res.status(500).json({ error: 'Internal server error.' });
    }
    
    res.status(201).json({ 
      message: 'Successfully joined the waiting list! Welcome aboard.',
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
