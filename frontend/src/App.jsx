import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UrlAnalyzer from './pages/UrlAnalyzer';
import EmailAnalyzer from './pages/EmailAnalyzer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Marketing Pages */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          <Route path="/about" element={
            <Layout>
              <AboutUs />
            </Layout>
          } />

          {/* Auth Pages (Standalone) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected App Pages (Dashboard Layout) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/analyzer" element={
            <PrivateRoute>
              <DashboardLayout>
                <UrlAnalyzer />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/email" element={
            <PrivateRoute>
              <DashboardLayout>
                <EmailAnalyzer />
              </DashboardLayout>
            </PrivateRoute>
          } />

          {/* Legacy Route Redirect */}
          <Route path="/email-analyzer" element={<Navigate to="/email" replace />} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;