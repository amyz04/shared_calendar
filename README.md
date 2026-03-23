# Calendar App

A shared group calendar app for matching free days and planning itineraries.

## Tech stack

- **Backend:** Java 21 · Spring Boot 3 · PostgreSQL · Spring Security · JWT
- **Frontend:** React 18 · TypeScript · Vite · React Router · Axios

## First-time setup

### Prerequisites

- Java 21+
- Node 18+
- Maven 3.9+
- Docker (for local PostgreSQL)

### 1. Enable Git hooks

```bash
git config core.hooksPath .githooks
```

### 2. Start the database

```bash
docker-compose up -d
```

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:8080  
Swagger UI at http://localhost:8080/swagger-ui.html

After cloning, run the following to enable Git hooks:
git config core.hooksPath .githooks
