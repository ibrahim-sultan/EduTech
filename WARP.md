# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This repo is currently a Node.js/Express backend (`server/`) intended to power an EduTech-style application with authentication and course management APIs. A `client/` directory exists but has no tracked files yet; TODOs describe planned React frontend work.

The backend uses:
- Express 5 for HTTP routing
- MongoDB via Mongoose for persistence
- JSON Web Tokens (JWT) for auth
- `dotenv` for environment configuration

## Backend commands (server/)

All commands below assume `pwd` is the repo root (`EduTech`).

- Install backend dependencies:
  - `cd server; npm install`

- Run the API in development (with auto-restart via `nodemon`):
  - `cd server; npm run dev`

- Run the API in production mode:
  - `cd server; npm start`

- Tests:
  - `server/package.json` defines `npm test` as a placeholder that always exits with an error; no test runner is wired up yet. There is currently no way to run a single automated test because no test framework has been configured.

## Environment configuration

The backend reads configuration from environment variables via `dotenv` (see `server/index.js` and `server/middleware/auth.js`). Typical values:

- `PORT` – optional; Express will listen on this port (defaults to `5000`).
- `MONGO_URI` – MongoDB connection string; defaults to `mongodb://localhost:27017/edutech` if unset.
- `JWT_SECRET` – secret key for signing JWTs; defaults to `dev_jwt_secret_change_me` if unset. Override this in real environments.

Place a `.env` file in `server/` or export variables via the shell before running `npm run dev` / `npm start`.

## Backend architecture

### Entry point

- `server/index.js` bootstraps the Express app, applies global middleware, defines a simple `ContactMessage` Mongoose model inline, mounts feature routers, connects to MongoDB, and starts the HTTP server.
- Health and basic routes:
  - `GET /` – returns a plain text "EduTech API is running" message.
  - `GET /api/health` – returns `{ status: 'ok', timestamp: ... }` for simple liveness checks.
  - `POST /api/contact` – creates a `ContactMessage` document from `name`, `email`, and `message` in the request body.

### Data models (Mongoose)

Located in `server/models/`:

- `User.js`
  - Fields: `name`, unique `email`, `passwordHash`, `role` (`student` | `admin`, default `student`).
  - Instance methods:
    - `setPassword(password)` – hashes the password with bcrypt and stores `passwordHash`.
    - `validatePassword(password)` – compares the provided password with `passwordHash`.

- `Course.js`
  - Fields: `title`, `description`, `level` (`beginner` | `intermediate` | `advanced`, default `beginner`), `category` (default `general`).
  - Uses Mongoose timestamps for created/updated times.

### Auth and authorization

Implemented in `server/middleware/auth.js` and used by routes under `server/routes/`.

- Token generation:
  - `generateToken(user)` produces a JWT containing `id`, `role`, and `email`, signed with `JWT_SECRET`, expiring in 7 days.

- Authentication middleware:
  - `authRequired(req, res, next)`
    - Expects a `Bearer <token>` header in `Authorization`.
    - Verifies the JWT, loads the corresponding `User` (excluding `passwordHash`), assigns it to `req.user`, or responds `401` on failure.

- Authorization helper:
  - `requireRole(role)`
    - Returns middleware that checks `req.user.role === role` and responds with `403` if insufficient permissions.

### Route modules

All feature routes are mounted from `server/index.js` using Express routers:

- `server/routes/auth.js` mounted at `/api/auth`
  - `POST /api/auth/register` – register a new user (defaults to role `student`). Ensures `name`, `email`, and `password` are provided, checks for email uniqueness, hashes the password, saves the user, and returns a JWT plus basic user info.
  - `POST /api/auth/login` – login with `email` and `password`. Returns JWT and user info on success; responds with `401` on invalid credentials.
  - `GET /api/auth/me` – returns the current authenticated user (`authRequired` middleware).

- `server/routes/courses.js` mounted at `/api/courses`
  - `GET /api/courses` – list all courses, sorted by `createdAt` descending.
  - `GET /api/courses/:id` – fetch a single course by Mongo `_id`.
  - `POST /api/courses` – create a course; requires `authRequired` and `requireRole('admin')`. Validates presence of `title` and `description`.
  - `PUT /api/courses/:id` – update a course by id; also admin-only via `authRequired` + `requireRole('admin')`.
  - `DELETE /api/courses/:id` – delete a course by id; admin-only.

### Contact messages

- Defined inline in `server/index.js` as `ContactMessage` model with `name`, `email`, and `message` fields plus timestamps.
- `POST /api/contact` uses this model to persist contact/application-style messages.

## Frontend status

- A `client/` directory exists but is currently empty in the tracked code.
- The root `package.json` declares a dependency on `react-router-dom`, and `TODO.md` describes planned React frontend work (routing, auth pages, course listing, dashboards), but no frontend code or scripts are present yet.

## Notes for future changes

- When adding new resource types, follow the existing pattern: create a Mongoose model in `server/models/`, an Express router in `server/routes/`, and mount it from `server/index.js` under an `/api/...` prefix.
- Reuse `authRequired` and `requireRole` from `server/middleware/auth.js` to protect new routes rather than re-implementing auth logic.
- If/when tests are added, prefer wiring them through `server/package.json` scripts (e.g., `npm test`) so they can be run consistently from the `server/` directory.