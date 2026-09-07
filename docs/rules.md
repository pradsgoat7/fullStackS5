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