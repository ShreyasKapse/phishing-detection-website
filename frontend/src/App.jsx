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
import Extension from './pages/Extension';
import ApiDocs from './pages/ApiDocs';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Settings from './pages/Settings';

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

          <Route path="/extension" element={
            <Layout>
              <Extension />
            </Layout>
          } />

          <Route path="/api" element={
            <Layout>
              <ApiDocs />
            </Layout>
          } />

          <Route path="/pricing" element={
            <Layout>
              <Pricing />
            </Layout>
          } />

          <Route path="/contact" element={
            <Layout>
              <Contact />
            </Layout>
          } />

          <Route path="/privacy" element={
            <Layout>
              <Privacy />
            </Layout>
          } />

          <Route path="/terms" element={
            <Layout>
              <Terms />
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

          <Route path="/settings" element={
            <PrivateRoute>
              <DashboardLayout>
                <Settings />
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