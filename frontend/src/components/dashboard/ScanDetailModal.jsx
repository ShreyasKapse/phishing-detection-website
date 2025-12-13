import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
    X, Shield, ShieldX, ShieldCheck, AlertTriangle, CheckCircle,
    Link2, Fingerprint, FileWarning, Zap, AlertCircle, XCircle, Clock
} from 'lucide-react';

export default function ScanDetailModal({ scan, isOpen, onClose }) {
    if (!isOpen || !scan) return null;

    const parseUrl = (urlString) => {
        try {
            const parsed = new URL(urlString);
            return {
                protocol: parsed.protocol.replace(':', ''),
                hostname: parsed.hostname,
                pathname: parsed.pathname,
                search: parsed.search
            };
        } catch {
            return { protocol: '?', hostname: urlString, pathname: '', search: '' };
        }
    };

    const getRecommendation = (result, riskLevel) => {
        const isPhishing = result === 'Phishing';
        if (isPhishing || riskLevel === 'Critical' || riskLevel === 'High') {
            return {
                icon: XCircle,
                color: 'text-red-600',
                bg: 'bg-red-50',
                title: 'Dangerous URL',
                description: 'This URL was flagged as potentially malicious.'
            };
        } else if (riskLevel === 'Medium' || result === 'Suspicious') {
            return {
                icon: AlertCircle,
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
                title: 'Suspicious URL',
                description: 'This URL has some concerning characteristics.'
            };
        } else {
            return {
                icon: ShieldCheck,
                color: 'text-green-600',
                bg: 'bg-green-50',
                title: 'Safe URL',
                description: 'No major threats were detected.'
            };
        }
    };

    const SignalItem = ({ label, value, isRisky }) => (
        <div className={`flex justify-between items-center p-2 rounded ${isRisky ? 'bg-red-50' : 'bg-gray-50'}`}>
            <span className="text-gray-600 text-xs">{label}</span>
            <span className={`font-medium text-xs ${isRisky ? 'text-red-600' : 'text-gray-900'}`}>
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value ?? 'N/A')}
            </span>
        </div>
    );

    const parsed = parseUrl(scan.url || scan.content || '');
    const rec = getRecommendation(scan.result, scan.risk_level);
    const RecIcon = rec.icon;
    const confidence = scan.confidence || 0;
    const features = scan.features || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={`p-6 rounded-t-2xl ${scan.result === 'Safe' ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                {scan.result === 'Safe' ? <ShieldCheck className="w-8 h-8" /> : <ShieldX className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{scan.result}</h2>
                                <p className="text-white/80 text-sm">
                                    Confidence: {(confidence * 100).toFixed(1)}% • Risk: {scan.risk_level || 'Unknown'}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Risk Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Risk Score</span>
                            <span>{(confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-white"
                                style={{ width: `${confidence * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Scanned URL */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <Link2 className="w-4 h-4" /> Scanned URL
                        </h3>
                        <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-700 break-all">
                            {scan.url || scan.content || 'Unknown'}
                        </div>
                    </div>

                    {/* URL Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Protocol</div>
                            <div className={`font-mono font-medium ${parsed.protocol === 'https' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {parsed.protocol}://
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">Domain</div>
                            <div className="font-mono font-medium text-gray-900 truncate">{parsed.hostname}</div>
                        </div>
                    </div>

                    {/* Technical Signals */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Fingerprint className="w-4 h-4 text-indigo-500" /> Technical Signals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <SignalItem label="Has IP Address" value={features.has_ip_address} isRisky={features.has_ip_address} />
                            <SignalItem label="URL Length" value={`${features.url_length || 0} chars`} isRisky={features.url_length > 75} />
                            <SignalItem label="Subdomains" value={features.subdomain_count || 0} isRisky={features.subdomain_count > 3} />
                            <SignalItem label="Special Chars" value={features.special_char_count || 0} isRisky={features.special_char_count > 5} />
                            <SignalItem label="Shortened URL" value={features.is_shortened} isRisky={features.is_shortened} />
                            <SignalItem label="Valid SSL" value={features.has_valid_ssl} isRisky={!features.has_valid_ssl} />
                        </CardContent>
                    </Card>

                    {/* Warnings */}
                    {scan.warnings && scan.warnings.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <FileWarning className="w-4 h-4 text-orange-500" /> Warnings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {scan.warnings.map((w, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-orange-50 p-2 rounded border border-orange-100">
                                            <AlertTriangle className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recommendation */}
                    <div className={`p-4 rounded-xl ${rec.bg} border ${rec.color.replace('text-', 'border-')}`}>
                        <div className="flex items-center gap-3">
                            <RecIcon className={`w-6 h-6 ${rec.color}`} />
                            <div>
                                <h4 className={`font-bold ${rec.color}`}>{rec.title}</h4>
                                <p className="text-sm text-gray-600">{rec.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        Scanned: {scan.timestamp ? new Date(scan.timestamp).toLocaleString() : 'Unknown'}
                    </div>
                </div>
            </div>
        </div>
    );
}
