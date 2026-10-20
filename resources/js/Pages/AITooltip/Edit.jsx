import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, aiTooltip }) {
    const { data, setData, put, processing, errors } = useForm({
        reference: aiTooltip.reference || '',
        component: aiTooltip.component || '',
        page: aiTooltip.page || '',
        category: aiTooltip.category || '',
        tooltips: Array.isArray(aiTooltip.tooltips) ? aiTooltip.tooltips.join('\n') : (aiTooltip.tooltips || ''),
        description: aiTooltip.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('ai-tooltips.update', aiTooltip.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit AI Tooltip</h2>}
        >
            <Head title={`Edit AI Tooltip - ${aiTooltip.reference}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    
                                    {/* Reference */}
                                    <div>
                                        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                                            Reference *
                                        </label>
                                        <input
                                            type="text"
                                            id="reference"
                                            name="reference"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.reference ? 'border-red-500' : ''
                                            }`}
                                            required
                                            placeholder="Enter a unique reference name"
                                        />
                                        {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                                    </div>

                                    {/* Component */}
                                    <div>
                                        <label htmlFor="component" className="block text-sm font-medium text-gray-700 mb-1">
                                            Component
                                        </label>
                                        <input
                                            type="text"
                                            id="component"
                                            name="component"
                                            value={data.component}
                                            onChange={(e) => setData('component', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="e.g., AIHistory, AISearchView, ezbar"
                                        />
                                    </div>

                                    {/* Page */}
                                    <div>
                                        <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
                                            Page
                                        </label>
                                        <input
                                            type="text"
                                            id="page"
                                            name="page"
                                            value={data.page}
                                            onChange={(e) => setData('page', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="e.g., AI History, Home, AI Search View"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="e.g., summary, actions, modal, search"
                                        />
                                    </div>
                                    
                                    {/* Tooltip Content */}
                                    <div>
                                        <label htmlFor="tooltips" className="block text-sm font-medium text-gray-700 mb-1">
                                            AI Tooltip Content * (one tooltip per line)
                                        </label>
                                        <textarea
                                            id="tooltips"
                                            name="tooltips"
                                            rows={10}
                                            value={data.tooltips}
                                            onChange={(e) => setData('tooltips', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono ${
                                                errors.tooltips ? 'border-red-500' : ''
                                            }`}
                                            required
                                            placeholder="Enter each AI tooltip on a new line"
                                        />
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>• Enter each AI tooltip text on a separate line</p>
                                            <p>• They will be stored as a JSON array</p>
                                            <p>• Use clear, descriptive text for each tooltip</p>
                                        </div>
                                        {errors.tooltips && <p className="mt-1 text-sm text-red-600">{errors.tooltips}</p>}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Internal description of what this tooltip is used for"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('ai-tooltips.index')}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-4 transition duration-150 ease-in-out"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-150 ease-in-out"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update AI Tooltip'}
                                    </button>
                                </div>
                            </form>

                            {/* Current Data Preview */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Current Data Preview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Reference:</span>
                                        <p className="mt-1 text-gray-600">{aiTooltip.reference}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Component:</span>
                                        <p className="mt-1 text-gray-600">{aiTooltip.component || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Page:</span>
                                        <p className="mt-1 text-gray-600">{aiTooltip.page || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Category:</span>
                                        <p className="mt-1 text-gray-600">{aiTooltip.category || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Tooltips Count:</span>
                                        <p className="mt-1 text-gray-600">
                                            {Array.isArray(aiTooltip.tooltips) ? aiTooltip.tooltips.length : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Description:</span>
                                        <p className="mt-1 text-gray-600">{aiTooltip.description || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}