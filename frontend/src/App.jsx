import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import EmailAnalyzer from './pages/EmailAnalyzer';
import { BarChart3, Home, LogOut } from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('analyzer');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authForm, setAuthForm] = useState({ email: '', password: '', full_name: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile`);
      setUser(response.data.profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e?.preventDefault?.();
    setAuthError('');
    try {
      const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
      const payload = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password, full_name: authForm.full_name };
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);
      setUser(response.data.user);
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Authentication failed.');
    }
  };

  const analyzeUrl = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze/url`, { url });
      setResult(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Please login first');
      } else {
        alert('Error analyzing URL. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setResult(null);
    setCurrentView('analyzer');
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTone = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-700';
      case 'medium': return 'text-yellow-800';
      case 'high': return 'text-orange-800';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-700';
    }
  };

  const getNextSteps = (riskLevel, isPhishing) => {
    const level = riskLevel?.toLowerCase();
    if (isPhishing) {
      return 'Do not click or enter any information. Report this URL to your security team and block it if possible.';
    }
    if (level === 'medium') return 'Proceed with caution. Verify the sender/owner and double-check the URL before interacting.';
    if (level === 'high' || level === 'critical') return 'Avoid interacting with this URL. Consider reporting and blocking it.';
    return 'Looks safe, but still verify the source if you were not expecting this link.';
  };

  const featureKeyToLabel = (key) => {
    const map = {
      has_ip_in_url: 'Contains IP address',
      url_length: 'URL length',
      num_subdomains: 'Number of subdomains',
      uses_https: 'HTTPS usage',
      suspicious_keywords: 'Suspicious keywords',
      unusual_tld: 'Unusual TLD',
      domain_age_days: 'Domain age (days)',
      alexa_rank: 'Alexa rank',
      redirect_count: 'Redirect count',
      contains_at_symbol: 'Contains @ symbol',
      has_mismatched_hostname: 'Hostname mismatch',
    };
    return map[key] || key;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">AI Phishing Detector</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                className={`px-3 py-1 rounded ${authMode==='login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAuthMode('login')}
              >Login</button>
              <button
                className={`px-3 py-1 rounded ${authMode==='signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setAuthMode('signup')}
              >Sign Up</button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={authForm.full_name}
                    onChange={handleAuthChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {authError && (
                <div className="text-sm text-red-600">{authError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >{authMode==='login' ? 'Login' : 'Create Account'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Navigation: show correct main view
  if (currentView === 'dashboard') {
    return <Dashboard user={user} onNavigate={setCurrentView} logout={logout} />;
  }
  if (currentView === 'email') {
    return <EmailAnalyzer user={user} onNavigate={setCurrentView} logout={logout} />;
  }
  // currentView === 'analyzer'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Phishing Detector
              </h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('analyzer')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'analyzer'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>URL Analyzer</span>
                </button>
                <button
                  onClick={() => setCurrentView('email')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'email'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span role="img" aria-label="email">✉️</span>
                  <span>Email Analyzer</span>
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Analyze URL</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={analyzeUrl}
              disabled={loading || !url}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze URL'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className={`p-4 rounded-lg ${getRiskColor(result.risk_level)} bg-opacity-10 border-l-4 ${getRiskColor(result.risk_level)}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {result.is_phishing ? '⚠️ Phishing Detected' : '✅ Likely Safe'}
                  </h3>
                  <p className="text-sm opacity-75">
                    Confidence: {(result.confidence * 100).toFixed(1)}% • Risk Level: {result.risk_level}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRiskColor(result.risk_level)}`}>
                  {result.risk_level} Risk
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">URL</div>
                <div className="text-sm font-mono break-words bg-gray-50 border rounded px-2 py-1">{result.url || url}</div>
              </div>

              <div className={`${getRiskTone(result.risk_level)} text-sm`}>
                {getNextSteps(result.risk_level, result.is_phishing)}
              </div>

              {Array.isArray(result.warnings) && result.warnings.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Warnings</h3>
                  <ul className="ml-4 list-disc text-sm space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.features && (
                <div>
                  <h3 className="font-medium mb-1">Why this result</h3>
                  <ul className="ml-4 list-disc text-sm space-y-1">
                    {Object.entries(result.features)
                      .slice(0, 6)
                      .map(([k, v]) => (
                        <li key={k}>
                          <span className="font-medium">{featureKeyToLabel(k)}:</span>{' '}
                          <span className="text-gray-700">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <details className="text-sm">
                <summary className="cursor-pointer font-medium">Technical details</summary>
                <div className="mt-2">
                  <pre className="bg-gray-50 rounded p-3 overflow-x-auto text-xs">{JSON.stringify(result.features || result, null, 2)}</pre>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.model_used ? <span>Model: {result.model_used}</span> : null}
                    {result.analyzed_at ? <span> • Analyzed: {new Date(result.analyzed_at).toLocaleString()}</span> : null}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;