import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Shield, CheckCircle, Upload, Link as LinkIcon, FileText, Zap, Clock, ShieldCheck, Fingerprint, FileWarning } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EmailAnalyzer() {
  const [formData, setFormData] = useState({ subject: '', body: '', from: '', reply_to: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resultRef = useRef(null);

  // Auto-scroll when results appear
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const headers = {};
      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("Sending email analysis request...", formData);
      const response = await axios.post(`${API_BASE_URL}/api/analyze/email`, formData, { headers });
      console.log("Received response:", response.data);
      const data = response.data;

      const normalizedResult = {
        is_phishing: data.verdict === 'Phishing',
        confidence: data.score,
        risk_level: data.risk_level,
        features: data.signals || data.features,
        warnings: data.warnings,
        verdict: data.verdict
      };

      console.log("Normalized Result:", normalizedResult);

      setResult(normalizedResult);

      // Auto-scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      toast({
        title: "Analysis Complete",
        description: `Verdict: ${data.verdict}`,
        variant: data.verdict === 'Phishing' ? "destructive" : "default",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Analysis Failed",
        description: err.response?.data?.error || err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Email Threat <span className="text-indigo-600">Analyzer</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Paste email content, headers, or suspicious text below. Our deep learning engine will analyze the syntax, sender reputation, and links in real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Input Form */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {/* Mock Tabs */}
            <div className="flex gap-4 mb-6 text-sm font-medium border-b border-gray-100 pb-1">
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText className="w-4 h-4" /> Structured Input
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 cursor-not-allowed">
                <Upload className="w-4 h-4" /> Upload .EML
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 cursor-not-allowed">
                <LinkIcon className="w-4 h-4" /> URL Only
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-xs uppercase text-gray-400 font-bold">From (Sender)</Label>
                  <Input name="from" id="from" className="bg-gray-50 border-gray-200" placeholder="phisher@gmail.com" value={formData.from} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply_to" className="text-xs uppercase text-gray-400 font-bold">Reply-To</Label>
                  <Input name="reply_to" id="reply_to" className="bg-gray-50 border-gray-200" placeholder="Optional" value={formData.reply_to} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs uppercase text-gray-400 font-bold">Subject Line</Label>
                <Input name="subject" id="subject" className="bg-gray-50 border-gray-200 font-medium" placeholder="Urgent: Account Verification Required" value={formData.subject} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-xs uppercase text-gray-400 font-bold">Email Body</Label>
                <textarea
                  name="body"
                  id="body"
                  placeholder="Paste the full email body content here..."
                  rows={8}
                  value={formData.body}
                  onChange={handleChange}
                  required
                  className="flex w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                  </div>
                  <span className="text-sm text-gray-500">Deep Scan (Slower)</span>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setFormData({ subject: '', body: '', from: '', reply_to: '' })}>Clear</Button>
                  <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                    {loading ? 'Analyzing...' : 'Analyze Risk'}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {result && (
            <div ref={resultRef} className="space-y-8">
              {/* 1. Header Summary Card */}
              <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden ${result.is_phishing ? 'bg-gradient-to-r from-red-600 to-pink-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                  {result.is_phishing ? <AlertTriangle className="w-64 h-64" /> : <Shield className="w-64 h-64" />}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold tracking-wide uppercase">
                      {result.is_phishing ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      {result.risk_level} Risk
                    </div>
                    <h2 className="text-5xl font-black tracking-tight mb-2">{result.verdict}</h2>
                    <p className="text-lg opacity-90 max-w-md">
                      {result.is_phishing
                        ? "This email contains strong indicators of a phishing attempt. Do not reply or click."
                        : "This email appears safe, but always verify sensitive requests."}
                    </p>
                  </div>

                  {/* Gauge */}
                  <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 text-center min-w-[200px]">
                    <div className="text-4xl font-black mb-1">{(result.confidence * 100).toFixed(0)}%</div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80">Confidence Score</div>
                    <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-1000 ease-out"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Breakdown Grid */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Identity Card */}
                <Card className="border-gray-100 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-indigo-600" /> Identity Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    {/* Sender */}
                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-500 uppercase">Sender Domain</span>
                        <div className="font-mono text-sm break-all">{formData.from}</div>
                      </div>
                      {result.features?.from_free_domain === 1 ? (
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded">FREE DOMAIN</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">DOMAIN CHECKED</span>
                      )}
                    </div>

                    {/* Reply-To Mismatch */}
                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-500 uppercase">Return Path (Reply-To)</span>
                        <div className="font-mono text-sm break-all">{formData.reply_to || 'Same as Sender'}</div>
                      </div>
                      {result.features?.reply_to_mismatch === 1 ? (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded animate-pulse">MISMATCH</span>
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500 opacity-50" />
                      )}
                    </div>

                    {/* Suspicious TLD */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Top-Level Domain (TLD)</span>
                      {result.features?.from_odd_tld === 1 ? (
                        <span className="text-red-600 font-bold text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Suspicious</span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Standard</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Analysis Card */}
                <Card className="border-gray-100 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <FileWarning className="w-5 h-5 text-indigo-600" /> Content Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Keyword Urgency */}
                      <div className="p-3 bg-indigo-50 rounded-xl text-center">
                        <div className="text-2xl font-black text-indigo-700">{(result.features?.subject_keywords || 0) + (result.features?.body_keywords || 0)}</div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase">Urgency Keywords</div>
                      </div>

                      {/* Link Count */}
                      <div className="p-3 bg-red-50 rounded-xl text-center">
                        <div className="text-2xl font-black text-red-700">{result.features?.link_count || 0}</div>
                        <div className="text-[10px] font-bold text-red-400 uppercase">Links Found</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Attachment Analysis</span>
                        {result.features?.suspicious_attach_count > 0 ? (
                          <span className="text-red-600 font-bold">Suspicious Type Detected</span>
                        ) : (
                          <span className="text-gray-400">Clean / None</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">HTML Structure</span>
                        {result.features?.html_tag_count > 25 ? (
                          <span className="text-yellow-600 font-bold">Heavy HTML (Obfuscation Risk)</span>
                        ) : (
                          <span className="text-gray-400">Normal Text</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* 3. Warnings & Recommendations */}
              <div className="grid md:grid-cols-3 gap-6">

                {/* Warnings List */}
                <Card className={`border-gray-100 shadow-md md:col-span-2 ${result.is_phishing ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-emerald-500'}`}>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Detailed Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.warnings && result.warnings.length > 0 ? (
                      <ul className="space-y-3">
                        {(result.warnings || []).map((w, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <ShieldCheck className="w-12 h-12 text-emerald-200 mb-2" />
                        <p>No critical warnings found. This email looks clean.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recommendation Action */}
                <Card className="bg-gray-900 text-white border-0 shadow-xl flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Recommendation
                    </h3>

                    {result.is_phishing ? (
                      <>
                        <p className="text-2xl font-bold leading-tight">Delete this email immediately.</p>
                        <p className="text-sm text-gray-400">Do not click any links or download attachments. Block the sender.</p>
                      </>
                    ) : result.risk_level === 'Medium' || result.risk_level === 'High' ? (
                      <>
                        <p className="text-2xl font-bold leading-tight">Proceed with caution.</p>
                        <p className="text-sm text-gray-400">Verify the sender through another channel before replying.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold leading-tight">Safe to open.</p>
                        <p className="text-sm text-gray-400">The content matches standard legitimate email patterns.</p>
                      </>
                    )}
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold" onClick={() => setFormData({ subject: '', body: '', from: '', reply_to: '' })}>
                      Analyze Another
                    </Button>
                  </div>
                </Card>

              </div>

            </div>
          )}
        </div>

        {/* Right Column - Sidebar Widgets (Unchanged) */}
        <div className="space-y-6">
          {/* Analysis Checks */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-pink-600" />
                </div>
                <h3 className="font-bold text-gray-900">Analysis Checks</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" /> SPF / DKIM / DMARC
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Domain Age & Reputation
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Hidden Hyperlinks
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Heuristic NLP
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans (Fake) */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Recent Scans</h3>
                <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">support@paypal.com</span>
                      <span className="text-xs text-gray-400">2 mins ago</span>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">HIGH</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Shield className="w-3 h-3" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">newsletter@figma.com</span>
                      <span className="text-xs text-gray-400">15 mins ago</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">SAFE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Feature Banner */}
          <div className="bg-indigo-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-bold mb-3 uppercase tracking-wider">Pro Feature</span>
              <h3 className="font-bold mb-2">Automate with API</h3>
              <p className="text-xs text-indigo-200 mb-4">Integrate PhishGuard directly into your SOC workflow or Slack.</p>
              <Button size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 w-full text-xs font-bold">Get API Key</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
