import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, rules }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text, length = 150) => {
        if (!text) return 'No steps provided';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

    const parseKeywords = (keywordsData) => {
        if (!keywordsData) return [];
        
        try {
            // If it's already an array, return it
            if (Array.isArray(keywordsData)) {
                return keywordsData;
            }
            
            // If it's a string that looks like JSON, parse it
            if (typeof keywordsData === 'string') {
                // Check if it's already a JSON string
                if (keywordsData.trim().startsWith('[') && keywordsData.trim().endsWith(']')) {
                    return JSON.parse(keywordsData);
                }
                // If it's just a plain string, wrap it in an array
                return [keywordsData];
            }
            
            // If it's something else, return empty array
            return [];
        } catch (error) {
            console.error('Error parsing keywords:', error, keywordsData);
            // If parsing fails, try to handle as a single string
            if (typeof keywordsData === 'string') {
                return [keywordsData];
            }
            return [];
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Domain Transfer Rules</h2>
                    <Link
                        href={route('domain-transfer-rules.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Create New Rule
                    </Link>
                </div>
            }
        >
            <Head title="Domain Transfer Rules" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support URL</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rules.data.map((rule) => {
                                            const keywords = parseKeywords(rule.keywords);
                                            
                                            return (
                                                <tr key={rule.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {rule.provider_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {keywords.length > 0 ? (
                                                                <>
                                                                    {keywords.slice(0, 3).map((keyword, index) => (
                                                                        <span 
                                                                            key={index} 
                                                                            className="inline-block bg-gray-100 rounded px-2 py-1 text-xs font-semibold text-gray-700"
                                                                        >
                                                                            {keyword}
                                                                        </span>
                                                                    ))}
                                                                    {keywords.length > 3 && (
                                                                        <span className="inline-block bg-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-700">
                                                                            +{keywords.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs">
                                                            {truncateText(stripHtml(rule.steps))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {rule.support_url ? (
                                                                <a 
                                                                    href={rule.support_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-900 truncate max-w-xs block"
                                                                >
                                                                    {new URL(rule.support_url).hostname}
                                                                </a>
                                                            ) : '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(rule.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('domain-transfer-rules.edit', rule.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this domain transfer rule?')) {
                                                                    router.delete(route('domain-transfer-rules.destroy', rule.id));
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={rules.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}