import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        reference: '',
        component: '',
        page: '',
        category: '',
        tooltips: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ai-tooltips.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New AI Tooltip</h2>}
        >
            <Head title="Create AI Tooltip" />

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
                                            placeholder="Enter a unique reference name (e.g., ai_history_total_conversations)"
                                        />
                                        <div className="mt-1 text-sm text-gray-500">
                                            Examples: ai_history_total_conversations, ai_search_view_login, ezbar_scan_qr
                                        </div>
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
                                        <div className="mt-1 text-sm text-gray-500">
                                            The React component name where this tooltip is used
                                        </div>
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
                                        <div className="mt-1 text-sm text-gray-500">
                                            The page where this tooltip appears
                                        </div>
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
                                        <div className="mt-1 text-sm text-gray-500">
                                            Category grouping (summary, actions, modal, search, metadata, etc.)
                                        </div>
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
                                            placeholder="Enter each AI tooltip on a new line. Example:&#10;Total number of conversations in your history&#10;Search through your conversation history&#10;Start a new conversation with AI"
                                        />
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>• Enter each AI tooltip text on a separate line</p>
                                            <p>• They will be stored as a JSON array</p>
                                            <p>• Use clear, descriptive text for each tooltip</p>
                                            <p>• Empty lines will be ignored</p>
                                            <p>• You can use placeholders like {'{date}'}, {'{email}'}, {'{count}'}, {'{model}'}</p>
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
                                        <div className="mt-1 text-sm text-gray-500">
                                            Optional internal notes about this tooltip's purpose
                                        </div>
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
                                        {processing ? 'Creating...' : 'Create AI Tooltip'}
                                    </button>
                                </div>
                            </form>

                            {/* Example Section */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900 mb-3">Example from Database</h3>
                                <div className="bg-white p-4 rounded border">
                                    <p className="font-medium mb-2">Reference:</p>
                                    <code className="block mb-4 text-sm bg-gray-100 p-2 rounded">ai_history_total_conversations</code>
                                    
                                    <p className="font-medium mb-2">Component:</p>
                                    <code className="block mb-4 text-sm bg-gray-100 p-2 rounded">AIHistory</code>
                                    
                                    <p className="font-medium mb-2">Page:</p>
                                    <code className="block mb-4 text-sm bg-gray-100 p-2 rounded">AI History</code>
                                    
                                    <p className="font-medium mb-2">Category:</p>
                                    <code className="block mb-4 text-sm bg-gray-100 p-2 rounded">summary</code>
                                    
                                    <p className="font-medium mb-2">Tooltip Content:</p>
                                    <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap">
{`Total number of conversations in your history`}
                                    </pre>
                                    
                                    <p className="font-medium mb-2 mt-4">Description:</p>
                                    <code className="block text-sm bg-gray-100 p-2 rounded">Displays the total count of conversations in the user's history</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}