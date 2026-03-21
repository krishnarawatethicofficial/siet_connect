# SIET Connect

**Unified student platform for State Institute of Engineering & Technology, Panchkula**

> One app for academics, placements, and campus services — built for every student, including those with accessibility needs.

---

## Tech Stack

| Layer      | Technology                                                    |
| ---------- | ------------------------------------------------------------- |
| Backend    | Node.js, Express, MongoDB Atlas, Mongoose, Socket.io, JWT     |
| Frontend   | React 18, Vite, Tailwind CSS v3, DaisyUI (night theme)       |
| State      | Zustand                                                       |
| Icons      | Lucide React                                                  |
| Real-time  | Socket.io (live presence, upvotes, alerts)                    |
| Rate Limit | Upstash Redis (sliding window)                                |
| Auth       | JWT httpOnly cookies, bcryptjs                                |

---

## Features

### Core (MVP)
- **PYQ Repository** — Searchable, branch + semester filters, download tracking
- **Notice Board** — Real-time with live upvotes (Socket.io), auto-tagging, category filters
- **Attendance Alerts** — Dashboard warning when below 75% threshold
- **Placement Board** — Internship/job listings, upvote ranking, apply links

### Showstoppers
- **Live Upvote Counter** — Socket.io pushes urgent items to top
- **Real-Time Presence** — "X users active now" with live avatars
- **Activity Heatmap** — GitHub-style 30-day usage visualization
- **Streak System** — Daily login XP + leaderboard
- **Smart Auto-Tagging** — Keyword extraction from content

### Accessibility (WCAG 2.0 AA)
- Skip to Main Content link
- Text size controls (Small / Medium / Large)
- High Contrast mode toggle
- Wide letter spacing for dyslexia support
- Light / Dark mode toggle
- Full keyboard navigation with visible focus indicators
- ARIA labels on all interactive elements
- Screen reader compatible semantic HTML
- Color-blind safe design

### Full Feature List
- Auth (signup with Student ID, login, JWT)
- Smart Dashboard (schedule, attendance, notices, quick actions)
- Academics (syllabus, PYQs, faculty profiles, lab manuals, calendar)
- Placements (job board, stats, alumni network, interview prep, TPO booking)
- Campus Life (events RSVP, clubs, hackathons, gallery, sports, canteen menu, campus map)
- Services (document requests, hostel/mess menu, bus routes, lost & found, scholarships, ID card, FAQ)
- Admin Panel (stats, post notices/placements/PYQs, manage documents, manage users/roles)
- Leaderboard (XP ranking, streak tracking, activity heatmap)
- Profile (edit details, view stats)

---

## Project Structure

```
siet-connect/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── config/        (db.js, upstash.js)
│   │   ├── models/        (user, notice, placement, document, pyq)
│   │   ├── controllers/   (auth, notice, placement, document, pyq, admin, leaderboard)
│   │   ├── routes/        (auth, notice, placement, document, pyq, admin, leaderboard)
│   │   ├── middleware/    (auth, ratelimit, validate)
│   │   └── utils/         (autoTag, token)
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/    (Navbar, Spinner, EmptyState, ConfirmModal, ProtectedRoute)
│   │   ├── pages/         (Landing, Login, Signup, Dashboard, Academics, Placements, Campus, Services, Profile, Admin, Leaderboard)
│   │   ├── store/         (authStore, accessibilityStore)
│   │   ├── hooks/         (useDebounce, useSocket)
│   │   ├── lib/           (axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Upstash Redis account (for rate limiting)

### Environment Variables

Create `backend/.env`:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=your_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
NODE_ENV=development
```

### Install & Run

```bash
# From root
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Run both (from root)
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`

---

## Deployment

### Backend → Render

1. Create new Web Service on Render
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables
6. Set `NODE_ENV=production` and `CLIENT_URL` to your Vercel URL

### Frontend → Vercel

1. Import repo on Vercel
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variable if needed

---

## API Endpoints

| Method | Route                        | Auth     | Description              |
| ------ | ---------------------------- | -------- | ------------------------ |
| POST   | /api/auth/signup             | Public   | Register                 |
| POST   | /api/auth/login              | Public   | Login                    |
| POST   | /api/auth/logout             | Public   | Logout                   |
| GET    | /api/auth/me                 | Protected| Get current user         |
| PUT    | /api/auth/profile            | Protected| Update profile           |
| GET    | /api/notices                 | Protected| Get all notices          |
| POST   | /api/notices                 | Admin    | Create notice            |
| PUT    | /api/notices/:id/upvote      | Protected| Upvote notice            |
| GET    | /api/placements              | Protected| Get placements           |
| GET    | /api/placements/stats        | Protected| Get placement stats      |
| POST   | /api/placements              | Admin    | Create placement         |
| PUT    | /api/placements/:id/upvote   | Protected| Upvote placement         |
| GET    | /api/documents/mine          | Protected| My document requests     |
| GET    | /api/documents/all           | Admin    | All requests             |
| POST   | /api/documents               | Protected| Create request           |
| PUT    | /api/documents/:id/status    | Admin    | Update request status    |
| GET    | /api/pyqs                    | Protected| Get PYQs                 |
| POST   | /api/pyqs                    | Admin    | Upload PYQ               |
| PUT    | /api/pyqs/:id/download       | Protected| Track download           |
| GET    | /api/admin/stats             | Admin    | Dashboard stats          |
| GET    | /api/admin/users             | Admin    | Get all users            |
| PUT    | /api/admin/users/:id/role    | Admin    | Update user role         |
| GET    | /api/leaderboard             | Protected| XP leaderboard           |
| GET    | /api/leaderboard/activity    | Protected| Activity heatmap data    |

---

## Screenshots

> Screenshots placeholder — add after first deployment

---

## License

Built for SIET Panchkula. For educational and demonstration purposes.
