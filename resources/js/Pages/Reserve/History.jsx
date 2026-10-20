import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
export default function History({ auth, transactions, filters }) {
const formatNumber = (num) => {
if (num === null || num === undefined) return '0.00';
return new Intl.NumberFormat('en-US', {
minimumFractionDigits: 2,
maximumFractionDigits: 8
}).format(num);
};
const handleSearch = (e) => {
    const value = e.target.value;
    router.get(route('reserve.history'), { search: value }, {
        preserveState: true,
        replace: true
    });
};

const clearSearch = () => {
    router.get(route('reserve.history'), {}, {
        preserveState: true,
        replace: true
    });
};

// Function to open invoice
const openInvoice = (invoiceId) => {
    if (invoiceId) {
        window.open(route('invoice.show', invoiceId), '_blank');
    }
};

return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Reserve Transaction History
                </h2>
                <Link
                    href={route('reserve.dashboard')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    Back to Dashboard
                </Link>
            </div>
        }
    >
        <Head title="Reserve Transaction History" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Search Filter */}
                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            defaultValue={filters.search}
                            onChange={handleSearch}
                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {filters.search && (
                            <button
                                onClick={clearSearch}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reference ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User/Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.data.length > 0 ? (
                                    transactions.data.map(transaction => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.reference_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    transaction.transaction_type === 'reserve' 
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : transaction.transaction_type === 'release'
                                                        ? 'bg-green-100 text-green-800'
                                                        : transaction.transaction_type === 'transfer_to_user'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {transaction.transaction_type.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                EZ${formatNumber(transaction.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {transaction.reason || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.invoice?.invoice_number ? (
                                                    <button
                                                        onClick={() => openInvoice(transaction.invoice.id)}
                                                        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                    >
                                                        {transaction.invoice.invoice_number}
                                                    </button>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.admin?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.transaction_type === 'transfer_to_user' && transaction.user ? (
                                                    <div>
                                                        <div className="font-medium">{transaction.user.name}</div>
                                                        <div className="text-xs text-gray-400">{transaction.user.email}</div>
                                                    </div>
                                                ) : transaction.transaction_type === 'transfer_to_user' && transaction.recipient_email ? (
                                                    <div>
                                                        <div className="font-medium text-gray-400">Pending Registration</div>
                                                        <div className="text-xs text-gray-400">{transaction.recipient_email}</div>
                                                    </div>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination links={transactions.links} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);
}