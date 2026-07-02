# CodeVerse — Frontend

This folder contains the frontend SPA for CodeVerse built with React and Vite. The app uses Clerk for authentication and expects a Clerk publishable key to be provided via Vite environment variables.

## Quick Overview
- Framework: React (Vite)
- Auth: Clerk (`@clerk/clerk-react`)
- State: React + `@tanstack/react-query`
- Styling: TailwindCSS (and DaisyUI)

## Environment
Create a `.env` or `.env.local` file inside `frontend/` with the following variable:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Notes:
- `frontend/src/main.jsx` will throw an error if `VITE_CLERK_PUBLISHABLE_KEY` is not set.
- Vite exposes env variables prefixed with `VITE_` to the client bundle.

## Scripts
From the `frontend/` folder you can use the scripts defined in `package.json`:

- `npm run dev` — start the Vite dev server (default: `http://localhost:5173`)
- `npm run build` — build the production assets into `dist/`
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint across the project

## Development — Run Locally
Open a PowerShell terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

To run frontend and backend together during development, open two terminals and run the backend dev server (from `backend/`) alongside the frontend dev server.

Example (two terminals):

Terminal 1 — Backend:
```powershell
cd d:\CodeVerse\backend
npm install
npm run dev
```

Terminal 2 — Frontend:
```powershell
cd d:\CodeVerse\frontend
npm run dev
```

The backend `CLIENT_URL` env var should point to your frontend (for example `http://localhost:5173`) so CORS works correctly.

## Production Build
Build frontend and serve via the backend (root scripts can help):

From repo root:
```powershell
npm run build
npm start
```

This will run the root `build` script which installs deps and builds `frontend/`, then `npm start` runs the backend server. When `NODE_ENV=production` and `frontend/dist` exists, the backend serves the static files.

## Tips
- Commit a `.env.example` (without secrets) for onboarding.
- When debugging Clerk, ensure the publishable key belongs to the correct project and that the Clerk application origin includes your dev URL.
- Use `vite` options or `--port` if you need a different dev port.

## Contributing
Make changes on a feature branch, run `npm run lint` and ensure the app builds with `npm run build` before opening a PR.
