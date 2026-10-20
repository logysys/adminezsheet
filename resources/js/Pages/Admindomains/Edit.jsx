import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, admindomain }) {
    // Convert the comma-separated days string back to array for the form
    const initialDays = admindomain.days ? admindomain.days.split(',') : [];
    
    const { data, setData, put, processing, errors, transform } = useForm({
        domain: admindomain.domain || '',
        status: admindomain.status || 'Active',
        days: initialDays
    });

    // Transform days array to string before submission
    transform((data) => ({
        ...data,
        days: data.days.join(',')
    }));

    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admindomains.update', admindomain.id), {
            onSuccess: () => {
                // Optional: Add any success handling here
            }
        });
    };

    const handleDayChange = (day) => {
        setData('days', prev => 
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleAllDaysChange = (e) => {
        setData('days', e.target.checked ? [...daysOfWeek] : []);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Domain</h2>
                    <Link
                        href={route('admindomains.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Back to Domains
                    </Link>
                </div>
            }
        >
            <Head title="Edit Domain" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Domain Field */}
                                    <div>
                                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                                            Domain Name *
                                        </label>
                                        <TextInput
                                            id="domain"
                                            name="domain"
                                            type="text"
                                            value={data.domain}
                                            onChange={(e) => setData('domain', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.domain ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        <InputError message={errors.domain} className="mt-1" />
                                    </div>

                                    {/* Status Field */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.status ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-1" />
                                    </div>

                                    {/* Days Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Active Days
                                        </label>
                                        
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id="allDays"
                                                checked={data.days.length === daysOfWeek.length}
                                                onChange={handleAllDaysChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="allDays" className="ml-2 block text-sm text-gray-700">
                                                Select All Days
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`day-${day}`}
                                                        checked={data.days.includes(day)}
                                                        onChange={() => handleDayChange(day)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.days} className="mt-1" />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end mt-6">
                                        <Link
                                            href={route('admindomains.index')}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            {processing ? 'Updating...' : 'Update Domain'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}