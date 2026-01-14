import React from 'react';
import { Button } from '../components/ui/button';
import { Copy, Terminal, Server } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

export default function ApiDocs() {
    const { toast } = useToast();

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Code snippet copied to clipboard.",
        });
    };

    return (
        <div className="py-24 bg-white min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <div className="hidden lg:block col-span-1 space-y-8 sticky top-24 self-start">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Getting Started</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#intro" className="hover:text-indigo-600">Introduction</a></li>
                                <li><a href="#auth" className="hover:text-indigo-600">Authentication</a></li>
                                <li><a href="#rate-limits" className="hover:text-indigo-600">Rate Limits</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4">Endpoints</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#predict-url" className="hover:text-indigo-600 font-medium">POST /api/predict/url</a></li>
                                <li><a href="#predict-email" className="hover:text-indigo-600">POST /api/predict/email</a></li>
                                <li><a href="#batch" className="hover:text-indigo-600">POST /api/batch</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-16">
                        <section id="intro">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">API Documentation</h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-6">
                                Integrate PhishGuard's powerful detection engine directly into your SOC, SIEM, or custom applications.
                                Our REST API provides real-time analysis with JSON responses.
                            </p>
                            <div className="flex gap-4">
                                <Button className="bg-indigo-600 hover:bg-indigo-700">Get API Key</Button>
                                <Button variant="outline">View Postman Collection</Button>
                            </div>
                        </section>

                        <section id="auth">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <key className="w-6 h-6 text-gray-400" /> Authentication
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Authenticate your requests by including your API key in the header.
                            </p>
                            <div className="bg-gray-900 rounded-xl p-6 relative group">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <code className="text-green-400 font-mono text-sm">
                                    Authorization: Bearer YOUR_API_KEY
                                </code>
                            </div>
                        </section>

                        <section id="predict-url">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-green-100 text-green-700 font-mono font-bold rounded-lg text-sm">POST</span>
                                <h2 className="text-2xl font-bold text-gray-900">/api/predict/url</h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Analyzes a single URL for phishing indicators, returning risk score and feature signals.
                            </p>

                            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Request Body</h3>
                            <div className="bg-gray-900 rounded-xl p-6 mb-6">
                                <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                                    {`{
  "url": "https://suspicious-bank-login.com/verify"
}`}
                                </pre>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Response</h3>
                            <div className="bg-gray-900 rounded-xl p-6 relative">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                    onClick={() => copyToClipboard('')}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <pre className="text-gray-300 font-mono text-sm leading-relaxed">
                                    {`{
  "success": true,
  "verdict": "Phishing",
  "score": 0.98,
  "risk_level": "Critical",
  "signals": {
    "is_shortened": false,
    "has_ip_address": false,
    "ssl_valid": false
  }
}`}
                                </pre>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
