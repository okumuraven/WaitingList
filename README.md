# ComradeMarket Kenya - Waiting List

A professional, high-performance "Coming Soon" landing page for ComradeMarket Kenya. 

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, PostgreSQL (via `pg`).

## Deployment Configuration

### Render (Backend)
Set the following environment variables in your Render Web Service:
- `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon).
- `FRONTEND_URL`: Your deployed Vercel URL (e.g., `https://your-app.vercel.app`).
- `EMAIL_USER`: Your Gmail address.
- `EMAIL_PASS`: Your Gmail App Password.
- `PORT`: 5000 (standard, Render will override if needed).

### Vercel (Frontend)
Set the following environment variable in your Vercel project:
- `VITE_API_BASE_URL`: Your deployed Render backend URL (e.g., `https://waitinglist-backend.onrender.com`).

## Data Storage
Emails are stored in a PostgreSQL database. The schema is automatically initialized on the first run of the backend.
