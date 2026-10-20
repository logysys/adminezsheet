import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, tooltips }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tooltips</h2>
                    <Link
                        href={route('tooltips.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Create New Tooltip
                    </Link>
                </div>
            }
        >
            <Head title="Tooltips" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {tooltips.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No tooltips found.</p>
                                    <Link
                                        href={route('tooltips.create')}
                                        className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        Create Your First Tooltip
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tooltip Content</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {tooltips.data.map((tooltip) => (
                                                    <tr key={tooltip.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tooltip.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {tooltip.reference}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                                            {Array.isArray(tooltip.tooltips) ? (
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {tooltip.tooltips.map((tip, index) => (
                                                                        <li key={index} className="break-words">
                                                                            {tip}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="break-words whitespace-pre-wrap">
                                                                    {tooltip.tooltips}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(tooltip.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(tooltip.updated_at).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <Link
                                                                href={route('tooltips.edit', tooltip.id)}
                                                                className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this tooltip? This action cannot be undone.')) {
                                                                        router.delete(route('tooltips.destroy', tooltip.id));
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Pagination */}
                                    <div className="mt-6">
                                        <Pagination links={tooltips.links} />
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