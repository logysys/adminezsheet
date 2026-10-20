import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Editor } from '@tinymce/tinymce-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTimes,
    faPlusCircle,
    faTrashAlt,
    faArrowUp,
    faArrowDown,
    faInfoCircle,
    faSave,
    faSearch,
    faGlobe,
    faLink,
    faMapPin,
    faPlus,
    faMinus
} from '@fortawesome/free-solid-svg-icons';

export default function EzFunnelForm({ auth, flash, funnel, templates }) {
    // Get page props
    const { flash: pageFlash, funnel: pageFunnel, templates: pageTemplates } = usePage().props;
    
    // Safely handle potentially undefined props
    const flashMessages = flash || pageFlash || {};
    const funnelData = funnel || pageFunnel || {};
    const templatesData = templates || pageTemplates || [];
    
    // Safely access nested properties with fallbacks
    const seoSettings = funnelData.seoSettings || {};
    const logoSettings = funnelData.logoSettings || {};
    const fieldsData = funnelData.fields || [];
    
    // Parse theme properly
    const parseTheme = (theme) => {
        if (!theme) return [];
        if (Array.isArray(theme)) return theme;
        
        try {
            // Handle comma-separated values (like "92,4,21")
            if (typeof theme === 'string' && theme.includes(',')) {
                return theme.split(',').filter(id => id.trim() !== '');
            } else if (theme.trim() !== '') {
                return [theme.trim()];
            }
            return [];
        } catch (e) {
            console.error('Error parsing theme:', e);
            return [];
        }
    };
    
    const { data, setData, post, processing, errors, reset } = useForm({
        id: funnelData.id || 40,
        flySign: funnelData.fly_sign || false,
        eyeTracking: funnelData.eye_tracking || false,
        seoTag: funnelData.seo_tag || '',
        theme: parseTheme(funnelData.theme),
        color: funnelData.color || '#4ade80',
        transparency: funnelData.transparency || 80,
        mode: funnelData.mode || 'L',
        dynamicFields: fieldsData.map(field => ({
            emojiMarker: field.emoji_marker || '1️⃣',
            fontSize: field.font_size || '12px',
            caption: field.caption || '',
            url: field.url || '',
            pinned: field.pinned || false,
            reference: field.reference || '',
            customWidth: field.custom_width || 33
        })),
        meta_title: seoSettings.meta_title || '',
        meta_keywords: seoSettings.meta_keywords || '',
        meta_description: seoSettings.meta_description || '',
        meta_site_name: seoSettings.meta_site_name || '',
        meta_site_url: seoSettings.meta_site_url || '',
        logoimage: logoSettings.logoimage || '',
        fly_sign_logo: logoSettings.fly_sign_logo || '',
        favicon_logo: logoSettings.favicon_logo || '',
        meta_logo: logoSettings.meta_logo || '',
        secondary_logo: logoSettings.secondary_logo || '',
    });

    const [showReference, setShowReference] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const editorRefs = useRef({});
    
    // Add these new states for the editor modal
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentEditorContent, setCurrentEditorContent] = useState('');
    const [currentFieldIndex, setCurrentFieldIndex] = useState(null);

    // Function to reset form with new data
    const resetFormWithNewData = (funnelData) => {
        const seoSettings = funnelData.seoSettings || {};
        const logoSettings = funnelData.logoSettings || {};
        const fieldsData = funnelData.fields || [];
        
        reset({
            id: funnelData.id || 40,
            flySign: funnelData.fly_sign || false,
            eyeTracking: funnelData.eye_tracking || false,
            seoTag: funnelData.seo_tag || '',
            theme: parseTheme(funnelData.theme),
            color: funnelData.color || '#4ade80',
            transparency: funnelData.transparency || 80,
            mode: funnelData.mode || 'L',
            dynamicFields: fieldsData.map(field => ({
                emojiMarker: field.emoji_marker || '1️⃣',
                fontSize: field.font_size || '12px',
                caption: field.caption || '',
                url: field.url || '',
                pinned: field.pinned || false,
                reference: field.reference || '',
                customWidth: field.custom_width || 33
            })),
            meta_title: seoSettings.meta_title || '',
            meta_keywords: seoSettings.meta_keywords || '',
            meta_description: seoSettings.meta_description || '',
            meta_site_name: seoSettings.meta_site_name || '',
            meta_site_url: seoSettings.meta_site_url || '',
            logoimage: logoSettings.logoimage || '',
            fly_sign_logo: logoSettings.fly_sign_logo || '',
            favicon_logo: logoSettings.favicon_logo || '',
            meta_logo: logoSettings.meta_logo || '',
            secondary_logo: logoSettings.secondary_logo || '',
        });
    };

    useEffect(() => {
        if (flashMessages.success) {
            setSuccessMessage(flashMessages.success);
            setTimeout(() => setSuccessMessage(''), 3000);
            
            // If we have updated funnel data in props, reset the form
            if (funnelData && funnelData.id) {
                resetFormWithNewData(funnelData);
            }
        }
    }, [flashMessages.success, funnelData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Transform data to match backend expectations
        const submitData = {
            id: data.id,
            flySign: data.flySign,
            eyeTracking: data.eyeTracking,
            seoTag: data.seoTag,
            theme: Array.isArray(data.theme) ? data.theme.join(',') : data.theme,
            color: data.color,
            transparency: data.transparency,
            mode: data.mode,
            dynamicFields: data.dynamicFields
        };
        
        router.put(route('funnel-default.update'), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                // Success is handled by the useEffect with flash messages
            },
        });
    };

    const handleAddField = (position) => {
        const newField = {
            emojiMarker: '1️⃣',
            fontSize: '12px',
            caption: '',
            url: '',
            pinned: false,
            reference: '',
            customWidth: 33,
        };

        const updatedFields = [...data.dynamicFields];
        if (position === 'top') {
            updatedFields.unshift(newField);
        } else {
            updatedFields.push(newField);
        }

        setData('dynamicFields', updatedFields);
    };

    const handleRemoveField = (index) => {
        const updatedFields = [...data.dynamicFields];
        updatedFields.splice(index, 1);
        setData('dynamicFields', updatedFields);
    };

    const handleMoveField = (index, direction) => {
        const updatedFields = [...data.dynamicFields];
        if (direction === 'up' && index > 0) {
            [updatedFields[index], updatedFields[index - 1]] = [updatedFields[index - 1], updatedFields[index]];
        } else if (direction === 'down' && index < updatedFields.length - 1) {
            [updatedFields[index], updatedFields[index + 1]] = [updatedFields[index + 1], updatedFields[index]];
        }
        setData('dynamicFields', updatedFields);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedFields = [...data.dynamicFields];
        updatedFields[index][field] = value;
        setData('dynamicFields', updatedFields);
    };

    const handleReferenceChange = (index, content) => {
        const updatedFields = [...data.dynamicFields];
        updatedFields[index].reference = content;
        setData('dynamicFields', updatedFields);
    };

    const toggleReference = (index) => {
        setShowReference(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Theme management functions
    const addTheme = (themeId) => {
        if (themeId && !data.theme.includes(themeId)) {
            setData('theme', [...data.theme, themeId]);
        }
    };

    const removeTheme = (themeId) => {
        setData('theme', data.theme.filter(id => id !== themeId));
    };

    const moveThemeUp = (index) => {
        if (index > 0) {
            const updatedThemes = [...data.theme];
            [updatedThemes[index], updatedThemes[index - 1]] = [updatedThemes[index - 1], updatedThemes[index]];
            setData('theme', updatedThemes);
        }
    };

    const moveThemeDown = (index) => {
        if (index < data.theme.length - 1) {
            const updatedThemes = [...data.theme];
            [updatedThemes[index], updatedThemes[index + 1]] = [updatedThemes[index + 1], updatedThemes[index]];
            setData('theme', updatedThemes);
        }
    };

    // Add this function to handle opening the editor
    const handleOpenEditor = (index, content) => {
        setCurrentFieldIndex(index);
        setCurrentEditorContent(content);
        setIsEditorOpen(true);
    };

    // Add this function to handle saving editor content
    const handleSaveEditorContent = () => {
        if (currentFieldIndex !== null) {
            handleFieldChange(currentFieldIndex, 'caption', currentEditorContent);
        }
        setIsEditorOpen(false);
        setCurrentFieldIndex(null);
        setCurrentEditorContent('');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ez Funnel Editor</h2>}
        >
            <Head title="Ez Funnel Editor">
                <script src="/js/tinymce/tinymce.min.js" />
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {successMessage && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} id="formContainer" className="space-y-6">
                                {/* Header Buttons */}
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Funnel'}
                                    </button>
                                    <div className="bg-gray-100 w-48 h-10 rounded-md flex items-center justify-center">
                                        <span className="text-gray-800 font-medium">Funnel #{funnelData?.id || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Main Settings Card */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center flex-wrap gap-4">
                                        <div className="flex items-center space-x-3">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    checked={data.flySign}
                                                    onChange={(e) => setData('flySign', e.target.checked)}
                                                />
                                                <span className="text-gray-700 font-medium">Fly-Sign</span>
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    checked={data.eyeTracking}
                                                    onChange={(e) => setData('eyeTracking', e.target.checked)}
                                                />
                                                <span className="text-2xl">👀</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Frame Color</label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm cursor-pointer" style={{backgroundColor: data.color}}>
                                                        <input 
                                                            type="color" 
                                                            value={data.color}
                                                            onChange={(e) => setData('color', e.target.value)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        value={data.color}
                                                        onChange={(e) => setData('color', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Frame Transparency</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max="100" 
                                                        value={data.transparency}
                                                        onChange={(e) => setData('transparency', parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                                <div className="w-14 text-center text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1.5 rounded-md border border-gray-300">
                                                    {data.transparency}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Seo Tag</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <span className="text-gray-500 font-medium">#</span>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={data.seoTag}
                                                    onChange={(e) => setData('seoTag', e.target.value)}
                                                    placeholder="Enter SEO tag, e.g. Marketing" 
                                                    className="block w-full rounded-md border-gray-300 pl-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                                    Templates *
                                                </label>
                                            </div>

                                            <div className="mb-3 space-y-2">
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
                                                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

                                {/* Add to Top Button */}
                                <button 
                                    type="button"
                                    onClick={() => handleAddField('top')}
                                    className="w-full bg-gray-100 text-gray-700 rounded-md px-4 py-2 flex items-center gap-2 justify-center font-medium hover:bg-gray-200 transition-all duration-200 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
                                    <span>Add to the Top</span>
                                </button>

                                {/* Form Item Cards */}
                                {data.dynamicFields.map((field, index) => (
                                    <div key={index} className="border border-gray-300 rounded-md p-4 space-y-4 bg-white">
                                        {/* Delete button */}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField(index)}
                                                className="text-red-500 hover:text-red-700 text-xl"
                                                aria-label="Delete field"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-700 font-medium">Emoji Markers</span>
                                                    <FontAwesomeIcon 
                                                        icon={faInfoCircle} 
                                                        className="text-gray-500 hover:text-gray-700 cursor-help" 
                                                        title="Emoji markers determine frame width: 1️⃣=Custom, 2️⃣=42%, 3️⃣=50%, 4️⃣=66%, 5️⃣=100%" 
                                                    />
                                                </div>
                                                <select 
                                                    value={field.emojiMarker}
                                                    onChange={(e) => handleFieldChange(index, 'emojiMarker', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="1️⃣">1️⃣ = Frame width Custom</option>
                                                    <option value="2️⃣">2️⃣ = Frame width 42%</option>
                                                    <option value="3️⃣">3️⃣ = Frame width 50%</option>
                                                    <option value="4️⃣">4️⃣ = Frame width 66%</option>
                                                    <option value="5️⃣">5️⃣ = Frame width 100%</option>
                                                    <option value="0️⃣">0️⃣ = Frame kept but hidden from display</option>
                                                    <option value="🔐">🔐 For password protected frames</option>
                                                    <option value="🚀">🚀 For redirect link</option>
                                                    <option value="🧨">🧨 For multiredirect link</option>
                                                </select>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-gray-700 text-sm">Width:</span>
                                                    <input 
                                                        type="range" 
                                                        min="10" 
                                                        max="100" 
                                                        value={field.customWidth}
                                                        onChange={(e) => handleFieldChange(index, 'customWidth', parseInt(e.target.value))}
                                                        className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer" 
                                                    />
                                                    <span className="text-gray-700 text-sm w-10 text-center">{field.customWidth}%</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1"><span className="text-gray-700 font-medium">Font Size</span></div>
                                                <select 
                                                    value={field.fontSize}
                                                    onChange={(e) => handleFieldChange(index, 'fontSize', e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option>9px</option>
                                                    <option>10px</option>
                                                    <option>12px</option>
                                                    <option>14px</option>
                                                    <option>16px</option>
                                                    <option>18px</option>
                                                    <option>24px</option>
                                                    <option>36px</option>
                                                    <option>inherit</option>
                                                    <option>large</option>
                                                    <option>larger</option>
                                                    <option>medium</option>
                                                    <option>small</option>
                                                    <option>smaller</option>
                                                    <option>x-larger</option>
                                                    <option>x-small</option>
                                                    <option>xx-larger</option>
                                                    <option>xx-small</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1"><span className="text-gray-700 font-medium">Caption</span></div>
                                                <div className="flex">
                                                    <textarea 
                                                        value={field.caption}
                                                        onChange={(e) => handleFieldChange(index, 'caption', e.target.value)}
                                                        className="flex-1 border border-gray-300 text-gray-700 text-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500 resize-y min-h-[38px] rounded-l-md border-r-0" 
                                                        rows="1" 
                                                        placeholder="Enter caption"
                                                    ></textarea>
                                                    <button 
                                                        type="button"
                                                        className="bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700 h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md border-l-0 border-blue-600"
                                                        onClick={() => handleOpenEditor(index, field.caption)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">Reference Content (Optional)</label>
                                            <button 
                                                type="button"
                                                onClick={() => toggleReference(index)}
                                                className="flex items-center text-blue-600 justify-center w-8 h-8 hover:text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <FontAwesomeIcon icon={showReference[index] ? faMinus : faPlus} className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        {showReference[index] && (
                                            <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '200px' }}>
                                                <Editor
                                                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                                    value={field.reference || ''}
                                                    onEditorChange={(content) => handleReferenceChange(index, content)}
                                                    init={{
                                                        resize: true,
                                                        height: '200',
                                                        menubar: true,
                                                        plugins: [
                                                            'advlist autolink lists link image charmap print preview anchor',
                                                            'searchreplace visualblocks code fullscreen',
                                                            'insertdatetime media table paste code help wordcount',
                                                            'emoticons quickbars codesample',
                                                            'directionality',
                                                            'hr',
                                                            'nonbreaking',
                                                            'pagebreak',
                                                            'autoresize',
                                                            'textcolor',
                                                            'imagetools',
                                                            'template',
                                                            'autolink',
                                                            'charmap',
                                                            'contextmenu',
                                                            'link',
                                                            'media',
                                                            'visualchars',
                                                            'visualblocks',
                                                            'toc',
                                                            'code',
                                                            'fontselect',
                                                            'fontsizeselect'
                                                        ],
                                                        toolbar: [
                                                            'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
                                                            'fontsizeselect | fontselect | code codesample | emoticons charmap hr pagebreak | ltr rtl | removeformat | help'
                                                        ].join(' | '),
                                                        skin: 'oxide',
                                                        content_css: 'default',
                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                        contextmenu: 'link image table',
                                                        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                                                        toolbar_mode: 'sliding',
                                                        image_advtab: true,
                                                        image_title: true,
                                                        automatic_uploads: true,
                                                        file_picker_types: 'image',
                                                        file_picker_callback: function(cb, value, meta) {
                                                            const input = document.createElement('input');
                                                            input.setAttribute('type', 'file');
                                                            input.setAttribute('accept', 'image/*');
                                                            
                                                            input.onchange = function() {
                                                                const file = this.files[0];
                                                                const reader = new FileReader();
                                                                
                                                                reader.onload = function() {
                                                                    const id = 'blobid' + (new Date()).getTime();
                                                                    const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                                                                    const base64 = reader.result.split(',')[1];
                                                                    const blobInfo = blobCache.create(id, file, base64);
                                                                    blobCache.add(blobInfo);
                                                                    
                                                                    cb(blobInfo.blobUri(), { title: file.name });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            };
                                                            
                                                            input.click();
                                                        },
                                                        templates: [
                                                            { title: 'Two Columns', description: 'Two column layout', content: '<div style="display: flex;"><div style="flex: 1; padding: 10px;">Left column</div><div style="flex: 1; padding: 10px;">Right column</div></div>' },
                                                            { title: 'Callout Box', description: 'Highlighted text box', content: '<div style="border-left: 4px solid #4CAF50; background-color: #f8f8f8; padding: 10px 15px; margin: 10px 0;">Callout text here</div>' }
                                                        ],
                                                        emoticons_append: {
                                                            custom_mind_explode: {
                                                                keywords: ['brain', 'mind', 'explode', 'blown'],
                                                                char: '🤯'
                                                            }
                                                        },
                                                        codesample_languages: [
                                                            { text: 'HTML/XML', value: 'markup' },
                                                            { text: 'JavaScript', value: 'javascript' },
                                                            { text: 'CSS', value: 'css' },
                                                            { text: 'PHP', value: 'php' },
                                                            { text: 'Ruby', value: 'ruby' },
                                                            { text: 'Python', value: 'python' },
                                                            { text: 'Java', value: 'java' },
                                                            { text: 'C', value: 'c' },
                                                            { text: 'C#', value: 'csharp' },
                                                            { text: 'C++', value: 'cpp' }
                                                        ],
                                                        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
                                                        font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                                                        branding: false
                                                    }}
                                                    onInit={(evt, editor) => editorRefs.current[index] = editor}
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
                                            <div className="bg-blue-600 flex items-center justify-center px-2 text-white w-16">
                                                <div className="flex flex-col items-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleMoveField(index, 'up')}
                                                        disabled={index === 0}
                                                        className="text-blue-100 hover:text-white disabled:opacity-30 text-sm"
                                                    >
                                                        <FontAwesomeIcon icon={faArrowUp} />
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleMoveField(index, 'down')}
                                                        disabled={index === data.dynamicFields.length - 1}
                                                        className="text-blue-100 hover:text-white disabled:opacity-30 text-sm"
                                                    >
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea 
                                                value={field.url}
                                                onChange={(e) => handleFieldChange(index, 'url', e.target.value)}
                                                className="flex-1 resize-y px-3 py-2 text-gray-700 text-sm bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]" 
                                                placeholder="Enter URL or embedded code..."
                                            ></textarea>
                                            <button 
                                                type="button"
                                                onClick={() => handleFieldChange(index, 'pinned', !field.pinned)}
                                                className={`flex flex-col items-center justify-center px-3 space-y-1 transition-all duration-200 w-16 ${field.pinned ? 'bg-red-600' : 'bg-blue-600'} text-white focus:outline-none focus:ring-2 ring-blue-400 text-xs`}
                                            >
                                                <FontAwesomeIcon icon={faMapPin} className="text-sm" />
                                                <span>Pin It</span>
                                                <span>Test</span>
                                                <span>&lt;/&gt;</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add at the End Button */}
                                <button 
                                    type="button"
                                    onClick={() => handleAddField('end')}
                                    className="w-full bg-gray-100 text-gray-700 rounded-md px-4 py-2 flex items-center gap-2 justify-center font-medium hover:bg-gray-200 transition-all duration-200 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                                >
                                    <FontAwesomeIcon icon={faPlusCircle} className="text-lg" />
                                    <span>Add at the End</span>
                                </button>

                                {/* Editor Modal */}
                                {isEditorOpen && (
                                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                                            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">Rich Text Editor</h3>
                                                <button
                                                    onClick={() => setIsEditorOpen(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                            <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 56px)' }}>
                                                <Editor
                                                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                                    value={currentEditorContent}
                                                    onEditorChange={(content) => setCurrentEditorContent(content)}
                                                    init={{
                                                        height: '100%',
                                                        menubar: true,
                                                        plugins: [
                                                            'advlist autolink lists link image charmap preview anchor',
                                                            'searchreplace visualblocks code fullscreen',
                                                            'insertdatetime media table paste code help wordcount',
                                                            'emoticons codesample directionality',
                                                            'hr nonbreaking pagebreak textcolor imagetools',
                                                            'autoresize contextmenu visualchars toc',
                                                            'template',
                                                            'quickbars',
                                                            'autolink',
                                                            'charmap',
                                                            'visualblocks',
                                                            'spellchecker',
                                                            'noneditable',
                                                            'code',
                                                            'fontselect',
                                                            'fontsizeselect'
                                                        ],
                                                        toolbar: [
                                                            'undo redo | formatselect | bold italic underline strikethrough superscript subscript | forecolor backcolor',
                                                            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                                                            'link image media table | codesample emoticons charmap hr pagebreak',
                                                            'fontsizeselect fontselect | removeformat | code fullscreen help'
                                                        ].join(' | '),
                                                        skin: 'oxide',
                                                        content_css: 'default',
                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                                                        branding: false,
                                                        resize: true,
                                                        contextmenu: 'link image table',
                                                        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                                                        toolbar_mode: 'sliding',
                                                        image_advtab: true,
                                                        image_title: true,
                                                        automatic_uploads: true,
                                                        file_picker_types: 'image',
                                                        file_picker_callback: function(cb, value, meta) {
                                                            const input = document.createElement('input');
                                                            input.setAttribute('type', 'file');
                                                            input.setAttribute('accept', 'image/*');
                                                            
                                                            input.onchange = function() {
                                                                const file = this.files[0];
                                                                const reader = new FileReader();
                                                                
                                                                reader.onload = function() {
                                                                    const id = 'blobid' + (new Date()).getTime();
                                                                    const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                                                                    const base64 = reader.result.split(',')[1];
                                                                    const blobInfo = blobCache.create(id, file, base64);
                                                                    blobCache.add(blobInfo);
                                                                    
                                                                    cb(blobInfo.blobUri(), { title: file.name });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            };
                                                            
                                                            input.click();
                                                        },
                                                        templates: [
                                                                                                                        { title: 'Two Columns', description: 'Two column layout', content: '<div style="display: flex;"><div style="flex: 1; padding: 10px;">Left column</div><div style="flex: 1; padding: 10px;">Right column</div></div>' },
                                                            { title: 'Callout Box', description: 'Highlighted text box', content: '<div style="border-left: 4px solid #4CAF50; background-color: #f8f8f8; padding: 10px 15px; margin: 10px 0;">Callout text here</div>' }
                                                        ],
                                                        emoticons_append: {
                                                            custom_mind_explode: {
                                                                keywords: ['brain', 'mind', 'explode', 'blown'],
                                                                char: '🤯'
                                                            }
                                                        },
                                                        codesample_languages: [
                                                            { text: 'HTML/XML', value: 'markup' },
                                                            { text: 'JavaScript', value: 'javascript' },
                                                            { text: 'CSS', value: 'css' },
                                                            { text: 'PHP', value: 'php' },
                                                            { text: 'Ruby', value: 'ruby' },
                                                            { text: 'Python', value: 'python' },
                                                            { text: 'Java', value: 'java' },
                                                            { text: 'C', value: 'c' },
                                                            { text: 'C#', value: 'csharp' },
                                                            { text: 'C++', value: 'cpp' }
                                                        ],
                                                        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
                                                        font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats'
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4 border-t border-gray-300 flex justify-end gap-3">
                                                <button
                                                    onClick={() => setIsEditorOpen(false)}
                                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveEditorContent}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}