import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, powerstrings, flash }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        min_word: '',
        max_word: '',
        dollar_price: ''
    });

    const handleEditClick = (powerstring) => {
        setEditingId(powerstring.id);
        setEditForm({
            min_word: powerstring.min_word,
            max_word: powerstring.max_word,
            dollar_price: powerstring.dollar_price
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = (id) => {
        router.patch(`/powerstrings/${id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
            }
        });
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Price Strings</h2>
                </div>
            }
        >
            <Head title="Price Strings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Words</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Words</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Dollar Price</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom Dollar Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {powerstrings.data.map((powerstring) => (
                                            <tr key={`powerstring-${powerstring.id}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === powerstring.id ? (
                                                        <input
                                                            type="number"
                                                            name="min_word"
                                                            value={editForm.min_word}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-900">{powerstring.min_word}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === powerstring.id ? (
                                                        <input
                                                            type="number"
                                                            name="max_word"
                                                            value={editForm.max_word}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-900">{powerstring.max_word}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === powerstring.id ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            name="dollar_price"
                                                            value={editForm.dollar_price}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-900">US${Number(powerstring.dollar_price).toFixed(2)}</div>
                                                    )}
                                                </td>
												<td className="px-6 py-4 whitespace-nowrap">
                                                    {editingId === powerstring.id ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            name="custom_price"
                                                            value={editForm.custom_price}
                                                            onChange={handleInputChange}
                                                            className="w-full px-2 py-1 border rounded"
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-900">US${Number(powerstring.custom_price).toFixed(2)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingId === powerstring.id ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleUpdate(powerstring.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditClick(powerstring)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4">
                                <Pagination links={powerstrings.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}