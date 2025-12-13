import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, Zap, LayoutDashboard, CheckCircle, ArrowRight, Lock, Activity, Globe, Star, Play, Link as LinkIcon } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left mb-12 lg:mb-0">
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-indigo-100">
                                New: Browser Extension Available
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                                AI-Powered <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                                    Phishing Detection
                                </span>
                                <br />Made Simple
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Protect your digital identity with real-time URL analysis. Our advanced machine learning models detect threats before they can harm you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/analyzer">
                                    <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
                                        <Shield className="mr-2 h-5 w-5" /> Try Analyzer Free
                                    </Button>
                                </Link>
                                <Link to="/#how-it-works">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 text-base border-gray-300 hover:bg-gray-50 text-gray-700">
                                        <Play className="mr-2 h-4 w-4 fill-current" /> See How It Works
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - App Mockup */}
                        <div className="relative">
                            <div className="relative rounded-2xl bg-white shadow-2xl border border-gray-200 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-1 w-20 h-1 bg-gray-200 rounded-b-lg"></div>

                                {/* Window Controls */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="mx-auto text-xs text-gray-400 font-mono bg-white px-3 py-0.5 rounded-md border border-gray-100">
                                        phishguard.ai/analyzer
                                    </div>
                                </div>

                                {/* Mockup Content */}
                                <div className="p-8 pb-12 bg-white rounded-b-xl">
                                    <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                            <Shield className="w-10 h-10 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Safe to Proceed</h3>
                                            <p className="text-gray-500">No phishing threats detected in this URL.</p>
                                        </div>
                                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" /> Verified Safe Domain
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce hidden md:flex" style={{ animationDuration: '3s' }}>
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Activity className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-semibold">Real-time Scans</div>
                                    <div className="text-sm font-bold text-gray-900">1,240+ Checked Today</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section (Logos) */}
            <section className="py-10 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by security teams at</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-full"></div> <span className="font-bold text-xl text-gray-600">CyberCorp</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-lg"></div> <span className="font-bold text-xl text-gray-600">BlockSecure</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white ring-2 ring-gray-400"></div> <span className="font-bold text-xl text-gray-600">SkyNet</span></div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-400 rounded-sm transform rotate-45"></div> <span className="font-bold text-xl text-gray-600">IDGuard</span></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Why Choose Us</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Advanced Protection Features
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Our platform utilizes state-of-the-art technology to keep you safe from evolving cyber threats.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Detection</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Deep learning algorithms analyze URL patterns, domain reputation, and page content to identify zero-day threats instantly.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get a safety verdict in milliseconds. Our optimized infrastructure ensures you never have to wait to click safely.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                                <LayoutDashboard className="w-7 h-7 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">User Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track your scan history, manage API keys, and generate detailed security reports all from one centralized hub.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gray-50" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Process</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-lg text-gray-500">Three simple steps to ensure your browsing safety.</p>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-8">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative text-center z-10">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center mb-6">
                                <span className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full font-bold text-xl">1</span>
                            </div>
                            <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold absolute top-0 right-[35%] border-4 border-gray-50">
                                <LinkIcon className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Enter URL or Email</h3>
                            <p className="text-gray-600 px-4">Paste the suspicious link or email content into our scanner.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center z-10">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center mb-6">
                                <Globe className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                            <p className="text-gray-600 px-4">Our engines scan the code, domain age, and heuristic patterns.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center z-10">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Verdict</h3>
                            <p className="text-gray-600 px-4">Receive a clear "Safe" or "Phishing" result immediately.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Reviews</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">What Users Say</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <p className="text-gray-700 italic mb-6">"PhishGuard saved my company from a sophisticated spear-phishing attack last week. The AI detected it instantly when other tools missed it."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="User" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Marcus Chen</div>
                                    <div className="text-sm text-gray-500">CISO, FinTech Inc.</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <p className="text-gray-700 italic mb-6">"The Chrome extension is seamless. It checks every link in my emails without slowing down my browser. Highly recommended for remote teams."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="User" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Elena Rodriguez</div>
                                    <div className="text-sm text-gray-500">Freelance Developer</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100">
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>
                            <p className="text-gray-700 italic mb-6">"Incredibly fast API. We integrated PhishGuard into our internal Slack bot and its been working flawlessly for months."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="User" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">David Kim</div>
                                    <div className="text-sm text-gray-500">DevOps Engineer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl text-center p-12 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Start Protecting Yourself Today</h2>
                            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                                Don't wait for a data breach to take action. Join thousands of users who trust PhishGuard for real-time protection.
                            </p>
                            <div>
                                <Link to="/analyzer">
                                    <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-100 px-8 h-12 text-base font-bold shadow-lg">
                                        Try Analyzer For Free
                                    </Button>
                                </Link>
                                <p className="mt-4 text-xs text-indigo-300 opacity-70">No credit card required. Free tier available forever.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="h-8 w-8 text-indigo-600" />
                                <span className="text-xl font-bold text-gray-900">PhishGuardAI</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Advanced phishing detection powered by artificial intelligence. Making the internet safer one link at a time.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link to="/features" className="hover:text-indigo-600">Features</Link></li>
                                <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
                                <li><Link to="/api" className="hover:text-indigo-600">API</Link></li>
                                <li><Link to="/extension" className="hover:text-indigo-600">Extension</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
                                <li><Link to="/careers" className="hover:text-indigo-600">Careers</Link></li>
                                <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
                                <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
                                <li><Link to="/cookies" className="hover:text-indigo-600">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-50">
                        <p className="text-xs text-gray-400">© 2025 PhishGuard AI. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Systems Operational
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
