# 🏙️ CivicLens — Smart City Issue Reporting Platform

A full-stack MERN application for reporting, tracking, and resolving civic issues. Citizens report problems, track progress, and authorities manage resolutions — all in one platform.



---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Google Maps API key (for geocoding)

---

## 🚀 Installation & Running Locally

### 1. Clone / Set up the project

```bash
# Navigate to backend
cd civiclens/backend
npm install

# Navigate to frontend
cd ../frontend
npm install
```

### 2. Configure Backend Environment

```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/civiclens
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@civiclens.gov
ADMIN_PASSWORD=Admin@123456
```

### 3. Configure Frontend Environment

```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 4. Seed Admin User (Optional)

```bash
# In backend directory
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({
    fullName: 'Admin User',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin'
  });
  console.log('Admin created:', process.env.ADMIN_EMAIL);
  process.exit(0);
}).catch(console.error);
"
```

### 5. Run the Apps

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

---

### 🔐 Auth Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new citizen |
| POST | `/auth/login` | No | Citizen login |
| POST | `/auth/admin-login` | No | Authority login |
| GET | `/auth/me` | Yes | Get current user |
| PUT | `/auth/profile` | Yes | Update profile |
| PUT | `/auth/change-password` | Yes | Change password |
| DELETE | `/auth/account` | Yes | Delete account |

**POST /auth/register**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": { "_id": "...", "fullName": "John Doe", "role": "citizen" }
}
```

---

### 🚧 Issue Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/issues` | No | Get all issues (filtered) |
| GET | `/issues/stats` | No | Get platform stats |
| GET | `/issues/my-issues` | Yes | Get current user's issues |
| GET | `/issues/:id` | No | Get single issue |
| POST | `/issues` | Yes | Create issue (multipart/form-data) |
| PUT | `/issues/:id` | Yes | Update own issue |
| POST | `/issues/:id/upvote` | Yes | Toggle upvote |

**GET /issues** Query params:
- `status` — Reported | In Review | In Progress | Resolved
- `category` — Road | Water | Electricity | Sanitation | Other
- `search` — text search
- `page`, `limit`

**POST /issues** (multipart/form-data):
```
category: Road
title: Large pothole on Main Street
description: About 2ft wide, causing traffic issues
locationAddress: MG Road, Sector 12
locationLat: 28.6139
locationLng: 77.2090
photo: [file]
draftMode: false
```

---

### 👮 Admin Routes (Admin/Authority only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/issues` | Admin | Get all issues with stats |
| GET | `/admin/issues/:id` | Admin | Get issue detail |
| PUT | `/admin/issues/:id` | Admin | Update status/priority/notes |
| DELETE | `/admin/issues/:id` | Admin | Delete issue |
| GET | `/admin/users` | Admin | Get all users |

**PUT /admin/issues/:id**
```json
{
  "status": "In Progress",
  "priority": "High",
  "resolutionNotes": "Team dispatched, ETA 2 hours",
  "officialMessage": "We've prioritized this repair",
  "officialFrom": "City Council"
}
```

---

### 🔔 Alert Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/alerts` | Yes | Get user alerts |
| POST | `/alerts` | Yes | Create alert |
| PUT | `/alerts/:id/toggle` | Yes | Toggle alert on/off |
| DELETE | `/alerts/:id` | Yes | Remove alert |
| PUT | `/alerts/preferences` | Yes | Update notification prefs |

---

### 📸 Upload Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload/avatar` | Yes | Upload profile photo |
| DELETE | `/upload/avatar` | Yes | Remove profile photo |

---

## 🖥️ App Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Landing | `/` | Public marketing page |
| Login | `/login` | Citizen sign-in |
| Register | `/register` | New account |
| Admin Login | `/admin/login` | Authority portal entry |
| Home | `/home` | Dashboard + stats + recent |
| Report | `/report` | 3-step issue submission |
| Track | `/track` | Issue list + filters |
| Issue Detail | `/track/:id` | Full issue view + timeline |
| Alerts | `/alerts` | Alert settings |
| Profile | `/profile` | User profile + stats |
| Edit Profile | `/profile/edit` | Edit info + change password |
| Admin Dashboard | `/admin` | All issues + management |
| Admin Issue | `/admin/issues/:id` | Status updates + notes |

---

## 🚢 Deployment

### Backend → Render

1. Go to [render.com](https://render.com), create a **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. Add environment variables (all from `.env`)
7. Set `FRONTEND_URL` to your Vercel URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com), import your repo
2. Set **Root Directory** to `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_URL` = your Render backend URL + `/api`
   - `VITE_GOOGLE_MAPS_API_KEY` = your Maps key

### MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add **Network Access** → `0.0.0.0/0` (allow all)
3. Create database user
4. Copy connection string to `MONGODB_URI`

### Cloudinary Setup

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `.env`

### Google Maps API Key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Maps JavaScript API** and **Geocoding API**
3. Create credentials → API Key
4. Restrict key to your domains in production

---

## 🔑 User Roles

| Role | Access |
|------|--------|
| `citizen` | Report, track, upvote, manage own profile |
| `authority` | + Admin dashboard, update issue status |
| `admin` | Full access including delete |

---

## 🎮 Features

- ✅ JWT authentication with 30-day sessions
- ✅ 3-step issue reporting flow
- ✅ GPS geolocation + Google Maps reverse geocoding
- ✅ Cloudinary image uploads (optimized)
- ✅ Issue timeline tracking (Reported → In Review → In Progress → Resolved)
- ✅ Upvote system
- ✅ Alert subscriptions by area/category
- ✅ Gamification (points + levels)
- ✅ Admin portal with status management
- ✅ Official update messages from authorities
- ✅ Dark-themed admin login
- ✅ Draft mode for issues
- ✅ Responsive mobile-first design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Storage | Cloudinary + Multer |
| Maps | Google Maps API (Geocoding) |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Deployment | Vercel (FE) + Render (BE) + MongoDB Atlas |
