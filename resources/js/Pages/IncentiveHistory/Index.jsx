import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';

// Simple spinner component (replacing the missing LoadingSpinner)
const SimpleSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8"></div>
    </div>
);

export default function Index({ auth, incentives, filters }) {
    const { errors } = usePage().props;
    const [search, setSearch] = useState((filters && filters.search) || '');
    const [isLoading, setIsLoading] = useState(false);
    
    // Handle potential API errors
    useEffect(() => {
        if (errors && errors.message) {
            alert(errors.message);
        }
    }, [errors]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            distributed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(route('incentive-history.index'), { search }, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const resetFilters = () => {
        setSearch('');
        setIsLoading(true);
        router.get(route('incentive-history.index'), {}, {
            preserveState: true,
            replace: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Safely access incentives data
    const incentiveData = incentives?.data || [];
    const paginationLinks = incentives?.links || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Incentive History</h2>}
        >
            <Head title="Incentive History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Error Message Display */}
                            {errors?.message && (
                                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                                    Error: {errors.message}
                                </div>
                            )}
                            
                            {/* Filter Form */}
                            <form onSubmit={handleFilter} className="mb-6">
                                <div className="relative flex">
                                    <TextInput
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by invoice number..."
                                        className="w-full pr-12"
                                        noLabel
                                        disabled={isLoading}
                                    />
                                    <div className="absolute right-0 top-0 h-full flex">
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="px-3 text-gray-500 hover:text-gray-700"
                                                disabled={isLoading}
                                                aria-label="Clear search"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Searching...' : 'Search'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex justify-center py-8">
                                    <SimpleSpinner />
                                </div>
                            )}
                            
                            {/* Table */}
                            {!isLoading && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributed At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {incentiveData.length > 0 ? (
                                                incentiveData.map((incentive) => (
                                                    <tr key={incentive.incentive_history_id || incentive.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {incentive.user?.name || 'N/A'}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {incentive.user?.email || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            EZ${formatCurrency(incentive.fiat_amount || incentive.amount || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {incentive.invoice_number ? (
                                                                <a 
                                                                    href={route('incentive-history.invoice', incentive.invoice_number)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                >
                                                                    {incentive.invoice_number}
                                                                </a>
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                            {incentive.incentive_type || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(incentive.status)}`}>
                                                                {incentive.status || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(incentive.distributed_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No incentive history found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {!isLoading && incentiveData.length > 0 && paginationLinks.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={paginationLinks} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}