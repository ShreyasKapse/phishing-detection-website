# AI Phishing Detection System

A sophisticated web application designed to detect phishing attacks using a hybrid approach of Machine Learning and Heuristic Analysis. This project is a comprehensive solution for identifying malicious URLs and analyzing suspicious emails, integrated with cloud-based persistent storage for user history.

## Key Features

- **Advanced Phishing Detection**:
    - **URL Analysis**: Utilizes a Random Forest Machine Learning model to classify URLs based on lexical and domain-based features.
    - **Email Analysis**: Implements heuristic analysis to evaluate email headers and body content for phishing indicators.
- **Secure Authentication**: Robust user management using Firebase Authentication.
- **Interactive Dashboard**:
    - **Live Cyber Threat Map**: Real-time visualization of global threats and attack origins.
    - **Visual Analytics**: Comprehensive charts for risk distribution and scan history.
- **Admin Analytics**: "God Mode" dashboard for monitoring global system health, user growth, and threat intelligence.
- **Dark Mode Support**: Fully responsive light and dark themes for optimal viewing in any environment.
- **Cloud Persistence**: Stores user scan history securely in Cloud Firestore.
- **Modern User Interface**: A responsive and accessible UI built with React, Tailwind CSS, and Shadcn components.

## System Architecture

The project follows a decoupled client-server architecture:

- **Frontend**: Single Page Application (SPA) built with React (Vite). Handles user interaction, visualizations, and communicates with the backend via REST API.
- **Backend**: Flask (Python) REST API. Handles machine learning inference, data processing, and user management logic.
- **Database**: Cloud Firestore (NoSQL) for storing scan results and user profiles.
- **Authentication**: Firebase Admin SDK for verifying client-side tokens.

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Shadcn UI
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State/Auth**: Firebase SDK

### Backend
- **Framework**: Flask
- **ML Libraries**: Scikit-learn, Pandas, NumPy
- **Authentication**: Flask-JWT-Extended, Firebase Admin SDK
- **Database ORM**: Flask-SQLAlchemy (for optional relational data), Firestore (primary)

## Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Firebase Project with Firestore and Authentication enabled

### 1. Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     # Or manually create .env and copy content from .env.example
     ```
   - Place your Firebase `serviceAccountKey.json` in the `backend/` folder.
   - Update `GOOGLE_APPLICATION_CREDENTIALS` in `.env` if necessary.

5. Run the Server:
   ```bash
   python run.py
   ```
   Server will start at `http://localhost:5000`.

### 2. Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env` file in `frontend/` (copy from `.env.example` if available).
   - Ensure `VITE_API_URL` points to your backend:
     ```
     VITE_API_URL=http://localhost:5000
     ```
   - Add your Firebase config keys (VITE_FIREBASE_API_KEY, etc.).

4. Start Development Server:
   ```bash
   npm run dev
   ```
   Open the specific port shown in terminal (usually `http://localhost:5173`).

## Usage Guide

1. **Sign Up**: Create a new account to access the platform.
2. **Dashboard**: Overview of security stats.
3. **URL Analyzer**: Tab to the URL section, paste a link, and scan to see the risk score and ML confidence.
4. **Email Analyzer**: Paste email headers or raw content to check for spoofing and malicious patterns.

## Deployment Notes

- **Frontend**: Optimized for Vercel/Netlify deployment. Run `npm run build` to generate production assets.
- **Backend**: Python web server ready for Render/Heroku. Ensure `requirements.txt` is up to date.
