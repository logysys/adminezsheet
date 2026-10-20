import { Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';

export default function LogoEdit({ auth, funnel }) {
    // Get page props using the usePage hook
    const { flash: pageFlash, funnel: pageFunnel } = usePage().props;

    // Safely handle potentially undefined props, prioritizing direct props over page props
    const flashMessages = pageFlash || {};
    const funnelData = funnel || pageFunnel || {};

    // Safely access nested properties with fallbacks
    const logoSettings = funnelData.logoSettings || {};

    const { data, setData, put, processing, errors, reset } = useForm({
        id: funnelData.id || '',
        logoimage: logoSettings.logoimage || '',
        fly_sign_logo: logoSettings.fly_sign_logo || '',
        favicon_logo: logoSettings.favicon_logo || '',
        meta_logo: logoSettings.meta_logo || '',
        secondary_logo: logoSettings.secondary_logo || '',
        // Checkbox states are correctly initialized by checking if the value is truthy
        useAsFlySign: !!logoSettings.fly_sign_logo,
        useAsFavicon: !!logoSettings.favicon_logo,
        useAsMetaLogo: !!logoSettings.meta_logo,
        useAsSecondary: !!logoSettings.secondary_logo
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const fileInputRef = useRef(null);

    // --- NEW: State for image preview ---
    // Initialize with the existing logo URL if it exists.
    // This assumes files are stored in a publicly accessible 'storage' directory.
    const [imagePreview, setImagePreview] = useState(logoSettings.logoimage ? `/storage/${logoSettings.logoimage}` : null);

    // Function to reset form with new data from props
    const resetFormWithNewData = (newFunnelData) => {
        const newLogoSettings = newFunnelData.logoSettings || {};
        reset({
            id: newFunnelData.id || '',
            logoimage: newLogoSettings.logoimage || '',
            fly_sign_logo: newLogoSettings.fly_sign_logo || '',
            favicon_logo: newLogoSettings.favicon_logo || '',
            meta_logo: newLogoSettings.meta_logo || '',
            secondary_logo: newLogoSettings.secondary_logo || '',
            useAsFlySign: !!newLogoSettings.fly_sign_logo,
            useAsFavicon: !!newLogoSettings.favicon_logo,
            useAsMetaLogo: !!newLogoSettings.meta_logo,
            useAsSecondary: !!newLogoSettings.secondary_logo
        });
        // Update the image preview as well
        setImagePreview(newLogoSettings.logoimage ? `/storage/${newLogoSettings.logoimage}` : null);
    };

    useEffect(() => {
        if (flashMessages.success) {
            setSuccessMessage(flashMessages.success);
            const timer = setTimeout(() => setSuccessMessage(''), 3000);

            // If we have updated funnel data in props, reset the form
            if (funnelData && funnelData.id) {
                resetFormWithNewData(funnelData);
            }
            return () => clearTimeout(timer);
        }
    }, [flashMessages.success, funnelData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('flySign', data.useAsFlySign ? '1' : '0');
        formData.append('favicon', data.useAsFavicon ? '1' : '0');
        formData.append('metaLogo', data.useAsMetaLogo ? '1' : '0');
        formData.append('secondaryLogo', data.useAsSecondary ? '1' : '0');

        if (selectedFile) {
            formData.append('logoImage', selectedFile);
        }

        router.post(route('funnel-logo.update'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedFile(null);
                setFileName('No file chosen');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            // --- NEW: Update preview when a new file is chosen ---
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setFileName('No file chosen');
            // --- NEW: Revert to original image if selection is cancelled ---
            setImagePreview(logoSettings.logoimage ? `/storage/${logoSettings.logoimage}` : null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Logo Editor</h2>}
        >
            <Head title="Logo Editor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {successMessage && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
                            {successMessage}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-xl text-gray-800 font-bold">Editing Logos for: {funnelData.id || 'N/A'}</h1>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-gray-800">
                                    <div>
                                        <p className="mb-2">https://ez.wiki/{funnelData.id || 'X0000250'}</p>
                                        <div className="bg-white p-4 rounded-xl border border-gray-300">
                                            <img src="https://i.ibb.co/bFYY8tN/qr-code-image.png" alt="QR Code 1" className="mx-auto w-32 h-32"/>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-2">https://ez.wiki/{funnelData.id || 'X0000250'}</p>
                                        <div className="bg-white p-4 rounded-xl border border-gray-300">
                                            <img src="https://i.ibb.co/bFYY8tN/qr-code-image.png" alt="QR Code 2" className="mx-auto w-32 h-32"/>
                                        </div>
                                    </div>
                                </div>

                                {/* --- NEW: Image Preview Section --- */}
                                {imagePreview && (
                                    <div className="mt-6 text-center">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {selectedFile ? 'New Logo Preview' : 'Current Logo'}
                                        </label>
                                        <div className="inline-block bg-gray-50 p-2 rounded-lg border border-gray-300">
                                            <img src={imagePreview} alt="Logo Preview" className="h-32 w-auto object-contain" />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Image</label>
                                    <div className="flex">
                                        <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-l-lg border border-gray-300 hover:bg-gray-300">
                                            Choose File
                                        </label>
                                        <span className="flex-grow p-2 border border-l-0 border-gray-300 bg-gray-100 text-gray-500 rounded-r-lg">
                                            {fileName}
                                        </span>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.logoImage && <div className="text-red-500 text-sm mt-1">{errors.logoImage}</div>}
                                </div>
                                
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Apply image to:</label>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-800">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" checked={data.useAsFlySign} onChange={(e) => setData('useAsFlySign', e.target.checked)} className="form-checkbox h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"/>
                                            <span>First Fly-sign Avatar</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" checked={data.useAsFavicon} onChange={(e) => setData('useAsFavicon', e.target.checked)} className="form-checkbox h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"/>
                                            <span>Favicon</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" checked={data.useAsMetaLogo} onChange={(e) => setData('useAsMetaLogo', e.target.checked)} className="form-checkbox h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"/>
                                            <span>Meta logo</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" checked={data.useAsSecondary} onChange={(e) => setData('useAsSecondary', e.target.checked)} className="form-checkbox h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"/>
                                            <span>Second EZ LOGO</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="text-center mt-8">
                                    <button type="submit" disabled={processing} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition flex items-center mx-auto disabled:opacity-50">
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {processing ? 'Saving...' : 'Save Logo Settings'}
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