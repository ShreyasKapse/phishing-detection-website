import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Activity, AlertTriangle, CheckCircle, Percent } from 'lucide-react';

export default function StatsCards({ totalScans, threatsBlocked, loading }) {
    const safeScans = totalScans - threatsBlocked;
    const riskRate = totalScans > 0 ? Math.round((threatsBlocked / totalScans) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Scans */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Total Scans</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {loading ? '...' : totalScans.toLocaleString()}
                    </h3>
                </CardContent>
            </Card>

            {/* Threats Blocked */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs font-bold">Action</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Threats Blocked</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {loading ? '...' : threatsBlocked.toLocaleString()}
                    </h3>
                </CardContent>
            </Card>

            {/* Safe Scans */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-bold">Clean</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Safe Scans</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {loading ? '...' : safeScans.toLocaleString()}
                    </h3>
                </CardContent>
            </Card>

            {/* Risk Ratio */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Risk Ratio</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{riskRate}%</h3>
                </CardContent>
            </Card>
        </div>
    );
}
