import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        emoji: '',
        add_emoji: '',
        edit_emoji: '',
        handle: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('emojimarkers.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Emojimarker</h2>}
        >
            <Head title="Create Emojimarker" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700 mb-1">
                                            Emoji *
                                        </label>
                                        <input
                                            id="emoji"
                                            name="emoji"
                                            type="text"
                                            value={data.emoji}
                                            onChange={(e) => setData('emoji', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.emoji ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.emoji && <p className="mt-1 text-sm text-red-600">{errors.emoji}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="add_emoji" className="block text-sm font-medium text-gray-700 mb-1">
                                            Add Emoji *
                                        </label>
                                        <input
                                            id="add_emoji"
                                            name="add_emoji"
                                            type="text"
                                            value={data.add_emoji}
                                            onChange={(e) => setData('add_emoji', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.add_emoji ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.add_emoji && <p className="mt-1 text-sm text-red-600">{errors.add_emoji}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="edit_emoji" className="block text-sm font-medium text-gray-700 mb-1">
                                            Edit Emoji *
                                        </label>
                                        <input
                                            id="edit_emoji"
                                            name="edit_emoji"
                                            type="text"
                                            value={data.edit_emoji}
                                            onChange={(e) => setData('edit_emoji', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.edit_emoji ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.edit_emoji && <p className="mt-1 text-sm text-red-600">{errors.edit_emoji}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                                            Handle *
                                        </label>
                                        <input
                                            id="handle"
                                            name="handle"
                                            type="text"
                                            value={data.handle}
                                            onChange={(e) => setData('handle', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.handle ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.handle && <p className="mt-1 text-sm text-red-600">{errors.handle}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('emojimarkers.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Emojimarker'}
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