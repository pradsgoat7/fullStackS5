# Experiment 1 Tasks

## Setup

- [x] Create React Project
- [x] Configure Tailwind CSS
- [x] Create PRD
- [x] Create Design Document

---

## Layout

- [x] Create Dashboard Layout
- [x] Create Sidebar
- [x] Create Top Navigation

---

## Dashboard

- [x] Queue Status Cards
- [ ] Categories
- [x] Featured Food
- [ ] Active Order Card
- [x] Announcements
- [ ] Recent Orders

---

## Responsive Design

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

## Polish

- [x] Icons
- [x] Hover Effects
- [x] Loading States

---

# Experiment 2 Tasks

## React Hooks

- [x] Reusable custom hooks (`useCart`, `useMenuItems`, `useForm`)
- [x] Data fetching (`useMenuItems` simulates an async load against mock data, with loading and error states)
- [x] Forms (`CheckoutForm` — Pre-Order checkout with field validation, inline errors, and a submit flow)

---

# Experiment 3 Tasks

## Context API

- [x] Manage cart state globally with `CartContext` (`CartProvider` + `useCart`)
- [x] Fix cart not syncing between Dashboard and Menu pages (previously two independent `useCart` instances)
- [ ] Manage login state globally
- [ ] Manage other shared application data globally
---

# Experiment 4 Tasks

## REST API (Express + MongoDB)

- [x] Express server with MongoDB (Mongoose) connection
- [x] `Food` model
- [x] CRUD routes for `/api/foods` (create, read all, read by id, update, delete)

---

# Experiment 5 Tasks

## Secure, Production-Ready REST APIs

- [x] `User` model with roles (`student`, `staff`, `admin`) and bcrypt password hashing
- [x] Register / Login with JWT (`/api/auth/register`, `/api/auth/login`)
- [x] Protected route with Bearer token (`/api/auth/profile`)
- [x] Role-based access: food create/update/delete and `/api/users` are admin-only
- [x] Input validation with express-validator (400 with field errors)
- [x] Rate limiting (global + stricter limit on auth endpoints → 429)
- [x] Security headers with helmet, CORS restricted to the frontend origin
- [x] Central error handling (no stack traces leaked; 400/404/409 mapped properly)
- [x] NoSQL injection protection (`sanitizeFilter`, string-only auth fields)
- [x] Secrets in `.env` (gitignored) with `.env.example`
- [x] Admin seeding script (`npm run seed:admin`)

---

# Experiment 6 Tasks

## Authentication & Authorization (JWT) with UI

- [x] Distinct 401 messages for missing, invalid and expired tokens
- [x] Protected student route (`/api/dashboard`) and admin-only route (`/api/admin`)
- [x] Interactive API docs with Swagger UI (`/api/docs`, development only)
- [x] Login and Registration pages connected to the backend
- [x] Manage login state globally (`AuthProvider` + `useAuth`), token kept in localStorage
- [x] Protected routes in the frontend (`ProtectedRoute`, `PublicOnlyRoute`)
- [x] Role-based UI: Admin Panel only for admins, Access Denied (403) page for others
- [x] Expired session logs the user out and explains why on the login page

---

# Experiment 7 Tasks

## Containerization with Docker

- [x] `backend/Dockerfile` — production Node image (`npm ci --omit=dev`, non-root user, healthcheck)
- [x] `frontend/Dockerfile` — multi-stage build (Node builds the app, nginx serves it)
- [x] `frontend/nginx.conf` — SPA fallback for React Router and `/api` reverse proxy to the backend
- [x] `.dockerignore` files so `node_modules` and `.env` never enter an image
- [x] `docker-compose.yml` — MongoDB + backend + frontend, healthchecks, persistent volume
- [x] Secrets passed at runtime from `backend/.env` (never baked into images)
- [x] Build, run, and verify the containerized app (frontend on :8080, API on :5050)

---

# Experiment 8 Tasks

## Real-Time Communication Using WebSockets (Socket.IO)

- [x] Socket.IO server sharing the Express HTTP server (`backend/socket.js`)
- [x] Socket connections authenticated with the user's JWT (forged/expired tokens rejected at handshake)
- [x] Canteen Live Chat (`/chat`): instant two-way messaging between students and canteen staff/admin
- [x] Online users (presence) and typing indicators
- [x] Chat history stored in MongoDB (`Message` model) and loaded when the chat opens
- [x] Server-side message validation and per-socket flood limit
- [x] Live announcements: admin posts in the Admin Panel, every dashboard updates instantly (`Announcement` model)
- [x] Server logs for connections, broadcasts and rejections
- [x] nginx WebSocket proxying so real-time features also work in Docker

---

# Mini Project: Testing, CI/CD & Deployment

- [x] Automated end-to-end API + Socket.IO tests (`backend/tests`, `npm test`)
- [x] GitHub Actions pipeline: backend tests, frontend lint & build, Docker image builds
- [x] Render Blueprint for the API (`render.yaml`), deploys only after checks pass
- [x] Vercel config for the frontend (`frontend/vercel.json`, SPA routing)
- [ ] Backend live on Render with MongoDB Atlas
- [ ] Frontend live on Vercel

---

# Orders, Order Tracking & Profile

- [x] `Order` model; orders saved in MongoDB with a server-generated pickup token
- [x] Menu loaded from the database (`/api/foods`); prices and stock always checked on the server
- [x] Stock reserved when ordering and restored on cancel; sold-out / low-stock labels on the menu
- [x] My Orders: live status tracker (placed → preparing → ready) over Socket.IO, cancel while "placed"
- [x] Order History: collected and cancelled orders with totals
- [x] Profile: details, order stats, edit name, change password
- [x] Admin live order queue to move orders through each status
- [x] Dashboard queue length and waiting time from real orders; active-order banner
- [x] Shared `FoodCard` component replaces the duplicated menu card markup
- [x] API tests for orders and profile (23 tests)
