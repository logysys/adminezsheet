import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth, categories }) {
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        answer: '',
        keywords: [],
        category: '',
        is_active: true
    });

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
        post(route('faqs.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New FAQ</h2>}
        >
            <Head title="Create FAQ" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Question */}
                                    <div>
                                        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                                            Question *
                                        </label>
                                        <input
                                            id="question"
                                            name="question"
                                            type="text"
                                            value={data.question}
                                            onChange={(e) => setData('question', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.question ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                                    </div>

                                    {/* Answer */}
                                    <div>
                                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                                            Answer *
                                        </label>
                                        <textarea
                                            id="answer"
                                            name="answer"
                                            rows={6}
                                            value={data.answer}
                                            onChange={(e) => setData('answer', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.answer ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
                                    </div>

                                    {/* Keywords */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Keywords
                                        </label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newKeyword}
                                                onChange={(e) => setNewKeyword(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Enter a keyword"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddKeyword}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
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
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                id="category"
                                                name="category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="">Uncategorized</option>
                                                {categories.map((cat, index) => (
                                                    <option key={index} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={data.category && !categories.includes(data.category) ? data.category : ''}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Or enter new category"
                                            />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('faqs.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create FAQ'}
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