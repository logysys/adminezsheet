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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInvoiceTypeLabel = (type) => {
        const types = {
            'point_purchase': 'Bee Points Purchase',
            'handle_purchase': 'Domain/Handle Purchase',
            'reserve_transaction': 'Reserve Transaction',
            'handle_sale': 'Domain Sale',
            'domain_refund': 'Domain Refund',
            'other': 'Other Transaction'
        };
        return types[type] || type.replace(/_/g, ' ');
    };

    const getTransactionTypeLabel = (type) => {
        const types = {
            'reserve': 'Reserve Points',
            'release': 'Release Points',
            'transfer_to_user': 'Transfer to User',
            'purchase': 'Purchase',
            'sale': 'Sale',
            'refund': 'Refund',
            'penalty': 'Penalty',
            'incentive': 'Incentive'
        };
        return types[type] || (type ? type.replace(/_/g, ' ') : 'N/A');
    };

    // Render appropriate content based on invoice type
    const renderInvoiceDetails = () => {
        switch (invoice.type) {
            case 'point_purchase':
                return renderPointPurchaseDetails();
            case 'handle_purchase':
                return renderHandlePurchaseDetails();
            case 'reserve_transaction':
                return renderReserveTransactionDetails();
            case 'handle_sale':
                return renderHandleSaleDetails();
            case 'domain_refund':
                return renderDomainRefundDetails();
            default:
                return renderDefaultDetails();
        }
    };

    const renderPointPurchaseDetails = () => {
        const purchase = invoice.related_data;
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Purchase Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Bee Points Amount</p>
                            <p className="font-medium">{formatNumber(purchase?.bee_points_amount)} EZ$</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fiat Amount</p>
                            <p className="font-medium">${formatNumber(purchase?.fiat_amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Price Per Point</p>
                            <p className="font-medium">${formatNumber(purchase?.price_per_point)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium">{purchase?.payment_method || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Transaction Hash</p>
                            <p className="font-medium break-all">{purchase?.transaction_hash || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">{purchase?.status || 'N/A'}</p>
                        </div>
                        {purchase?.processed_at && (
                            <div>
                                <p className="text-sm text-gray-500">Processed At</p>
                                <p className="font-medium">{formatDateTime(purchase.processed_at)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderHandlePurchaseDetails = () => {
        const purchase = invoice.related_data;
        const domain = purchase?.domain;
        
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Purchase Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Domain/Handle</p>
                            <p className="font-medium">
                                {domain?.name ? (
                                    <a 
                                        href={domain.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {domain.name}.{domain.selected}
                                    </a>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium capitalize">{domain?.type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">{formatCurrency(purchase?.amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Currency</p>
                            <p className="font-medium">{purchase?.currency || 'USD'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium">{purchase?.payment_method || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">{purchase?.status || 'N/A'}</p>
                        </div>
                        {purchase?.transaction_id && (
                            <div>
                                <p className="text-sm text-gray-500">Transaction ID</p>
                                <p className="font-medium">{purchase.transaction_id}</p>
                            </div>
                        )}
                        {purchase?.processed_at && (
                            <div>
                                <p className="text-sm text-gray-500">Processed At</p>
                                <p className="font-medium">{formatDateTime(purchase.processed_at)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderReserveTransactionDetails = () => {
        const transaction = invoice.related_data;
        
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Transaction Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Transaction Type</p>
                            <p className="font-medium">
                                {getTransactionTypeLabel(transaction?.transaction_type)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Reference ID</p>
                            <p className="font-medium">{transaction?.reference_id || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Processed By</p>
                            <p className="font-medium">
                                {transaction?.admin?.name || 'N/A'}
                                {transaction?.admin?.email && ` (${transaction.admin.email})`}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">
                                {transaction?.created_at ? formatDateTime(transaction.created_at) : 'N/A'}
                            </p>
                        </div>
                        {transaction?.reason && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Reason</p>
                                <p className="font-medium">{transaction.reason}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recipient Information for transfers */}
                {transaction?.transaction_type === 'transfer_to_user' && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Recipient Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">
                                        {transaction?.user?.name || 
                                         (transaction?.recipient_email ? 'Pending Registration' : 'N/A')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">
                                        {transaction?.user?.email || 
                                         transaction?.recipient_email || 
                                         'N/A'}
                                    </p>
                                </div>
                                {transaction?.recipient_email && !transaction?.user && (
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
            </div>
        );
    };

    const renderHandleSaleDetails = () => {
        const sale = invoice.related_data;
        const domain = sale?.domain;
        
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Sale Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Domain/Handle</p>
                            <p className="font-medium">
                                {domain?.name ? (
                                    <a 
                                        href={domain.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {domain.name}.{domain.selected}
                                    </a>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium capitalize">{domain?.type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sale Amount</p>
                            <p className="font-medium">{formatCurrency(sale?.amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Seller Amount</p>
                            <p className="font-medium">{formatCurrency(sale?.seller_amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Commission</p>
                            <p className="font-medium">{formatCurrency(sale?.commission)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Currency</p>
                            <p className="font-medium">{sale?.currency || 'USD'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium">{sale?.payment_method || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">{sale?.status || 'N/A'}</p>
                        </div>
                        {sale?.transaction_id && (
                            <div>
                                <p className="text-sm text-gray-500">Transaction ID</p>
                                <p className="font-medium">{sale.transaction_id}</p>
                            </div>
                        )}
                        {sale?.processed_at && (
                            <div>
                                <p className="text-sm text-gray-500">Processed At</p>
                                <p className="font-medium">{formatDateTime(sale.processed_at)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderDomainRefundDetails = () => {
        const refund = invoice.related_data;
        const domain = refund?.domain;
        
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Refund Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Domain/Handle</p>
                            <p className="font-medium">
                                {domain?.name ? (
                                    <a 
                                        href={domain.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {domain.name}.{domain.selected}
                                    </a>
                                ) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium capitalize">{domain?.type || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Original Amount</p>
                            <p className="font-medium">{formatCurrency(refund?.original_amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Refund Amount</p>
                            <p className="font-medium">{formatCurrency(refund?.refund_amount)}</p>
                        </div>
                        {refund?.buyer_payment_hold && (
                            <div>
                                <p className="text-sm text-gray-500">Buyer Payment Hold</p>
                                <p className="font-medium">{formatCurrency(refund.buyer_payment_hold)}</p>
                            </div>
                        )}
                        {refund?.total_penalty && (
                            <div>
                                <p className="text-sm text-gray-500">Total Penalty</p>
                                <p className="font-medium">{formatCurrency(refund.total_penalty)}</p>
                            </div>
                        )}
                        {refund?.processed_at && (
                            <div>
                                <p className="text-sm text-gray-500">Processed At</p>
                                <p className="font-medium">{formatDateTime(refund.processed_at)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional refund details if available */}
                {(refund?.sell_service_commission || refund?.reject_service_commission || refund?.reject_buyer_commission) && (
                    <div className="mt-4">
                        <h3 className="text-md font-medium text-gray-800 mb-2">Commission Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                {refund?.sell_service_commission && (
                                    <div>
                                        <p className="text-sm text-gray-500">Sale Service Commission</p>
                                        <p className="font-medium">{formatCurrency(refund.sell_service_commission)}</p>
                                    </div>
                                )}
                                {refund?.reject_service_commission && (
                                    <div>
                                        <p className="text-sm text-gray-500">Rejection Service Commission</p>
                                        <p className="font-medium">{formatCurrency(refund.reject_service_commission)}</p>
                                    </div>
                                )}
                                {refund?.reject_buyer_commission && (
                                    <div>
                                        <p className="text-sm text-gray-500">Rejection Buyer Commission</p>
                                        <p className="font-medium">{formatCurrency(refund.reject_buyer_commission)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderDefaultDetails = () => {
        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Transaction Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">No additional details available for this invoice type.</p>
                </div>
            </div>
        );
    };

    const renderItemsTable = () => {
        // Parse items if it's a string, otherwise use as is
        let items = [];
        try {
            items = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items;
        } catch (e) {
            console.error('Error parsing items:', e);
            items = [];
        }

        if (!items || items.length === 0) {
            return (
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Items</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600">No items listed for this invoice.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Items</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                {items.some(item => item.type) && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.quantity || 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(item.unit_price || item.price_per_point || 0)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(item.total || item.amount || 0)}
                                    </td>
                                    {items.some(i => i.type) && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {item.type || '—'}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
                            href={route('reserve.dashboard')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice #${invoice.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
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
                                    <p className="text-gray-600 mt-1">
                                        Type: {getInvoiceTypeLabel(invoice.type)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          invoice.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                                          invoice.status === 'penalty' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'}`}>
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
                                {invoice.user ? (
                                    <>
                                        <p className="font-medium">{invoice.user.name}</p>
                                        <p className="text-gray-600">{invoice.user.email}</p>
                                    </>
                                ) : (
                                    <p className="text-gray-600">System Account</p>
                                )}
                            </div>

                            {/* Type-specific details */}
                            {renderInvoiceDetails()}

                            {/* Items table */}
                            {renderItemsTable()}

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

                            {/* Dates */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium">Created At</p>
                                        <p>{formatDateTime(invoice.created_at)}</p>
                                    </div>
                                    {invoice.updated_at && invoice.updated_at !== invoice.created_at && (
                                        <div>
                                            <p className="font-medium">Last Updated</p>
                                            <p>{formatDateTime(invoice.updated_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

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