FLAWENDER - Startup Idea Evaluator
Overview
FLAWENDER is a React-based web application that allows users to submit startup ideas, get AI-powered evaluations, and view all ideas shared by the community. The application uses Prisma with MySQL for data persistence and JWT for authentication.

Features
✅ User authentication (sign up/login) with JWT
✅ AI-powered startup idea evaluation using Google's Gemini API
✅ Community dashboard showing all ideas with user attribution
✅ Secure idea storage linked to user accounts
✅ Clean, modern UI with video backgrounds
Tech Stack
Frontend: React, React Router, Framer Motion
Backend: Express.js, Node.js
Database: MySQL with Prisma ORM
Authentication: JWT tokens
AI: Google Gemini API
Styling: CSS with video backgrounds
Setup Instructions
Prerequisites
Node.js (v18 or higher)
MySQL server running
Google Gemini API key
1. Install Dependencies
npm install
2. Database Setup
Make sure your MySQL server is running
Update the .env file with your database credentials:
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
3. Generate Prisma Client
npx prisma generate
4. Run Database Migrations
npx prisma db push
5. Start the Application
Run both frontend and backend:

npm run dev:full
Or run them separately:

# Terminal 1: Backend server
npm run server

# Terminal 2: Frontend development server  
npm run dev
6. Access the Application
Frontend: http://localhost:5173
Backend API: http://localhost:5000
API Endpoints
Authentication
POST /api/auth/signup - Create new user account
POST /api/auth/login - Login user
Ideas
POST /api/ideas - Save new idea (requires authentication)
GET /api/ideas - Get all ideas (public)
GET /api/user/ideas - Get current user's ideas (requires authentication)
Database Schema
User Table
id - Primary key
name - User's display name
email - Unique email address
password - Hashed password
createdAt - Account creation timestamp
Idea Table
id - Primary key
Description - AI-generated description
Verdict - AI-generated verdict
Positive - AI-generated positive points
Negative - AI-generated negative points
user_id - Foreign key to User table


Usage Flow
User Registration/Login: Users can create accounts or login using the AuthDialog
Idea Submission: Authenticated users submit startup ideas via the chat interface
AI Evaluation: Ideas are evaluated using Google's Gemini API
Data Storage: Evaluated ideas are stored in MySQL with user attribution
Community Dashboard: All users can view all submitted ideas with creator names
File Structure
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
Environment Variables
Create a .env file with:

DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-secret-key"
PORT=5000
Troubleshooting
Common Issues
Database Connection Error: Verify MySQL is running and credentials are correct
Prisma Client Error: Run npx prisma generate to regenerate client
Authentication Issues: Check JWT_SECRET is set in .env
CORS Issues: Backend includes CORS middleware for cross-origin requests
Development Tips
Use npm run dev:full to run both frontend and backend simultaneously
Check browser console for frontend errors
Check server console for backend API errors
Use MySQL Workbench or similar tool to inspect database directly
Production Deployment
Backend
Set environment variables on your server
Run npm run build for optimized build
Use PM2 or similar for process management
Set up reverse proxy (nginx) for domain routing
Database
Use managed MySQL service (AWS RDS, DigitalOcean, etc.)
Update DATABASE_URL with production credentials
Run migrations: npx prisma db push
Frontend
Update API_BASE_URL in components to production backend URL
