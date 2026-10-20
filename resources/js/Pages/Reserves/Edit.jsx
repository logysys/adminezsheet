import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit() {
    const { props } = usePage();
    const { reserve, auth } = props;

    // Debug what's received
    useEffect(() => {
        console.log('Page props:', props);
        console.log('Reserve data:', reserve);
    }, []);

    if (!reserve) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-red-500">
                                <h2 className="text-xl font-bold">Error: Reserve Not Found</h2>
                                <p className="mt-2">The reserve you're trying to edit doesn't exist or couldn't be loaded.</p>
                                <Link
                                    href={route('reserves.index')}
                                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Back to Reserves List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const { data, setData, put, processing, errors } = useForm({
        reserve: reserve.reserve || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('reserves.update', reserve.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Reserve: {data.reserve}
                    </h2>
                    <Link
                        href={route('reserves.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Back to Reserves
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${data.reserve}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="reserve" className="block text-sm font-medium text-gray-700">
                                            Reserve Brand *
                                        </label>
                                        <input
                                            type="text"
                                            id="reserve"
                                            name="reserve"
                                            value={data.reserve}
                                            onChange={(e) => setData('reserve', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.reserve ? 'border-red-500' : ''
                                            }`}
                                            required
                                            autoFocus
                                        />
                                        {errors.reserve && (
                                            <p className="mt-1 text-sm text-red-600">{errors.reserve}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <Link
                                        href={route('reserves.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Reserve'}
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