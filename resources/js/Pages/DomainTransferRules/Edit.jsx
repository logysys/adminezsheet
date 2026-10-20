import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, rule }) {
    const [keywords, setKeywords] = useState(rule.keywords || []);
    const [newKeyword, setNewKeyword] = useState('');
    
    const { data, setData, put, processing, errors } = useForm({
        provider_name: rule.provider_name,
        keywords: rule.keywords || [],
        steps: rule.steps,
        support_url: rule.support_url || '',
    });

    useEffect(() => {
        setKeywords(rule.keywords || []);
    }, [rule.keywords]);

    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            const updatedKeywords = [...keywords, newKeyword.trim()];
            setKeywords(updatedKeywords);
            setData('keywords', updatedKeywords);
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (index) => {
        const updatedKeywords = keywords.filter((_, i) => i !== index);
        setKeywords(updatedKeywords);
        setData('keywords', updatedKeywords);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('domain-transfer-rules.update', rule.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Domain Transfer Rule</h2>}
        >
            <Head title={`Edit Domain Transfer Rule - ${rule.provider_name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Provider Name */}
                                    <div>
                                        <label htmlFor="provider_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Provider Name *
                                        </label>
                                        <input
                                            id="provider_name"
                                            name="provider_name"
                                            type="text"
                                            value={data.provider_name}
                                            onChange={(e) => setData('provider_name', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.provider_name ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.provider_name && <p className="mt-1 text-sm text-red-600">{errors.provider_name}</p>}
                                    </div>

                                    {/* Keywords */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Keywords *
                                            <span className="text-gray-500 text-xs ml-1">(Used for matching domain providers)</span>
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newKeyword}
                                                onChange={(e) => setNewKeyword(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="e.g., godaddy, gd, go daddy"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddKeyword}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {keywords.map((keyword, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                                    {keyword}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveKeyword(index)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.keywords && <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>}
                                    </div>

                                    {/* Steps */}
                                    <div>
                                        <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                                            Transfer Steps *
                                            <span className="text-gray-500 text-xs ml-1">(Step-by-step instructions)</span>
                                        </label>
                                        <textarea
                                            id="steps"
                                            name="steps"
                                            rows={8}
                                            value={data.steps}
                                            onChange={(e) => setData('steps', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.steps ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.steps && <p className="mt-1 text-sm text-red-600">{errors.steps}</p>}
                                    </div>

                                    {/* Support URL */}
                                    <div>
                                        <label htmlFor="support_url" className="block text-sm font-medium text-gray-700 mb-1">
                                            Support URL
                                            <span className="text-gray-500 text-xs ml-1">(Link to provider's transfer guide)</span>
                                        </label>
                                        <input
                                            id="support_url"
                                            name="support_url"
                                            type="url"
                                            value={data.support_url}
                                            onChange={(e) => setData('support_url', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.support_url ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.support_url && <p className="mt-1 text-sm text-red-600">{errors.support_url}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('domain-transfer-rules.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Rule'}
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