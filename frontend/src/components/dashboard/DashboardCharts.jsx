import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardCharts({ history = [] }) {

    // Process history for Risk Distribution
    const pieData = useMemo(() => {
        if (!history || history.length === 0) return [
            { name: 'No Data', value: 1, color: '#e5e7eb' }
        ];

        let safe = 0;
        let suspicious = 0;
        let phishing = 0;

        history.forEach(item => {
            if (item.result === 'Safe') safe++;
            else if (item.result === 'Suspicious') suspicious++;
            else phishing++;
        });

        // Filter out zero values to look cleaner
        const data = [
            { name: 'Safe', value: safe, color: '#22c55e' },
            { name: 'Suspicious', value: suspicious, color: '#eab308' },
            { name: 'Phishing', value: phishing, color: '#ef4444' },
        ].filter(d => d.value > 0);

        return data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
    }, [history]);

    // Process history for Activity (Last 7 Days)
    const barData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [];

        // Initialize last 7 days buckets
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push({
                name: days[d.getDay()],
                dateStr: d.toDateString(), // for matching
                count: 0
            });
        }

        if (history) {
            history.forEach(item => {
                const itemDate = new Date(item.created_at || item.timestamp); // Handle both formats
                const itemDateStr = itemDate.toDateString();

                const dayBucket = last7Days.find(d => d.dateStr === itemDateStr);
                if (dayBucket) {
                    dayBucket.count++;
                }
            });
        }

        return last7Days.map(d => ({ name: d.name, scans: d.count }));
    }, [history]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Pie Chart */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Activity Bar Chart */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Daily Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="scans" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
