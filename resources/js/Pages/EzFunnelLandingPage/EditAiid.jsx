import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EditAiid({ auth }) {
    const { funnel, aiHistories } = usePage().props;
    
    const { data, setData, put, processing, errors } = useForm({
        aiid: funnel.aiid || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('ezfunnellandingpage.update-aiid', funnel.id));
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit AI History for Funnel: {funnel.token}
                    </h2>
                </div>
            }
        >
            <Head title={`Edit AI History - ${funnel.token}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Funnel Info Card */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Funnel Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Token:</p>
                                        <a 
                                            href={`https://ez3d.ai/${encodeURIComponent(funnel.token)}`} 
                                            target="_blank" 
                                            className="text-yellow-400 font-semibold hover:text-yellow-500 transition-colors"
                                            rel="noopener noreferrer"
                                        >
                                            https://ez3d.ai/{funnel.token}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Current AI History:</p>
                                        {funnel.ai_search_history ? (
                                            <div className="flex flex-col">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                                    ID: {funnel.aiid}
                                                </span>
                                                <span className="text-sm text-gray-800 mt-1">
                                                    {funnel.ai_search_history.conversation_title || funnel.ai_search_history.query}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Created: {formatDate(funnel.ai_search_history.created_at)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No AI History assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="aiid" className="block text-sm font-medium text-gray-700 mb-1">
                                            Select AI History
                                        </label>
                                        <select
                                            id="aiid"
                                            name="aiid"
                                            value={data.aiid}
                                            onChange={(e) => setData('aiid', e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm rounded-md"
                                        >
                                            <option value="">-- Select AI History --</option>
                                            {aiHistories.map((history) => (
                                                <option key={history.id} value={history.id}>
                                                    {history.conversation_title 
                                                        ? `${history.conversation_title} (${formatDate(history.created_at)})`
                                                        : `${history.query.substring(0, 60)}${history.query.length > 60 ? '...' : ''} (${formatDate(history.created_at)})`
                                                    }
                                                </option>
                                            ))}
                                        </select>
                                        {errors.aiid && (
                                            <p className="mt-2 text-sm text-red-600">{errors.aiid}</p>
                                        )}
                                        <p className="mt-2 text-sm text-gray-500">
                                            Select an AI history from the dropdown. Leave empty to remove AI history association.
                                        </p>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available AI Histories: {aiHistories.length}</h4>
                                        <p className="text-xs text-gray-500">
                                            Showing all conversations. Select one to associate with this funnel.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end space-x-3">
                                        <Link
                                            href={route('ezfunnellandingpage.index')}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Recent AI Histories Table */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent AI Histories</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title/Query</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {aiHistories.slice(0, 10).map((history) => (
                                                <tr key={history.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {history.id}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            {history.conversation_title && (
                                                                <span className="font-medium text-gray-900">
                                                                    {history.conversation_title}
                                                                </span>
                                                            )}
                                                            <span className="text-sm text-gray-600">
                                                                {history.query.substring(0, 60)}
                                                                {history.query.length > 60 ? '...' : ''}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(history.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            type="button"
                                                            onClick={() => setData('aiid', history.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {aiHistories.length > 10 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Showing 10 of {aiHistories.length} records. Use the dropdown above to see all.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}