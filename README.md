# Task Management System

Full-stack application for managing tasks, built on Next.js, Express, and Prisma.

## Overview
This is a task management application featuring a dashboard for task tracking, secure user authentication with JWT, and responsive UI.

## Tech Stack
- **Frontend**: Next.js (App Router), Redux Toolkit, RTK Query, React-Bootstrap, Formik/Yup
- **Backend**: Node.js, Express, TypeScript, Prisma ORM (SQLite)
- **Shared**: TypeScript used across both frontend and backend for end-to-end type safety.

## Getting Started

### Prerequisites
- Node.js (tested with v18+)

### Steps to Run

1. **Clone project**
   ```bash
   git clone <repo_url>
   cd "Task Management System"
   ```

2. **Setup Backend**
   - Head into `/backend`
   - Install dependencies: `npm install`
   - Setup database:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
   - Run server: `npm run dev`

3. **Setup Frontend**
   - Head into `/frontend`
   - Install dependencies: `npm install`
   - Start Next.js: `npm run dev`

## Project Structure
- `/frontend`: Next.js frontend with Redux store and dashboard view.
- `/backend`: Express API with Prisma models for Users and Tasks.
- `/backend/prisma`: Contains the SQLite database schema.

## Available Scripts
- `npm run dev`: Starts the respective dev servers (Next.js and Express).
- `npm run build`: Compiles for production.
- `npm run start`: Runs production builds.

## License
ISC
