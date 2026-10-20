import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, tokenInfo, flash }) {
    // Formatter for numbers with two decimal places and thousand separators.
    const numberFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Inertia's useForm hook to manage form state and submission
    const { data, setData, put, processing, errors } = useForm({
        token_name: tokenInfo.token_name || '',
        total_supply: tokenInfo.total_supply || 0,
        circulating_supply: tokenInfo.circulating_supply || 0,
        current_price: tokenInfo.current_price || 0,
    });

    // State to hold the user-visible, formatted string values
    const [displayValues, setDisplayValues] = useState({
        total_supply: numberFormatter.format(tokenInfo.total_supply || 0),
        circulating_supply: numberFormatter.format(tokenInfo.circulating_supply || 0),
        current_price: numberFormatter.format(tokenInfo.current_price || 0),
    });

    // Handles changes for all form inputs, including formatting for numeric fields
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['total_supply', 'circulating_supply', 'current_price'];

        if (numericFields.includes(name)) {
            // Remove non-numeric characters except the decimal point
            const rawValue = value.replace(/,/g, '');

            // Allow only valid number patterns (e.g., 123, 123., 123.45)
            if (/^\d*\.?\d*$/.test(rawValue)) {
                // Update the raw data for submission
                setData(name, rawValue === '' ? null : rawValue);

                // Update the display value with commas as the user types
                const [integerPart, decimalPart] = rawValue.split('.');
                const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                
                let newDisplayValue = formattedInteger;
                if (decimalPart !== undefined) {
                    newDisplayValue += '.' + decimalPart;
                }
                
                setDisplayValues(prev => ({ ...prev, [name]: newDisplayValue }));
            }
        } else {
            // Handle standard text input (e.g., token_name)
            setData(name, value);
        }
    };

    // Formats the number completely when the user leaves the input field
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const numericFields = ['total_supply', 'circulating_supply', 'current_price'];
    
        if (numericFields.includes(name) && value) {
            const numericValue = parseFloat(value.replace(/,/g, ''));
            if (!isNaN(numericValue)) {
                // Update display value with full formatting (e.g., .00)
                setDisplayValues(prev => ({
                    ...prev,
                    [name]: numberFormatter.format(numericValue)
                }));
                // Ensure data for submission is a clean number
                setData(name, numericValue);
            }
        }
    };

    // Form submission handler
    const submit = (e) => {
        e.preventDefault();
        put(route('token-info.update', tokenInfo.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Token Information</h2>}
        >
            <Head title="Token Information" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Current Token Details</h3>
                                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">Token Name</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{tokenInfo.token_name}</dd>
                                        </div>
                                        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Supply</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{numberFormatter.format(tokenInfo.total_supply)}</dd>
                                        </div>
                                        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">Circulating Supply</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{numberFormatter.format(tokenInfo.circulating_supply)}</dd>
                                        </div>
                                        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                            <dt className="text-sm font-medium text-gray-500 truncate">Current Price</dt>
                                            <dd className="mt-1 text-3xl font-semibold text-gray-900">US${numberFormatter.format(tokenInfo.current_price)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Update Token Information</h3>
                                    <form onSubmit={submit} className="mt-5">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label htmlFor="token_name" className="block text-sm font-medium text-gray-700">Token Name</label>
                                                <input
                                                    type="text"
                                                    name="token_name"
                                                    id="token_name"
                                                    value={data.token_name}
                                                    onChange={handleFormChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="total_supply" className="block text-sm font-medium text-gray-700">Total Supply</label>
                                                <input
                                                    type="text"
                                                    name="total_supply"
                                                    id="total_supply"
                                                    value={displayValues.total_supply}
                                                    onChange={handleFormChange}
                                                    onBlur={handleBlur}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="circulating_supply" className="block text-sm font-medium text-gray-700">Circulating Supply</label>
                                                <input
                                                    type="text"
                                                    name="circulating_supply"
                                                    id="circulating_supply"
                                                    value={displayValues.circulating_supply}
                                                    onChange={handleFormChange}
                                                    onBlur={handleBlur}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="current_price" className="block text-sm font-medium text-gray-700">Current Price ($)</label>
                                                <input
                                                    type="text"
                                                    name="current_price"
                                                    id="current_price"
                                                    value={displayValues.current_price}
                                                    onChange={handleFormChange}
                                                    onBlur={handleBlur}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Updating...' : 'Update Token Info'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}