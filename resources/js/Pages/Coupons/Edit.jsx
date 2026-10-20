import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, coupon }) {
    const { data, setData, put, processing, errors } = useForm({
        title: coupon.title,
        type: coupon.type,
        coupon: coupon.coupon,
        offer: coupon.offer,
        use_limit: coupon.use_limit,
        limit_type: coupon.limit_type,
        expire: new Date(coupon.expire).toISOString().slice(0, 16),
        status: coupon.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('coupons.update', coupon.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Coupon</h2>}
        >
            <Head title={`Edit Coupon - ${coupon.coupon}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.title ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    {/* Coupon Code */}
                                    <div>
                                        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon Code *
                                        </label>
                                        <input
                                            id="coupon"
                                            name="coupon"
                                            type="text"
                                            value={data.coupon}
                                            onChange={(e) => setData('coupon', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.coupon ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.coupon && <p className="mt-1 text-sm text-red-600">{errors.coupon}</p>}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Type *
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="all">Fixed Amount</option>
                                        </select>
                                    </div>

                                    {/* Offer */}
                                    <div>
                                        <label htmlFor="offer" className="block text-sm font-medium text-gray-700 mb-1">
                                            Offer Value *
                                        </label>
                                        <input
                                            id="offer"
                                            name="offer"
                                            type="number"
                                            step={data.type === 'percentage' ? '1' : '0.01'}
                                            min="0"
                                            value={data.offer}
                                            onChange={(e) => setData('offer', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.offer ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.offer && <p className="mt-1 text-sm text-red-600">{errors.offer}</p>}
                                    </div>

                                    {/* Limit Type */}
                                    <div>
                                        <label htmlFor="limit_type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Limit Type *
                                        </label>
                                        <select
                                            id="limit_type"
                                            name="limit_type"
                                            value={data.limit_type}
                                            onChange={(e) => {
                                                setData('limit_type', e.target.value);
                                                if (e.target.value === 'unlimited') {
                                                    setData('use_limit', 0);
                                                }
                                            }}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="limited">Limited</option>
                                            <option value="unlimited">Unlimited</option>
                                        </select>
                                        {data.limit_type === 'unlimited' && (
                                            <p className="mt-1 text-sm text-gray-500">No usage limit for this coupon</p>
                                        )}
                                    </div>

                                    {/* Use Limit */}
                                    <div>
                                        <label htmlFor="use_limit" className="block text-sm font-medium text-gray-700 mb-1">
                                            Use Limit *
                                        </label>
                                        <input
                                            id="use_limit"
                                            name="use_limit"
                                            type="number"
                                            min="0"
                                            value={data.use_limit}
                                            onChange={(e) => setData('use_limit', parseInt(e.target.value) || 0)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.use_limit ? 'border-red-500' : ''
                                            }`}
                                            required
                                            disabled={data.limit_type === 'unlimited'}
                                        />
                                        {errors.use_limit && <p className="mt-1 text-sm text-red-600">{errors.use_limit}</p>}
                                        {data.limit_type === 'unlimited' && (
                                            <p className="mt-1 text-sm text-gray-500">Use limit is disabled for unlimited coupons</p>
                                        )}
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label htmlFor="expire" className="block text-sm font-medium text-gray-700 mb-1">
                                            Expiry Date *
                                        </label>
                                        <input
                                            id="expire"
                                            name="expire"
                                            type="datetime-local"
                                            value={data.expire}
                                            onChange={(e) => setData('expire', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.expire ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.expire && <p className="mt-1 text-sm text-red-600">{errors.expire}</p>}
                                    </div>

                                    {/* Status */}
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
                                        href={route('coupons.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Coupon'}
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