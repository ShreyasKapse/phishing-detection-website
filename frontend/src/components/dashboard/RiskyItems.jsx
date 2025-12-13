import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ExternalLink, Mail, AlertOctagon } from 'lucide-react';

export default function RiskyItems() {
    const topRiskyUrls = [
        { url: 'secure-login-update.com', hits: 142 },
        { url: 'verify-account-bank.net', hits: 89 },
        { url: 'free-crypto-giveaway.xyz', hits: 56 },
        { url: 'netflix-subscription-failed.com', hits: 41 },
    ];

    const topRiskyEmails = [
        { email: 'support@secure-update.com', reports: 34 },
        { email: 'billing@verify-net.com', reports: 22 },
        { email: 'admin@company-it-support.net', reports: 18 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Risky URLs */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <AlertOctagon className="w-5 h-5 text-red-500" />
                        Top Risky URLs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topRiskyUrls.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-red-50/50 rounded-lg border border-red-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center shrink-0">
                                        <ExternalLink className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="truncate">
                                        <div className="font-medium text-gray-900 truncate">{item.url}</div>
                                        <div className="text-xs text-red-600 font-medium">{item.hits} detections</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Risky Emails */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Mail className="w-5 h-5 text-orange-500" />
                        Top Risky Senders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topRiskyEmails.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="truncate">
                                        <div className="font-medium text-gray-900 truncate">{item.email}</div>
                                        <div className="text-xs text-orange-600 font-medium">{item.reports} user reports</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
