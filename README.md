# Task Management System

A comprehensive full-stack task management application built with **Next.js**, **Node.js (Express)**, **TypeScript**, and **Prisma**.

## 🚀 Key Features

- **Dashboard**: Overview of tasks and their statuses.
- **Task Management**: Create, edit, delete, and organize tasks.
- **State Management**: Robust state handle using Redux Toolkit and RTK Query.
- **Authentication**: Secure JWT-based authentication.
- **Responsive UI**: Built with React-Bootstrap for a seamless experience across devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **UI Components**: [React-Bootstrap](https://react-bootstrap.github.io/)
- **Form Handling**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)

### Backend
- **Environment**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) (SQLite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Security**: JWT Authentication & Bcryptjs

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "Task Management System"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables provided
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📝 Scripts

### Backend
- `npm run dev`: Starts the development server with ts-node-dev.
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm run start`: Runs the compiled backend.

### Frontend
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the production-ready application.
- `npm run start`: Starts the production server.

## 📄 License
This project is licensed under the ISC License.
