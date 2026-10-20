import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AuthenticatedLayout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Statistics({ stats, dailyTrends, modelDistribution, topUsers }) {
    // Prepare chart data
    const dailyTrendsData = {
        labels: dailyTrends.map(item => item.date),
        datasets: [
            {
                label: 'Conversations',
                data: dailyTrends.map(item => item.conversations),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.1
            },
            {
                label: 'Messages',
                data: dailyTrends.map(item => item.messages),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.1
            }
        ]
    };

    const modelDistributionData = {
        labels: modelDistribution.map(item => item.model),
        datasets: [
            {
                label: 'Conversations',
                data: modelDistribution.map(item => item.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('ai-history.index')}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            AI Conversation Statistics
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Admin - AI Statistics" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-5">
                            <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total_conversations}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5">
                            <p className="text-sm font-medium text-gray-600">Total Messages</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total_messages}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5">
                            <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total_tokens.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5">
                            <p className="text-sm font-medium text-gray-600">Total Cost</p>
                            <p className="text-2xl font-semibold text-gray-900">${stats.total_cost}</p>
                        </div>
                    </div>

                    {/* Daily Trends Chart */}
                    <div className="bg-white rounded-lg shadow mb-6 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Activity (Last 30 Days)</h3>
                        <div style={{ height: '400px' }}>
                            <Line data={dailyTrendsData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Model Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Model Distribution</h3>
                            <div style={{ height: '300px' }}>
                                <Pie data={modelDistributionData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Status Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Public</span>
                                        <span className="text-sm text-gray-600">{stats.status_counts.public}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full" 
                                            style={{ width: `${(stats.status_counts.public / stats.total_conversations) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Private</span>
                                        <span className="text-sm text-gray-600">{stats.status_counts.private}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-500 h-2 rounded-full" 
                                            style={{ width: `${(stats.status_counts.private / stats.total_conversations) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Hidden</span>
                                        <span className="text-sm text-gray-600">{stats.status_counts.hidden}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full" 
                                            style={{ width: `${(stats.status_counts.hidden / stats.total_conversations) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Top Users by Conversation Count</h3>
                        </div>
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {topUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.user}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.conversations}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}