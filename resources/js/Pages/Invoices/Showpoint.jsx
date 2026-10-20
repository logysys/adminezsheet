import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, invoice }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoice.stripe_transaction?.currency || 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
                                    <h1 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h1>
                                    <p className="text-gray-500">Issued: {formatDate(invoice.issue_date)}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                        invoice.status === 'paid' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {invoice.status}
                                    </div>
                                    <p className="mt-2 text-xl font-bold">{formatCurrency(invoice.amount)}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-2">Bill To</h2>
                                <p>{invoice.user.name}</p>
                                <p>{invoice.user.email}</p>
                            </div>

                            {/* Payment Details */}
                            {invoice.point_purchase && (
								<div className="mb-8">
									<h2 className="text-lg font-semibold mb-2">Payment Details</h2>
									<p>Points Purchased: {invoice.point_purchase.bee_points_amount} EZ$</p>
									<p>Amount: {formatCurrency(invoice.point_purchase.fiat_amount)}</p>
									<p>Price per Point: {formatCurrency(invoice.point_purchase.price_per_point)}</p>
									<p>Method: {invoice.point_purchase.payment_method}</p>
								</div>
							)}

                            {/* Items Table */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4">Items</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoice.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.price)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="mt-8">
                                    <h2 className="text-lg font-semibold mb-2">Notes</h2>
                                    <p className="text-gray-600">{invoice.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}