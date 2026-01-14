import React from 'react';
import { Button } from '../components/ui/button';
import { Shield, Zap, Chrome, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Extension() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <section className="pt-20 pb-32 overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-4">
                            Early Access
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                            Phishing Protection for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Your Browser
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Stay safe while you browse. Our extension automatically scans every link you visit and warns you of potential threats in real-time.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl flex items-center gap-2">
                                <Chrome className="w-6 h-6" /> Add to Chrome
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg flex items-center gap-2">
                                <Download className="w-5 h-5" /> Download for Edge
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">Version 1.0.2 • Free Forever • Privacy First</p>
                    </div>

                    <div className="mt-20 relative">
                         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-full bg-indigo-200 blur-3xl opacity-30 -z-10"></div>
                        <img 
                            src="https://placehold.co/1200x800/png?text=Extension+Preview" 
                            alt="Extension Preview" 
                            className="rounded-xl shadow-2xl border border-gray-200 mx-auto w-full md:w-3/4"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Zero Latency</h3>
                            <p className="text-gray-600">Scans execute in milliseconds without slowing down your browsing experience.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-time Blocking</h3>
                            <p className="text-gray-600">Automatically prevents page loads if a critical threat is detected.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Visual Indicators</h3>
                            <p className="text-gray-600">Simple Green/Red badge icons let you know the status of any site instantly.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
