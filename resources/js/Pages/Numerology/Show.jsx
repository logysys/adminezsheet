import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, search }) {
    const formatUSD = (cost) => {
        if (!cost && cost !== 0) return '$0.00';
        if (cost < 0.0001) return `$${cost.toExponential(4)}`;
        return `$${parseFloat(cost).toFixed(6)}`;
    };

    const agentColors = {
        openai: 'bg-emerald-100 text-emerald-800',
        kimi: 'bg-rose-100 text-rose-800',
        perplexity: 'bg-blue-100 text-blue-800',
        gemini: 'bg-purple-100 text-purple-800',
        deepseek: 'bg-amber-100 text-amber-800',
    };

    const handleDelete = () => {
        if (confirm('Delete this search record?')) {
            router.delete(route('numerology.destroy', search.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        🔮 Numerology Search #{search.id}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('numerology.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 transition"
                        >
                            ← Back
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition"
                        >
                            Delete Record
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Numerology Search #${search.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            
                            {/* Header Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <div className="text-xs font-bold uppercase text-gray-500">User Number</div>
                                    <div className="text-2xl font-mono font-bold text-purple-700">{search.user_number}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-gray-500">Agent</div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${agentColors[search.agent_used] || 'bg-gray-200'}`}>
                                            {search.agent_used}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-gray-500">Date & Time</div>
                                    <div className="text-sm font-medium">{new Date(search.created_at).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase text-gray-500">IP Address</div>
                                    <div className="text-sm font-mono">{search.ip_address || 'Not recorded'}</div>
                                </div>
                            </div>

                            {/* Token & Cost Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xs font-bold uppercase text-gray-500">Input Tokens</div>
                                    <div className="text-xl font-mono font-bold text-blue-600">{search.input_tokens?.toLocaleString() || 0}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold uppercase text-gray-500">Output Tokens</div>
                                    <div className="text-xl font-mono font-bold text-green-600">{search.output_tokens?.toLocaleString() || 0}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold uppercase text-gray-500">Total Cost (USD)</div>
                                    <div className="text-xl font-mono font-bold text-purple-600">{formatUSD(search.cost_usd)}</div>
                                </div>
                            </div>

                            {/* Watch Out Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">⚠️</span>
                                    <h3 className="text-lg font-semibold text-gray-800">Watch Out For</h3>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                                    <p className="text-gray-700 leading-relaxed">{search.watch_out || 'No data'}</p>
                                </div>
                            </div>

                            {/* Expect Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">✨</span>
                                    <h3 className="text-lg font-semibold text-gray-800">Expect Today</h3>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                    <p className="text-gray-700 leading-relaxed">{search.expect || 'No data'}</p>
                                </div>
                            </div>

                            {/* Extra Nuance Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">💫</span>
                                    <h3 className="text-lg font-semibold text-gray-800">Extra Nuance</h3>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                                    <p className="text-gray-700 leading-relaxed italic">{search.extra_nuance || 'No data'}</p>
                                </div>
                            </div>

                            {/* User Agent Info */}
                            {search.user_agent && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="text-xs font-bold uppercase text-gray-500 mb-2">User Agent</div>
                                    <div className="text-xs text-gray-500 break-all font-mono">{search.user_agent}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}