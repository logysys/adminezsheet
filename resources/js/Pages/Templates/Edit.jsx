import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

export default function Edit({ auth, template }) {
    const { data, setData, put, processing } = useForm({
        title: template.title,
        description: template.description,
        price: template.price,
        status: template.status,
        theme_upload: null,
        theme_link: template.image,
        frame_color: template.framecolor,
        transparency: template.transparency,
        option: template.option,
    });

    const [isYouTubeLink, setIsYouTubeLink] = useState(false);

    useEffect(() => {
        // Check if the link is a YouTube URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        setIsYouTubeLink(youtubeRegex.test(data.theme_link));
    }, [data.theme_link]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('templates.update', template.id));
    };

    const handleFileChange = (e) => {
        setData('theme_upload', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Theme</h2>}
        >
            <Head title="Edit Theme" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Theme Upload */}
                                    <div>
                                        <label htmlFor="theme_upload" className="block text-sm font-medium text-gray-700 mb-1">
                                            Theme Upload
                                        </label>
                                        <input
                                            id="theme_upload"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>

                                    <div className="text-center text-gray-500">OR</div>

                                    {/* Theme Link */}
                                    <div>
                                        <label htmlFor="theme_link" className="block text-sm font-medium text-gray-700 mb-1">
                                            Theme Link
                                        </label>
                                        <input
                                            id="theme_link"
                                            name="theme_link"
                                            type="text"
                                            value={data.theme_link}
                                            onChange={(e) => setData('theme_link', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter URL for theme"
                                        />
                                    </div>

                                    {/* Option Select - Only shown for YouTube links */}
                                    {isYouTubeLink && (
                                        <div>
                                            <label htmlFor="option" className="block text-sm font-medium text-gray-700 mb-1">
                                                Option *
                                            </label>
                                            <select
                                                id="option"
                                                name="option"
                                                value={data.option}
                                                onChange={(e) => setData('option', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                required
                                            >
                                                <option value="autoplay">Autoplay</option>
                                                <option value="mute">Mute</option>
                                                <option value="pause">Pause</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter template description"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price
                                        </label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter price in USD"
                                        />
                                    </div>

                                    {/* Frame Color */}
                                    <div>
                                        <label htmlFor="frame_color" className="block text-sm font-medium text-gray-700 mb-1">
                                            Frame Color
                                        </label>
                                        <input
                                            id="frame_color"
                                            name="frame_color"
                                            type="color"
                                            value={data.frame_color}
                                            onChange={(e) => setData('frame_color', e.target.value)}
                                            className="h-10 w-16 cursor-pointer"
                                        />
                                    </div>

                                    {/* Transparency */}
                                    <div>
                                        <label htmlFor="transparency" className="block text-sm font-medium text-gray-700 mb-1">
                                            Transparency
                                        </label>
                                        <div className="flex rounded-md shadow-sm">
                                            <input
                                                id="transparency"
                                                name="transparency"
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={data.transparency}
                                                onChange={(e) => setData('transparency', e.target.value)}
                                                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="0-100"
                                            />
                                            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Select */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('templates.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Theme'}
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