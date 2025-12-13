import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Activity, AlertTriangle, Users, Zap } from 'lucide-react';

export default function StatsCards({ totalScans, threatsBlocked, loading }) {
    // Mock data for things we don't have yet
    const activeUsers = 1250;
    const currentStreak = 5;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Scans */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-bold">+12%</span>
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

            {/* Active Users (Mock) */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">Global</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeUsers.toLocaleString()}</h3>
                </CardContent>
            </Card>

            {/* Activity Streak (Mock) */}
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 text-xs font-bold">On Fire!</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Activity Streak</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{currentStreak} Days</h3>
                </CardContent>
            </Card>
        </div>
    );
}
