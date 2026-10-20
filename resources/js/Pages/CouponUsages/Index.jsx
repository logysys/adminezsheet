import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, usages, coupons, filters }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterValues, setFilterValues] = useState({
        coupon_id: filters.coupon_id || '',
        user_id: filters.user_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || ''
    });

    // Update selectAll when selectedIds changes
    useEffect(() => {
        if (usages.data.length > 0) {
            setSelectAll(selectedIds.length === usages.data.length);
        } else {
            setSelectAll(false);
        }
    }, [selectedIds, usages.data]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleFilterChange = (e) => {
        setFilterValues({
            ...filterValues,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        // Remove empty filters
        const cleanFilters = Object.entries(filterValues).reduce((acc, [key, value]) => {
            if (value !== '' && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});
        
        router.get(route('coupon-usages.index'), cleanFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilterValues({
            coupon_id: '',
            user_id: '',
            date_from: '',
            date_to: ''
        });
        router.get(route('coupon-usages.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(usages.data.map(usage => usage.id));
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const bulkDelete = () => {
        if (selectedIds.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedIds.length} usage record(s)? This action cannot be undone.`)) {
            router.post(route('coupon-usages.bulk-destroy'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSelectAll(false);
                }
            });
        }
    };

    const deleteSingle = (id) => {
        if (confirm('Are you sure you want to delete this usage record? This action cannot be undone.')) {
            router.delete(route('coupon-usages.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const exportToCSV = () => {
        const exportFilters = {};
        if (filterValues.coupon_id) exportFilters.coupon_id = filterValues.coupon_id;
        if (filterValues.user_id) exportFilters.user_id = filterValues.user_id;
        if (filterValues.date_from) exportFilters.date_from = filterValues.date_from;
        if (filterValues.date_to) exportFilters.date_to = filterValues.date_to;
        
        window.location.href = route('coupon-usages.export', exportFilters);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Coupon Usage History
                    </h2>
                    <div className="flex space-x-3">
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Export CSV
                        </button>
                        <Link
                            href={route('coupon-usages.statistics')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Statistics
                        </Link>
                        <Link
                            href={route('coupons.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Back to Coupons
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Coupon Usage History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filter Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center text-gray-700 hover:text-gray-900 mb-4 focus:outline-none"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {filterOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            
                            {filterOpen && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Coupon
                                            </label>
                                            <select
                                                name="coupon_id"
                                                value={filterValues.coupon_id}
                                                onChange={handleFilterChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">All Coupons</option>
                                                {coupons.map(coupon => (
                                                    <option key={coupon.id} value={coupon.id}>
                                                        {coupon.coupon} - {coupon.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                User ID
                                            </label>
                                            <input
                                                type="text"
                                                name="user_id"
                                                value={filterValues.user_id}
                                                onChange={handleFilterChange}
                                                placeholder="Enter user ID"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date From
                                            </label>
                                            <input
                                                type="date"
                                                name="date_from"
                                                value={filterValues.date_from}
                                                onChange={handleFilterChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date To
                                            </label>
                                            <input
                                                type="date"
                                                name="date_to"
                                                value={filterValues.date_to}
                                                onChange={handleFilterChange}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={applyFilters}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedIds.length > 0 && (
                        <div className="bg-blue-50 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                                <span className="text-sm text-blue-700">
                                    {selectedIds.length} record(s) selected
                                </span>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setSelectedIds([])}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel Selection
                                    </button>
                                    <button
                                        onClick={bulkDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Delete Selected
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Usages Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                disabled={usages.data.length === 0}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coupon Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Coupon Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Used At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {usages.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span>No usage records found.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        usages.data.map((usage) => (
                                            <tr key={usage.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(usage.id)}
                                                        onChange={() => handleSelectRow(usage.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usage.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                                                    {usage.coupon_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usage.coupon?.title || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {usage.user ? (
                                                        <div>
                                                            <Link
                                                                href={route('userlist.index') + `?search=${usage.user_id}`}
                                                                className="text-blue-600 hover:text-blue-900 hover:underline"
                                                            >
                                                                {usage.user.email}
                                                            </Link>
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                {usage.user.name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Link
                                                                href={route('userlist.index') + `?search=${usage.user_id}`}
                                                                className="text-blue-600 hover:text-blue-900 hover:underline"
                                                            >
                                                                User ID: {usage.user_id}
                                                            </Link>
                                                            <div className="text-xs text-red-400 mt-0.5">
                                                                User not found
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(usage.used_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => deleteSingle(usage.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors focus:outline-none"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {usages.data.length > 0 && (
                            <div className="p-6 border-t border-gray-200">
                                <Pagination links={usages.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}