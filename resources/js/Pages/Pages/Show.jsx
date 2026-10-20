import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, page }) {
    const [showCode, setShowCode] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">View Page: {page.pagename}</h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('pages.edit', page.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('pages.index')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={page.pagename} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Page Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">ID</label>
                                        <p className="mt-1 text-sm text-gray-900">{page.id}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Page Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{page.pagename}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Created At</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(page.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(page.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* View Toggle */}
                            <div className="mb-4 flex gap-2 border-b border-gray-200">
                                <button
                                    onClick={() => setShowCode(false)}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        !showCode
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setShowCode(true)}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        showCode
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    HTML Code
                                </button>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {showCode ? 'HTML Code' : 'Preview'}
                                </h3>
                                
                                {showCode ? (
                                    <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                                        <pre className="text-sm font-mono whitespace-pre-wrap">
                                            {page.code || '<empty>'}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-md overflow-hidden">
                                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">Live Preview</span>
                                        </div>
                                        <div className="p-4 min-h-[500px]">
                                            {page.code ? (
                                                <div dangerouslySetInnerHTML={{ __html: page.code }} />
                                            ) : (
                                                <p className="text-gray-500 text-center py-8">No content available</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}