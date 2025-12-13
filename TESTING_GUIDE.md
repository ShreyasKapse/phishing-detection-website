# Manual Testing Guide

## Prerequisites
✅ Backend running on `http://localhost:5000`
✅ Frontend running on `http://localhost:3001`

## Test Scenarios

### 1. Home Page (Landing)
**URL**: `http://localhost:3001/`
**Expected**:
- Hero section with title "AI-Powered Security for Every Click"
- Two CTA buttons: "Analyze URL" and "Get Started"
- Features grid showing URL Analysis, Email Inspection, Personal Dashboard, Real-time Protection
- Footer with copyright info
- Navbar with Logo, Home, URL Analyzer, Email Analyzer, Login, Sign Up

### 2. Authentication Flow

#### Google Sign-In
**URL**: `http://localhost:3001/login`
**Steps**:
1. Click "Login" in navbar
2. See email/password form
3. See "Or continue with" divider
4. See Google button with Google icon
5. Click Google button → Should trigger Firebase popup

#### Email/Password Login
**Steps**:
1. Enter email and password
2. Click "Login"
3. Should redirect to `/dashboard` on success
4. Should show error toast on failure

### 3. URL Analyzer
**URL**: `http://localhost:3001/analyzer` (Protected route)
**Steps**:
1. Login first
2. Navigate to URL Analyzer
3. Enter test URL: `http://suspicious-site.com`
4. Click "Analyze"
5. **Expected Backend Logs**:
   ```
   DEBUG: Analyze URL request received. Payload: {'url': 'http://suspicious-site.com'}
   DEBUG: Auth User ID: mock_user_123
   DEBUG: Processing URL: http://suspicious-site.com
   DEBUG: Analysis Result features: {...}
   DEBUG: Prediction result: {...}
   DEBUG: Saved to Firestore with ID: mock_history_...
   ```
6. **Expected Frontend**:
   - Toast notification: "Analysis Complete: Verdict [Safe/Phishing]"
   - Result card showing:
     - Verdict badge (red for Phishing, green for Safe)
     - Confidence score
     - Risk level
     - Analysis details (features/signals)
     - Warnings (if any)

### 4. Email Analyzer
**URL**: `http://localhost:3001/email` (Protected route)
**Steps**:
1. Login first
2. Navigate to Email Analyzer
3. Fill in form:
   - From: `phisher@gmail.com`
   - Subject: `Urgent: Verify your account`
   - Body: `Click here to verify: http://fake-bank.com`
4. Click "Analyze Email"
5. **Expected**: Similar to URL analyzer - toast + result card

### 5. Dashboard
**URL**: `http://localhost:3001/dashboard` (Protected route)
**Expected**:
- User greeting in navbar
- Analytics overview (total analyses, safe/phishing counts)
- Recent analyses list
- Risk distribution chart

## API Response Format Verification

### URL Analysis Response
```json
{
  "success": true,
  "verdict": "Safe" | "Phishing",
  "score": 0.0-1.0,
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "signals": { ...feature_object... },
  "warnings": [...],
  "id": "firestore_doc_id"
}
```

### Email Analysis Response
```json
{
  "success": true,
  "verdict": "Safe" | "Phishing",
  "score": 0.0-1.0,
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "signals": { ...feature_object... },
  "warnings": [...],
  "id": "firestore_doc_id"
}
```

## Common Issues & Solutions

### Issue: "Connection Refused"
- **Solution**: Ensure both backend and frontend servers are running

### Issue: "Authorization header is missing"
- **Solution**: You must be logged in to use analyzers

### Issue: Analyzers return error
- **Solution**: Check backend terminal for DEBUG logs to see exact error

### Issue: Google Sign-In doesn't work
- **Solution**: Ensure Firebase project has Google auth enabled in Firebase Console

## Success Criteria
✅ Home page loads with modern design
✅ Navbar shows correct links based on auth state
✅ Google Sign-In button appears on Login/Signup
✅ URL Analyzer accepts input and returns verdict
✅ Email Analyzer accepts input and returns verdict
✅ Toast notifications appear on success/error
✅ Backend logs show detailed debugging info
✅ Response format matches specification (verdict, score, signals)
