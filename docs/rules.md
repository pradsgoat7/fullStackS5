# Project Rules

## General

- Build the project incrementally.
- Never generate the entire application at once.
- Complete one task before moving to the next.
- Keep the code clean, modular, and reusable.

---

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Lucide React Icons

---

## Styling

- Follow the design described in `design.md`.
- Use Tailwind CSS only.
- Avoid inline styles.
- Keep the UI clean and modern.
- Desktop-first design with responsive behavior.

---

## Components

- Create reusable components.
- Keep components small and focused.
- Avoid duplicate code.

---

## Code Style

- Use functional components.
- Use TypeScript interfaces for props.
- Keep files organized.
- Use meaningful names.

---

## Data

For Experiment 1,

- Do NOT create APIs.
- Do NOT connect MongoDB.
- Do NOT implement authentication.
- Use dummy data only.

---

## Scope

For this experiment only build:

- Dashboard
- Sidebar
- Navbar
- Food Cards
- Categories
- Queue Status
- Active Order
- Announcements
- Recent Orders

Do not implement backend functionality.

---

## Experiment 2

For Experiment 2,

- Do NOT create APIs.
- Do NOT connect MongoDB.
- Do NOT implement authentication.
- Simulate data fetching with mock data and custom hooks instead of a real backend.

Scope for this experiment:

- Reusable custom hooks
- Mock data fetching (with loading and error states)
- Forms with validation (Pre-Order checkout)

Do not implement backend functionality.

---

## Experiment 3

For Experiment 3,

- Do NOT create APIs.
- Do NOT connect MongoDB.
- Do NOT implement real authentication.
- Use the Context API (not Redux) to manage shared state.

Scope for this experiment:

- Manage cart state globally with Context API, replacing the per-page `useCart` hook so cart contents stay in sync across the Dashboard and Menu pages.

Do not implement backend functionality.
---

## Experiment 5

For Experiment 5,

- Build on the existing backend in `backend/` — do NOT create a separate project.
- Use JWT for authentication and bcrypt for password hashing.
- Keep secrets in `backend/.env` only; never commit it.
- Never accept `role` from the request body; admins are created with `npm run seed:admin`.

Scope for this experiment:

- Register, login, and protected profile endpoints
- Role-based authorization on admin-only endpoints
- Input validation, rate limiting, security headers, and safe error handling

Do not connect the frontend to the backend yet.

---

## Experiment 6

For Experiment 6,

- Connect the frontend to the backend for authentication only (login, register, protected data).
- Use the Context API for login state (`AuthProvider` + `useAuth`); no Redux.
- The API base URL comes from `VITE_API_URL` (see `frontend/.env.example`).
- Never trust the UI for security: every protected page must also be protected by the API.

Scope for this experiment:

- Login and Registration UI with validation and server error messages
- Protected and admin-only routes in both the API and the UI
- Clear handling of missing, invalid and expired JWTs

---

## Experiment 7

For Experiment 7,

- Containerize the existing project; do not change application features.
- One `docker compose up -d --build` must start the whole stack (database, API, web app).
- Never copy `.env` into an image; pass secrets at runtime with `env_file`.
- Host ports: web app 8080, API 5050 (port 5000 is taken by macOS AirPlay Receiver).

Scope for this experiment:

- Dockerfiles for frontend and backend, `.dockerignore`, `docker-compose.yml`
- Building images, running containers, and verifying the app in the browser

---

## Experiment 8

For Experiment 8,

- Use Socket.IO on the existing backend (same HTTP server and port as the REST API).
- Every socket must authenticate with the same JWT as the REST API; never trust a client-supplied name or role.
- Validate and rate-limit every client event on the server.
- Keep one socket per logged-in session (`SocketProvider` + `useSocket`).

Scope for this experiment:

- Live Chat between students and canteen staff/admin, with presence and typing indicators
- Live announcements pushed from the Admin Panel to every connected dashboard

---

## Mini Project (CI/CD & Deployment)

- Every push must pass GitHub Actions (backend tests, frontend lint + build, Docker builds).
- Secrets (MONGO_URI, JWT_SECRET) live only in Render/Vercel settings, never in the repo.
- Production: API on Render (`render.yaml`), frontend on Vercel (`frontend/`), database on MongoDB Atlas.

---

## Mini Project (CI/CD & Deployment)

- Every push must pass GitHub Actions (backend tests, frontend lint + build, Docker builds).
- Secrets (MONGO_URI, JWT_SECRET) live only in Render/Vercel settings, never in the repo.
- Production: API on Render (`render.yaml`), frontend on Vercel (`frontend/`), database on MongoDB Atlas.
