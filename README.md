# CampusEats — Smart College Canteen Queue & Ordering System

A full-stack web app that lets students pre-order canteen food, see live queue and seat status,
chat with canteen staff in real time, and get instant announcements — built for the Full Stack
Development mini-project (Pradnyesh Patil, D15B).

## Features

- **Dashboard** with live queue length, waiting time and seat availability
- **Menu** with categories, search and a pre-order cart with pickup tokens
- **Accounts**: register / login with JWT, roles (student, staff, admin), protected pages
- **Admin Panel**: user list, menu stats, and live announcements to every student
- **Live Chat** between students and canteen staff (Socket.IO) with presence and typing indicators
- **Secure API**: bcrypt, JWT, validation, rate limiting, helmet, CORS, NoSQL-injection protection

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Context API |
| Backend | Node.js, Express 5, Socket.IO, Mongoose |
| Database | MongoDB (Atlas in production) |
| DevOps | Docker & Docker Compose, GitHub Actions, Render (API), Vercel (frontend) |

## Run locally

```bash
# Backend (needs MongoDB; copy backend/.env.example to backend/.env first)
cd backend && npm install && npm run seed:admin && npm run dev

# Frontend (set VITE_API_URL if the API is not on http://localhost:5001)
cd frontend && npm install && npm run dev
```

API docs (development only): `http://localhost:<PORT>/api/docs`

## Run with Docker

```bash
docker compose up -d --build   # app: http://localhost:8080, API: http://localhost:5050
docker compose down            # stop (add -v to delete the database volume)
```

## Tests

```bash
cd backend && npm test          # end-to-end API + Socket.IO tests against a throwaway database
cd frontend && npm run lint && npm run build
```

## CI/CD

Every push runs **GitHub Actions** (`.github/workflows/ci.yml`): backend tests against MongoDB,
frontend lint + build, and both Docker image builds. **Render** (`render.yaml`) deploys the API
only after those checks pass, and **Vercel** deploys the frontend from `frontend/`.

```
git push → GitHub Actions (tests, lint, build, Docker) → Render API + MongoDB Atlas → Vercel frontend
```
