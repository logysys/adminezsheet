import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SettingsIndex({ auth, settings, flash }) {
    // Default settings
    const defaultSettings = {
        scraping: 'OFF',
        mode: 'NO',
        social: 'YES',
        widget: 'NO',
        slidget: 'NO',
        webring: 'NO',
        flysign: 'NO',
        hours: 24,
        minutes: 60,
        lockday: 7,
        handlelimit: 0,
        signupbonus: 0,
        up: '⬆️',
        down: '⬇️',
        color: '#000000',
        domaincolor: '#3eb80a',
        customcolor: null,
        default_coupon_code: '#1010',
        scrapingurl: [],
        scrapingtip_en: [],
        scrapingtip_cn: [],
        scrapingtip_hindi: [],
        set: null,
        flycustom: null,
        flydefault: null,
        sitemapupdate: null,
        sitemapcustom: null,
        sitemapdomain: null,
        mailuid: null,
        mailuidjunk: null,
        ...settings
    };

    const { data, setData, post, processing, errors } = useForm({
        scraping: defaultSettings.scraping,
        mode: defaultSettings.mode,
        social: defaultSettings.social,
        widget: defaultSettings.widget,
        slidget: defaultSettings.slipidgem,
        webring: defaultSettings.webring,
        flysign: defaultSettings.flysign,
        hours: defaultSettings.hours,
        minutes: defaultSettings.minutes,
        lockday: defaultSettings.lockday,
        handlelimit: defaultSettings.handlelimit,
        signupbonus: defaultSettings.signupbonus,
        up: defaultSettings.up,
        down: defaultSettings.down,
        color: defaultSettings.color,
        customcolor: defaultSettings.customcolor || '',
        domaincolor: defaultSettings.domaincolor,
        default_coupon_code: defaultSettings.default_coupon_code || '#1010',
        scrapingurl: defaultSettings.scrapingurl || [],
        scrapingtip_en: defaultSettings.scrapingtip_en || [],
        scrapingtip_cn: defaultSettings.scrapingtip_cn || [],
        scrapingtip_hindi: defaultSettings.scrapingtip_hindi || [],
        set: defaultSettings.set || '',
        flycustom: defaultSettings.flycustom || '',
        flydefault: defaultSettings.flydefault || '',
        sitemapupdate: defaultSettings.sitemapupdate || '',
        sitemapcustom: defaultSettings.sitemapcustom || '',
        sitemapdomain: defaultSettings.sitemapdomain || '',
        mailuid: defaultSettings.mailuid || '',
        mailuidjunk: defaultSettings.mailuidjunk || '',
    });

    // Tab state
    const [activeTab, setActiveTab] = useState('scraping');

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/settings/change');
    };

    // Helper for array field management
    const addArrayItem = (field, value = '') => {
        setData(field, [...data[field], value]);
    };

    const removeArrayItem = (field, index) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(field, newArray);
    };

    const updateArrayItem = (field, index, value) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    const tabs = [
        { id: 'scraping', label: 'Scraping Configuration', icon: '🔍' },
        { id: 'limits', label: 'Coupon Settings', icon: '📊' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    System Settings
                </h2>
            }
        >
            <Head title="System Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg shadow-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg shadow-sm">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 bg-gray-50">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Scraping Configuration Tab */}
                            {activeTab === 'scraping' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Scraping URLs
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {data.scrapingurl.map((url, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="url"
                                                        value={url}
                                                        onChange={(e) => updateArrayItem('scrapingurl', index, e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="https://example.com"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('scrapingurl', index)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('scrapingurl', '')}
                                                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                + Add URL
                                            </button>
                                            <p className="mt-2 text-xs text-gray-500">Add URLs to be scraped by the system</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                            Scraping Tips (English)
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {data.scrapingtip_en.map((tip, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="url"
                                                        value={tip}
                                                        onChange={(e) => updateArrayItem('scrapingtip_en', index, e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="https://example.com/tip"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('scrapingtip_en', index)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('scrapingtip_en', '')}
                                                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                + Add English Tip
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                            Scraping Tips (Chinese)
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {data.scrapingtip_cn.map((tip, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="url"
                                                        value={tip}
                                                        onChange={(e) => updateArrayItem('scrapingtip_cn', index, e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="https://example.com/tip"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('scrapingtip_cn', index)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('scrapingtip_cn', '')}
                                                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                + Add Chinese Tip
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                            Scraping Tips (Hindi)
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {data.scrapingtip_hindi.map((tip, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input
                                                        type="url"
                                                        value={tip}
                                                        onChange={(e) => updateArrayItem('scrapingtip_hindi', index, e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                        placeholder="https://example.com/tip"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('scrapingtip_hindi', index)}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('scrapingtip_hindi', '')}
                                                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                            >
                                                + Add Hindi Tip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Coupon Settings Tab */}
                            {activeTab === 'limits' && (
                                <div className="space-y-6">
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                            </svg>
                                            Coupon Settings
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Coupon Code</label>
                                                <input
                                                    type="text"
                                                    value={data.default_coupon_code || ''}
                                                    onChange={(e) => setData('default_coupon_code', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder="#1010"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Default coupon code for new users or promotions</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Current Settings Summary */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Current Settings Summary
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-600 font-medium">Scraping:</span>{' '}
                                        <span className={data.scraping === 'ON' ? 'text-green-600' : 'text-red-600'}>
                                            {data.scraping === 'ON' ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600 font-medium">Social:</span>{' '}
                                        <span className={data.social === 'YES' ? 'text-green-600' : 'text-red-600'}>
                                            {data.social === 'YES' ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600 font-medium">Schedule:</span>{' '}
                                        <span className="text-gray-600">{data.hours}h {data.minutes}m</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600 font-medium">Bonus:</span>{' '}
                                        <span className="text-gray-600">{data.signupbonus} pts</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600 font-medium">Default Coupon:</span>{' '}
                                        <span className="text-gray-600">{data.default_coupon_code || '#1010'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8 flex items-center justify-end border-t pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save All Settings'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}