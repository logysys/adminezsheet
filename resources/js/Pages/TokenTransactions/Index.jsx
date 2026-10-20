import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

export default function Index({ auth, transactions, summary, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [transactionType, setTransactionType] = useState(filters.transaction_type || '');
    const [dateRange, setDateRange] = useState(filters.date_range || '');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount).replace('$', 'US$');
    };

    const formatPoints = (amount) => {
        return 'EZ$' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('token-transactions.index'), { 
            search, 
            transaction_type: transactionType,
            date_range: dateRange 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        setTransactionType('');
        setDateRange('');
        router.get(route('token-transactions.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Token Transactions</h2>}
        >
            <Head title="Token Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Filter Form */}
                            <form onSubmit={handleFilter} className="mb-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <TextInput
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search users by name or email..."
                                        className="w-full"
                                        noLabel
                                    />
                                    <SelectInput
                                        id="transaction_type"
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                        className="w-full"
                                        noLabel
                                    >
                                        <option value="">All Transaction Types</option>
                                        <option value="purchase">Purchase</option>
                                        <option value="refund">Refund</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="withdrawal">Withdrawal</option>
                                    </SelectInput>
                                    <TextInput
                                        type="date"
                                        id="date_range"
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        placeholder="Date range"
                                        className="w-full"
                                        noLabel
                                    />
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
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </form>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-800">Total Balance</h3>
                                    <p className="text-2xl font-semibold text-blue-900">
                                        {formatPoints(summary.total_balance)}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-800">Positive Balance</h3>
                                    <p className="text-2xl font-semibold text-green-900">
                                        {formatPoints(summary.positive_balance)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-800">Negative Balance</h3>
                                    <p className="text-2xl font-semibold text-red-900">
                                        {formatPoints(summary.negative_balance)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Before</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transactions.data.length > 0 ? (
                                            transactions.data.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {transaction.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {transaction.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {formatPoints(transaction.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        {transaction.transaction_type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatPoints(transaction.balance_before)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatPoints(transaction.balance_after)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(transaction.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {transactions.data.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={transactions.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}