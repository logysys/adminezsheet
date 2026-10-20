import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, record, globalStats }) {
    
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this record?')) {
            router.delete(route('divination.destroy', record.id));
        }
    };

    const getLuckBadgeClass = (luckLevel) => {
        if (luckLevel?.includes('大吉')) return 'bg-red-100 text-red-800';
        if (luckLevel?.includes('上吉')) return 'bg-orange-100 text-orange-800';
        if (luckLevel?.includes('中吉')) return 'bg-yellow-100 text-yellow-800';
        if (luckLevel?.includes('小吉')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Divination Record: 【{record.character}】
                    </h2>
                    <div className="flex gap-3">
                        <Link
                            href={route('divination.edit', record.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 transition"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                        <Link
                            href={route('divination.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 transition"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Divination Record - ${record.character}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            
                            {/* Record Details */}
                            <div className="space-y-6">
                                {/* Header Info */}
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-6xl font-serif bg-gray-100 p-4 rounded-2xl">
                                            {record.character}
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Record #{record.id}</div>
                                            <div className="text-sm text-gray-500">Created: {new Date(record.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getLuckBadgeClass(record.luck_level)}`}>
                                            {record.luck_level}
                                        </span>
                                    </div>
                                </div>

                                {/* Structure */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Structure</h3>
                                    <p className="text-lg font-medium">{record.structure}</p>
                                </div>

                                {/* Fortune / Divination Text */}
                                <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-400">
                                    <h3 className="text-sm font-bold text-amber-700 uppercase mb-3">✦ Fortune ✦</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{record.fortune}</p>
                                </div>

                                {/* Cost Information */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500">AI Source</div>
                                        <div className="font-semibold capitalize">{record.ai_source}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500">Response Time</div>
                                        <div className="font-semibold">{record.response_time_ms}ms</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500">Total Cost</div>
                                        <div className="font-semibold font-mono">${(record.cost_data?.total_cost || 0).toFixed(6)}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500">Tokens</div>
                                        <div className="font-semibold">
                                            {(record.cost_data?.input_tokens || 0) + (record.cost_data?.output_tokens || 0)}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Cost Breakdown */}
                                {record.cost_data && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Cost Breakdown</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>Input Tokens: <span className="font-mono">{record.cost_data.input_tokens || 0}</span></div>
                                            <div>Output Tokens: <span className="font-mono">{record.cost_data.output_tokens || 0}</span></div>
                                            <div>Input Cost: <span className="font-mono">${(record.cost_data.input_cost || 0).toFixed(6)}</span></div>
                                            <div>Output Cost: <span className="font-mono">${(record.cost_data.output_cost || 0).toFixed(6)}</span></div>
                                            {record.cost_data.search_fee && (
                                                <div>Search Fee: <span className="font-mono">${record.cost_data.search_fee.toFixed(6)}</span></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}