# Seeker

Seeker is a modern movie and TV show discovery application. It allows users to browse, search, and get personalized recommendations for content they love.

## Tech Stack

### Frontend
*   **Framework:** [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Database:** SQLite
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** JWT (JSON Web Tokens)

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)

### Installation & Running

The project consists of a frontend (root) and a backend (`server` directory). You need to run both concurrently.

#### 1. Backend Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

Start the backend server:

```bash
npm run dev
```
The server will start (defaulting to port 3000 or as defined in `.env`).

#### 2. Frontend Setup

Open a **new** terminal window and navigate to the project root:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Key Features
*   **Discovery:** Browse popular and trending movies and TV shows.
*   **Search:** Find specific titles instantly.
*   **Recommendations:** Get personalized suggestions based on your interactions.
*   **User Accounts:** Sign up and log in to save your preferences.
*   **Responsive Design:** Optimized for both desktop and mobile devices.

## Project Structure

*   `/src` - Frontend source code (Components, Pages, Redux Store).
*   `/server` - Backend source code (Express API, Prisma Schema).
*   `/server/prisma` - Database schema and configurations.
