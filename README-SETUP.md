# FLAWENDER - Startup Idea Evaluator

## Overview
FLAWENDER is a React-based web application that allows users to submit startup ideas, get AI-powered evaluations, and view all ideas shared by the community. The application uses Prisma with MySQL for data persistence and JWT for authentication.

## Features
- ✅ User authentication (sign up/login) with JWT
- ✅ AI-powered startup idea evaluation using Google's Gemini API
- ✅ Community dashboard showing all ideas with user attribution
- ✅ Secure idea storage linked to user accounts
- ✅ Clean, modern UI with video backgrounds

## Tech Stack
- **Frontend**: React, React Router, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT tokens
- **AI**: Google Gemini API
- **Styling**: CSS with video backgrounds

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL server running
- Google Gemini API key

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Make sure your MySQL server is running
2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migrations
```bash
npx prisma db push
```

### 5. Start the Application
Run both frontend and backend:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Terminal 1: Backend server
npm run server

# Terminal 2: Frontend development server  
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### Ideas
- `POST /api/ideas` - Save new idea (requires authentication)
- `GET /api/ideas` - Get all ideas (public)
- `GET /api/user/ideas` - Get current user's ideas (requires authentication)

## Database Schema

### User Table
- `id` - Primary key
- `name` - User's display name  
- `email` - Unique email address
- `password` - Hashed password
- `createdAt` - Account creation timestamp

### Idea Table
- `id` - Primary key
- `Description` - AI-generated description
- `Verdict` - AI-generated verdict
- `Positive` - AI-generated positive points
- `Negative` - AI-generated negative points  
- `user_id` - Foreign key to User table

## Key Changes from PocketBase

### Removed
- ✅ PocketBase dependency and client
- ✅ PocketBase authentication system
- ✅ PocketBase real-time features (likes, comments)
- ✅ PocketBase data collections

### Added
- ✅ Express.js backend with REST API
- ✅ JWT-based authentication
- ✅ Prisma ORM with MySQL
- ✅ User context for state management
- ✅ Proper error handling and validation

## Usage Flow

1. **User Registration/Login**: Users can create accounts or login using the AuthDialog
2. **Idea Submission**: Authenticated users submit startup ideas via the chat interface
3. **AI Evaluation**: Ideas are evaluated using Google's Gemini API
4. **Data Storage**: Evaluated ideas are stored in MySQL with user attribution  
5. **Community Dashboard**: All users can view all submitted ideas with creator names

## File Structure
```
src/
├── component/           # React components
│   ├── AuthDialog.jsx   # Authentication modal
│   ├── Dashboard.jsx    # Community ideas dashboard
│   ├── InputCard.jsx    # Idea submission interface
│   └── ...
├── context/
│   └── AuthContext.jsx  # Authentication context
├── lib/
│   └── prisma.js        # Prisma client configuration
├── prisma/
│   └── schema.prisma    # Database schema
└── server.js            # Express backend server
```

## Environment Variables
Create a `.env` file with:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-secret-key"
PORT=5000
```

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Verify MySQL is running and credentials are correct
2. **Prisma Client Error**: Run `npx prisma generate` to regenerate client
3. **Authentication Issues**: Check JWT_SECRET is set in .env
4. **CORS Issues**: Backend includes CORS middleware for cross-origin requests

### Development Tips
- Use `npm run dev:full` to run both frontend and backend simultaneously
- Check browser console for frontend errors
- Check server console for backend API errors
- Use MySQL Workbench or similar tool to inspect database directly

## Production Deployment

### Backend
1. Set environment variables on your server
2. Run `npm run build` for optimized build
3. Use PM2 or similar for process management
4. Set up reverse proxy (nginx) for domain routing

### Database  
1. Use managed MySQL service (AWS RDS, DigitalOcean, etc.)
2. Update DATABASE_URL with production credentials
3. Run migrations: `npx prisma db push`

### Frontend
1. Update API_BASE_URL in components to production backend URL
2. Deploy to Vercel, Netlify, or similar static hosting service
