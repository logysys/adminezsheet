import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, tooltips, filters, availableGroups, availableTypes }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    
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

    const getTypeBadge = (type) => {
        const badges = {
            tooltip: <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Tooltip</span>,
            placeholder: <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Placeholder</span>,
            label: <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">Label</span>
        };
        return badges[type] || badges.tooltip;
    };

    const getStatusBadge = (isActive) => {
        return isActive 
            ? <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span>
            : <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Inactive</span>;
    };

    const handleFilterChange = (key, value) => {
        router.get(route('hometooltips.index'), { ...filters, [key]: value, page: 1 }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        router.get(route('hometooltips.index'), { ...filters, per_page: value, page: 1 }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(route('hometooltips.index'), { ...filters, search: formData.get('search'), page: 1 }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilters = () => {
        router.get(route('hometooltips.index'), { per_page: filters.per_page || 100 }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tooltips.data.map(t => t.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
            setSelectAll(false);
        } else {
            setSelectedIds([...selectedIds, id]);
            if (selectedIds.length + 1 === tooltips.data.length) {
                setSelectAll(true);
            }
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedIds.length} tooltip(s)?`)) {
            router.post(route('hometooltips.bulk-destroy'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSelectAll(false);
                }
            });
        }
    };

    const handleClearCache = () => {
        if (confirm('This will clear all tooltip cache. Continue?')) {
            router.post(route('hometooltips.clear-cache'));
        }
    };

    // Available per page options
    const perPageOptions = [10, 25, 50, 100, 200, 500];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Home Tooltips</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClearCache}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                            Clear Cache
                        </button>
                        <Link
                            href={route('hometooltips.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Create New Tooltip
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Home Tooltips" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            
                            {/* Filters */}
                            <div className="mb-6 space-y-4">
                                <div className="flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-[200px]">
                                        <form onSubmit={handleSearch} className="flex gap-2">
                                            <input
                                                type="text"
                                                name="search"
                                                defaultValue={filters.search || ''}
                                                placeholder="Search by key or content..."
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Search
                                            </button>
                                        </form>
                                    </div>
                                    
                                    <div>
                                        <select
                                            value={filters.group || ''}
                                            onChange={(e) => handleFilterChange('group', e.target.value || undefined)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="">All Groups</option>
                                            {availableGroups.map(group => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <select
                                            value={filters.type || ''}
                                            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="">All Types</option>
                                            {availableTypes.map(type => (
                                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    
                                    {(filters.group || filters.type || filters.status || filters.search) && (
                                        <button
                                            onClick={handleResetFilters}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                    
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Delete Selected ({selectedIds.length})
                                        </button>
                                    )}
                                </div>
                                
                                {/* Per Page Selector */}
                                <div className="flex items-center justify-end gap-4 border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-600">Items per page:</label>
                                        <select
                                            value={filters.per_page || 100}
                                            onChange={handlePerPageChange}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            {perPageOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Showing {tooltips.from || 0} to {tooltips.to || 0} of {tooltips.total} entries
                                    </div>
                                </div>
                            </div>
                            
                            {/* Table */}
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
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tooltips.data.map((tooltip) => (
                                            <tr key={tooltip.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(tooltip.id)}
                                                        onChange={() => handleSelect(tooltip.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                    {tooltip.key}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                                                        {tooltip.group}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getTypeBadge(tooltip.type)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                                    <div className="truncate" title={tooltip.content}>
                                                        {tooltip.content.length > 60 
                                                            ? tooltip.content.substring(0, 60) + '...' 
                                                            : tooltip.content}
                                                    </div>
                                                    {tooltip.fallback && (
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Fallback: {tooltip.fallback}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tooltip.sort_order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getStatusBadge(tooltip.is_active)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(tooltip.updated_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('hometooltips.edit', tooltip.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this tooltip?')) {
                                                                router.delete(route('hometooltips.destroy', tooltip.id));
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* No Results */}
                            {tooltips.data.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No tooltips found. <Link href={route('hometooltips.create')} className="text-blue-600 hover:text-blue-800">Create your first tooltip</Link>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {tooltips.data.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={tooltips.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}