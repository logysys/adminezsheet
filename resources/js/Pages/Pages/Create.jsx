import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        pagename: '',
        code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pages.store'), {
            onSuccess: () => {
                setData({
                    pagename: '',
                    code: '',
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Page</h2>
                    <Link
                        href={route('pages.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Back to Pages
                    </Link>
                </div>
            }
        >
            <Head title="Create Page" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Page Name Field */}
                                    <div>
                                        <label htmlFor="pagename" className="block text-sm font-medium text-gray-700 mb-1">
                                            Page Name *
                                        </label>
                                        <TextInput
                                            id="pagename"
                                            name="pagename"
                                            type="text"
                                            value={data.pagename}
                                            onChange={(e) => setData('pagename', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.pagename ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        <InputError message={errors.pagename} className="mt-1" />
                                    </div>

                                    {/* Code Field (HTML Editor) */}
                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                            HTML Code
                                        </label>
                                        <textarea
                                            id="code"
                                            name="code"
                                            rows={20}
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm ${
                                                errors.code ? 'border-red-500' : ''
                                            }`}
                                            placeholder="<div>Your HTML content here...</div>"
                                        />
                                        <InputError message={errors.code} className="mt-1" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            You can use HTML, CSS, and JavaScript in this field.
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end mt-6">
                                        <Link
                                            href={route('pages.index')}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            {processing ? 'Creating...' : 'Create Page'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}