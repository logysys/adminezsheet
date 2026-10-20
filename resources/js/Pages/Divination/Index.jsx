import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import debounce from 'lodash/debounce';

export default function Index({ auth, records, filters, stats, globalStats, flash }) {
    const [params, setParams] = useState({
        search: filters.search || '',
        ai_source: filters.ai_source || '',
        luck_level: filters.luck_level || '',
        is_favorite: filters.is_favorite || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        limit: filters.limit || '50',
    });
    
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const updateFilters = (newParams) => {
        router.get(route('divination.index'), newParams, {
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
        const resetParams = { 
            search: '', 
            ai_source: '', 
            luck_level: '', 
            is_favorite: '', 
            date_from: '', 
            date_to: '', 
            limit: '50' 
        };
        setParams(resetParams);
        updateFilters(resetParams);
    };

    const handleExport = () => {
        const exportParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value && key !== 'limit') {
                exportParams.append(key, value);
            }
        });
        window.open(route('divination.export') + '?' + exportParams.toString(), '_blank');
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) {
            alert('Please select records to delete');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selectedIds.length} record(s)?`)) {
            router.post(route('divination.bulk-destroy'), { ids: selectedIds }, {
                preserveState: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSelectAll(false);
                }
            });
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(records.data.map(r => r.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getLuckBadgeClass = (luckLevel) => {
        if (luckLevel?.includes('大吉')) return 'bg-red-100 text-red-800';
        if (luckLevel?.includes('上吉')) return 'bg-orange-100 text-orange-800';
        if (luckLevel?.includes('中吉')) return 'bg-yellow-100 text-yellow-800';
        if (luckLevel?.includes('小吉')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getAiSourceBadgeClass = (source) => {
        switch(source) {
            case 'kimi': return 'bg-blue-100 text-blue-800';
            case 'perplexity': return 'bg-purple-100 text-purple-800';
            case 'offline': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Divination Records</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage拆字解運 records</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 transition"
                        >
                            Export CSV
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition"
                            >
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Divination Records" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Global Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                            <div className="text-sm text-gray-500">Total Cost</div>
                            <div className="text-2xl font-bold">${globalStats.total_cost_usd?.toFixed(6)}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                            <div className="text-sm text-gray-500">Total Tokens</div>
                            <div className="text-2xl font-bold">{globalStats.total_tokens?.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                            <div className="text-sm text-gray-500">Total Requests</div>
                            <div className="text-2xl font-bold">{globalStats.total_requests?.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                            <div className="text-sm text-gray-500">Total Records</div>
                            <div className="text-2xl font-bold">{stats.total_records?.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-pink-500">
                            <div className="text-sm text-gray-500">Avg Response</div>
                            <div className="text-2xl font-bold">{Math.round(stats.avg_response_time || 0)}ms</div>
                        </div>
                    </div>

                    {/* Filter Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500">By AI Source</div>
                            <div className="flex justify-center gap-3 mt-1 text-sm">
                                <span>Kimi: <strong>{stats.by_ai_source?.kimi || 0}</strong></span>
                                <span>Perplexity: <strong>{stats.by_ai_source?.perplexity || 0}</strong></span>
                                <span>Offline: <strong>{stats.by_ai_source?.offline || 0}</strong></span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500">By Luck Level</div>
                            <div className="flex justify-center gap-2 mt-1 text-xs flex-wrap">
                                <span>大吉: <strong>{stats.by_luck_level?.大吉 || 0}</strong></span>
                                <span>上吉: <strong>{stats.by_luck_level?.上吉 || 0}</strong></span>
                                <span>中吉: <strong>{stats.by_luck_level?.中吉 || 0}</strong></span>
                                <span>小吉: <strong>{stats.by_luck_level?.小吉 || 0}</strong></span>
                                <span>平: <strong>{stats.by_luck_level?.平 || 0}</strong></span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-500">Favorites</div>
                            <div className="text-lg font-bold">{stats.total_favorites?.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 shadow-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            
                            {/* Filter Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search character, structure..."
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">AI Source</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.ai_source}
                                        onChange={(e) => handleFilterChange('ai_source', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="kimi">Kimi</option>
                                        <option value="perplexity">Perplexity</option>
                                        <option value="offline">Offline</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Luck Level</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.luck_level}
                                        onChange={(e) => handleFilterChange('luck_level', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="大吉">大吉</option>
                                        <option value="上吉">上吉</option>
                                        <option value="中吉">中吉</option>
                                        <option value="小吉">小吉</option>
                                        <option value="平">平</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Favorite</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.is_favorite}
                                        onChange={(e) => handleFilterChange('is_favorite', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="1">Favorited</option>
                                        <option value="0">Not Favorited</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date From</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date To</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.date_to}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={handleReset}
                                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            {/* Limit and Count Info */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>Show</span>
                                    <select
                                        value={params.limit}
                                        onChange={(e) => handleFilterChange('limit', e.target.value)}
                                        className="mx-2 border-gray-300 rounded-md py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="250">250</option>
                                    </select>
                                    <span>entries</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-800">{records.from || 0}-{records.to || 0}</span> of <span className="font-semibold text-gray-800">{records.total}</span>
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
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Character</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Structure</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Luck Level</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Source</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Response</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorite</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records.data.length > 0 ? (
                                            records.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(item.id)}
                                                            onChange={() => handleSelectRow(item.id)}
                                                            className="rounded border-gray-300"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-gray-900">{item.character}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {item.structure}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLuckBadgeClass(item.luck_level)}`}>
                                                            {item.luck_level}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAiSourceBadgeClass(item.ai_source)}`}>
                                                            {item.ai_source}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono">
                                                        ${(item.cost_data?.total_cost || 0).toFixed(6)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.response_time_ms}ms
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {item.is_favorite ? (
                                                            <span className="text-yellow-500 text-lg">★</span>
                                                        ) : (
                                                            <span className="text-gray-300 text-lg">☆</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('divination.show', item.id)} className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                                                        <Link href={route('divination.edit', item.id)} className="text-green-600 hover:text-green-900 mr-3">Edit</Link>
                                                        <button 
                                                            onClick={() => confirm('Delete this record?') && router.delete(route('divination.destroy', item.id))}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="px-6 py-12 text-center text-gray-400 italic">
                                                    No records found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                <Pagination links={records.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}