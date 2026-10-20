import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, defaultpages, handles, domains }) {
    // Create maps for easy lookup
    const handleMap = {};
    handles.forEach(handle => {
        handleMap[handle.id] = handle.token;
    });

    const domainMap = {};
    domains.forEach(domain => {
        domainMap[domain.id] = domain.domain;
    });

    const formatHandle = (handleId) => {
        if (!handleId) return 'N/A';
        return handleMap[handleId] || handleId;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Defaultpages</h2>
                    <Link
                        href={route('defaultpages.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Create New defaultpage
                    </Link>
                </div>
            }
        >
            <Head title="Defaultpages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handle</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {defaultpages.data.map((defaultpage) => (
                                            <tr key={defaultpage.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{defaultpage.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {domainMap[defaultpage.domain_id] || defaultpage.domain_id}
                                                </td>
                                                {/* FIX: Added the missing 'Handle' column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatHandle(defaultpage.handle_id)}
                                                </td>
                                                {/* FIX: Corrected the position for the 'Created At' column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(defaultpage.created_at).toLocaleString()}
                                                </td>
                                                {/* FIX: Corrected the position for the 'Actions' column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('defaultpages.edit', defaultpage.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this defaultpage?')) {
                                                                router.delete(route('defaultpages.destroy', defaultpage.id));
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
                            
                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={defaultpages.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}