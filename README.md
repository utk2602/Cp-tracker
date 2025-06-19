# CP Tracker – Fullstack Documentation

## Overview

**CP Tracker** is a fullstack web application designed to track, analyze, and visualize student progress on Codeforces. It provides a seamless experience for both administrators and students, featuring real-time analytics, a dynamic leaderboard, and automated reminders. The project leverages a modern, scalable tech stack and is production-ready, with deployments on Vercel (frontend) and Render (backend).

---

## Table of Contents

1. [Features](#features)
2. [Architecture & Design](#architecture--design)
3. [Tech Stack Highlights](#tech-stack-highlights)
4. [Project Structure](#project-structure)
5. [Backend](#backend)
    - [API Endpoints](#api-endpoints)
    - [Key Files & Folders](#key-backend-files)
    - [Data Models](#data-models)
    - [Services](#services)
    - [CORS & Deployment](#cors--deployment)
6. [Frontend](#frontend)
    - [Key Files & Folders](#key-frontend-files)
    - [Component Overview](#component-overview)
    - [Leaderboard & Analytics](#leaderboard--analytics)
    - [API Integration](#api-integration)
    - [Styling](#styling)
7. [Setup & Development](#setup--development)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- **Student Management**: Add, edit, delete, and view students with full profile and contest history.
- **Codeforces Integration**: Fetches and syncs contest, problem, and rating data directly from Codeforces.
- **Leaderboard**: Dynamic, real-time leaderboard ranking students by rating, activity, and achievements.
- **Advanced Analytics**: Visualizes submissions, rankings, and achievements with interactive charts and heatmaps.
- **Email Reminders**: Automated inactivity reminders to keep students engaged.
- **Cron Job Management**: Schedule and trigger data syncs and reminders.
- **Responsive UI**: Modern, mobile-friendly interface with dark mode and accessibility support.
- **Data Export**: Download student data as CSV for offline analysis or reporting.

---

## Architecture & Design

```
Frontend (React, Vercel)
    |
    |  (REST API, CORS)
    v
Backend (Express, Node.js, Render)
    |
    |  (ODM)
    v
MongoDB (Cloud Database)
```

- **Frontend**: Single Page Application (SPA) built with React, providing a fast and interactive user experience.
- **Backend**: RESTful API built with Express, handling business logic, data aggregation, and external API integration.
- **Database**: MongoDB, chosen for its flexibility and scalability with complex, nested student data.
- **Deployment**: CI/CD ready, with separate deployments for frontend (Vercel) and backend (Render).

---

## Tech Stack Highlights

- **React 18**: Modern, component-based UI with hooks and context for state management.
- **Vite**: Ultra-fast build tool for instant feedback during development.
- **Tailwind CSS**: Utility-first CSS framework for rapid, consistent, and responsive design.
- **Recharts & React Calendar Heatmap**: Advanced data visualization for analytics and activity tracking.
- **Lucide React**: Beautiful, open-source icon library.
- **Axios**: Promise-based HTTP client for robust API communication.
- **Node.js & Express**: High-performance backend with modular routing and middleware.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Nodemailer**: Reliable email delivery for reminders and notifications.
- **node-cron**: Flexible cron job scheduling for automated tasks.
- **CORS**: Secure cross-origin resource sharing for safe frontend-backend communication.
- **dotenv**: Secure environment variable management for sensitive credentials.

---

## Project Structure

```
.
├── backend/
│   ├── controllers/    # Route handlers (business logic)
│   ├── models/         # Mongoose data models
│   ├── routes/         # Express route definitions
│   ├── services/       # External APIs, cron jobs, email, analytics
│   ├── config/         # DB and cron configuration
│   ├── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main app pages
│   │   ├── services/   # API service functions
│   │   ├── App.jsx     # App root
│   │   └── main.jsx    # Entry point
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md           # (This file)
```

---

## Backend

### Key Backend Files

- **server.js**: Main Express app, CORS config, route mounting, error handling.
- **controllers/**: Logic for students, analytics, cron jobs.
- **models/**: Mongoose schemas for Student, Contest, Problem, EmailLog.
- **routes/**: API endpoints for students, analytics, cron.
- **services/**: 
    - `codeforcesAPI.js`: Fetches data from Codeforces.
    - `cronJob.js`: Schedules and runs periodic syncs.
    - `analyticsService.js`: Aggregates stats and analytics.
    - `emailService.js`: Sends inactivity reminders.
- **config/**: 
    - `db.js`: MongoDB connection.
    - `cronConfig.js`: Cron schedule presets.

### Data Models

- **Student**: Name, email, phone, Codeforces handle, rating, contest history, problems solved, etc.
- **Contest**: Contest details, student performance.
- **Problem**: Problem details, solved status.
- **EmailLog**: Logs of sent/failed emails.

### API Endpoints

#### Student Management
- `GET /api/students` – List all students.
- `POST /api/students` – Add a new student.
- `PUT /api/students/:id` – Update student info.
- `DELETE /api/students/:id` – Remove student.
- `GET /api/students/:id/profile` – Get full profile (contests, problems).
- `POST /api/students/:id/toggle-reminders` – Toggle email reminders.

#### Analytics
- `GET /api/analytics/leaderboard` – Student leaderboard (see below).
- `GET /api/analytics/global-stats` – Global stats (total submissions, average rating, etc.).
- `GET /api/analytics/department-stats` – Stats by department.
- `GET /api/analytics/achievements/:studentId` – Student achievements.
- `GET /api/analytics/student/:studentId` – Student analytics.

#### Cron Jobs
- `GET /api/cron/schedule` – Get cron schedule.
- `PUT /api/cron/schedule` – Update cron schedule.
- `POST /api/cron/sync` – Trigger manual sync.
- `POST /api/cron/sync/:studentId` – Sync a specific student.

### Services

- **Codeforces API**: Handles rate-limited requests to Codeforces for user data.
- **Cron Jobs**: Periodically syncs student data and sends reminders.
- **Email Service**: Sends inactivity reminders using nodemailer.

### CORS & Deployment

- CORS is configured in `server.js` to allow requests from the Vercel frontend domain.
- Backend is deployed on Render, with environment variables for DB and email credentials.

---

## Frontend

### Key Frontend Files

- **src/components/**: 
    - `SubmissionHeatmap.jsx`: Calendar heatmap of submissions.
    - `StudentFormModal.jsx`: Modal for adding/editing students.
    - `PerformanceChart.jsx`: Visualizes rating/progress.
    - `Achievements.jsx`: Displays student achievements.
    - `Navigation.jsx`: Sidebar/topbar navigation.
    - `ContestHistory.jsx`, `ProblemSolving.jsx`: Contest and problem views.
- **src/pages/**:
    - `Dashboard.jsx`: Main dashboard, student list, analytics.
    - `StudentProfile.jsx`: Detailed student view.
    - `Leaderboard.jsx`: Rankings.
    - `SettingsPage.jsx`: Cron and email settings.
- **src/services/api.js**: Centralized API calls using Axios.
- **src/api.js**: Additional API functions for analytics.

### Component Overview

- **Dashboard**: Overview of all students, quick actions, analytics.
- **Student Profile**: Detailed view with contest history, problem-solving, achievements.
- **Leaderboard**: Ranks students by rating, activity, etc.
- **Settings**: Manage cron schedule, trigger sync, toggle reminders.

---

### Leaderboard & Analytics

#### Leaderboard Feature

- **Dynamic Ranking**: The leaderboard ranks students in real-time based on their Codeforces rating, number of problems solved, and contest performance.
- **Sorting & Filtering**: Users can sort and filter the leaderboard by department, rating, or activity.
- **Highlighting Achievements**: Top performers and most improved students are visually highlighted.
- **Live Updates**: The leaderboard updates automatically as new data is synced from Codeforces or when students are added/updated.
- **API Integration**: Powered by the `/api/analytics/leaderboard` endpoint, which aggregates and sorts data server-side for performance and accuracy.

#### Analytics

- **Submission Heatmap**: Visualizes daily submission activity for each student over the past year.
- **Performance Charts**: Interactive charts show rating progression, contest participation, and problem-solving trends.
- **Department & Global Stats**: Aggregated statistics for departments and the entire user base.
- **Achievements**: Badges and milestones for students based on their activity and performance.

---

### API Integration

- All API calls are routed through `src/services/api.js` and `src/api.js`.
- Base URL is set to the deployed backend (`https://cp-tracker-1.onrender.com/api`).
- Uses Axios for HTTP requests, with error handling and loading states.

### Styling

- **Tailwind CSS**: Utility-first, responsive, dark mode support.
- **Recharts**: For charts and data visualization.
- **React Calendar Heatmap**: For activity visualization.
- **Lucide Icons**: For a modern, consistent icon set.

---

## Setup & Development

### Prerequisites

- Node.js (v16+)
- MongoDB (cloud or local for dev)
- Vercel/Render accounts for deployment

### Backend

```bash
cd backend
npm install
# Set up .env with MongoDB URI and email credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

---

## Deployment

- **Frontend**: Deploy `frontend/` to Vercel. Set `REACT_APP_API_URL` or update API base URL in code.
- **Backend**: Deploy `backend/` to Render. Set environment variables for DB and email.

---

## Contributing

- Follow code style and best practices (functional components, hooks, error handling).
- Test thoroughly before PRs.
- Keep documentation up to date.

---

## License

This project is part of the Student Progress Management System. For educational and demonstration purposes.

---

