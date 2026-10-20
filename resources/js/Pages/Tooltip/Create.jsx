import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        reference: '',
        tooltips: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tooltips.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Tooltip</h2>}
        >
            <Head title="Create Tooltip" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    
                                    {/* Reference */}
                                    <div>
                                        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                                            Reference *
                                        </label>
                                        <input
                                            type="text"
                                            id="reference"
                                            name="reference"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.reference ? 'border-red-500' : ''
                                            }`}
                                            required
                                            placeholder="Enter a unique reference name (e.g., main-tooltip, auth-tooltip)"
                                        />
                                        <div className="mt-1 text-sm text-gray-500">
                                            Examples: main-tooltip, auth-tooltip, modal-tooltip, nav-tooltip
                                        </div>
                                        {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                                    </div>
                                    
                                    {/* Tooltip Content */}
                                    <div>
                                        <label htmlFor="tooltips" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tooltip Content * (one tooltip per line)
                                        </label>
                                        <textarea
                                            id="tooltips"
                                            name="tooltips"
                                            rows={12}
                                            value={data.tooltips}
                                            onChange={(e) => setData('tooltips', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono ${
                                                errors.tooltips ? 'border-red-500' : ''
                                            }`}
                                            required
                                            placeholder="Enter each tooltip on a new line. Example:&#10;Click to open menu&#10;Close this dialog&#10;Save your changes&#10;Delete this item"
                                        />
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>• Enter each tooltip text on a separate line</p>
                                            <p>• They will be stored as a JSON array</p>
                                            <p>• Use clear, descriptive text for each tooltip</p>
                                            <p>• Empty lines will be ignored</p>
                                        </div>
                                        {errors.tooltips && <p className="mt-1 text-sm text-red-600">{errors.tooltips}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('tooltips.index')}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-4 transition duration-150 ease-in-out"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-150 ease-in-out"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Tooltip'}
                                    </button>
                                </div>
                            </form>

                            {/* Example Section */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-900 mb-3">Example Format</h3>
                                <div className="bg-white p-4 rounded border">
                                    <p className="font-medium mb-2">Reference:</p>
                                    <code className="block mb-4 text-sm bg-gray-100 p-2 rounded">example-tooltip</code>
                                    
                                    <p className="font-medium mb-2">Tooltip Content:</p>
                                    <pre className="text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap">
{`Click to open menu
Close this dialog
Save your changes
Delete this item
View more options
Share this content`}
                                    </pre>
                                    <p className="mt-2 text-sm text-gray-600">
                                        This will create a tooltip group with 6 individual tooltips that can be referenced by "example-tooltip"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}