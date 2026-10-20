import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AiSettings({ auth, settings, flash }) {
    // Ensure settings have default values if any property is undefined
    const defaultSettings = {
        guest_ai_enabled: true,
        guest_char_limit: 1000,
        user_ai_enabled: true,
        user_char_limit: 5000,
        ...settings // Spread the actual settings to override defaults
    };

    const { data, setData, post, processing, errors } = useForm({
        guest_ai_enabled: defaultSettings.guest_ai_enabled,
        guest_char_limit: defaultSettings.guest_char_limit,
        user_ai_enabled: defaultSettings.user_ai_enabled,
        user_char_limit: defaultSettings.user_char_limit,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ai-settings.update'));
    };

    // Helper function to safely format numbers
    const formatNumber = (value) => {
        if (value === undefined || value === null) return '0';
        return value.toLocaleString();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    AI Settings
                </h2>
            }
        >
            <Head title="AI Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                {/* Guest User Settings */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Guest User Settings</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                id="guest_ai_enabled"
                                                checked={data.guest_ai_enabled || false}
                                                onChange={(e) => setData('guest_ai_enabled', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="guest_ai_enabled" className="ml-2 block text-sm text-gray-900">
                                                Enable AI search for guest users
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label htmlFor="guest_char_limit" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Character Limit (per search) *
                                                </label>
                                                <input
                                                    id="guest_char_limit"
                                                    type="number"
                                                    min="100"
                                                    max="10000"
                                                    step="100"
                                                    value={data.guest_char_limit || 1000}
                                                    onChange={(e) => setData('guest_char_limit', parseInt(e.target.value) || 1000)}
                                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                        errors.guest_char_limit ? 'border-red-500' : ''
                                                    }`}
                                                    disabled={!data.guest_ai_enabled}
                                                    required
                                                />
                                                {errors.guest_char_limit && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.guest_char_limit}</p>
                                                )}
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Maximum number of characters allowed per AI search for guest users (100-10,000).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logged-in User Settings */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Logged-in User Settings</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                id="user_ai_enabled"
                                                checked={data.user_ai_enabled || false}
                                                onChange={(e) => setData('user_ai_enabled', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="user_ai_enabled" className="ml-2 block text-sm text-gray-900">
                                                Enable AI search for logged-in users
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label htmlFor="user_char_limit" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Character Limit (per search) *
                                                </label>
                                                <input
                                                    id="user_char_limit"
                                                    type="number"
                                                    min="100"
                                                    max="100000"
                                                    step="100"
                                                    value={data.user_char_limit || 5000}
                                                    onChange={(e) => setData('user_char_limit', parseInt(e.target.value) || 5000)}
                                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                        errors.user_char_limit ? 'border-red-500' : ''
                                                    }`}
                                                    disabled={!data.user_ai_enabled}
                                                    required
                                                />
                                                {errors.user_char_limit && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.user_char_limit}</p>
                                                )}
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Maximum number of characters allowed per AI search for logged-in users (100-100,000).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Section */}
                                <div className="mb-8 p-4 bg-blue-50 rounded-md">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Current Settings Summary</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-600">Guest AI:</span>{' '}
                                            <span className={data.guest_ai_enabled ? 'text-green-600' : 'text-red-600'}>
                                                {data.guest_ai_enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                            {data.guest_ai_enabled && (
                                                <span className="text-gray-600 ml-1">
                                                    (Char Limit: {formatNumber(data.guest_char_limit)})
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-blue-600">User AI:</span>{' '}
                                            <span className={data.user_ai_enabled ? 'text-green-600' : 'text-red-600'}>
                                                {data.user_ai_enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                            {data.user_ai_enabled && (
                                                <span className="text-gray-600 ml-1">
                                                    (Char Limit: {formatNumber(data.user_char_limit)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Settings'}
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