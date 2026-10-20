import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import debounce from 'lodash/debounce'; // Optional: npm install lodash if not present

export default function Index({ auth, aiframes, filters, flash }) {
    // Local state for filters to make inputs feel responsive
    const [params, setParams] = useState({
        search: filters.search || '',
        type: filters.type || '',
        status: filters.status || '',
        limit: filters.limit || '100',
    });

    // Helper to perform the Inertia request
    const updateFilters = (newParams) => {
        router.get(route('aiframes.index'), newParams, {
            preserveState: true,
            replace: true,
        });
    };

    // Debounced search function
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
        const resetParams = { search: '', type: '', status: '', limit: '100' };
        setParams(resetParams);
        updateFilters(resetParams);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Aiframes</h2>
                    <Link
                        href={route('aiframes.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition duration-150 shadow-sm"
                    >
                        + Create New
                    </Link>
                </div>
            }
        >
            <Head title="Aiframes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 shadow-sm">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            
                            {/* Filter Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search content or domain..."
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.type}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="TOP">TOP</option>
                                        <option value="BOTTOM">BOTTOM</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={params.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
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
                                        <option value="500">500</option>
                                    </select>
                                    <span>entries</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-800">{aiframes.from || 0}-{aiframes.to || 0}</span> of <span className="font-semibold text-gray-800">{aiframes.total}</span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {aiframes.data.length > 0 ? (
                                            aiframes.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.domain?.domain || `ID: ${item.domain_id}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                            item.type === 'TOP' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                        {item.content}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                                                            item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {item.status ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('aiframes.edit', item.id)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                                                        <button 
                                                            onClick={() => confirm('Delete item?') && router.delete(route('aiframes.destroy', item.id))}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                                    No results found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                <Pagination links={aiframes.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}