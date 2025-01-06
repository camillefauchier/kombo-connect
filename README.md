# Kombo Connect Project

This repository contains two projects:
- **Backend**: A NestJS application for integration logic, webhook handling, and database operations.
- **Frontend**: A React application for managing integrations via a user interface.

## Table of Contents
1. [Backend](#backend)
    - [Setup](#setup)
    - [Environment Variables](#environment-variables)
    - [Endpoints](#endpoints)
2. [Frontend](#frontend)
    - [Setup](#setup-1)
    - [Environment Variables](#environment-variables-1)
3. [Deployment](#deployment)
4. [Docker Compose](#docker-compose)

---

## Backend

### Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

2. Install dependencies:
    ```bash
    npm install

3. Run in development:

    ```bash
    npm run start:dev
4. Build for production:
    ```bash
    npm run build

### Environment Variables
Create a .env file in the backend directory:

```
KOMBO_API_KEY=your_kombo_api_key
KOMBO_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
```

## Frontend
### Setup
Navigate to the frontend directory:
```
cd frontend
```

Install dependencies:
```
yarn install
```

Run in development:
```
yarn start
```

Build for production:
```
yarn build
```
### Environment Variables
Create a .env file in the frontend directory:

```
REACT_APP_KOMBO_BACKEND_URL=http://localhost:3001
```