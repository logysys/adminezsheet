import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ 
    auth, 
    tokenTransactions,
    pointPurchases,
    handlePurchases,
    sellingDetails,
    funnels,
    domains,
    customDomains,
    transfers,
    incentives,
    tokenInfo,
    totalIncentives,
    stats,
    filters
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [incentivesData, setIncentivesData] = useState(incentives);
    const [funnelSearch, setFunnelSearch] = useState(filters.funnel_search || '');
    const [funnelSearchType, setFunnelSearchType] = useState(filters.funnel_search_type || 'fuzzy');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        if (currency.toUpperCase() === 'USD') {
            const numberPart = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount || 0);
            return `US$${numberPart}`;
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatBee = (amount) => {
        const numberPart = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount || 0);
        return `EZ$${numberPart}`;
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const loadMoreIncentives = async () => {
        try {
            const response = await fetch(route('dashboard.incentives'));
            const data = await response.json();
            setIncentivesData(prev => [...prev, ...data.incentives.data]);
        } catch (error) {
            console.error('Error loading more incentives:', error);
        }
    };

    const handleFunnelSearch = (e) => {
        if (e) e.preventDefault();
        router.get(route('dashboard'), {
            ...filters,
            funnel_search: funnelSearch,
            funnel_search_type: funnelSearchType,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFunnelFilters = () => {
        setFunnelSearch('');
        setFunnelSearchType('fuzzy');
        router.get(route('dashboard'), {
            ...filters,
            funnel_search: '',
            funnel_search_type: 'fuzzy',
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Debug useEffect
    useEffect(() => {
        console.log('Funnels data:', funnels);
        console.log('Active tab:', activeTab);
    }, [funnels, activeTab]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8 px-6">
                {/* Admin Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium">Total Users</h3>
                        <p className="text-3xl font-bold mt-2">{stats.total_users}</p>
                        <p className="text-blue-100 mt-1">Registered users</p>
                    </div>
                    
                    {/* Total Funnels Card */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium">Total Funnels</h3>
                        <p className="text-3xl font-bold mt-2">{stats.total_funnels}</p>
                        <p className="text-purple-100 mt-1">System-wide funnels</p>
                    </div>
                    
                    {/* Total Domains Card */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium">Total Domains</h3>
                        <p className="text-3xl font-bold mt-2">{stats.total_domains}</p>
                        <p className="text-green-100 mt-1">All domains</p>
                    </div>
                    
                    {/* Total Transactions Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(stats.total_point_purchases)}</p>
                        <p className="text-orange-100 mt-1">From EZ$ purchases</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['overview', 'incentives', 'transactions', 'funnels', 'domains', 'transfers', 'selling'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Incentives */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-800">Recent Incentives</h3>
                                    <Link 
                                        href={route('incentive-history.index')} 
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {incentives.slice(0, 5).map((incentive) => (
                                        <div key={incentive.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center">
                                                <div className="bg-green-100 p-2 rounded-full mr-4">
                                                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {incentive.type} Incentive
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(incentive.distributed_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-green-600">
                                                    +{formatBee(incentive.amount)}
                                                </p>
                                                {incentive.invoice_number && (
                                                    <Link 
                                                        href={route('dashboard.invoice.show', incentive.invoice_number)}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        View Invoice
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {incentives.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No incentives found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Token Transactions */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Token Transactions</h3>
                                <div className="space-y-4">
                                    {tokenTransactions.slice(0, 5).map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-full mr-4 ${
                                                    transaction.transaction_type === 'earned' ? 'bg-blue-100' : 'bg-red-100'
                                                }`}>
                                                    <svg className={`h-5 w-5 ${
                                                        transaction.transaction_type === 'earned' ? 'text-blue-600' : 'text-red-600'
                                                    }`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800 capitalize">
                                                        {transaction.transaction_type}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(transaction.created_at)}
                                                    </p>
                                                    {transaction.user && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            User: {transaction.user.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`text-sm font-bold ${
                                                transaction.transaction_type === 'earned' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.transaction_type === 'earned' ? '+' : '-'}{transaction.amount}
                                            </p>
                                        </div>
                                    ))}
                                    {tokenTransactions.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No token transactions found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Incentives Tab */}
                {activeTab === 'incentives' && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Incentive History</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Invoice
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {incentivesData.map((incentive) => (
                                            <tr key={incentive.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {incentive.user_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                    {formatBee(incentive.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {incentive.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {incentive.invoice_number ? (
                                                        <Link 
                                                            href={route('dashboard.invoice.show', incentive.invoice_number)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            {incentive.invoice_number}
                                                        </Link>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(incentive.distributed_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {incentives.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No incentives found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="space-y-6">
                        {/* Point Purchases */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">EZ$ Purchases</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    EZ$
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pointPurchases.map((purchase) => (
                                                <tr key={purchase.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.user?.name || 'Unknown User'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatBee(purchase.bee_points_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(purchase.fiat_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            purchase.status === 'completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {purchase.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(purchase.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {pointPurchases.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No point purchases found.</p>
                                )}
                            </div>
                        </div>

                        {/* Handle Purchases */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Handle Purchases</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Handle
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Method
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {handlePurchases.map((purchase) => (
                                                <tr key={purchase.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {purchase.user?.name || 'N/A'}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {purchase.user?.email || 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {purchase.domain ? (
                                                            <a
                                                                href={
                                                                    purchase.domain.type === 'custom'
                                                                        ? `https://${purchase.domain.domainselected}/${purchase.domain.domain}`
                                                                        : `https://${purchase.domain.domain}.${purchase.domain.domainselected}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-yellow-600 hover:text-yellow-800"
                                                            >
                                                                {purchase.domain.domain}
                                                                {purchase.domain.domainselected && `.${purchase.domain.domainselected}`}
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.payment_method?.toLowerCase() === 'bee'
                                                            ? formatBee(purchase.bee_points_amount)
                                                            : formatCurrency(purchase.amount || 0, purchase.currency)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.payment_method === 'bee' ? 'EZ$' : purchase.payment_method}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            purchase.status === 'completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : purchase.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {purchase.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(purchase.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {handlePurchases.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No handle purchases found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Funnels Tab */}
                {activeTab === 'funnels' && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            {/* Funnel Search Form */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search funnels by token"
                                        className="flex-grow bg-white text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-0"
                                        value={funnelSearch}
                                        onChange={(e) => setFunnelSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFunnelSearch(e)}
                                    />

                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            className={`font-semibold px-3 py-2 flex items-center gap-1.5 whitespace-nowrap rounded-l-md border-r transition-colors ${
                                                funnelSearchType === 'fuzzy'
                                                    ? 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                                                    : 'bg-gray-600 text-gray-300 border-gray-700 hover:bg-gray-700'
                                            }`}
                                            onClick={() => {
                                                setFunnelSearchType('fuzzy');
                                                handleFunnelSearch();
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            Fuzzy
                                        </button>
                                        <button
                                            type="button"
                                            className={`font-semibold px-3 py-2 flex items-center gap-1.5 whitespace-nowrap rounded-r-md transition-colors ${
                                                funnelSearchType === 'exact'
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                            }`}
                                            onClick={() => {
                                                setFunnelSearchType('exact');
                                                handleFunnelSearch();
                                            }}
                                        >
                                            <span className="text-sm">🏀</span>
                                            Exact
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={resetFunnelFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleFunnelSearch}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            {!funnels || funnels.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    {funnelSearch ? 'No funnels found matching your search.' : 'No funnels found.'}
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domains</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transparency</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {funnels.map(funnel => (
                                                <tr key={funnel.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a 
                                                            href={`https://ez3d.ai/${encodeURIComponent(funnel.token)}`} 
                                                            target="_blank" 
                                                            className="text-yellow-400 font-semibold truncate"
                                                            rel="noopener noreferrer"
                                                        >
                                                            https://ez3d.ai/{funnel.token}
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            {funnel.handle_domains?.map((domain) => (
                                                                <a
                                                                    key={domain.id}
                                                                    href={`https://${domain.domain}.${domain.domainselected}`}
                                                                    target="_blank"
                                                                    className="text-yellow-400 font-semibold truncate"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    https://{domain.domain}.{domain.domainselected}
                                                                </a>
                                                            ))}
                                                            {funnel.custom_domains?.map((domain) => (
                                                                <a
                                                                    key={domain.id}
                                                                    href={`https://${domain.domain}/${domain.domainselected}`}
                                                                    target="_blank"
                                                                    className="text-yellow-400 font-semibold truncate"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    https://{domain.domain}/{domain.domainselected}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div 
                                                                className="w-6 h-6 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: funnel.color }}
                                                                title={funnel.color}
                                                            ></div>
                                                            <span className="ml-2 text-sm text-gray-500">{funnel.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {funnel.transparency}%
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(funnel.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Domains Tab */}
                {activeTab === 'domains' && (
                    <div className="space-y-6">
                        {/* Custom Domains */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Custom Domains</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Domain
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date Added
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {customDomains.map((domain) => (
                                                <tr key={domain.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{domain.domainselected}/{domain.domain}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Custom
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(domain.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {customDomains.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No custom domains found.</p>
                                )}
                            </div>
                        </div>

                        {/* System Domains */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Domains</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Domain
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date Added
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {domains.map((domain) => (
                                                <tr key={domain.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {domain.domain}.{domain.domainselected}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Domain
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(domain.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {domains.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No system domains found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Transfers Tab */}
                {activeTab === 'transfers' && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Domain Transfers</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Domain
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                From User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                To User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {transfers.map((transfer) => (
                                            <tr key={transfer.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {transfer.domain}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transfer.from_user?.name || 'Unknown User'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transfer.to_user?.name || 'Unknown User'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        transfer.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {transfer.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(transfer.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {transfers.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No domain transfers found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Selling Tab */}
                {activeTab === 'selling' && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Selling Details</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sellingDetails.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {sale.user?.name || 'Unknown User'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatBee(sale.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        sale.status === 'completed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(sale.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {sellingDetails.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No selling details found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}