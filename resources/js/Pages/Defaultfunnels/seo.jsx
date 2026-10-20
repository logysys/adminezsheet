import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faSave
} from '@fortawesome/free-solid-svg-icons';

export default function SeoEdit({ auth, flash, funnel }) {
    // Get page props
    const { flash: pageFlash, funnel: pageFunnel } = usePage().props;
    
    // Safely handle potentially undefined props
    const flashMessages = flash || pageFlash || {};
    const funnelData = funnel || pageFunnel || {};
    
    // **FIX 1: Use 'seo_settings' (snake_case) and remove 'logoSettings'**
    const seo_settings = funnelData.seo_settings || {};
    
    const { data, setData, put, processing, errors, reset } = useForm({
        id: funnelData.id || '',
        // **FIX 2: Access all properties from 'seo_settings'**
        meta_title: seo_settings.meta_title || '',
        meta_keywords: seo_settings.meta_keywords || '',
        meta_description: seo_settings.meta_description || '',
        meta_site_name: seo_settings.meta_site_name || '',
        meta_site_url: seo_settings.meta_site_url || '',
        meta_logo: seo_settings.meta_logo || '', // Corrected this line
        canonical_url: seo_settings.meta_site_url || `https://ez.wiki/${funnelData.id || 'X0000250'}`
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [characterCounts, setCharacterCounts] = useState({
        meta_title: 0,
        meta_description: 0
    });

    // Function to reset form with new data
    const resetFormWithNewData = (funnelData) => {
        // **FIX 3: Update reset function to use 'seo_settings'**
        const seo_settings = funnelData.seo_settings || {};
        
        reset({
            id: funnelData.id || '',
            meta_title: seo_settings.meta_title || '',
            meta_keywords: seo_settings.meta_keywords || '',
            meta_description: seo_settings.meta_description || '',
            meta_site_name: seo_settings.meta_site_name || '',
            meta_site_url: seo_settings.meta_site_url || '',
            meta_logo: seo_settings.meta_logo || '', // Corrected this line
            canonical_url: funnelData.canonical_url || `https://ez.wiki/${funnelData.id || 'X0000250'}`
        });
    };

    useEffect(() => {
        if (flashMessages.success) {
            setSuccessMessage(flashMessages.success);
            setTimeout(() => setSuccessMessage(''), 3000);
            
            if (funnelData && funnelData.id) {
                resetFormWithNewData(funnelData);
            }
        }
    }, [flashMessages.success, funnelData]);

    useEffect(() => {
        setCharacterCounts({
            meta_title: data.meta_title.length,
            meta_description: data.meta_description.length
        });
    }, [data.meta_title, data.meta_description]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            id: data.id,
            meta_title: data.meta_title,
            meta_keywords: data.meta_keywords,
            meta_description: data.meta_description,
            meta_site_name: data.meta_site_name,
            meta_site_url: data.meta_site_url,
            meta_logo: data.meta_logo,
            canonical_url: data.canonical_url
        };
        
        router.put(route('funnel-seo.update'), submitData, {
            preserveScroll: true,
        });
    };

    // ... The rest of your component's return statement remains the same
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">SEO Editor</h2>}
        >
            <Head title="SEO Editor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {successMessage && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-xl text-gray-800 font-bold">Editing SEO for: {funnelData.id || 'X0000250'}</h1>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">
                                            Meta Title <span className="text-xs">(60 characters max)</span>
                                        </label>
                                        <div className="relative mt-1">
                                            <input 
                                                type="text" 
                                                id="meta_title"
                                                value={data.meta_title}
                                                onChange={(e) => setData('meta_title', e.target.value)}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Page title that appears in search results"
                                                maxLength={60}
                                            />
                                            <span className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">
                                                {characterCounts.meta_title}/60
                                            </span>
                                        </div>
                                        {errors.meta_title && <div className="text-red-500 text-sm mt-1">{errors.meta_title}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700">
                                            Meta Keywords <span className="text-xs">(Comma separated)</span>
                                        </label>
                                        <textarea 
                                            id="meta_keywords"
                                            rows="3"
                                            value={data.meta_keywords}
                                            onChange={(e) => setData('meta_keywords', e.target.value)}
                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="keywords, for, search, engines"
                                        ></textarea>
                                        {errors.meta_keywords && <div className="text-red-500 text-sm mt-1">{errors.meta_keywords}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                                            Meta Description <span className="text-xs">(160 characters max)</span>
                                        </label>
                                        <div className="relative mt-1">
                                            <textarea 
                                                id="meta_description"
                                                rows="3"
                                                value={data.meta_description}
                                                onChange={(e) => setData('meta_description', e.target.value)}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Brief description that appears in search results"
                                                maxLength={160}
                                            ></textarea>
                                            <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                                                {characterCounts.meta_description}/160
                                            </span>
                                        </div>
                                        {errors.meta_description && <div className="text-red-500 text-sm mt-1">{errors.meta_description}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="meta_logo" className="block text-sm font-medium text-gray-700">
                                            Meta Logo URL <span className="text-xs">(Recommended: 1200x630px)</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="meta_logo"
                                            value={data.meta_logo}
                                            onChange={(e) => setData('meta_logo', e.target.value)}
                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="https://example.com/logo.png"
                                        />
                                        {errors.meta_logo && <div className="text-red-500 text-sm mt-1">{errors.meta_logo}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="meta_site_name" className="block text-sm font-medium text-gray-700">
                                            Site/Brand Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="meta_site_name"
                                            value={data.meta_site_name}
                                            onChange={(e) => setData('meta_site_name', e.target.value)}
                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                            placeholder="Your brand or company name"
                                        />
                                        {errors.meta_site_name && <div className="text-red-500 text-sm mt-1">{errors.meta_site_name}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700">
                                            Canonical URL
                                        </label>
                                        <input 
                                            type="text" 
                                            id="canonical_url"
                                            value={data.canonical_url}
                                            onChange={(e) => setData('canonical_url', e.target.value)}
                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.canonical_url && <div className="text-red-500 text-sm mt-1">{errors.canonical_url}</div>}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-between items-center mt-8">
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition flex items-center disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Saving...' : 'Save SEO Settings'}
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