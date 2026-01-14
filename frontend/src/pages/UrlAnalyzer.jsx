import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    AlertTriangle, Shield, CheckCircle, Search, Globe, Lock, Code, Eye,
    Link2, Clock, FileWarning, Fingerprint, ExternalLink, Info, XCircle,
    AlertCircle, ShieldCheck, ShieldX, Zap, FileText, Upload, Download, List
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UrlAnalyzer() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('single'); // 'single' or 'batch'

    // Single Scan State
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Batch Scan State
    const [batchUrls, setBatchUrls] = useState('');
    const [batchResults, setBatchResults] = useState([]);
    const [batchLoading, setBatchLoading] = useState(false);

    const { currentUser } = useAuth();
    const { toast } = useToast();

    // Initialize from URL param
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
            setActiveTab('single');
        }
    }, [searchParams]);

    // --- Single Scan Logic ---
    const analyzeUrl = async (urlToScan = url) => {
        if (!urlToScan) return;
        setLoading(true);
        setResult(null);
        try {
            const headers = {};
            if (currentUser) {
                const token = await currentUser.getIdToken();
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.post(`${API_BASE_URL}/api/analyze/url`, { url: urlToScan }, { headers });
            const data = response.data;

            const normalizedResult = {
                url: urlToScan,
                is_phishing: data.verdict === 'Phishing',
                confidence: data.score,
                risk_level: data.risk_level,
                features: data.signals || data.features || {},
                warnings: data.warnings || [],
                verdict: data.verdict,
                id: data.id,
                scanned_at: new Date().toISOString()
            };

            setResult(normalizedResult);
            toast({
                title: "Analysis Complete",
                description: `Verdict: ${data.verdict}`,
                variant: data.verdict === 'Phishing' ? "destructive" : "default",
            });
        } catch (error) {
            toast({
                title: "Analysis Failed",
                description: error.response?.data?.error || "An error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Batch Scan Logic ---
    const analyzeBatch = async () => {
        const urls = batchUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        if (urls.length === 0) {
            toast({ title: "No URLs", description: "Please enter at least one URL.", variant: "destructive" });
            return;
        }
        if (urls.length > 50) {
            toast({ title: "Limit Exceeded", description: "Max 50 URLs per batch.", variant: "destructive" });
            return;
        }

        setBatchLoading(true);
        setBatchResults([]);
        try {
            const headers = {};
            if (currentUser) {
                const token = await currentUser.getIdToken();
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.post(`${API_BASE_URL}/api/analyze/url/batch`, { urls }, { headers });
            const data = response.data;

            setBatchResults(data.results);
            toast({
                title: "Batch Complete",
                description: `Processed ${data.processed} URLs.`,
            });
        } catch (error) {
            toast({
                title: "Batch Failed",
                description: error.response?.data?.error || "An error occurred.",
                variant: "destructive",
            });
        } finally {
            setBatchLoading(false);
        }
    };

    // --- PDF Export Logic ---
    const exportSinglePDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(result.is_phishing ? 220 : 50, result.is_phishing ? 50 : 180, 50); // Red or Greenish
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text("PhishGuard Security Report", 10, 14);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`Target URL: ${result.url}`, 10, 30);
        doc.text(`Scan Date: ${new Date(result.scanned_at).toLocaleString()}`, 10, 38);
        doc.text(`Verdict: ${result.verdict}`, 10, 46);
        doc.text(`Risk Level: ${result.risk_level}`, 10, 54);
        doc.text(`Confidence Score: ${(result.confidence * 100).toFixed(1)}%`, 10, 62);

        doc.text("Features Detected:", 10, 75);
        const features = Object.entries(result.features).map(([k, v]) => [k, typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v]);

        autoTable(doc, {
            startY: 80,
            head: [['Feature', 'Value']],
            body: features,
        });

        if (result.warnings && result.warnings.length > 0) {
            doc.text("Warnings:", 10, doc.lastAutoTable.finalY + 10);
            result.warnings.forEach((w, i) => {
                doc.text(`- ${w}`, 10, doc.lastAutoTable.finalY + 18 + (i * 7));
            });
        }

        doc.save(`phishguard-report-${new Date().getTime()}.pdf`);
    };

    const exportBatchPDF = () => {
        if (!batchResults.length) return;
        const doc = new jsPDF();
        doc.text("PhishGuard Batch Scan Report", 10, 10);
        doc.text(`Date: ${new Date().toLocaleString()}`, 10, 18);

        const rows = batchResults.map(r => [
            r.url,
            r.verdict || 'N/A',
            r.risk_level || 'N/A',
            r.score ? (r.score * 100).toFixed(0) + '%' : 'N/A'
        ]);

        autoTable(doc, {
            startY: 25,
            head: [['URL', 'Verdict', 'Risk', 'Score']],
            body: rows,
        });

        doc.save(`batch-scan-report-${new Date().getTime()}.pdf`);
    };

    // --- Helpers ---
    const parseUrl = (urlString) => {
        try {
            const parsed = new URL(urlString);
            return {
                protocol: parsed.protocol.replace(':', ''),
                hostname: parsed.hostname,
                pathname: parsed.pathname,
                search: parsed.search,
                port: parsed.port
            };
        } catch {
            return { protocol: '?', hostname: urlString, pathname: '', search: '', port: '' };
        }
    };

    const SignalItem = ({ label, value, isRisky }) => (
        <div className={`flex justify-between items-center p-3 rounded-lg ${isRisky ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
            <span className="text-gray-600 text-sm">{label}</span>
            <span className={`font-medium text-sm ${isRisky ? 'text-red-600' : 'text-gray-900'}`}>
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </span>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            {/* Header */}
            <div className="text-center space-y-6 py-10">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wide">
                    Real-time Threat Intelligence
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Analyze any URL for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">hidden cyber threats</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Deep learning analysis for single links or bulk datasets.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'single' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Single Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('batch')}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'batch' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Batch Scan (New)
                    </button>
                </div>
            </div>

            {/* SINGLE MODE */}
            {activeTab === 'single' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="max-w-3xl mx-auto mb-12 relative">
                        <div className="flex shadow-xl rounded-full p-2 bg-white border border-gray-100 items-center">
                            <div className="pl-4 text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <Input
                                placeholder="https://example.com/suspicious-link"
                                className="border-0 shadow-none focus-visible:ring-0 text-lg h-14 flex-1"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
                            />
                            <Button
                                onClick={() => analyzeUrl()}
                                disabled={loading}
                                className="rounded-full h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            >
                                {loading ? 'Scanning...' : 'Scan URL'}
                            </Button>
                        </div>
                    </div>

                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {/* Verdict Banner */}
                            <div className={`rounded-3xl p-8 text-white shadow-2xl ${result.is_phishing ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-teal-600'}`}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            {result.is_phishing ? <ShieldX className="w-12 h-12 text-white" /> : <ShieldCheck className="w-12 h-12 text-white" />}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-1">{result.verdict}</h2>
                                            <p className="text-white/80 opacity-90 text-lg">
                                                Confidence: {(result.confidence * 100).toFixed(1)}% • Risk: {result.risk_level}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="secondary"
                                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                                            onClick={exportSinglePDF}
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Download Report
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Signals (Same as before) */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Fingerprint className="w-5 h-5 text-indigo-500" /> Technical Signals
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <SignalItem label="Has IP Address" value={result.features?.has_ip_address} isRisky={result.features?.has_ip_address} />
                                        <SignalItem label="URL Length" value={`${result.features?.url_length || 0} chars`} isRisky={result.features?.url_length > 75} />
                                        <SignalItem label="Subdomain Count" value={result.features?.subdomain_count || 0} isRisky={result.features?.subdomain_count > 3} />
                                        <SignalItem label="Is Shortened URL" value={result.features?.is_shortened} isRisky={result.features?.is_shortened} />
                                        <SignalItem label="Has Valid SSL" value={result.features?.has_valid_ssl} isRisky={!result.features?.has_valid_ssl} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <FileWarning className="w-5 h-5 text-orange-500" /> Warnings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {result.warnings && result.warnings.length > 0 ? (
                                            <ul className="space-y-2">
                                                {result.warnings.map((w, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                                                <CheckCircle className="w-5 h-5" />
                                                <span>No specific warnings detected</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* BATCH MODE */}
            {activeTab === 'batch' && (
                <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch URL Scanner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    Enter up to 50 URLs (one per line). Ideal for checking lists of suspicious domains.
                                </p>
                                <textarea
                                    className="w-full h-48 rounded-md border border-gray-200 p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="https://example.com&#10;http://suspicious-site.net&#10;..."
                                    value={batchUrls}
                                    onChange={(e) => setBatchUrls(e.target.value)}
                                />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">
                                        {batchUrls.split('\n').filter(line => line.trim().length > 0).length} / 50 URLs
                                    </span>
                                    <Button onClick={analyzeBatch} disabled={batchLoading}>
                                        {batchLoading ? 'Processing...' : 'Scan All URLs'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {batchResults.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Batch Results</h3>
                                <Button variant="outline" onClick={exportBatchPDF}>
                                    <Download className="w-4 h-4 mr-2" /> Export to PDF
                                </Button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {batchResults.map((res, idx) => (
                                            <tr key={idx} className={res.verdict === 'Phishing' ? 'bg-red-50/50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono truncate max-w-xs" title={res.url}>
                                                    {res.url}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {res.status === 'error' ? (
                                                        <span className="text-red-500">Error</span>
                                                    ) : (
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${res.verdict === 'Phishing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {res.verdict}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {res.risk_level}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {res.score ? (res.score * 100).toFixed(0) + '%' : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
