import React from 'react';
import { Button } from '../components/ui/button';
import { Check, Shield, Zap, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
    return (
        <div className="py-24 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-500">Start for free, upgrade for advanced protection and API access.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
                        <div className="mb-6">
                            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide mb-4">
                                Personal
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">$0</h2>
                            <p className="text-gray-500 mt-1">Forever free</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500" /> 100 URL Scans / day
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500" /> Basic Email Analysis
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500" /> Browser Extension
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500" /> Community Support
                            </li>
                        </ul>
                        <Link to="/signup">
                            <Button className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-600 p-8 flex flex-col relative transform scale-105 z-10">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                            POPULAR
                        </div>
                        <div className="mb-6">
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-4">
                                Pro
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">$12<span className="text-lg text-gray-400 font-normal">/mo</span></h2>
                            <p className="text-gray-500 mt-1">For power users</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-indigo-600" /> Unlimited URL Scans
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-indigo-600" /> Advanced Heuristics
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-indigo-600" /> PDF Reports
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-indigo-600" /> Priority Support
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-indigo-600" /> API Access (1k req/mo)
                            </li>
                        </ul>
                        <Link to="/signup?plan=pro">
                            <Button className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
                        <div className="mb-6">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
                                Enterprise
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">Custom</h2>
                            <p className="text-gray-500 mt-1">For large teams</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-700">
                                <Briefcase className="w-5 h-5 text-blue-500" /> Everything in Pro
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-blue-500" /> SSO & SAML
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-blue-500" /> Dedicated Account Manager
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-blue-500" /> Unlimited API
                            </li>
                            <li className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-blue-500" /> On-premise Deployment
                            </li>
                        </ul>
                        <Link to="/contact">
                            <Button variant="outline" className="w-full h-12 text-lg border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
