# AI Phishing Detection Website

A sophisticated web application that detects phishing URLs and emails using machine learning and rule-based analysis. Integrated with Firebase for secure authentication and cloud data storage.

## Features
- **Phishing Detection**: Machine Learning (Random Forest) for URLs and Heuristics for Emails.
- **Secure Authentication**: Firebase Authentication (Email/Password).
- **User Dashboard**: Real-time statistics, risk distribution, and analysis history.
- **Cloud Storage**: Firestore for persistent per-user history.
- **Modern UI**: Built with React, Tailwind CSS, and Shadcn-compatible components.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Firebase SDK, React Router.
- **Backend**: Flask, Firebase Admin SDK, Scikit-learn.
- **Database**: Cloud Firestore.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Firebase Project (configured)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
**Mock Mode**: If `GOOGLE_APPLICATION_CREDENTIALS` is not set, the backend will run in Mock Mode. You can use the token `mock_token` to bypass authentication during local development.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the port shown in terminal).

### 3. Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```
*(Firebase config is currently hardcoded in `src/firebase.js` for demo purposes. See file for keys.)*

**Backend (.env or System Env)**
```
GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
```

## functionality
- **Sign Up/Login**: Create an account to access the dashboard.
- **URL Analyzer**: Check suspicious links.
- **Email Analyzer**: Paste email headers/body to verify sender authenticity.
- **Dashboard**: View your recent scans and security posture.

## Deployment
- **Frontend**: Ready for Vercel (clean build).
- **Backend**: Ready for Render (ensure `requirements.txt` and `firebase-admin` are present).
