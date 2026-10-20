import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import debounce from 'lodash/debounce';

export default function Index({ auth, searches, filters, stats, flash }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [params, setParams] = useState({
        search: filters.search || '',
        agent: filters.agent || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        min_cost: filters.min_cost || '',
        max_cost: filters.max_cost || '',
        limit: filters.limit || '100',
    });

    const updateFilters = (newParams) => {
        router.get(route('numerology.index'), newParams, {
            preserveState: true,
            replace: true,
        });
    };

    const debouncedSearch = useCallback(
        debounce((searchVal) => {
            updateFilters({ ...params, search: searchVal, page: 1 });
        }, 500),
        [params]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setParams(prev => ({ ...prev, search: value }));
        debouncedSearch(value);
    };

    const handleFilterChange = (key, value) => {
        const newParams = { ...params, [key]: value, page: 1 };
        setParams(newParams);
        updateFilters(newParams);
    };

    const handleReset = () => {
        const resetParams = { search: '', agent: '', date_from: '', date_to: '', min_cost: '', max_cost: '', limit: '100' };
        setParams(resetParams);
        updateFilters(resetParams);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(searches.data.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} selected records?`)) {
            router.post(route('numerology.bulk-destroy'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSelectAll(false);
                }
            });
        }
    };

    const handleClearAll = () => {
        const agent = params.agent;
        const confirmMsg = agent 
            ? `Delete ALL records for agent: ${agent}? This cannot be undone.`
            : `Delete ALL numerology records? This cannot be undone.`;
        if (confirm(confirmMsg)) {
            router.delete(route('numerology.clear-all', { agent: agent || '' }), {
                preserveScroll: true,
            });
        }
    };

    const formatUSD = (cost) => {
        // Convert to number if it's a string
        const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
        
        // Check if it's a valid number
        if (isNaN(numCost) || (!numCost && numCost !== 0)) return '$0.00';
        
        // Handle very small numbers
        if (numCost !== 0 && numCost < 0.0001) return `$${numCost.toExponential(4)}`;
        
        // Format with 6 decimal places for regular numbers
        return `$${numCost.toFixed(6)}`;
    };

    const agentColors = {
        openai: 'bg-emerald-100 text-emerald-800',
        kimi: 'bg-rose-100 text-rose-800',
        perplexity: 'bg-blue-100 text-blue-800',
        gemini: 'bg-purple-100 text-purple-800',
        deepseek: 'bg-amber-100 text-amber-800',
    };

    // Safely get total input and output tokens
    const totalInputTokens = stats.total_input_tokens || 0;
    const totalOutputTokens = stats.total_output_tokens || 0;
    const totalTokens = (typeof totalInputTokens === 'number' ? totalInputTokens : parseFloat(totalInputTokens) || 0) + 
                       (typeof totalOutputTokens === 'number' ? totalOutputTokens : parseFloat(totalOutputTokens) || 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        🔮 Numerology Search Records
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('numerology.export', params)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 transition"
                        >
                            📥 Export CSV
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Numerology Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 shadow-sm rounded">
                            {flash.success}
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg p-4 text-white">
                            <div className="text-sm opacity-90">Total Searches</div>
                            <div className="text-2xl font-bold">{stats.total_searches || 0}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg p-4 text-white">
                            <div className="text-sm opacity-90">Total Cost</div>
                            <div className="text-2xl font-bold">{formatUSD(stats.total_cost)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg p-4 text-white">
                            <div className="text-sm opacity-90">Total Tokens</div>
                            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg p-4 text-white">
                            <div className="text-sm opacity-90">Today</div>
                            <div className="text-2xl font-bold">{stats.today_searches || 0}</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg p-4 text-white">
                            <div className="text-sm opacity-90">This Week</div>
                            <div className="text-2xl font-bold">{stats.week_searches || 0}</div>
                        </div>
                    </div>

                    {/* Agent Stats Summary */}
                    {stats.searches_by_agent && stats.searches_by_agent.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">📊 Searches by Agent</h3>
                            <div className="flex flex-wrap gap-4">
                                {stats.searches_by_agent.map(agent => (
                                    <div key={agent.agent} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${agentColors[agent.agent] || 'bg-gray-200'}`}>
                                            {agent.agent}
                                        </span>
                                        <span className="text-sm font-medium">{agent.count} searches</span>
                                        <span className="text-xs text-gray-500">{formatUSD(agent.total_cost)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            
                            {/* Filter Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search predictions..."
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Agent</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.agent}
                                        onChange={(e) => handleFilterChange('agent', e.target.value)}
                                    >
                                        <option value="">All Agents</option>
                                        <option value="openai">OpenAI</option>
                                        <option value="kimi">Kimi</option>
                                        <option value="perplexity">Perplexity</option>
                                        <option value="gemini">Gemini</option>
                                        <option value="deepseek">DeepSeek</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.date_to}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition"
                                    >
                                        Clear Filters
                                    </button>
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition"
                                        >
                                            Delete Selected ({selectedIds.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClearAll}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Cost Range Filter */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Min Cost (USD)</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        placeholder="0.00"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.min_cost}
                                        onChange={(e) => handleFilterChange('min_cost', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Cost (USD)</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        placeholder="0.00"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        value={params.max_cost}
                                        onChange={(e) => handleFilterChange('max_cost', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Limit and Count Info */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>Show</span>
                                    <select
                                        value={params.limit}
                                        onChange={(e) => handleFilterChange('limit', e.target.value)}
                                        className="mx-2 border-gray-300 rounded-md py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="250">250</option>
                                        <option value="500">500</option>
                                    </select>
                                    <span>entries</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-800">{searches.from || 0}-{searches.to || 0}</span> of <span className="font-semibold text-gray-800">{searches.total || 0}</span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll && searches.data && searches.data.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Number</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Watch Out</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expect</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tokens</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {searches.data && searches.data.length > 0 ? (
                                            searches.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(item.id)}
                                                            onChange={() => handleSelectRow(item.id)}
                                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">{item.id}</td>
                                                    <td className="px-3 py-4 text-sm font-mono font-bold text-purple-700">{item.user_number}</td>
                                                    <td className="px-3 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${agentColors[item.agent_used] || 'bg-gray-200'}`}>
                                                            {item.agent_used}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {item.watch_out?.substring(0, 80)}...
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {item.expect?.substring(0, 80)}...
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        <span className="font-mono">in: {item.input_tokens || 0}</span><br />
                                                        <span className="font-mono">out: {item.output_tokens || 0}</span>
                                                    </td>
                                                    <td className="px-3 py-4 text-sm font-mono font-semibold">
                                                        {formatUSD(item.cost_usd)}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-3 py-4 text-right text-sm font-medium">
                                                        <Link href={route('numerology.show', item.id)} className="text-purple-600 hover:text-purple-900 mr-3">
                                                            View
                                                        </Link>
                                                        <button 
                                                            onClick={() => {
                                                                if (confirm('Delete this record?')) {
                                                                    router.delete(route('numerology.destroy', item.id))
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="px-6 py-12 text-center text-gray-400 italic">
                                                    No numerology records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {searches.links && (
                                <div className="mt-6 flex justify-center">
                                    <Pagination links={searches.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}