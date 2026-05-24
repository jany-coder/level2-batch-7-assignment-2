# DevPulse API

An internal tech issue & feature tracker — a collaborative backend for software teams to report bugs, suggest features, and coordinate resolutions.

## Live URL

- **API Base:** _add your deployed URL here_
- **Repository:** _add your GitHub repo URL here_

## Features

- JWT-based authentication with role-based access (`contributor`, `maintainer`)
- Secure password hashing with bcrypt
- Create, read, update, and delete issues (bugs or feature requests)
- Filter issues by `type` and `status`, sort by `newest` or `oldest`
- Ownership and status-aware update permissions
- Maintainer-only delete enforcement
- Raw SQL access via `pg` driver (no ORMs, no JOINs)
- Consistent JSON response envelope for success and error cases

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Runtime      | Node.js (LTS)                    |
| Language     | TypeScript                       |
| Framework    | Express.js (modular routers)     |
| Database     | PostgreSQL (native `pg` driver)  |
| Auth         | `jsonwebtoken` + `bcrypt`        |
| Config       | `dotenv`                         |
| Dev tooling  | `tsx`, `prettier`                |

## Project Structure

```
src/
├── app.ts                  # Express app, middleware, route mounting
├── server.ts               # Bootstraps DB and starts the HTTP server
├── config/                 # Loads env vars
├── db/                     # PG pool + table initialization
├── middleware/             # JWT auth + role guard
├── modules/
│   ├── auth/               # signup / login (controller, service, route)
│   └── issue/              # CRUD for issues
└── utility/                # Shared response helper
```

## Setup

### 1. Prerequisites

- Node.js 20+ (24.x recommended)
- A PostgreSQL database (NeonDB / Supabase / local Postgres)

### 2. Install

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
CONNECTION_STRING=postgres://user:password@host:5432/devpulse
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
```

### 4. Run

```bash
npm run dev      # start dev server with hot reload (tsx watch)
npm run build    # compile TypeScript to dist/
npm start        # run the compiled server
```

On first boot the server creates the `users` and `issues` tables automatically if they do not exist.

## Database Schema

### `users`

| Column       | Type                  | Notes                                           |
| ------------ | --------------------- | ----------------------------------------------- |
| `id`         | `SERIAL PRIMARY KEY`  | Auto-incrementing                               |
| `name`       | `VARCHAR(100)`        | Required                                        |
| `email`      | `VARCHAR(255) UNIQUE` | Required, unique                                |
| `password`   | `TEXT`                | bcrypt hash, never returned                     |
| `role`       | `VARCHAR(20)`         | `contributor` (default) or `maintainer`         |
| `created_at` | `TIMESTAMPTZ`         | Defaults to `NOW()`                             |
| `updated_at` | `TIMESTAMPTZ`         | Refreshed on update                             |

### `issues`

| Column         | Type                  | Notes                                                  |
| -------------- | --------------------- | ------------------------------------------------------ |
| `id`           | `SERIAL PRIMARY KEY`  | Auto-incrementing                                      |
| `title`        | `VARCHAR(150)`        | Required                                               |
| `description`  | `TEXT`                | Required, minimum 20 characters                        |
| `type`         | `VARCHAR(20)`         | `bug` or `feature_request`                             |
| `status`       | `VARCHAR(20)`         | `open` (default), `in_progress`, or `resolved`         |
| `reporter_id`  | `INTEGER`             | References `users.id` (validated in application logic) |
| `created_at`   | `TIMESTAMPTZ`         | Defaults to `NOW()`                                    |
| `updated_at`   | `TIMESTAMPTZ`         | Refreshed on update                                    |

## API Endpoints

Base URL: `/api`

### Auth

| Method | Endpoint            | Access | Description                       |
| ------ | ------------------- | ------ | --------------------------------- |
| POST   | `/api/auth/signup`  | Public | Register a new user               |
| POST   | `/api/auth/login`   | Public | Authenticate and receive a JWT    |

### Issues

| Method | Endpoint            | Access                 | Description                                            |
| ------ | ------------------- | ---------------------- | ------------------------------------------------------ |
| GET    | `/api/issues`       | Public                 | List issues (supports `sort`, `type`, `status` query)  |
| GET    | `/api/issues/:id`   | Public                 | Get a single issue with reporter info                  |
| POST   | `/api/issues`       | Authenticated          | Create a new issue                                     |
| PATCH  | `/api/issues/:id`   | Owner (open) / Maint.  | Update title / description / type                      |
| DELETE | `/api/issues/:id`   | Maintainer             | Delete an issue                                        |

**Authorization header for protected routes**

```
Authorization: <JWT_TOKEN>
```

### Query parameters for `GET /api/issues`

| Param    | Values                                | Default  |
| -------- | ------------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                    | `newest` |
| `type`   | `bug`, `feature_request`              | —        |
| `status` | `open`, `in_progress`, `resolved`     | —        |

## Response Format

**Success**

```json
{
  "success": true,
  "message": "Operation description",
  "data": { }
}
```

**Error**

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

## HTTP Status Codes

| Code | Usage                                                |
| ---- | ---------------------------------------------------- |
| 200  | Successful GET / PATCH / DELETE                      |
| 201  | Resource created                                     |
| 400  | Validation errors, invalid input, duplicate resource |
| 401  | Missing / invalid / expired JWT                      |
| 403  | Valid token but insufficient permissions             |
| 404  | Resource not found                                   |
| 409  | Business-logic conflict                              |
| 500  | Unexpected server / database error                   |

## Scripts

| Script          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start dev server with hot reload (`tsx`) |
| `npm run build` | Compile TypeScript to `dist/`            |
| `npm start`     | Run compiled server from `dist/`         |

## Author

**Jony Coder** — developers@niftyitsolution.com
