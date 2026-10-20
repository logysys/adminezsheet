import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, aiTooltips, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [pageFilter, setPageFilter] = useState(filters.page || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('ai-tooltips.index'), {
            search: searchTerm,
            page: pageFilter,
            category: categoryFilter,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPageFilter('');
        setCategoryFilter('');
        router.get(route('ai-tooltips.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    // Get unique pages and categories from the data for filter dropdowns
    const uniquePages = [...new Set(aiTooltips.data.map(tip => tip.page).filter(Boolean))];
    const uniqueCategories = [...new Set(aiTooltips.data.map(tip => tip.category).filter(Boolean))];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">AI Tooltips</h2>
                    <Link
                        href={route('ai-tooltips.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Create New AI Tooltip
                    </Link>
                </div>
            }
        >
            <Head title="AI Tooltips" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            
                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="mb-4 inline-flex items-center px-4 py-2 bg-gray-100 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-200 focus:outline-none focus:ring ring-gray-300 transition ease-in-out duration-150"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            {/* Filters */}
                            {showFilters && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <form onSubmit={handleSearch} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Search by Reference/Description */}
                                            <div>
                                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Search
                                                </label>
                                                <input
                                                    type="text"
                                                    id="search"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="Search by reference or description..."
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>

                                            {/* Page Filter */}
                                            <div>
                                                <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Page
                                                </label>
                                                <select
                                                    id="page"
                                                    value={pageFilter}
                                                    onChange={(e) => setPageFilter(e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">All Pages</option>
                                                    {uniquePages.sort().map((page) => (
                                                        <option key={page} value={page}>{page}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Category Filter */}
                                            <div>
                                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Category
                                                </label>
                                                <select
                                                    id="category"
                                                    value={categoryFilter}
                                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">All Categories</option>
                                                    {uniqueCategories.sort().map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring ring-blue-300 transition ease-in-out duration-150"
                                            >
                                                Apply Filters
                                            </button>
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 focus:outline-none focus:ring ring-gray-300 transition ease-in-out duration-150"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Active Filters Display */}
                            {(filters?.search || filters?.page || filters?.category) && (
                                <div className="mb-4 flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Active filters:</span>
                                    {filters.search && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Search: {filters.search}
                                        </span>
                                    )}
                                    {filters.page && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Page: {filters.page}
                                        </span>
                                    )}
                                    {filters.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Category: {filters.category}
                                        </span>
                                    )}
                                </div>
                            )}

                            {aiTooltips.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No AI tooltips found.</p>
                                    <Link
                                        href={route('ai-tooltips.create')}
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        Create Your First AI Tooltip
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tooltip Content</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {aiTooltips.data.map((aiTooltip) => (
                                                    <tr key={aiTooltip.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <Link
                                                                href={route('ai-tooltips.edit', aiTooltip.id)}
                                                                className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this AI tooltip? This action cannot be undone.')) {
                                                                        router.delete(route('ai-tooltips.destroy', aiTooltip.id));
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aiTooltip.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {aiTooltip.reference}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {aiTooltip.page || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {aiTooltip.category || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                                            {Array.isArray(aiTooltip.tooltips) ? (
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {aiTooltip.tooltips.slice(0, 3).map((tip, index) => (
                                                                        <li key={index} className="break-words">
                                                                            {tip}
                                                                        </li>
                                                                    ))}
                                                                    {aiTooltip.tooltips.length > 3 && (
                                                                        <li className="text-gray-400">+{aiTooltip.tooltips.length - 3} more</li>
                                                                    )}
                                                                </ul>
                                                            ) : (
                                                                <div className="break-words whitespace-pre-wrap">
                                                                    {aiTooltip.tooltips}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                                            {aiTooltip.description ? (
                                                                <div className="truncate" title={aiTooltip.description}>
                                                                    {aiTooltip.description}
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(aiTooltip.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Pagination */}
                                    <div className="mt-6">
                                        <Pagination links={aiTooltips.links} />
                                    </div>

                                    {/* Results Count */}
                                    <div className="mt-4 text-sm text-gray-600">
                                        Showing {aiTooltips.from} to {aiTooltips.to} of {aiTooltips.total} results
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}