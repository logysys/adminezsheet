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
        router.get(route('ezfunnels.index'), {
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
        router.get(route('ezfunnels.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">EZ Funnels</h2>
                    <Link 
                        href={route('ezfunnels.create')} 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create New Funnel
                    </Link>
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
                                        className="flex-grow bg-white text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-0"
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
                                            <span className="text-sm">🏀</span>
                                            Exact
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domains</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transparency</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {funnels.data.map(funnel => (
                                            <tr key={funnel.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a 
                                                        href={`https://ez3d.ai/${encodeURIComponent(funnel.token)}`} 
                                                        target="_blank" 
                                                        className="text-yellow-400 font-semibold truncate"
                                                        rel="noopener noreferrer"
                                                    >
                                                        https://ez3d.ai/{funnel.token}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        {funnel.handle_domains?.map((domain) => (
                                                            <a
                                                                key={domain.id}
                                                                href={`https://${domain.domain}.${domain.domainselected}`}
                                                                target="_blank"
                                                                className="text-yellow-400 font-semibold truncate"
                                                                rel="noopener noreferrer"
                                                            >
                                                                https://{domain.domain}.{domain.domainselected}
                                                            </a>
                                                        ))}
                                                        {funnel.custom_domains?.map((domain) => (
                                                            <a
                                                                key={domain.id}
                                                                href={`https://${domain.domain}/${domain.domainselected}`}
                                                                target="_blank"
                                                                className="text-yellow-400 font-semibold truncate"
                                                                rel="noopener noreferrer"
                                                            >
                                                                https://{domain.domain}/{domain.domainselected}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div 
                                                            className="w-6 h-6 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: funnel.color }}
                                                            title={funnel.color}
                                                        ></div>
                                                        <span className="ml-2 text-sm text-gray-500">{funnel.color}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {funnel.transparency}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(funnel.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={funnels.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}