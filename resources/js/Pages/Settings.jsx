import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Settings({ auth, setting }) {
    // Initialize form data with default values from the database
    const [formData, setFormData] = useState({
        // Toggle settings
        scraping: setting?.scraping === 'ON',
        mode: setting?.mode === 'YES',
        social: setting?.social === 'YES',
        widget: setting?.widget === 'YES',
        slidget: setting?.slidget === 'YES',
        flysign: setting?.flysign === 'YES',
        
        // Commission setting
        commission: setting?.commission || '10',
        
        // Array settings (URLs only)
        url: setting?.scrapingurl ? JSON.parse(setting.scrapingurl) : ['']
    });

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Auto-save on change
        saveSettings();
    };

    // Handle URL array changes
    const handleUrlChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
        
        // Auto-save on change
        saveSettings();
    };

    // Add new URL field
    const addUrlField = () => {
        setFormData(prev => ({
            ...prev,
            url: [...prev.url, '']
        }));
        
        // Auto-save on change
        saveSettings();
    };

    // Remove URL field
    const removeUrlField = (index) => {
        if (formData.url.length <= 1) return;
        
        setFormData(prev => ({
            ...prev,
            url: prev.url.filter((_, i) => i !== index)
        }));
        
        // Auto-save on change
        saveSettings();
    };

    // Save settings
    const saveSettings = () => {
        router.post(route('setting.change'), {
            // Convert boolean values to ENUM strings for database
            scrap: formData.scraping ? 'ON' : 'OFF',
            maintenance: formData.mode ? 'YES' : 'NO',
            social: formData.social ? 'YES' : 'NO',
            widget: formData.widget ? 'YES' : 'NO',
            slidget: formData.slidget ? 'YES' : 'NO',
            flysign: formData.flysign ? 'YES' : 'NO',
            
            // Commission value
            commission: formData.commission,
            
            // Array values (will be JSON encoded)
            url: formData.url
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Setting Insta Funnel
                </h2>
            }
        >
            <Head title="Setting Insta Funnel" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.session?.message && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{auth.session.message}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Toggle Settings */}
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: 'scraping', label: 'Scraping' },
                                        { id: 'mode', label: 'Maintenance' },
                                        { id: 'slidget', label: 'All Slidget on/off' },
                                        { id: 'social', label: 'All Social Posts on/off' },
                                        { id: 'widget', label: 'All Widget Posts on/off' },
                                        { id: 'flysign', label: 'All Fly-Sign on/off' }
                                    ].map((item) => (
                                        <div key={item.id} className="form-group flex items-center">
                                            <Checkbox
                                                id={item.id}
                                                checked={formData[item.id]}
                                                onChange={(e) => handleInputChange(item.id, e.target.checked)}
                                                className="mr-2"
                                            />
                                            <InputLabel 
                                                htmlFor={item.id} 
                                                value={item.label}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Commission field */}
                            <div className="space-y-6">
                                <div className="form-group">
                                    <InputLabel 
                                        htmlFor="commission" 
                                        value="Commission Percentage (%)"
                                    />
                                    <TextInput
                                        id="commission"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.commission}
                                        onChange={(e) => handleInputChange('commission', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Enter commission percentage"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL Settings - Full Width */}
                        <div className="mt-8 pt-8 border-t">
                            <div className="form-group">
                                <InputLabel 
                                    value="Scraping URLs"
                                />
                                
                                {formData.url.map((url, index) => (
                                    <div key={index} className="mb-6 p-4 border rounded-md bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium">URL Entry #{index + 1}</h4>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeUrlField(index)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <InputLabel htmlFor={`url-${index}`} value="URL" />
                                                <TextInput
                                                    id={`url-${index}`}
                                                    value={url}
                                                    onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                                                    placeholder="https://example.com"
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <button
                                    type="button"
                                    onClick={addUrlField}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    + Add URL Entry
                                </button>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className="mt-8 p-4 bg-green-100 text-green-700 rounded-md hidden" id="status-message">
                            Settings saved successfully!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}