import React, { useState } from 'react';
import axios from 'axios';
import { Home, BarChart3, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmailAnalyzer = ({ user, onNavigate, logout }) => {
  const [formData, setFormData] = useState({ subject: '', body: '', from: '', reply_to: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/analyze/email`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze email.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch ((riskLevel || '').toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

	const getRiskTone = (riskLevel) => {
		switch ((riskLevel || '').toLowerCase()) {
			case 'low': return 'text-green-700';
			case 'medium': return 'text-yellow-800';
			case 'high': return 'text-orange-800';
			case 'critical': return 'text-red-800';
			default: return 'text-gray-700';
		}
	};

	const getNextSteps = (riskLevel, isPhishing) => {
		const level = (riskLevel || '').toLowerCase();
		if (isPhishing) return 'Do not click links or open attachments. Report this email to your security team and delete it.';
		if (level === 'medium') return 'Be cautious. Verify the sender and avoid sharing sensitive information.';
		if (level === 'high' || level === 'critical') return 'Treat as dangerous. Do not interact and report immediately.';
		return 'Likely safe. If unexpected, verify with the sender before acting.';
	};

	const featureKeyToLabel = (key) => {
		const map = {
			suspicious_keywords: 'Suspicious keywords',
			spoofed_sender: 'Spoofed sender',
			mismatched_reply_to: 'Mismatched Reply-To',
			urgent_language: 'Urgent language',
			attachment_count: 'Attachment count',
			link_count: 'Link count',
			shortened_links: 'Shortened links',
			domain_age_days: 'Domain age (days)',
		};
		return map[key] || key;
	};

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Phishing Detector
              </h1>
              <nav className="flex space-x-4">
                <button
                  onClick={() => onNavigate && onNavigate('analyzer')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700`}
                >
                  <Home className="w-4 h-4" />
                  <span>URL Analyzer</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('email')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700`}
                >
                  <span role="img" aria-label="email">✉️</span>
                  <span>Email Analyzer</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700`}
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
                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Phishing Email Analyzer</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">From (Sender)</label>
            <input name="from" type="email" placeholder="phisher@gmail.com" required value={formData.from} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Reply-To (optional)</label>
            <input name="reply_to" type="email" placeholder="(if different)" value={formData.reply_to} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input name="subject" type="text" placeholder="Important: Action Required" required value={formData.subject} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Body</label>
            <textarea name="body" placeholder="Paste email body here" required rows={6} value={formData.body} onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded-md px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Email'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 rounded p-4 text-red-700 mb-4">{error}</div>
        )}
		{result && (
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-lg font-semibold mb-2">Analysis Results</h2>
				<div className={`mb-4 p-4 rounded ${getRiskColor(result.risk_level)} bg-opacity-10 border-l-4 ${getRiskColor(result.risk_level)}`}>
					<div className="flex justify-between items-center">
						<div>
							<p className="text-base font-semibold">
								{result.is_phishing ? '⚠️ Phishing Detected' : '✅ Likely Safe'}
							</p>
							<p className="text-sm opacity-70">
								Confidence: {(result.confidence * 100).toFixed(1)}% • Risk Level: {result.risk_level}
							</p>
						</div>
						<span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRiskColor(result.risk_level)}`}>{result.risk_level} Risk</span>
					</div>
				</div>

				<div className="space-y-4">
					<div className={`${getRiskTone(result.risk_level)} text-sm`}>
						{getNextSteps(result.risk_level, result.is_phishing)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<div className="text-xs uppercase tracking-wide text-gray-500 mb-1">From</div>
							<div className="text-sm font-mono break-words bg-gray-50 border rounded px-2 py-1">{result.from || formData.from}</div>
						</div>
						{(result.reply_to || formData.reply_to) && (
							<div>
								<div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Reply-To</div>
								<div className="text-sm font-mono break-words bg-gray-50 border rounded px-2 py-1">{result.reply_to || formData.reply_to}</div>
							</div>
						)}
						<div className="sm:col-span-2">
							<div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Subject</div>
							<div className="text-sm break-words bg-gray-50 border rounded px-2 py-1">{result.subject || formData.subject}</div>
						</div>
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
      </div>
    </div>
  );
};

export default EmailAnalyzer;
