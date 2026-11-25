# 🤖 AI Resume Analyzer

An AI-powered resume analysis platform that helps job seekers evaluate their resumes against specific job descriptions, identify skill gaps, improve ATS compatibility, and prepare for interviews.

Built using **Next.js, React, Node.js, Express, MongoDB, and Google Gemini AI**, the application provides intelligent resume insights and personalized recommendations to help candidates improve their job application strategy.

## 🚀 Features

### 📄 Resume Analysis
- Upload resumes in PDF and DOCX formats.
- Extract and analyze resume content using AI.
- Evaluate resume relevance against specific job descriptions.
- Generate detailed resume analysis reports.

### 🎯 ATS Score & Job Matching
- Calculate ATS compatibility scores.
- Generate job-resume match scores.
- Identify matching and missing skills.
- Analyze important keywords from job descriptions.
- Highlight areas requiring improvement.

### 🧠 AI-Powered Recommendations
- Generate personalized resume improvement suggestions.
- Provide grammar and formatting feedback.
- Identify missing keywords and relevant skills.
- Suggest improvements to resume content.

### ✉️ AI Cover Letter Generator
- Generate personalized cover letters.
- Align cover letter content with the job description.
- Highlight relevant experience and skills.

### 🎤 Interview Preparation
- Generate relevant interview questions.
- Provide role-specific preparation suggestions.
- Help candidates prepare based on their resume and target job.

### 📊 Dashboard & Analytics
- Track previous resume analysis results.
- Visualize score history using charts.
- Review previous analysis reports.
- Download analysis reports.

### 🔐 Authentication
- User registration and login.
- JWT-based authentication.
- Personalized user dashboard.

### 🎨 User Experience
- Modern and responsive interface.
- Dark mode support.
- Interactive dashboards and visualizations.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js |
| Styling | Tailwind CSS |
| Data Visualization | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Artificial Intelligence | Google Gemini API |
| Authentication | JSON Web Tokens (JWT) |
| File Processing | PDF and DOCX uploads |

## 🏗️ System Architecture

~~~text
              User
                |
                v
       Next.js / React Frontend
                |
                v
          Express REST API
                |
        +-------+-------+
        |               |
        v               v
   JWT Authentication  MongoDB
        |
        v
   Resume Upload
        |
        v
  Resume Content Extraction
        |
        v
   Google Gemini AI
        |
        v
   Resume Analysis
        |
    +---+------------------+
    |          |           |
    v          v           v
 ATS Score  Skill Gap   Job Match
    |          |           |
    +----------+-----------+
               |
               v
      AI Recommendations
               |
       +-------+-------+
       |       |       |
       v       v       v
    Cover   Interview  Report
   Letter   Questions Download
~~~

## 📁 Project Structure

~~~text
Ai_resume_analyzer/
│
├── client/                  # Next.js frontend
│   ├── public/              # Static assets
│   ├── src/                 # Application source code
│   ├── package.json         # Frontend dependencies
│   └── ...
│
├── server/                  # Node.js backend
│   ├── package.json         # Backend dependencies
│   └── ...
│
├── .gitignore
└── README.md
~~~

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js (v18 or later)
- npm
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key
- Git

### 1. Clone the Repository

~~~bash
git clone https://github.com/Raghu162005/Ai_resume_analyzer.git

cd Ai_resume_analyzer
~~~

### 2. Configure the Backend

Navigate to the server directory:

~~~bash
cd server
~~~

Install dependencies:

~~~bash
npm install
~~~

Create a `.env` file inside the `server` directory:

~~~env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
~~~

Replace the placeholder values with your actual configuration.

**Important:** Never commit your `.env` file or expose your API keys publicly.

Start the backend:

~~~bash
npm run dev
~~~

### 3. Configure the Frontend

Open another terminal and navigate to the project:

~~~bash
cd Ai_resume_analyzer/client
~~~

Install dependencies:

~~~bash
npm install
~~~

Start the frontend:

~~~bash
npm run dev
~~~

### 4. Access the Application

Open your browser:

**Frontend:** http://localhost:3000

**Backend:** http://localhost:5000

Make sure MongoDB is running and the backend environment variables are configured correctly.

## 🔄 Application Workflow

1. **Register/Login:** Users create an account or log in.
2. **Upload Resume:** Upload a resume in PDF or DOCX format.
3. **Enter Job Description:** Provide the target job description.
4. **AI Processing:** The backend processes the resume and sends relevant content to Google Gemini.
5. **Resume Evaluation:** The system evaluates ATS compatibility and job relevance.
6. **Skill Gap Analysis:** Identifies matching skills, missing skills, and important keywords.
7. **AI Recommendations:** Provides personalized suggestions for improving the resume.
8. **Career Preparation:** Generates cover letters and interview questions.
9. **Track Progress:** Users can review previous analysis results through the dashboard.

## 🔮 Future Enhancements

- AI-powered resume rewriting and optimization.
- Multiple job-description comparison.
- Personalized learning roadmaps for missing skills.
- LinkedIn profile analysis.
- Advanced resume analytics.
- Support for additional document formats.
- Improved semantic job matching.

## 🔒 Security

- JWT-based user authentication.
- Environment-based API key management.
- MongoDB-based data persistence.

Users should avoid uploading confidential personal information to untrusted deployments.

## 👨‍💻 Author

**Raghavendra Patne**

Computer Science Engineering Student | Software Developer | AI Enthusiast

- GitHub: [Raghu162005](https://github.com/Raghu162005)
- Project Repository: [AI Resume Analyzer](https://github.com/Raghu162005/Ai_resume_analyzer)

---

⭐ If you find this project useful, consider giving it a star!

**Built with ❤️ using AI and modern web technologies.**
