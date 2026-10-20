import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, frontpage, templates, handles, domains, initialThemeIds }) {
    const [type, setType] = useState(frontpage.type);
    const { data, setData, put, processing, errors } = useForm({
        page: frontpage.page,
        type: frontpage.type,
        theme_id: initialThemeIds,
        handle_id: frontpage.handle_id,
        domain_id: frontpage.domain_id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('frontpages.update', frontpage.id));
    };

    const toggleThemeSelection = (themeId) => {
        setData(prev => {
            if (prev.theme_id.includes(themeId)) {
                return {
                    ...prev,
                    theme_id: prev.theme_id.filter(id => id !== themeId)
                };
            } else {
                return {
                    ...prev,
                    theme_id: [...prev.theme_id, themeId]
                };
            }
        });
    };

    const moveThemeUp = (index) => {
        if (index <= 0) return;
        setData(prev => {
            const newThemes = [...prev.theme_id];
            [newThemes[index], newThemes[index - 1]] = [newThemes[index - 1], newThemes[index]];
            return {
                ...prev,
                theme_id: newThemes
            };
        });
    };

    const moveThemeDown = (index) => {
        setData(prev => {
            if (index >= prev.theme_id.length - 1) return prev;
            const newThemes = [...prev.theme_id];
            [newThemes[index], newThemes[index + 1]] = [newThemes[index + 1], newThemes[index]];
            return {
                ...prev,
                theme_id: newThemes
            };
        });
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setType(newType);
        setData('type', newType);
        if (newType === 'THEME') {
            setData('handle_id', null);
        } else {
            setData('theme_id', []);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Frontpage</h2>}
        >
            <Head title={`Edit Frontpage - ${frontpage.page}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Page */}
                                    <div>
                                        <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
                                            Page *
                                        </label>
                                        <input
                                            id="page"
                                            name="page"
                                            type="text"
                                            value={data.page}
                                            onChange={(e) => setData('page', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.page ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.page && <p className="mt-1 text-sm text-red-600">{errors.page}</p>}
                                    </div>

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

                                    {/* Type */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Type *
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={type}
                                            onChange={handleTypeChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="THEME">Theme</option>
                                            <option value="HANDLE">Handle</option>
                                            <option value="AISEARCH">Ai Search</option>
                                        </select>
                                    </div>

                                    {/* Theme or Handle selection based on type */}
                                    {type === 'THEME' && (
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <label htmlFor="theme_id" className="block text-sm font-medium text-gray-700">
                                                    Templates *
                                                </label>
                                            </div>

                                            <div className="mb-3 space-y-2">
                                                {data.theme_id.length > 0 ? (
                                                    data.theme_id.map((themeId, index) => {
                                                        const theme = templates.find(t => t.id.toString() === themeId);
                                                        if (!theme) return null;

                                                        return (
                                                            <div key={`${themeId}-${index}`} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveThemeUp(index)}
                                                                    disabled={index === 0}
                                                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveThemeDown(index)}
                                                                    disabled={index === data.theme_id.length - 1}
                                                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                                >
                                                                    ↓
                                                                </button>
                                                                <span className="flex-1 text-gray-800">
                                                                    {theme.unique_id} {theme.title}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleThemeSelection(themeId)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-gray-500 text-sm py-2 text-center bg-gray-100 rounded">
                                                        No templates selected
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <select
                                                    id="theme_id"
                                                    name="theme_id"
                                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                        errors.theme_id ? 'border-red-500' : ''
                                                    }`}
                                                    onChange={(e) => {
                                                        const themeId = e.target.value;
                                                        if (themeId && !data.theme_id.includes(themeId)) {
                                                            setData(prev => ({
                                                                ...prev,
                                                                theme_id: [...prev.theme_id, themeId]
                                                            }));
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                    value=""
                                                >
                                                    <option value="">Add a template...</option>
                                                    {templates && templates.length > 0 ? (
                                                        templates.map((template) => (
                                                            <option
                                                                key={template.id}
                                                                value={template.id}
                                                                disabled={data.theme_id.includes(template.id.toString())}
                                                            >
                                                                {template.title} (ID: {template.unique_id})
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="" disabled>No templates available</option>
                                                    )}
                                                </select>
                                                {errors.theme_id && <p className="mt-1 text-sm text-red-600">{errors.theme_id}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {type === 'HANDLE' && (
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
                                    )}
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('frontpages.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Frontpage'}
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