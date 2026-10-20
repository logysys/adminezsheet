import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, balance }) {
    const { data, setData, put, processing, errors } = useForm({
        bee_balance: balance.bee_balance,
        bee_points_balance: balance.bee_points_balance,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.user-balances.update', balance.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User Balance</h2>}
        >
            <Head title={`Edit Balance - ${balance.user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">User: {balance.user.name}</h3>
                                <p className="text-sm text-gray-500">{balance.user.email}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="bee_balance" className="block text-sm font-medium text-gray-700">
                                            Bee Balance
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            id="bee_balance"
                                            value={data.bee_balance}
                                            onChange={(e) => setData('bee_balance', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.bee_balance ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.bee_balance && <p className="mt-1 text-sm text-red-600">{errors.bee_balance}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="bee_points_balance" className="block text-sm font-medium text-gray-700">
                                            Bee Points Balance
                                        </label>
                                        <input
                                            type="number"
                                            step="0.00000001"
                                            id="bee_points_balance"
                                            value={data.bee_points_balance}
                                            onChange={(e) => setData('bee_points_balance', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.bee_points_balance ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.bee_points_balance && <p className="mt-1 text-sm text-red-600">{errors.bee_points_balance}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('admin.user-balances.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Balance'}
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