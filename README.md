# ComradeMarket Kenya - Waiting List

A professional, high-performance "Coming Soon" landing page for ComradeMarket Kenya. 

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, SQLite.

## Project Structure
- `frontend/`: The React application.
- `backend/`: The Express server and SQLite database.

## Getting Started

### 1. Install Dependencies
```bash
# In the root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run Development Servers
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
node index.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Production Deployment
1. Build the frontend: `cd frontend && npm run build`.
2. Start the backend in production mode: `cd backend && NODE_ENV=production node index.js`.
3. The backend will serve the static React files from `frontend/dist`.

## Data Storage
All emails are stored in `backend/waitlist.db` (SQLite).
