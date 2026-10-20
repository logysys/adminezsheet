import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUndo,
    faUser,
    faCoins,
    faCalendarAlt,
    faCheckCircle,
    faTimes,
    faSpinner,
    faArrowLeft,
    faPlus,
    faGlobe,
    faLink,
    faFileInvoice,
    faSearch,
    faFilter,
    faTimesCircle,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, transfers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatAmount = (amount) => {
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.refund-transfers.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        router.get(route('admin.refund-transfers.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const getInvoiceLink = (invoice) => {
        if (invoice.type === 'refund') {
            return `/refundinvoicebuyer/${invoice.number}`;
        } else if (invoice.type === 'penalty') {
            return `/refundinvoiceseller/${invoice.number}`;
        }
        return '#';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin - Refunded Transfers</h2>}
        >
            <Head title="Admin - Refunded Transfers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Filter Form */}
                            <form onSubmit={handleFilter} className="mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by email or invoice number..."
                                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Search
                                        </button>
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {transfers.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faUndo} className="text-gray-400 text-5xl mb-4" />
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">No refunded transfers found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Domain/Handle
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Buyer
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Seller
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Invoices
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Original Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Refund Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Processed At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transfers.data.map((transfer) => (
                                                <tr key={transfer.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon 
                                                                icon={transfer.domain.type === 'custom' ? faLink : faGlobe} 
                                                                className={`mr-2 ${transfer.domain.type === 'custom' ? 'text-blue-400' : 'text-green-400'}`} 
                                                            />
                                                            <a 
                                                                href={transfer.domain.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-indigo-600 hover:underline"
                                                            >
                                                                {transfer.domain.url}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {transfer.buyer ? (
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-500">
                                                                    {transfer.buyer.email}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Unknown</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {transfer.seller ? (
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-500">
                                                                    {transfer.seller.email}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Unknown</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            {transfer.invoices.length > 0 ? (
                                                                transfer.invoices.map((invoice) => (
                                                                    <Link 
                                                                        key={invoice.number}
                                                                        href={getInvoiceLink(invoice)}
                                                                        target="_blank"
                                                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                                                                    >
                                                                        <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
                                                                        {invoice.number} ({invoice.type})
                                                                    </Link>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-400">N/A</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                 EZ${formatAmount(transfer.original_amount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-teal-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                 EZ${formatAmount(transfer.refund_amount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 mr-2" />
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(transfer.processed_at)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {transfers.links.length > 3 && (
                                        <div className="mt-4 flex justify-center">
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {transfers.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}