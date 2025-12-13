import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Activity, ArrowRight, Eye, Chrome, Slack, Gem,
  Link, Mail, Flag, Lightbulb, Lock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import ErrorBoundary from '../components/ErrorBoundary';
import StatsCards from '../components/dashboard/StatsCards';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RiskyItems from '../components/dashboard/RiskyItems';
import ScanDetailModal from '../components/dashboard/ScanDetailModal';

export default function Dashboard() {
  const { currentUser, getIdToken } = useAuth();
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Modal state
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debugInfo, setDebugInfo] = useState({ status: 'init', error: null, uid: currentUser?.uid });

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      setDebugInfo(prev => ({ ...prev, status: 'fetching', uid: currentUser?.uid }));
      try {
        const token = await getIdToken();
        if (!token) throw new Error("No token returned");

        const response = await fetch(`http://localhost:5000/api/analyses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDebugInfo(prev => ({ ...prev, status: 'success', count: data.analyses?.length }));

          const mappedHistory = (data.analyses || []).map(item => ({
            ...item,
            result: item.is_phishing ? 'Phishing' : (item.risk_level === 'High' || item.risk_level === 'Critical') ? 'Suspicious' : 'Safe',
            url: item.content || item.url || 'Unknown',
            timestamp: item.created_at
          }));
          setHistory(mappedHistory);
        } else {
          const errText = await response.text();
          setDebugInfo(prev => ({ ...prev, status: 'error', error: `${response.status} ${errText}` }));
          console.error("API Error:", response.status, errText);
          toast({ title: "Failed to load history", description: `Error ${response.status}: ${errText}`, variant: "destructive" });
          setHistory([]);
        }
      } catch (error) {
        setDebugInfo(prev => ({ ...prev, status: 'catch_error', error: error.message }));
        console.error("Failed to fetch history", error);
        toast({ title: "Connection Failed", description: error.message, variant: "destructive" });
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currentUser, getIdToken]);

  const handleScan = () => {
    if (urlInput) {
      navigate(`/analyzer?url=${encodeURIComponent(urlInput)}`);
    }
  };

  const openScanDetail = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeScanDetail = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  // Derived Stats
  const totalScans = history.length;
  const threatsBlocked = history.filter(h => h.result === 'Phishing' || h.result === 'Suspicious').length;
  const recentActivity = history.slice(0, 5);

  // Security Tips
  const securityTips = [
    "Always check for HTTPS before entering sensitive data",
    "Hover over links to preview the actual URL",
    "Be wary of urgent or threatening language in emails",
    "When in doubt, type the URL directly in your browser",
    "Keep your browser and antivirus software updated"
  ];
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % securityTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <ErrorBoundary>
        {/* Welcome / Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative z-10 w-full md:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-4">
              <Activity className="w-3 h-3" /> Dashboard Overview
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser?.displayName || 'Defender'}!
            </h1>
            <p className="text-gray-500 mb-6">
              Your system is active and monitoring threats in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <Input
                placeholder="Scan specific URL..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-10 flex-1"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button onClick={handleScan} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6">
                Scan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-full opacity-10">
            <Shield className="w-64 h-64 text-indigo-900 -mb-10 -mr-10" />
          </div>
        </div>

        {/* Key Metrics Cards */}
        <StatsCards totalScans={totalScans} threatsBlocked={threatsBlocked} loading={loading} />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Risky Items & Detailed Lists */}
        <RiskyItems />

        {/* Recent Activity Table + Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                View All
              </Button>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No scans yet. Try scanning a URL!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">URL</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentActivity.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => openScanDetail(item)}>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${item.result === 'Safe' ? 'bg-green-100 text-green-800' :
                            item.result === 'Suspicious' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.result === 'Safe' ? 'bg-green-500' :
                              item.result === 'Suspicious' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></span>
                            {item.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600 truncate max-w-[200px]">
                          {item.url}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Just now'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={(e) => { e.stopPropagation(); openScanDetail(item); }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Widgets */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/analyzer')}
                  className="w-full justify-start gap-3 h-12 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link className="w-5 h-5" /> Scan URL
                </Button>
                <Button
                  onClick={() => navigate('/email')}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  <Mail className="w-5 h-5" /> Scan Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Flag className="w-5 h-5" /> Report a Threat
                </Button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900">Security Tip</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed min-h-[3rem]">
                {securityTips[currentTip]}
              </p>
              <div className="flex gap-1 mt-4">
                {securityTips.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full flex-1 transition-colors ${i === currentTip ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                  />
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Integrations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Chrome className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Chrome Extension</div>
                      <div className="text-xs text-green-600 font-medium">Active • v2.4.1</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Slack className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Slack Bot</div>
                      <div className="text-xs text-gray-400">Disconnected</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold hover:bg-indigo-50">Connect</Button>
                </div>
              </div>
            </div>

            {/* Pro Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">Upgrade to Pro</h3>
                <p className="text-indigo-200 text-sm mb-4">Get unlimited scans and API access.</p>
                <Button size="sm" className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold">Upgrade Now</Button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {/* Scan Detail Modal */}
      <ScanDetailModal
        scan={selectedScan}
        isOpen={isModalOpen}
        onClose={closeScanDetail}
      />

    </div>
  );
}
