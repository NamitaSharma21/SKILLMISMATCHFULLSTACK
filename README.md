🚀 Overview

This is a full-stack web application that generates a personalized learning roadmap based on a user's skill test results. The roadmap is created using AI and tailored to the selected domain and performance score. Users can also save their roadmap for future reference.

⚙️ Tech Stack
Frontend:
React.js (Vite)
React Router
CSS
Backend:
Node.js
Express.js
MongoDB
Mongoose
AI Integration:
Groq API (LLaMA 3 model)
✨ Features
User Authentication (Login / Signup)
Domain selection system
Skill assessment test
AI-powered roadmap generation
Personalized step-by-step learning plan
Save roadmap to MongoDB
Clean and responsive UI
🧠 How It Works
User logs in
Selects a domain (e.g., Web Dev, Cybersecurity, etc.)
Takes a skill test
AI generates a roadmap based on score
User views roadmap
User can save roadmap to database
🗄️ Database Schema
Roadmap Collection:
{
  userId: String,
  course: String,
  domain: String,
  score: Number,
  roadmap: [String],
  createdAt: Date
}
📦 Setup Instructions
Backend
npm install
node app.js
Frontend
npm install
npm run dev
🔐 Environment Variables

Create a .env file in frontend:

VITE_GROQ_API_KEY=YOUR_API_KEY_HERE


📡 API Endpoints
Auth Routes
/api/auth/register
/api/auth/login
Roadmap Routes
POST /api/save-roadmap
🔮 Future Improvements
User dashboard for saved roadmaps
Edit / delete roadmap feature
Download roadmap as PDF
Better AI prompt optimization
Progress tracking system
Mobile responsive redesign
JWT authentication security upgrade
Deployment on cloud (Vercel + Render)
🛡️ Security Note
API keys are stored in .env file only
Backend runs locally on port 5000
MongoDB runs on local instance (can be upgraded to Atlas)
👩‍💻 Author

Built as a full-stack learning project integrating AI + backend + database.