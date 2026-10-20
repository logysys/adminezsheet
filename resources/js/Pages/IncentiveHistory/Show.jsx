import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, invoice, incentive }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Parse the items JSON if it's a string
    const items = typeof invoice.items === 'string' 
        ? JSON.parse(invoice.items) 
        : invoice.items;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <Link 
                        href={route('incentive-history.index')} 
                        className="mr-4 text-blue-600 hover:text-blue-800"
                    >
                        &larr; Back to Incentive History
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Incentive Invoice #{invoice.invoice_number}
                    </h2>
                </div>
            }
        >
            <Head title={`Incentive Invoice #${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white border-b border-gray-200">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Incentive Invoice #{invoice.invoice_number}
                                    </h1>
                                    <p className="text-gray-600">Issued: {formatDate(invoice.issue_date)}</p>
                                    
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {invoice.status}
                                    </span>
                                    <p className="mt-2 text-xl font-bold">
                                        {formatCurrency(invoice.amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Incentive Details */}
                            {incentive && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Incentive Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Incentive Type</p>
                                                <p className="font-medium capitalize">{incentive.incentive_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Amount</p>
                                                <p className="font-medium">{formatCurrency(incentive.amount)}</p>
                                            </div>
                                            {incentive.distributed_at && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Distributed At</p>
                                                    <p className="font-medium">{formatDate(incentive.distributed_at)}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className="font-medium capitalize">{incentive.status}</p>
                                            </div>
                                            {incentive.description && (
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-500">Description</p>
                                                    <p className="font-medium">{incentive.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            {items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                </tr>
                                            ))}
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