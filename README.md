# AI Resume Analyzer

An AI-powered web application that analyzes resumes against job descriptions, calculates match scores, identifies missing skills, and provides personalized improvement suggestions.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI:** Google Gemini API
- **Auth:** JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas)
- Google Gemini API key

## Setup

### 1. Backend

```bash
cd server
npm install
```

Edit `.env` with your values:
```
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## Features

- User registration and login (JWT)
- Upload PDF/DOCX resumes
- Paste job descriptions
- AI-powered resume analysis via Gemini
- Match score and ATS score (0-100%)
- Skills matched/missing detection
- Keyword analysis
- Improvement suggestions
- Grammar and formatting feedback
- AI-generated cover letter
- Interview question suggestions
- Dashboard with score history charts
- Download analysis reports
- Dark mode support
