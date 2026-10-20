import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth }) {
    const { funnels, filters } = usePage().props;
    
    const [search, setSearch] = React.useState(filters.search || '');
    const [searchType, setSearchType] = React.useState(filters.search_type || 'fuzzy');
    
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        router.get(route('ezfunnellandingpage.index'), {
            search,
            search_type: searchType,
        }, {
            preserveState: true,
            replace: true,
        });
    };
    
    const resetFilters = () => {
        setSearch('');
        setSearchType('fuzzy');
        router.get(route('ezfunnellandingpage.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to truncate text
    const truncateText = (text, length = 50) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">EZ Funnels</h2>
                </div>
            }
        >
            <Head title="EZ Funnels" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search Form */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search by token"
                                        className="flex-grow bg-white text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-0 border border-gray-300"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    />

                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            className={`font-semibold px-3 py-2 flex items-center gap-1.5 whitespace-nowrap rounded-l-md border-r transition-colors ${
                                                searchType === 'fuzzy'
                                                    ? 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                                                    : 'bg-gray-600 text-gray-300 border-gray-700 hover:bg-gray-700'
                                            }`}
                                            onClick={() => {
                                                setSearchType('fuzzy');
                                                handleSubmit();
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Fuzzy
                                        </button>
                                        <button
                                            type="button"
                                            className={`font-semibold px-3 py-2 flex items-center gap-1.5 whitespace-nowrap rounded-r-md transition-colors ${
                                                searchType === 'exact'
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                            }`}
                                            onClick={() => {
                                                setSearchType('exact');
                                                handleSubmit();
                                            }}
                                        >
                                            <span className="text-sm">🎯</span>
                                            Exact
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            {/* Funnels List */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domains</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI History</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {funnels.data.map(funnel => {
                                            // Debug: Log the funnel data to see what's coming from the server
                                            console.log('Funnel:', funnel.id, 'aiid:', funnel.aiid, 'aiSearchHistory:', funnel.ai_search_history);
                                            
                                            return (
                                                <tr key={funnel.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('ezfunnellandingpage.edit-aiid', funnel.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                                                        >
                                                            Edit AI
                                                        </Link>
                                                        {funnel.aiid && funnel.ai_search_history?.slug && (
                                                            <Link
                                                                href={route('ai-history.show', funnel.ai_search_history.slug)}
                                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                                                target="_blank"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                    </td>
													<td className="px-6 py-4 whitespace-nowrap">
                                                        <a 
                                                            href={`https://ez3d.ai/${encodeURIComponent(funnel.token)}`} 
                                                            target="_blank" 
                                                            className="text-yellow-400 font-semibold truncate hover:text-yellow-500 transition-colors"
                                                            rel="noopener noreferrer"
                                                        >
                                                            https://ez3d.ai/{funnel.token}
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1 max-w-xs">
                                                            {funnel.handle_domains?.length > 0 && (
                                                                <div className="space-y-1">
                                                                    {funnel.handle_domains.map((domain) => (
                                                                        <a
                                                                            key={domain.id}
                                                                            href={`https://${domain.domain}.${domain.domainselected}`}
                                                                            target="_blank"
                                                                            className="text-yellow-400 font-semibold truncate block hover:text-yellow-500 transition-colors text-sm"
                                                                            rel="noopener noreferrer"
                                                                            title={`https://${domain.domain}.${domain.domainselected}`}
                                                                        >
                                                                            {domain.domain}.{domain.domainselected}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {funnel.custom_domains?.length > 0 && (
                                                                <div className="space-y-1 mt-1 pt-1 border-t border-gray-100">
                                                                    {funnel.custom_domains.map((domain) => (
                                                                        <a
                                                                            key={domain.id}
                                                                            href={`https://${domain.domain}/${domain.domainselected}`}
                                                                            target="_blank"
                                                                            className="text-yellow-400 font-semibold truncate block hover:text-yellow-500 transition-colors text-sm"
                                                                            rel="noopener noreferrer"
                                                                            title={`https://${domain.domain}/${domain.domainselected}`}
                                                                        >
                                                                            {domain.domain}/{domain.domainselected}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {!funnel.handle_domains?.length && !funnel.custom_domains?.length && (
                                                                <span className="text-gray-400 text-sm">No domains</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {funnel.aiid ? (
                                                            <div className="flex flex-col">
                                                                {funnel.ai_search_history ? (
                                                                    <>
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                                                            {funnel.ai_search_history.slug || 'no-slug'}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 mt-1" title={funnel.ai_search_history.query}>
                                                                            {truncateText(funnel.ai_search_history.conversation_title || funnel.ai_search_history.query, 30)}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">No history data</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">None</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(funnel.created_at)}
                                                    </td>
                                                    
                                                </tr>
                                            );
                                        })}
                                        {funnels.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    No funnels found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {funnels.links && funnels.links.length > 3 && (
                                <div className="mt-4">
                                    <Pagination links={funnels.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}