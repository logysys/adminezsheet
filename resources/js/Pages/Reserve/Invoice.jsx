import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Invoice({ auth, invoice }) {
    const formatCurrency = (amount) => {
        return `${formatNumber(amount)} EZ$`;
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0.00';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(num);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTransactionTypeLabel = (type) => {
        const types = {
            'reserve': 'Reserve Points',
            'release': 'Release Points',
            'transfer_to_user': 'Transfer to User'
        };
        return types[type] || type.replace(/_/g, ' ');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Invoice #{invoice.invoice_number}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Print Invoice
                        </button>
                        <Link
                            href={route('reserve.history')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Back to History
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice #${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white border-b border-gray-200">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Invoice #{invoice.invoice_number}</h1>
                                    <p className="text-gray-600">Issued: {formatDate(invoice.issue_date)}</p>
                                    {invoice.due_date && (
                                        <p className="text-gray-600">Due: {formatDate(invoice.due_date)}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {invoice.status.toUpperCase()}
                                    </span>
                                    <p className="mt-2 text-xl font-bold">
                                        {formatCurrency(invoice.amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-2">Bill To</h2>
                                <p className="font-medium">{invoice.reserve_transaction?.admin?.name || 'N/A'}</p>
                                <p className="text-gray-600">{invoice.reserve_transaction?.admin?.email || 'N/A'}</p>
                            </div>

                            {/* Transaction Details */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-2">Transaction Details</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Transaction Type</p>
                                            <p className="font-medium">
                                                {getTransactionTypeLabel(invoice.reserve_transaction?.transaction_type)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Reference ID</p>
                                            <p className="font-medium">{invoice.reserve_transaction?.reference_id || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium">
                                                {invoice.reserve_transaction?.created_at 
                                                    ? new Date(invoice.reserve_transaction.created_at).toLocaleString()
                                                    : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-2">Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getTransactionTypeLabel(invoice.reserve_transaction?.transaction_type)}
                                                    {invoice.reserve_transaction?.reason && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Reason: {invoice.reserve_transaction.reason}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(invoice.amount)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium">Subtotal</span>
                                        <span>{formatCurrency(invoice.amount)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold">{formatCurrency(invoice.amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Information for transfers */}
                            {invoice.reserve_transaction?.transaction_type === 'transfer_to_user' && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Recipient Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">
                                                    {invoice.reserve_transaction?.user?.name || 
                                                     (invoice.reserve_transaction?.recipient_email ? 'Pending Registration' : 'N/A')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">
                                                    {invoice.reserve_transaction?.user?.email || 
                                                     invoice.reserve_transaction?.recipient_email || 
                                                     'N/A'}
                                                </p>
                                            </div>
                                            {invoice.reserve_transaction?.recipient_email && !invoice.reserve_transaction?.user && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md">
                                                        <strong>Note:</strong> This transfer is pending user registration. 
                                                        The points will be credited to the user's account once they register with this email address.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-center text-gray-600">
                                    Thank you for using EZ$ Reserve Management System
                                </p>
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    This is an automated invoice. No signature required.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>
                {`
                    @media print {
                        .bg-white {
                            background: white !important;
                        }
                        .shadow-sm {
                            box-shadow: none !important;
                        }
                        .sm\\:rounded-lg {
                            border-radius: 0 !important;
                        }
                        .py-12 {
                            padding-top: 0 !important;
                            padding-bottom: 0 !important;
                        }
                        .flex.justify-between.items-start {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </AuthenticatedLayout>
    );
}