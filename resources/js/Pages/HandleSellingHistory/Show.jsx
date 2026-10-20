import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function HandleSellInvoice({ auth, invoice }) {
    const formatCurrency = (amount, currency = 'USD') => {
        if (invoice.transaction?.payment_method === 'bee') {
            return `${parseFloat(amount).toFixed(2)} EZ$`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Invoice #{invoice.invoice_number}</h2>}
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
                                        {invoice.status}
                                    </span>
                                    <p className="mt-2 text-xl font-bold">
                                        EZ$ {invoice.amount}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            {auth.user && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Bill To</h2>
                                    <p className="font-medium">{auth.user.name}</p>
                                    <p className="text-gray-600">{auth.user.email}</p>
                                </div>
                            )}

                            {/* Handle Details */}
                            {invoice.handle && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Handle Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Type</p>
                                                <p className="font-medium capitalize">{invoice.handle.type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Handle</p>
                                                <p className="font-medium">{invoice.handle.name}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">Domain</p>
                                                <p className="font-medium">
                                                    <a 
                                                        href={invoice.handle.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        {invoice.handle.url}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Details */}
                            {invoice.transaction && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Transaction Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Transaction ID</p>
                                                <p className="font-medium">{invoice.transaction.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Method</p>
                                                <p className="font-medium">
                                                    {invoice.transaction.payment_method === 'bee' 
                                                        ? 'Bee Points' 
                                                        : invoice.transaction.payment_method}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Amount</p>
                                                <p className="font-medium">
                                                    EZ$ {invoice.transaction.payment_method === 'bee'
                                                        ? `${parseFloat(invoice.amount).toFixed(2)} EZ$`
                                                        : invoice.transaction.amount}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-medium capitalize">{invoice.transaction.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Items */}
                            {invoice.items && invoice.items.length > 0 && (
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
                                                {invoice.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.description}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            EZ$ {item.amount}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="font-medium">Subtotal</span>
                                        <span>EZ$ {invoice.amount}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold">EZ$ {invoice.amount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}