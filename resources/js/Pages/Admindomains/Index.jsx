import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, admindomains, limit, flash = {} }) {
    const { props } = usePage();
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const handleStatusChange = (e, id) => {
        router.post(route('admindomains.status'), {
            id,
            status: e.target.value
        });
    };

    const handleDayChange = (e, id) => {
        const checkboxes = document.querySelectorAll(`input[data-id="${id}"].dayschange:checked`);
        const days = Array.from(checkboxes).map(cb => cb.value).join(',');
        
        router.post(route('admindomains.change'), { id, days });
    };

    const handleAllDaysChange = (e, id) => {
        const days = e.target.checked ? daysOfWeek.join(',') : '';
        daysOfWeek.forEach(day => {
            const checkbox = document.getElementById(`${day}${id}`);
            if (checkbox) checkbox.checked = e.target.checked;
        });
        router.post(route('admindomains.change'), { id, days });
    };

    const handleLimitChange = (e) => {
        router.get(route('admindomains.index'), { limit: e.target.value });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admindomains.index'), { search: e.target.value });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Admindomains</h2>
                    <Link
                        href={route('admindomains.create')}
                        className="btn-primary"
                    >
                        Add Admindomain
                    </Link>
                </div>
            }
        >
            <Head title="Admindomains" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.message && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {flash.message}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search and Results Info */}
                            <div className="flex items-center justify-between mb-4">
                                {admindomains.total > 0 && (
                                    <div className="text-gray-600">
                                        Showing {admindomains.from} to {admindomains.to} of {admindomains.total} entries
                                    </div>
                                )}
                                <div className="w-full sm:w-auto">
                                    <input
                                        type="text"
                                        name="search"
                                        className="form-input pl-8 pr-4 py-2 border rounded-md"
                                        placeholder="Search..."
                                        defaultValue={props.search || ''}
                                        onKeyDown={handleSearch}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">All Days</th>
                                            {daysOfWeek.map(day => (
                                                <th key={day} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {admindomains.data.map((domain) => (
                                            <tr key={domain.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {domain.domain}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(domain.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        onChange={(e) => handleStatusChange(e, domain.id)}
                                                        className={`form-select ${domain.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                        value={domain.status}
                                                    >
                                                        <option className="bg-green-100 text-green-800" value="Active">Active</option>
                                                        <option className="bg-red-100 text-red-800" value="Inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('admindomains.edit', domain.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this domain?')) {
                                                                router.delete(route('admindomains.destroy', domain.id))
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={domain.days === daysOfWeek.join(',')}
                                                        onChange={(e) => handleAllDaysChange(e, domain.id)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                {daysOfWeek.map((day) => (
                                                    <td key={day} className="px-6 py-4 whitespace-nowrap text-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`${day}${domain.id}`}
                                                            data-id={domain.id}
                                                            value={day}
                                                            checked={domain.days?.includes(day) || false}
                                                            onChange={(e) => handleDayChange(e, domain.id)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dayschange"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination and Limit Controls */}
                            <div className="mt-4 flex items-center justify-between">
                                <Pagination links={admindomains.links} />
                                <select
                                    onChange={handleLimitChange}
                                    value={limit}
                                    className="form-select w-20"
                                >
                                    {[5, 10, 25, 50, 100].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}