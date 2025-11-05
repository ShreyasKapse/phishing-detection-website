import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCards from '../components/StatsCards';
import RiskDistributionChart from '../components/RiskDistributionChart';
import { Activity, Shield, AlertTriangle, Home, BarChart3, LogOut } from 'lucide-react';
import TopRiskyUrls from '../components/TopRiskyUrls';
import TopRiskyEmails from '../components/TopRiskyEmails';
import FeatureFrequencyChart from '../components/FeatureFrequencyChart';
import WarningsFrequencyChart from '../components/WarningsFrequencyChart';
import ActivityStreak from '../components/ActivityStreak';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = ({ user, onNavigate, logout }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [listTab, setListTab] = useState('urls');

  useEffect(() => {
    fetchAnalytics();
    fetchRecentAnalyses();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/analyses?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentAnalyses(response.data.analyses);
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Phishing Detector
              </h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => onNavigate ? onNavigate('analyzer') : null}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-white/70 backdrop-blur border hover:bg-blue-50 text-gray-700 hover:text-blue-800`}
                >
                  <Home className="w-4 h-4" />
                  <span>URL Analyzer</span>
                </button>
                <button
                  onClick={() => onNavigate ? onNavigate('email') : null}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-white/70 backdrop-blur border hover:bg-blue-50 text-gray-700 hover:text-blue-800`}
                >
                  <span role="img" aria-label="email">✉️</span>
                  <span>Email Analyzer</span>
                </button>
                <button
                  onClick={() => onNavigate ? onNavigate('dashboard') : null}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white shadow hover:bg-blue-700`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
              )}
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-gray-700 text-white py-2 px-3 rounded-md hover:bg-gray-800 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 mt-6">
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Security Dashboard</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">Your real-time overview of phishing detections, risk levels, and recent activity across URLs and emails.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => onNavigate && onNavigate('analyzer')} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700">Analyze URL</button>
              <button onClick={() => onNavigate && onNavigate('email')} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Analyze Email</button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {analytics && <StatsCards stats={analytics.overview} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution Chart */}
          <RiskDistributionChart data={analytics?.risk_distribution} />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Analyses
            </h3>
            <div className="space-y-3">
              {(Array.isArray(recentAnalyses) ? recentAnalyses : []).map((analysis) => (
                <div
                  key={analysis.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    analysis.is_phishing ? 'bg-rose-50/60 border-rose-100' : 'bg-emerald-50/60 border-emerald-100'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {analysis.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysis.is_phishing ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Shield className="w-4 h-4 text-emerald-600" />
                    )}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        analysis.is_phishing
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {analysis.is_phishing ? 'Phishing' : 'Safe'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Widgets */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-100">
            <div className="flex border-b">
              <button onClick={() => setListTab('urls')} className={`px-4 py-3 text-sm font-medium ${listTab==='urls' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Top Risky URLs</button>
              <button onClick={() => setListTab('emails')} className={`px-4 py-3 text-sm font-medium ${listTab==='emails' ? 'text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Top Risky Emails</button>
            </div>
            <div className="p-6">
              {listTab === 'urls' ? (
                <TopRiskyUrls urls={analytics?.top_risky_urls} asPlain />
              ) : (
                <TopRiskyEmails emails={analytics?.top_risky_emails} asPlain />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Feature Frequency Bar Chart */}
          <FeatureFrequencyChart data={analytics?.feature_frequency} />
          {/* Warnings Frequency Bar Chart */}
          <WarningsFrequencyChart data={analytics?.warnings_frequency} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Streak Calendar */}
          <ActivityStreak days={analytics?.activity_days} />
        </div>

        {/* Daily Activity */}
        {analytics?.daily_activity && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">7-Day Activity</h3>
            <div className="grid grid-cols-7 gap-4">
              {analytics.daily_activity.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-600 mb-1">{day.day}</div>
                  <div
                    className={`h-20 rounded-lg flex items-end justify-center ${
                      day.analyses > 0 ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {day.analyses > 0 && (
                      <div
                        className={`w-8 rounded-t ${
                          day.analyses > 3 ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                        style={{ height: `${Math.min(day.analyses * 20, 100)}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{day.analyses}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;