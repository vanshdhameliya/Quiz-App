# QuizMaster — Spring Boot + React Quiz App

A full-stack quiz application:

- **Backend**: Spring Boot (REST API, Spring Data JPA, MySQL, Spring Security)
- **Frontend**: React (react-router, axios) with a public quiz-taking flow and a login-protected admin panel

## Project structure

```
quiz-app/
├── backend/    Spring Boot API (Maven project)
└── frontend/   React app (Create React App)
```

## 1. Run the backend

Requirements: Java 17+, Maven, and a running MySQL server.

Create the database once (or let `createDatabaseIfNotExist=true` in the JDBC URL do it for you, if your MySQL user has permission to create databases):

```sql
CREATE DATABASE quizdb;
```

Open `backend/src/main/resources/application.properties` and update the datasource username/password to match your local MySQL setup, then:

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Four sample quizzes are seeded automatically on first run (see `DataInitializer`): **Spring Boot**, **Computer Networks**, **Operating Systems**, and **DBMS** — five questions each. Since `spring.jpa.hibernate.ddl-auto=update`, Hibernate creates the tables for you; nothing to run by hand.

### Admin login

The admin panel is protected. Default credentials (in `application.properties`):

```
admin.username=admin
admin.password=admin123
```

**Change these before using this anywhere but your own machine.** Auth is HTTP Basic under the hood (see `SecurityConfig`) — the React login screen collects a username/password, and the browser sends them as an `Authorization: Basic ...` header on every `/api/admin/**` request. There's a single user defined in properties; no database-backed user table or password reset flow in this starter.

### API endpoints

**Public (player-facing)** — no auth required, never exposes correct answers:
| Method | Path                     | Description                              |
|--------|--------------------------|-------------------------------------------|
| GET    | `/api/quizzes`           | List quizzes (title, description, count) |
| GET    | `/api/quizzes/{id}/play` | Get quiz questions/options (no answers)  |
| POST   | `/api/quizzes/{id}/submit` | Submit answers, get back the score     |

**Admin** — requires `Authorization: Basic ...`, includes correct answers:
| Method | Path                                        | Description          |
|--------|------------------------------------------------|-----------------------|
| GET    | `/api/admin/quizzes`                          | List all quizzes      |
| GET    | `/api/admin/quizzes/{id}`                     | Get one quiz           |
| POST   | `/api/admin/quizzes`                          | Create a quiz          |
| PUT    | `/api/admin/quizzes/{id}`                     | Update quiz title/description |
| DELETE | `/api/admin/quizzes/{id}`                     | Delete a quiz (and its questions) |
| POST   | `/api/admin/quizzes/{quizId}/questions`       | Add a question         |
| PUT    | `/api/admin/quizzes/questions/{questionId}`   | Update a question       |
| DELETE | `/api/admin/quizzes/questions/{questionId}`   | Delete a question       |

> HTTP Basic with one hardcoded user is fine for a personal project or demo, not for production. Before deploying anywhere real: move to a database-backed user store with hashed passwords, add rate limiting on login attempts, and always serve this over HTTPS (Basic auth sends credentials on every request).

## 2. Run the frontend

Requirements: Node.js 18+.

```bash
cd frontend
npm install
npm start
```

The app opens on **http://localhost:3000** and talks to the backend at `http://localhost:8080`:
- `src/api/axiosConfig.js` — public endpoints (no auth)
- `src/api/adminApi.js` — admin endpoints (attaches the stored Basic auth header automatically, and logs the user out if the server ever returns 401)

## What you get

- **Home** (`/`) — landing page
- **Quizzes** (`/quizzes`) — browse available quizzes
- **Take a quiz** (`/quizzes/:id/play`) — answer questions, bracket-style lettered options
- **Result** (`/quizzes/:id/result`) — score after submitting
- **Admin login** (`/admin/login`) — sign in before touching anything under `/admin`
- **Admin dashboard** (`/admin`) — list of all quizzes with create/manage/delete (redirects to login if you're not signed in)
- **Manage quiz** (`/admin/quizzes/:id`) — edit title/description and add/edit/delete questions, marking the correct option per question

### Design

The UI uses a terminal/systems-console visual style (dark slate background, JetBrains Mono + Inter, signal-blue accent) rather than a generic template look, since the seeded content is CS/backend-focused. Page headings use a `$ prompt-style` treatment; quiz options render as monospace bracket chips; the admin dashboard reads like a log panel instead of a plain data table.

## Extending this

- Swap the single hardcoded admin user for a real `User` entity + repository, with BCrypt-hashed passwords, if you need more than one admin.
- Add question types beyond multiple-choice (true/false, short answer) by extending the `Question` entity.
- Add a "forgot password" or user-management screen once you move past the single hardcoded admin.
