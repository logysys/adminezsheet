import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faSave,
    faEye,
    faMagic,
    faPlus,
    faInfoCircle,
    faArrowUp,
    faArrowDown,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

export default function EzUi({ auth, flash, funnel, templates }) {
    // Get page props
    const { flash: pageFlash, funnel: pageFunnel, templates: pageTemplates } = usePage().props;
    
    // Safely handle potentially undefined props
    const flashMessages = flash || pageFlash || {};
    const funnelData = funnel || pageFunnel || {};
    const templatesData = templates || pageTemplates || [];
    
    // Debug log to check what data we're receiving
    console.log('Funnel Data:', funnelData);
    console.log('Effect Settings:', funnelData.effect_settings || funnelData.effectSettings);
    
    // Parse theme data which might be a string or array
    const initialTheme = Array.isArray(funnelData.theme) 
        ? funnelData.theme 
        : (funnelData.theme ? funnelData.theme.split(',') : []);
    
    // Get effect settings - handle both snake_case and camelCase
    const effectSettingsData = funnelData.effect_settings || funnelData.effectSettings || [];
    
    // State for dynamic effect forms
    const [effectForms, setEffectForms] = useState(() => {
        if (effectSettingsData && Array.isArray(effectSettingsData) && effectSettingsData.length > 0) {
            return effectSettingsData.map((effect, index) => ({
                id: effect.id || index + 1,
                movingEffect: effect.moving_effect || effect.movingEffect || 'bee',
                movingPattern: effect.moving_pattern || effect.movingPattern || 'none',
                flySignMessage: effect.brand_message || effect.flySignMessage || '',
                avatarLink: effect.avatar_link || effect.avatarLink || '',
                landingPage: effect.landing_page || effect.landingPage || '',
            }));
        }
        
        // Fallback to default empty form
        return [
            {
                id: 1,
                movingEffect: 'bee',
                movingPattern: 'none',
                flySignMessage: '',
                avatarLink: '',
                landingPage: '',
            }
        ];
    });

    const { data, setData, put, processing, errors, reset } = useForm({
        id: funnelData.id || '',
        flySign: funnelData.fly_sign || false,
        eyeTracking: funnelData.eye_tracking || false,
        mode: funnelData.mode || 'L',
        freestyleMode: funnelData.freestyle_mode || '',
        theme: initialTheme,
        effectForms: effectForms
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');

    // Function to reset form with new data
    const resetFormWithNewData = (funnelData) => {
        const themeData = Array.isArray(funnelData.theme) 
            ? funnelData.theme 
            : (funnelData.theme ? funnelData.theme.split(',') : []);
        
        const effectSettings = funnelData.effect_settings || funnelData.effectSettings || [];
        let newEffectForms = effectForms;
        
        if (effectSettings.length > 0) {
            newEffectForms = effectSettings.map((effect, index) => ({
                id: effect.id || index + 1,
                movingEffect: effect.moving_effect || effect.movingEffect || 'bee',
                movingPattern: effect.moving_pattern || effect.movingPattern || 'none',
                flySignMessage: effect.brand_message || effect.flySignMessage || '',
                avatarLink: effect.avatar_link || effect.avatarLink || '',
                landingPage: effect.landing_page || effect.landingPage || '',
            }));
        }
        
        setEffectForms(newEffectForms);
        
        reset({
            id: funnelData.id || '',
            flySign: funnelData.fly_sign || false,
            eyeTracking: funnelData.eye_tracking || false,
            mode: funnelData.mode || 'L',
            freestyleMode: funnelData.freestyle_mode || '',
            theme: themeData,
            effectForms: newEffectForms
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

    // Handle initial load of effect settings
    useEffect(() => {
        const effectSettings = funnelData.effect_settings || funnelData.effectSettings || [];
        if (effectSettings.length > 0) {
            const initialEffectForms = effectSettings.map((effect, index) => ({
                id: effect.id || index + 1,
                movingEffect: effect.moving_effect || effect.movingEffect || 'bee',
                movingPattern: effect.moving_pattern || effect.movingPattern || 'none',
                flySignMessage: effect.brand_message || effect.flySignMessage || '',
                avatarLink: effect.avatar_link || effect.avatarLink || '',
                landingPage: effect.landing_page || effect.landingPage || '',
            }));
            
            setEffectForms(initialEffectForms);
            setData('effectForms', initialEffectForms);
        }
    }, [funnelData.effect_settings, funnelData.effectSettings]);

    // Theme management functions
    const addTheme = (themeId) => {
        if (!data.theme.includes(themeId)) {
            setData('theme', [...data.theme, themeId]);
        }
    };

    const removeTheme = (themeId) => {
        setData('theme', data.theme.filter(id => id !== themeId));
    };

    const moveThemeUp = (index) => {
        if (index > 0) {
            const newTheme = [...data.theme];
            [newTheme[index], newTheme[index - 1]] = [newTheme[index - 1], newTheme[index]];
            setData('theme', newTheme);
        }
    };

    const moveThemeDown = (index) => {
        if (index < data.theme.length - 1) {
            const newTheme = [...data.theme];
            [newTheme[index], newTheme[index + 1]] = [newTheme[index + 1], newTheme[index]];
            setData('theme', newTheme);
        }
    };

    // Effect form management functions
    const addEffectForm = () => {
        const newForm = {
            id: Date.now() + Math.random(),
            movingEffect: 'bee',
            movingPattern: 'none',
            flySignMessage: '',
            avatarLink: '',
            landingPage: '',
        };
        const updatedForms = [...effectForms, newForm];
        setEffectForms(updatedForms);
        setData('effectForms', updatedForms);
    };

    const removeEffectForm = (id) => {
        if (effectForms.length > 1) {
            const updatedForms = effectForms.filter(form => form.id !== id);
            setEffectForms(updatedForms);
            setData('effectForms', updatedForms);
        }
    };

    const updateEffectForm = (id, field, value) => {
        const updatedForms = effectForms.map(form => {
            if (form.id === id) {
                return { ...form, [field]: value };
            }
            return form;
        });
        setEffectForms(updatedForms);
        setData('effectForms', updatedForms);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            id: data.id,
            flySign: data.flySign,
            eyeTracking: data.eyeTracking,
            mode: data.mode,
            freestyleMode: data.freestyleMode,
            theme: Array.isArray(data.theme) ? data.theme.join(',') : data.theme,
            effectForms: data.effectForms
        };
        
        console.log('Submitting data:', submitData);
        
        router.put(route('funnel-ui.update'), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                // Success is handled by the useEffect with flash messages
            },
        });
    };

    const handleCheckboxChange = (field, value) => {
        setData(field, value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">EZ-UI Editor</h2>}
        >
            <Head title="EZ-UI Editor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {successMessage && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300">
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-xl text-gray-800 font-bold">Editing: {funnelData.id || 'X0000250'}</h1>
                                </div>

                                {/* Effect Settings Section */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Effect Settings</h2>
                                    
                                    {effectForms.length > 0 ? (
                                        effectForms.map((form, index) => (
                                            <div key={form.id || index} className="border border-gray-200 rounded-lg p-4 relative">
                                                {effectForms.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEffectForm(form.id)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Moving Effect</label>
                                                        <select 
                                                            value={form.movingEffect}
                                                            onChange={(e) => updateEffectForm(form.id, 'movingEffect', e.target.value)}
                                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="none">External link</option>
                                                            <option value="bee">Flying Bee</option>
                                                            <option value="saucer">Flying Saucer</option>
                                                            <option value="bird">Flying Bird</option>
                                                            <option value="plane">Flying Plane</option>
                                                            <option value="superhero">Flying Superhero</option>
                                                            <option value="qr">Flying Qrcode</option>
                                                            <option value="real">Flying Real Estate</option>
                                                            <option value="coffee">Flying Coffee</option>
                                                            <option value="time">Flying Time</option>
                                                            <option value="fire">Flying Camp Fire</option>
                                                            <option value="burger">Flying Burger</option>
                                                            <option value="ball">Flying Ball</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Moving Pattern</label>
                                                        <select 
                                                            value={form.movingPattern}
                                                            onChange={(e) => updateEffectForm(form.id, 'movingPattern', e.target.value)}
                                                            className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="none">Hovering</option>
                                                            <option value="top">Top to Bottom</option>
                                                            <option value="bottom">Bottom to Top</option>
                                                            <option value="left">Left to Right</option>
                                                            <option value="right">Right to Left</option>
                                                            <option value="topright">TopLeft to Rightbottom</option>
                                                            <option value="bottomleft">Rightbottom to Topleft</option>
                                                            <option value="lefttop">Leftbottom to Righttop</option>
                                                            <option value="leftbottom">Righttop to Leftbottom</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700">Fly Sign Message</label>
                                                    <input 
                                                        type="text" 
                                                        value={form.flySignMessage}
                                                        onChange={(e) => updateEffectForm(form.id, 'flySignMessage', e.target.value)}
                                                        className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                        placeholder="Enter your brand message"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Avatar Link 
                                                        <FontAwesomeIcon 
                                                            icon={faInfoCircle} 
                                                            className="ml-2 text-gray-500 cursor-help" 
                                                            title="URL for the avatar image"
                                                        />
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        value={form.avatarLink}
                                                        onChange={(e) => updateEffectForm(form.id, 'avatarLink', e.target.value)}
                                                        className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                        placeholder="Enter avatar image URL"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700">Landing Page</label>
                                                    <input 
                                                        type="text" 
                                                        value={form.landingPage}
                                                        onChange={(e) => updateEffectForm(form.id, 'landingPage', e.target.value)}
                                                        className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                        placeholder="Enter landing page URL"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                                            No effect settings found. Click "Add more effect" to create one.
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="button"
                                        onClick={addEffectForm}
                                        className="w-full py-3 bg-yellow-400 text-gray-800 font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-500 transition"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        <span>Add more effect</span>
                                    </button>
                                </div>
                                
                                {/* Toggle Settings Section */}
                                <div className="space-y-6 mt-8">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fly-Sign 
                                            <FontAwesomeIcon 
                                                icon={faInfoCircle} 
                                                className="ml-2 text-gray-500 cursor-help" 
                                                title="Enable or disable the fly-sign effect"
                                            />
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={data.flySign}
                                                onChange={(e) => handleCheckboxChange('flySign', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Eye Tracking 
                                            <FontAwesomeIcon 
                                                icon={faInfoCircle} 
                                                className="ml-2 text-gray-500 cursor-help" 
                                                title="Enable or disable eye tracking features"
                                            />
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={data.eyeTracking}
                                                onChange={(e) => handleCheckboxChange('eyeTracking', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                
                                    <div className="text-center">
                                        <button 
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* EZTheme Setting Section */}
                                <div className="mt-10 pt-6 border-t border-gray-300">
                                    <h2 className="text-lg font-semibold text-gray-800">EZTheme Setting</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Select Mode</label>
                                            <select 
                                                value={data.mode}
                                                onChange={(e) => setData('mode', e.target.value)}
                                                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Mode</option>
                                                <option value="L">L</option>
                                                <option value="L,R">L,R</option>
                                                <option value="L,L,C,R">L,L,C,R</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center mt-4 gap-4">
                                        <div className="flex-grow w-full md:w-auto">
                                            <label className="block text-sm font-medium text-gray-700">Freestyle Mode</label>
                                            <input 
                                                type="text" 
                                                value={data.freestyleMode}
                                                onChange={(e) => setData('freestyleMode', e.target.value)}
                                                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                placeholder="Enter freestyle mode (e.g., L_R)"
                                            />
                                        </div>
                                        <span className="text-gray-800 font-bold py-2">OR</span>
                                        <div className="flex-grow w-full md:w-auto">
                                            <label className="block text-sm font-medium text-gray-700">Add a theme</label>
                                            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
                                                {data.theme.length > 0 ? (
                                                    data.theme.map((themeId, index) => {
                                                        const theme = templatesData.find(t => t.id.toString() === themeId.toString());
                                                        if (!theme) return null;

                                                        return (
                                                            <div key={`${themeId}-${index}`} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveThemeUp(index)}
                                                                    disabled={index === 0}
                                                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                                >
                                                                    <FontAwesomeIcon icon={faArrowUp} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveThemeDown(index)}
                                                                    disabled={index === data.theme.length - 1}
                                                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                                                >
                                                                    <FontAwesomeIcon icon={faArrowDown} />
                                                                </button>
                                                                <span className="flex-1 text-gray-800 text-sm">
                                                                    {theme.unique_id} {theme.title}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTheme(themeId)}
                                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                                >
                                                                    <FontAwesomeIcon icon={faTimes} />
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
                                            
                                            <div className="flex gap-2">
                                                <select 
                                                    value={selectedTheme}
                                                    onChange={(e) => {
                                                        const themeId = e.target.value;
                                                        if (themeId) {
                                                            addTheme(themeId);
                                                            setSelectedTheme('');
                                                        }
                                                    }}
                                                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                                >
                                                    <option value="">Add a theme...</option>
                                                    {templatesData.map(template => (
                                                        <option key={template.id} value={template.id}>
                                                            {template.unique_id} {template.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-between items-center mt-10 gap-4">
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save All Settings'}
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