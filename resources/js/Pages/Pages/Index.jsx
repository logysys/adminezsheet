import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, pages, limit, flash = {} }) {
    const { props } = usePage();
    const [selectedPages, setSelectedPages] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleLimitChange = (e) => {
        router.get(route('pages.index'), { limit: e.target.value });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('pages.index'), { search: e.target.value });
        }
    };

    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedPages(pages.data.map(page => page.id));
        } else {
            setSelectedPages([]);
        }
    };

    const handleSelectPage = (pageId) => {
        setSelectedPages(prev => 
            prev.includes(pageId)
                ? prev.filter(id => id !== pageId)
                : [...prev, pageId]
        );
    };

    const handleBulkDelete = () => {
        if (selectedPages.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedPages.length} page(s)?`)) {
            router.post(route('pages.bulk-destroy'), { ids: selectedPages }, {
                onSuccess: () => {
                    setSelectedPages([]);
                    setSelectAll(false);
                }
            });
        }
    };

    const handleDuplicate = (page) => {
        router.post(route('pages.duplicate', page.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Pages</h2>
                    <Link
                        href={route('pages.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Add Page
                    </Link>
                </div>
            }
        >
            <Head title="Pages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search and Actions */}
                            <div className="flex items-center justify-between mb-4">
                                {pages.total > 0 && (
                                    <div className="text-gray-600">
                                        Showing {pages.from} to {pages.to} of {pages.total} entries
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {selectedPages.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Delete Selected ({selectedPages.length})
                                        </button>
                                    )}
                                    <input
                                        type="text"
                                        className="px-4 py-2 border rounded-md"
                                        placeholder="Search pages..."
                                        defaultValue={props.search || ''}
                                        onKeyDown={handleSearch}
                                    />
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
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pages.data.map((page) => (
                                            <tr key={page.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPages.includes(page.id)}
                                                        onChange={() => handleSelectPage(page.id)}
                                                        className="h-4 w-4 text-blue-600 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {page.pagename}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(page.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(page.updated_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('pages.show', page.id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('pages.edit', page.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDuplicate(page)}
                                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                                    >
                                                        Duplicate
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this page?')) {
                                                                router.delete(route('pages.destroy', page.id));
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
                            
                            {/* Pagination and Limit Controls */}
                            <div className="mt-4 flex items-center justify-between">
                                <Pagination links={pages.links} />
                                <select
                                    onChange={handleLimitChange}
                                    value={limit}
                                    className="px-3 py-2 border rounded-md"
                                >
                                    {[5, 10, 25, 50, 100].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}