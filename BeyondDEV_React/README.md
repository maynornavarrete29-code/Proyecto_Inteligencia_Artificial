# BeyondDev - Modern React + FastAPI Refactoring

Complete refactoring of the BeyondDev biometric authentication system using modern technologies.

## 🏗️ Project Structure

```
BeyondDEV_React/
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (Login, Register, Dashboard)
│   │   ├── services/         # API client & biometric services
│   │   ├── hooks/            # Custom hooks & Zustand stores
│   │   ├── types/            # TypeScript interfaces
│   │   ├── styles/           # CSS stylesheets
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── vite.config.ts        # Vite config with API proxy
│   └── README.md             # Frontend setup guide
│
└── backend/                   # FastAPI + Python
    ├── app/
    │   ├── api/              # API endpoints (auth, face-id)
    │   ├── models/           # Database models & queries
    │   ├── schemas/          # Pydantic request/response models
    │   ├── services/         # Business logic (Auth, FaceID, Email)
    │   ├── utils/            # Utilities (JWT, dependencies)
    │   ├── config.py         # Application settings
    │   └── main.py           # FastAPI app initialization
    ├── requirements.txt      # Python dependencies
    ├── run.py                # Server entry point
    ├── .env                  # Environment variables
    └── README.md             # Backend setup guide
```

## 🚀 Quick Start

### Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python run.py
```

Server runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at: http://localhost:5173

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify?email=...&token=...` - Email verification
- `GET /api/auth/me` - Get current user (requires token)

### Face ID
- `POST /api/faceid/register` - Register face profile
- `POST /api/faceid/verify` - Verify face for login
- `GET /api/faceid/profile` - Get face profile (requires token)
- `DELETE /api/faceid/profile` - Delete face profile (requires token)

### Other
- `GET /api/health` - Health check
- `GET /api/emails` - Get email records
- `DELETE /api/emails` - Clear emails

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast & modern)
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **face-api.js** - Face detection & recognition

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.10+** - Programming language
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **BCrypt** - Password hashing
- **NumPy/SciPy** - Face descriptor comparison

### Database
- **JSON File** - Simple persistent storage (can be upgraded to SQLite/PostgreSQL)

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- CORS configuration
- Email verification flow
- Face quality validation (75% threshold)
- Face descriptor distance matching (0.6 threshold)

## 📦 Key Improvements vs Original

| Feature | Original | New |
|---------|----------|-----|
| Framework | Vanilla JS | React + TypeScript |
| Backend | Express.js | FastAPI |
| Build Tool | None | Vite |
| State Mgmt | Vanilla + SessionStorage | Zustand |
| Type Safety | No | Full TypeScript |
| Dev Experience | Hot reload via browser | HMR with Vite |
| API Docs | Manual | Auto-generated (Swagger) |
| Code Organization | Single folder | Modular structure |

## 🔄 Migration Path

The refactored app maintains the same:
- ✅ Database schema (JSON compatible)
- ✅ API contracts
- ✅ Face ID logic
- ✅ Authentication flow
- ✅ User experience

But improves:
- 📈 Performance (Vite, React optimizations)
- 🎯 Maintainability (TypeScript, modular code)
- 🧪 Testability (Separated concerns)
- 🚀 Scalability (Can easily swap JSON for SQL DB)

## 📝 Next Steps

1. **Complete Face ID UI Components**
   - FaceIDRegisterModal
   - FaceIDLoginModal
   - Face detection with live feed

2. **Enhance Backend**
   - Add database migration to SQLite/PostgreSQL
   - Implement liveness detection
   - Add rate limiting
   - Add audit logging

3. **Add Features**
   - User profile management
   - Face profile management
   - Email preferences
   - Multi-device support

4. **Deployment**
   - Containerize with Docker
   - Deploy to AWS/Azure/GCP
   - Set up CI/CD pipeline

## 📖 Documentation

- [Frontend README](./frontend/README.md) - React setup & development
- [Backend README](./backend/README.md) - FastAPI setup & API docs

## 🤝 Contributing

When adding new features:
1. Keep frontend and backend changes synchronized
2. Update type definitions when changing API
3. Maintain consistent error handling
4. Add proper logging for debugging

## 📄 License

Built with ❤️ for BeyondDev
