import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, availableGroups, availableTypes }) {
    const [showMetadata, setShowMetadata] = useState(false);
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        key: '',
        group: 'general',
        content: '',
        fallback: '',
        type: 'tooltip',
        metadata: {},
        is_active: true,
        sort_order: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isNewGroup && newGroupName) {
            setData('group', newGroupName);
        }
        post(route('hometooltips.store'));
    };

    const handleGroupChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsNewGroup(true);
            setData('group', '');
        } else {
            setIsNewGroup(false);
            setData('group', value);
        }
    };

    const addMetadataField = () => {
        setData('metadata', { ...data.metadata, '': '' });
    };

    const updateMetadata = (oldKey, newKey, value) => {
        const newMetadata = { ...data.metadata };
        if (oldKey !== newKey) {
            delete newMetadata[oldKey];
        }
        newMetadata[newKey] = value;
        setData('metadata', newMetadata);
    };

    const removeMetadataField = (key) => {
        const newMetadata = { ...data.metadata };
        delete newMetadata[key];
        setData('metadata', newMetadata);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Tooltip</h2>}
        >
            <Head title="Create Tooltip" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Key */}
                                    <div>
                                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                                            Key * <span className="text-xs text-gray-500">(unique identifier, e.g., ezbar_first_page)</span>
                                        </label>
                                        <input
                                            id="key"
                                            name="key"
                                            type="text"
                                            value={data.key}
                                            onChange={(e) => setData('key', e.target.value)}
                                            placeholder="ezbar_example_key"
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono ${
                                                errors.key ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
                                        <p className="mt-1 text-xs text-gray-500">Use lowercase letters, numbers, and underscores only</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Group */}
                                        <div>
                                            <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                                                Group *
                                            </label>
                                            <select
                                                id="group"
                                                name="group"
                                                value={isNewGroup ? 'new' : data.group}
                                                onChange={handleGroupChange}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            >
                                                {availableGroups.map(group => (
                                                    <option key={group} value={group}>{group}</option>
                                                ))}
                                                <option value="new">+ Add new group</option>
                                            </select>
                                            {isNewGroup && (
                                                <input
                                                    type="text"
                                                    placeholder="Enter new group name"
                                                    value={newGroupName}
                                                    onChange={(e) => setNewGroupName(e.target.value)}
                                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    required
                                                />
                                            )}
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                                Type *
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            >
                                                {availableTypes.map(type => (
                                                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                                ))}
                                            </select>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {data.type === 'tooltip' && 'Shown as hover tooltip'}
                                                {data.type === 'placeholder' && 'Shown as input placeholder'}
                                                {data.type === 'label' && 'Shown as static label text'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Sort Order */}
                                        <div>
                                            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
                                                Sort Order
                                            </label>
                                            <input
                                                id="sort_order"
                                                name="sort_order"
                                                type="number"
                                                min="0"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                id="is_active"
                                                name="is_active"
                                                value={data.is_active ? 'active' : 'inactive'}
                                                onChange={(e) => setData('is_active', e.target.value === 'active')}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                            Content * <span className="text-xs text-gray-500">(supports {'{variable}'} placeholders)</span>
                                        </label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            rows={4}
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            placeholder="Your tooltip text here... Use {variable} for dynamic content"
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.content ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                            <strong>Available variables:</strong> {'{number}'}, {'{title}'}, {'{url}'}, {'{type}'}, {'{score}'}, {'{date}'}, {'{time}'}, {'{count}'}
                                        </div>
                                    </div>

                                    {/* Fallback */}
                                    <div>
                                        <label htmlFor="fallback" className="block text-sm font-medium text-gray-700 mb-1">
                                            Fallback <span className="text-xs text-gray-500">(optional - used if content is not available)</span>
                                        </label>
                                        <input
                                            id="fallback"
                                            name="fallback"
                                            type="text"
                                            value={data.fallback}
                                            onChange={(e) => setData('fallback', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Default text if content is missing"
                                        />
                                    </div>

                                    {/* Metadata */}
                                    <div className="border-t pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowMetadata(!showMetadata)}
                                            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                                        >
                                            {showMetadata ? '▼ Hide' : '▶ Show'} Metadata (JSON)
                                        </button>
                                        
                                        {showMetadata && (
                                            <div className="mt-4 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Additional Metadata
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={addMetadataField}
                                                        className="text-xs text-blue-600 hover:text-blue-800"
                                                    >
                                                        + Add Field
                                                    </button>
                                                </div>
                                                
                                                {Object.entries(data.metadata).map(([key, value], index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <input
                                                            type="text"
                                                            placeholder="Key"
                                                            value={key}
                                                            onChange={(e) => updateMetadata(key, e.target.value, value)}
                                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={value}
                                                            onChange={(e) => updateMetadata(key, key, e.target.value)}
                                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMetadataField(key)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                
                                                {Object.keys(data.metadata).length === 0 && (
                                                    <p className="text-sm text-gray-500">No metadata fields added. Add fields to store additional data.</p>
                                                )}
                                                
                                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                                    <p className="text-xs text-gray-500">JSON Preview:</p>
                                                    <pre className="text-xs mt-1 overflow-x-auto">
                                                        {JSON.stringify(data.metadata, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 pt-4 border-t">
                                    <Link
                                        href={route('hometooltips.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Tooltip'}
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