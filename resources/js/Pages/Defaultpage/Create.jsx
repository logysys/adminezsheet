import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, handles, domains }) {
    const { data, setData, post, processing, errors } = useForm({
        page: '',
        handle_id: null,
        domain_id: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('defaultpages.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New defaultpage</h2>}
        >
            <Head title="Create defaultpage" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    
                                    {/* Domain */}
                                    <div>
                                        <label htmlFor="domain_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Domain *
                                        </label>
                                        <select
                                            id="domain_id"
                                            name="domain_id"
                                            value={data.domain_id || ''}
                                            onChange={(e) => setData('domain_id', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.domain_id ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">Select a domain...</option>
                                            {domains.map((domain) => (
                                                <option key={domain.id} value={domain.id}>
                                                    {domain.domain}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.domain_id && <p className="mt-1 text-sm text-red-600">{errors.domain_id}</p>}
                                    </div>
                                    
                                    {/* Handle */}
                                    <div>
                                        <label htmlFor="handle_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Handle *
                                        </label>
                                        <select
                                            id="handle_id"
                                            name="handle_id"
                                            value={data.handle_id || ''}
                                            onChange={(e) => setData('handle_id', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.handle_id ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">Select a handle...</option>
                                            {handles.map((handle) => (
                                                <option key={handle.id} value={handle.id}>
                                                    {handle.token} (ID: {handle.id})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.handle_id && <p className="mt-1 text-sm text-red-600">{errors.handle_id}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('defaultpages.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create defaultpage'}
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