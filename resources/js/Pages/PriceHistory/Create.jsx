import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        price_per_point: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('price-history.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Price</h2>}
        >
            <Head title="Add New Price" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="price_per_point" className="block text-sm font-medium text-gray-700">
                                            Price Per Point ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="price_per_point"
                                            name="price_per_point"
                                            value={data.price_per_point}
                                            onChange={(e) => setData('price_per_point', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.price_per_point ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.price_per_point && <p className="mt-1 text-sm text-red-600">{errors.price_per_point}</p>}
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
                                        href={route('price-history.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Add Price'}
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