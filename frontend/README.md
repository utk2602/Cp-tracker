# Student Progress Management Frontend

A modern, responsive React frontend for managing student progress and Codeforces integration.

## Features

- **Student Management**: Add, edit, delete, and view student information
- **Codeforces Integration**: Track student ratings, contest history, and problem-solving progress
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data**: Live updates from the backend API
- **Data Export**: Download student data as CSV
- **Email Reminders**: Toggle email reminder settings for students
- **Cron Job Management**: Configure automated data synchronization and reminders

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Recharts** - Data visualization charts
- **Lucide React** - Icon library
- **React Calendar Heatmap** - Activity visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ContestHistory.jsx
│   │   ├── ProblemSolving.jsx
│   │   └── StudentFormModal.jsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── StudentProfile.jsx
│   │   └── SettingsPage.jsx
│   ├── services/           # API service functions
│   │   └── api.js
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## API Integration

The frontend communicates with the backend through the following endpoints:

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/:id/profile` - Get student profile with contests and problems
- `GET /api/students/download/csv` - Download students data as CSV
- `POST /api/students/:id/toggle-reminders` - Toggle email reminders

### Cron Job Management
- `GET /api/cron/settings` - Get cron settings
- `PUT /api/cron/settings` - Update cron settings
- `POST /api/cron/sync` - Trigger manual sync

## Styling

The application uses Tailwind CSS for styling with a custom color palette:

- **Primary Colors**: Blue shades for primary actions and branding
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Custom Components**: Reusable component classes for buttons, cards, and form elements

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS classes for styling
- Implement proper error handling
- Add loading states for better UX

## Contributing

1. Follow the existing code style and patterns
2. Test your changes thoroughly
3. Ensure responsive design works on all screen sizes
4. Update documentation as needed

## License

This project is part of the Student Progress Management System.
