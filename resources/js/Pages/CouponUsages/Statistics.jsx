import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Statistics({ 
    auth, 
    totalUsages, 
    uniqueUsers, 
    topCoupons, 
    dailyUsages,
    monthlyUsages,
    hourlyUsages 
}) {
    const getMaxDailyCount = () => {
        if (!dailyUsages || dailyUsages.length === 0) return 0;
        return Math.max(...dailyUsages.map(d => d.count));
    };

    const getMaxMonthlyCount = () => {
        if (!monthlyUsages || monthlyUsages.length === 0) return 0;
        return Math.max(...monthlyUsages.map(m => m.count));
    };

    const getMaxHourlyCount = () => {
        if (!hourlyUsages || hourlyUsages.length === 0) return 0;
        return Math.max(...hourlyUsages.map(h => h.count));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Coupon Usage Statistics
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('coupon-usages.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Back to Usage History
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Coupon Usage Statistics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600">{totalUsages}</div>
                                    <div className="text-sm text-gray-500 mt-2">Total Coupon Usages</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600">{uniqueUsers}</div>
                                    <div className="text-sm text-gray-500 mt-2">Unique Users</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-600">
                                        {topCoupons.length > 0 ? topCoupons[0]?.usage_count || 0 : 0}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">Most Used Coupon (Uses)</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-orange-600">
                                        {totalUsages > 0 && uniqueUsers > 0 
                                            ? (totalUsages / uniqueUsers).toFixed(1) 
                                            : 0}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">Avg. Usages per User</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Coupons */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Top 10 Most Used Coupons</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Coupon Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usage Count
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {topCoupons.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    No usage data available.
                                                </td>
                                            </tr>
                                        ) : (
                                            topCoupons.map((item, index) => (
                                                <tr key={item.coupon_id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        #{index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                                                        {item.coupon?.coupon || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.coupon?.title || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                                            {item.usage_count} uses
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {((item.usage_count / totalUsages) * 100).toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Daily Usage Trend */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Usage Trend (Last 30 Days)</h3>
                            {dailyUsages && dailyUsages.length > 0 ? (
                                <div className="space-y-3">
                                    {dailyUsages.map((day) => {
                                        const maxCount = getMaxDailyCount();
                                        const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                                        return (
                                            <div key={day.date} className="flex items-center group">
                                                <div className="w-32 text-sm text-gray-600">{day.date}</div>
                                                <div className="flex-1 ml-4">
                                                    <div className="relative bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="bg-blue-500 text-xs text-white text-right pr-2 py-1 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        >
                                                            {percentage > 15 && day.count > 0 && day.count}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm font-medium text-gray-600">
                                                    {day.count}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No daily usage data available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Usage Trend */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Usage Trend (Last 12 Months)</h3>
                            {monthlyUsages && monthlyUsages.length > 0 ? (
                                <div className="space-y-3">
                                    {monthlyUsages.map((month) => {
                                        const maxCount = getMaxMonthlyCount();
                                        const percentage = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                                        return (
                                            <div key={month.month} className="flex items-center group">
                                                <div className="w-24 text-sm text-gray-600">{month.display}</div>
                                                <div className="flex-1 ml-4">
                                                    <div className="relative bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="bg-green-500 text-xs text-white text-right pr-2 py-1 rounded-full transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        >
                                                            {percentage > 15 && month.count > 0 && month.count}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm font-medium text-gray-600">
                                                    {month.count}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No monthly usage data available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hourly Usage Distribution */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Distribution by Hour</h3>
                            {hourlyUsages && hourlyUsages.length > 0 ? (
                                <div className="space-y-2">
                                    {hourlyUsages.map((hour) => {
                                        const maxCount = getMaxHourlyCount();
                                        const percentage = maxCount > 0 ? (hour.count / maxCount) * 100 : 0;
                                        const isPeak = hour.count === maxCount && maxCount > 0;
                                        return (
                                            <div key={hour.hour} className="flex items-center group">
                                                <div className="w-16 text-sm text-gray-600">{hour.display}</div>
                                                <div className="flex-1 ml-4">
                                                    <div className="relative bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`${isPeak ? 'bg-red-500' : 'bg-purple-500'} text-xs text-white text-right pr-2 py-1 rounded-full transition-all duration-300`}
                                                            style={{ width: `${percentage}%` }}
                                                        >
                                                            {percentage > 15 && hour.count > 0 && hour.count}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-12 text-right text-sm font-medium text-gray-600">
                                                    {hour.count}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    No hourly usage data available.
                                </div>
                            )}
                            
                            {/* Peak Hours Summary */}
                            {hourlyUsages && hourlyUsages.length > 0 && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Insights</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Peak Usage Hour:</span>
                                            <span className="ml-2 font-semibold text-purple-600">
                                                {(() => {
                                                    const peak = [...hourlyUsages].sort((a, b) => b.count - a.count)[0];
                                                    return peak ? `${peak.display} (${peak.count} uses)` : 'N/A';
                                                })()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Average per Hour:</span>
                                            <span className="ml-2 font-semibold text-blue-600">
                                                {(hourlyUsages.reduce((sum, h) => sum + h.count, 0) / 24).toFixed(1)} uses
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}