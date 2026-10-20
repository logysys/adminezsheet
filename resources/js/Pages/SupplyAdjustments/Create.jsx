import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, tokenInfo }) {
    const { data, setData, post, processing, errors } = useForm({
        new_supply: '',
        adjustment_type: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('supply-adjustments.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Supply Adjustment</h2>}
        >
            <Head title="Create Supply Adjustment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Current Circulating Supply: {tokenInfo.circulating_supply}</h3>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="new_supply" className="block text-sm font-medium text-gray-700">
                                            New Supply *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            id="new_supply"
                                            name="new_supply"
                                            value={data.new_supply}
                                            onChange={(e) => setData('new_supply', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.new_supply ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.new_supply && <p className="mt-1 text-sm text-red-600">{errors.new_supply}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="adjustment_type" className="block text-sm font-medium text-gray-700">
                                            Adjustment Type *
                                        </label>
                                        <select
                                            id="adjustment_type"
                                            name="adjustment_type"
                                            value={data.adjustment_type}
                                            onChange={(e) => setData('adjustment_type', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.adjustment_type ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="mint">Mint (Increase Supply)</option>
                                            <option value="burn">Burn (Decrease Supply)</option>
                                            <option value="adjustment">General Adjustment</option>
                                        </select>
                                        {errors.adjustment_type && <p className="mt-1 text-sm text-red-600">{errors.adjustment_type}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows="3"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('supply-adjustments.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Processing...' : 'Adjust Supply'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}