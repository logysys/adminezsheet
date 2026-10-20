import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        language: '',
        word: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('search-keywords.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Search Keyword</h2>}
        >
            <Head title="Create Search Keyword" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                            Language *
                                        </label>
                                        <input
                                            type="text"
                                            id="language"
                                            name="language"
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                            placeholder="e.g. en, fr, es"
                                            maxLength={10}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.language ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="word" className="block text-sm font-medium text-gray-700">
                                            Word *
                                        </label>
                                        <input
                                            type="text"
                                            id="word"
                                            name="word"
                                            value={data.word}
                                            onChange={(e) => setData('word', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.word ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.word && <p className="mt-1 text-sm text-red-600">{errors.word}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('search-keywords.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Search Keyword'}
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