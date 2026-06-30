# BeyondDev Frontend - React + TypeScript

Modern React application with TypeScript for biometric authentication and Face ID recognition.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run at http://localhost:5173

### 3. Build for Production
```bash
npm run build
```

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Face Recognition**: face-api.js

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── services/        # API and business logic services
├── hooks/           # Custom React hooks (Zustand stores)
├── types/           # TypeScript type definitions
├── styles/          # CSS files
├── main.tsx         # Entry point
└── App.tsx          # Root component
```

## Key Features

- User registration and authentication
- Email verification
- Face ID registration
- Face ID login
- Biometric profile management
- Responsive design
- Real-time face detection
- Quality assessment

## Environment

The app connects to the FastAPI backend at `http://localhost:8000`.
Proxy configuration is in `vite.config.ts`.
