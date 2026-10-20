import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, transfer }) {
    const formatPoints = (amount) => {
        return 'EZ$' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(amount);
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

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            completed: 'COMPLETED',
            pending: 'PENDING',
            failed: 'FAILED',
            cancelled: 'CANCELLED'
        };
        return statusLabels[status] || status.toUpperCase();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Bee Transfer #{transfer.transaction_hash}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                            Print Details
                        </button>
                        <Link
                            href={route('bee-transfers.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                            Back to Transfers
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Transfer ${transfer.transaction_hash}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white border-b border-gray-200">
                            {/* Transfer Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Transfer #{transfer.transaction_hash}</h1>
                                    <p className="text-gray-600">Created: {formatDate(transfer.created_at)}</p>
                                    <p className="text-gray-600 mt-1">
                                        Type: Bee Points Transfer
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(transfer.status)}`}>
                                        {getStatusLabel(transfer.status)}
                                    </span>
                                    <p className="mt-2 text-xl font-bold">
                                        {formatPoints(transfer.amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Parties Involved */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800 mb-4">Sender Information</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">{transfer.sender?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{transfer.sender?.email || 'N/A'}</p>
                                            </div>
                                            {transfer.sender?.id && (
                                                <div>
                                                    <p className="text-sm text-gray-500">User ID</p>
                                                    <p className="font-medium">{transfer.sender.id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800 mb-4">Receiver Information</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium">{transfer.receiver?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{transfer.receiver?.email || 'N/A'}</p>
                                            </div>
                                            {transfer.receiver?.id && (
                                                <div>
                                                    <p className="text-sm text-gray-500">User ID</p>
                                                    <p className="font-medium">{transfer.receiver.id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Transaction Details</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Transaction Hash</p>
                                            <p className="font-medium break-all">{transfer.transaction_hash}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Amount</p>
                                            <p className="font-medium">{formatPoints(transfer.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="font-medium">{formatDateTime(transfer.created_at)}</p>
                                        </div>
                                        {transfer.processed_at && (
                                            <div>
                                                <p className="text-sm text-gray-500">Processed At</p>
                                                <p className="font-medium">{formatDateTime(transfer.processed_at)}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <p className="font-medium capitalize">{transfer.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Transfer ID</p>
                                            <p className="font-medium">{transfer.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {transfer.notes && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Notes</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-line">{transfer.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            {transfer.metadata && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">Metadata</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <pre className="text-sm text-gray-700 overflow-x-auto">
                                            {JSON.stringify(transfer.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium">Created</p>
                                        <p>{formatDateTime(transfer.created_at)}</p>
                                    </div>
                                    {transfer.processed_at && (
                                        <div>
                                            <p className="font-medium">Processed</p>
                                            <p>{formatDateTime(transfer.processed_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-center text-gray-600">
                                    EZ$ Transfer Management System
                                </p>
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    This transfer was processed through the EZ$ network.
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
                        .flex.items-center.justify-between {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </AuthenticatedLayout>
    );
}