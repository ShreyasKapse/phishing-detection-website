import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    AlertTriangle, Shield, CheckCircle, Search, Globe, Lock, Code, Eye,
    Link2, Clock, FileWarning, Fingerprint, ExternalLink, Info, XCircle,
    AlertCircle, ShieldCheck, ShieldX, Zap
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UrlAnalyzer() {
    const [searchParams] = useSearchParams();
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    const { toast } = useToast();

    // Initialize from URL param
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
        }
    }, [searchParams]);

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

    // Parse URL for display
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

    const getRecommendation = (verdict, riskLevel) => {
        if (verdict === 'Phishing' || riskLevel === 'Critical' || riskLevel === 'High') {
            return {
                icon: XCircle,
                color: 'text-red-600',
                bg: 'bg-red-50',
                border: 'border-red-200',
                title: 'Do NOT visit this URL',
                description: 'This URL shows strong indicators of phishing or malicious activity. Do not enter any personal information or credentials.',
                actions: ['Close the page immediately', 'Report to your IT team', 'Clear browser cache if visited']
            };
        } else if (riskLevel === 'Medium') {
            return {
                icon: AlertCircle,
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                title: 'Proceed with caution',
                description: 'This URL has some suspicious characteristics. Verify the source before proceeding.',
                actions: ['Verify the sender/source', 'Check for HTTPS', 'Don\'t enter sensitive data']
            };
        } else {
            return {
                icon: ShieldCheck,
                color: 'text-green-600',
                bg: 'bg-green-50',
                border: 'border-green-200',
                title: 'URL appears safe',
                description: 'No major threats detected. However, always stay vigilant online.',
                actions: ['Site passed security checks', 'Still verify if unexpected', 'Report if suspicious']
            };
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
        <div className="max-w-5xl mx-auto space-y-10 pb-12">
            {/* Header / Input Section */}
            <div className="text-center space-y-6 py-10">
                <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wide">
                    Real-time Threat Intelligence
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Analyze any URL for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">hidden cyber threats</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Paste a suspicious link below. Our multi-layered AI engine scans for phishing patterns, malware signatures, and fraudulent domains instantly.
                </p>

                <div className="max-w-3xl mx-auto mt-8 relative">
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

                <div className="flex justify-center gap-8 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Deep Learning Analysis
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> 30+ Blocklists Checked
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Saved to History
                    </div>
                </div>
            </div>

            {/* Results Section */}
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
                            <div className="text-center md:text-right">
                                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Scanned</div>
                                <div className="font-mono text-sm">{new Date(result.scanned_at).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Risk Score Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-white/80 mb-2">
                                <span>Risk Score</span>
                                <span>{(result.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${result.is_phishing ? 'bg-white' : 'bg-white/80'}`}
                                    style={{ width: `${result.confidence * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* URL Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Link2 className="w-5 h-5 text-indigo-500" /> URL Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const parsed = parseUrl(result.url);
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Protocol</div>
                                            <div className={`font-mono font-medium ${parsed.protocol === 'https' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {parsed.protocol}://
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Domain</div>
                                            <div className="font-mono font-medium text-gray-900 truncate">{parsed.hostname}</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Path</div>
                                            <div className="font-mono font-medium text-gray-900 truncate">{parsed.pathname || '/'}</div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Query</div>
                                            <div className="font-mono font-medium text-gray-900 truncate">{parsed.search || 'None'}</div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Detailed Signals Grid */}
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
                                <SignalItem label="Special Characters" value={result.features?.special_char_count || 0} isRisky={result.features?.special_char_count > 5} />
                                <SignalItem label="Is Shortened URL" value={result.features?.is_shortened} isRisky={result.features?.is_shortened} />
                                <SignalItem label="Has Valid SSL" value={result.features?.has_valid_ssl} isRisky={!result.features?.has_valid_ssl} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileWarning className="w-5 h-5 text-orange-500" /> Warnings & Alerts
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

                    {/* Recommendation Section */}
                    {(() => {
                        const rec = getRecommendation(result.verdict, result.risk_level);
                        const RecIcon = rec.icon;
                        return (
                            <Card className={`${rec.bg} ${rec.border} border-2`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${rec.bg}`}>
                                            <RecIcon className={`w-8 h-8 ${rec.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-bold ${rec.color} mb-2`}>{rec.title}</h3>
                                            <p className="text-gray-600 mb-4">{rec.description}</p>
                                            <ul className="space-y-2">
                                                {rec.actions.map((action, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                        <Zap className={`w-4 h-4 ${rec.color}`} />
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })()}
                </div>
            )}

            {/* Features Info (if no result) */}
            {!result && (
                <div className="grid md:grid-cols-4 gap-6 pt-10">
                    {[
                        { icon: Globe, title: 'DNS Analysis', desc: 'Validates A, MX, and TXT records.' },
                        { icon: Lock, title: 'SSL Inspection', desc: 'Checks issuer validity and expiration.' },
                        { icon: Code, title: 'AI Content Scan', desc: 'NLP models read page text.' },
                        { icon: Eye, title: 'Visual Matching', desc: 'Compares screenshots via CV.' },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
                            <div className="w-12 h-12 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
