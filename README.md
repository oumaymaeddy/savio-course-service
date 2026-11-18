# Savio – Course Service

[![Course service CI](https://github.com/oumaymaeddy/savio-platform/actions/workflows/course-service.yml/badge.svg)](https://github.com/oumaymaeddy/savio-platform/actions/workflows/course-service.yml)

REST API that lets students manage their courses in **Savio**, a study platform for francophone and bilingual students.
It is the first service of a microservices architecture: this service owns everything about courses and their data.

## Features

- Create, list, read, update and delete courses
- **Archive / restore** a course without losing it (soft delete with an `archived_at` date)
- The main list shows active courses only; archived ones are available with `?archived=true`
- Input validation with clear `400` errors, `404` when a course does not exist
- Unit tests and continuous integration on every push

## Tech stack

- **NestJS 11** (TypeScript)
- **PostgreSQL 16** running in **Docker Compose**
- **Drizzle ORM** + **Drizzle Kit** for the schema and SQL migrations
- **class-validator** for request validation
- **Jest** for unit tests
- **ESLint** + **Prettier**
- **GitHub Actions** for CI (lint, tests, build)

## Getting started

Requirements: Node.js 20+, Docker Desktop.

```bash
# 1. Install dependencies
npm install

# 2. Create your local config
cp .env.example .env

# 3. Start PostgreSQL
docker compose up -d

# 4. Create the tables
npm run db:migrate

# 5. Start the service (watch mode)
npm run start:dev
```

The API runs on `http://localhost:3001`.
`GET /` returns a health check with the current database time.

## API

| Method | Route                    | Description                | Success |
| ------ | ------------------------ | -------------------------- | ------- |
| GET    | `/courses`               | List active courses        | 200     |
| GET    | `/courses?archived=true` | List archived courses      | 200     |
| GET    | `/courses/:id`           | Get one course             | 200     |
| POST   | `/courses`               | Create a course            | 201     |
| PATCH  | `/courses/:id`           | Update some fields         | 200     |
| PATCH  | `/courses/:id/archive`   | Archive a course           | 200     |
| PATCH  | `/courses/:id/restore`   | Restore an archived course | 200     |
| DELETE | `/courses/:id`           | Delete a course            | 204     |

`:id` must be a UUID and `archived` must be `true` or `false`, otherwise the API returns `400`.

### Course fields

| Field  | Type   | Rules                                            |
| ------ | ------ | ------------------------------------------------ |
| `name` | string | required, max 80 characters                      |
| `code` | string | optional, max 20 characters (e.g. `MAT1342`)     |
| `term` | string | optional, max 40 characters (e.g. `Winter 2027`) |

`id`, `createdAt`, `updatedAt` and `archivedAt` are set by the server.
Unknown fields are rejected with `400`.

### Examples

```bash
# Create
curl -i -X POST http://localhost:3001/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Linear Algebra","code":"MAT1342","term":"Winter 2027"}'

# List active courses
curl -i http://localhost:3001/courses

# Update
curl -i -X PATCH http://localhost:3001/courses/$ID \
  -H "Content-Type: application/json" \
  -d '{"term":"Fall 2027"}'

# Archive, then list archived courses
curl -i -X PATCH http://localhost:3001/courses/$ID/archive
curl -i "http://localhost:3001/courses?archived=true"

# Delete
curl -i -X DELETE http://localhost:3001/courses/$ID
```

## Testing

```bash
npm test              # unit tests
npm run lint:check    # lint without auto-fix (same as CI)
```

Unit tests cover the controller and every `CoursesService` rule (not-found errors, archive/restore, updated timestamps) with a mocked database, so they run in under a second without Docker.

## Database

The schema lives in `src/db/schema.ts`.
After changing it:

```bash
npm run db:generate   # creates a new SQL migration in drizzle/
npm run db:migrate    # applies it to the database
```

## Project structure

```
src/
├── main.ts                     # bootstrap + global validation
├── app.module.ts               # root module (config, database, courses)
├── db/
│   ├── schema.ts               # courses table definition
│   └── db.module.ts            # PostgreSQL pool + Drizzle client
└── courses/
    ├── courses.controller.ts   # HTTP routes
    ├── courses.service.ts      # business logic + queries
    ├── courses.service.spec.ts # unit tests
    └── dto/                    # request validation rules
drizzle/                        # SQL migrations
```

## Scripts

| Command               | What it does                           |
| --------------------- | -------------------------------------- |
| `npm run start:dev`   | start in watch mode                    |
| `npm run build`       | compile to `dist/`                     |
| `npm test`            | run unit tests                         |
| `npm run lint`        | run ESLint and fix what it can         |
| `npm run lint:check`  | run ESLint without fixing (used in CI) |
| `npm run format`      | run Prettier                           |
| `npm run db:generate` | generate a migration                   |
| `npm run db:migrate`  | apply migrations                       |

## Roadmap

- [x] Course CRUD with PostgreSQL
- [x] Validation and error handling
- [x] Migrations with Drizzle Kit
- [x] Archive / restore courses
- [x] Unit tests
- [x] CI with GitHub Actions (lint, tests, build)
- [ ] End-to-end tests on a dedicated test database
- [ ] Search and sorting
- [ ] Authentication: each student only sees their own courses
- [ ] Document service (upload course material)
