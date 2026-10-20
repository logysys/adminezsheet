import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Pagination from '@/Components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faReceipt,
    faCoins,
    faDollarSign,
    faCalendarAlt,
    faCheckCircle,
    faTimes,
    faSpinner,
    faArrowLeft,
    faPlus,
    faFileInvoice,
    faGlobe,
    faLink,
    faSearch,
    faFilter,
    faTimesCircle,
    faExchangeAlt,
    faUserShield,
    faUser,
    faUndo,
    faEye
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ auth, tokenInfo, recentTransactions = [], users = [], purchases, beepurchases, transactions, sales, transfers, refundtransfers, summary, filters, incentives, invoices }) {
    const [reserveForm, setReserveForm] = useState({ amount: '', reason: '' });
    const [releaseForm, setReleaseForm] = useState({ amount: '', reason: '' });
    const [transferForm, setTransferForm] = useState({
        email: '', amount: '', reason: ''
    });
    const [activeTab, setActiveTab] = useState('ReserveTransaction');
    const [search, setSearch] = useState(filters?.purchases_search || '');
    const [beepurchaseSearch, setBeepurchaseSearch] = useState(filters?.beepurchases_search || '');
    const [transactionSearch, setTransactionSearch] = useState(filters?.transactions_search || '');
    const [transactionType, setTransactionType] = useState(filters?.transaction_type || '');
    const [dateRange, setDateRange] = useState(filters?.date_range || '');
    const [salesSearch, setSalesSearch] = useState(filters?.sales_search || '');
    const [salesStatusFilter, setSalesStatusFilter] = useState(filters?.sales_status || '');
    const [pendingTransfersSearch, setPendingTransfersSearch] = useState(filters?.pending_transfers_search || '');
    const [pendingTransfersStatusFilter, setPendingTransfersStatusFilter] = useState(filters?.transfers_status || '');
    const [processingId, setProcessingId] = useState(null);
    const [refundTransfersSearch, setRefundTransfersSearch] = useState(filters?.refund_transfers_search || '');
    const [invoicesSearch, setInvoicesSearch] = useState(filters?.invoices_search || '');
    const [incentivesSearch, setIncentivesSearch] = useState(filters?.incentives_search || '');

    const handleReserve = (e) => {
        e.preventDefault();
        router.post(route('reserve.reserve'), reserveForm, {
            onSuccess: () => setReserveForm({ amount: '', reason: '' })
        });
    };

    const handleRelease = (e) => {
        e.preventDefault();
        router.post(route('reserve.release'), releaseForm, {
            onSuccess: () => setReleaseForm({ amount: '', reason: '' })
        });
    };

    const handleTransfer = (e) => {
        e.preventDefault();
        router.post(route('reserve.transfer'), transferForm, {
            onSuccess: () => setTransferForm({ email: '', amount: '', reason: '' })
        });
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) num = 0;
        return `EZ$${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(num)}`;
    };

    const formatCurrency = (amount, currency = 'USD') => {
        // For EZ$ amounts, use the points formatting
        if (currency === 'EZ$' || currency === 'BEE') {
            return 'EZ$' + new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }
        
        // Ensure we have a valid currency string. Fallback to 'USD' if the provided one is null or empty.
        const effectiveCurrency = currency || 'USD';
    
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: effectiveCurrency
        }).format(amount);
    
        if (effectiveCurrency.toUpperCase() === 'USD') {
            return formatted.replace('$', 'US$');
        }
        return formatted;
    };

    const formatPoints = (amount) => {
        return 'EZ$' + new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const getInvoiceLink = (invoice) => {
      if (invoice.type === 'refund') {
        return `/refundinvoicebuyer/${invoice.number}`;
      } else if (invoice.type === 'penalty') {
        return `/refundinvoiceseller/${invoice.number}`;
      }
      return '#';
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            completed: 'bg-green-100 text-green-800',
            distributed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
            case 'failed':
                return <FontAwesomeIcon icon={faTimes} className="text-red-500" />;
            case 'pending':
                return <FontAwesomeIcon icon={faSpinner} className="text-yellow-500 animate-spin" />;
            default:
                return <FontAwesomeIcon icon={faSpinner} className="text-gray-500" />;
        }
    };

    // Function to open invoice
    const openInvoice = (invoiceId) => {
        if (invoiceId) {
            window.open(route('showinvoice.show', invoiceId), '_blank');
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { purchases_search: search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleBeepurchaseFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { beepurchases_search: beepurchaseSearch }, {
            preserveState: true,
            replace: true
        });
    };

    const handleTransactionFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
            transactions_search: transactionSearch, 
            transaction_type: transactionType,
            date_range: dateRange 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSalesFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
            sales_search: salesSearch, 
            sales_status: salesStatusFilter 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePendingTransfersFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
            pending_transfers_search: pendingTransfersSearch, 
            transfers_status: pendingTransfersStatusFilter 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleRefundTransfersFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
          refund_transfers_search: refundTransfersSearch
        }, {
          preserveState: true,
          replace: true
        });
    };

    const handleInvoicesFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
            invoices_search: invoicesSearch 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleIncentivesFilter = (e) => {
        e.preventDefault();
        router.get(route('reserve.dashboard'), { 
            incentives_search: incentivesSearch 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetBeepurchaseFilters = () => {
        setBeepurchaseSearch('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetTransactionFilters = () => {
        setTransactionSearch('');
        setTransactionType('');
        setDateRange('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetSalesFilters = () => {
        setSalesSearch('');
        setSalesStatusFilter('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetPendingTransfersFilters = () => {
        setPendingTransfersSearch('');
        setPendingTransfersStatusFilter('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetRefundTransfersFilters = () => {
        setRefundTransfersSearch('');
        router.get(route('reserve.dashboard'), {}, {
          preserveState: true,
          replace: true
        });
    };

    const resetInvoicesFilters = () => {
        setInvoicesSearch('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const resetIncentivesFilters = () => {
        setIncentivesSearch('');
        router.get(route('reserve.dashboard'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const forceCompleteTransfer = async (transferId) => {
        setProcessingId(transferId);
        try {
            await router.post(route('pending-transfers.force-complete', transferId));
            // Inertia will handle the page reload with the success message
        } catch (error) {
            console.error('Error forcing transfer completion:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const getInvoiceTypeBadge = (type) => {
        const typeClasses = {
            point_purchase: 'bg-blue-100 text-blue-800',
            handle_purchase: 'bg-purple-100 text-purple-800',
            reserve_transaction: 'bg-orange-100 text-orange-800',
            handle_sale: 'bg-green-100 text-green-800',
            domain_refund: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        
        const typeLabels = {
            point_purchase: 'Point Purchase',
            handle_purchase: 'Handle Purchase',
            reserve_transaction: 'Reserve Transaction',
            handle_sale: 'Handle Sale',
            domain_refund: 'Domain Refund',
            other: 'Other'
        };
        
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${typeClasses[type] || typeClasses.other}`}>
                {typeLabels[type] || 'Other'}
            </span>
        );
    };

    // Safe access to tokenInfo properties
    const totalSupply = tokenInfo?.total_supply || 0;
    const circulatingSupply = tokenInfo?.circulating_supply || 0;
    const reservedSupply = tokenInfo?.reserved_supply || 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        EZ$ Reserve Management
                    </h2>
                    <Link
                        href={route('reserve.history')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Transaction History
                    </Link>
                </div>
            }
        >
            <Head title="13.EZ$ Reserve Management" />
            <Tooltip id="dashboard-tooltip" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6" data-tooltip-id="dashboard-tooltip" data-tooltip-content="The total amount of EZ$ that has ever been created.">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Supply</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatNumber(totalSupply)}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6" data-tooltip-id="dashboard-tooltip" data-tooltip-content="The amount of EZ$ currently available for transactions and not held in reserve.">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Circulating Supply</h3>
                            <p className="text-2xl font-bold text-green-600">
                                {formatNumber(circulatingSupply)}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6" data-tooltip-id="dashboard-tooltip" data-tooltip-content="The amount of EZ$ held in the reserve, not available for general circulation until released.">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reserved Supply</h3>
                            <p className="text-2xl font-bold text-orange-600">
                                {formatNumber(reservedSupply)}
                            </p>
                        </div>
                    </div>

                    {/* Action Forms */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Reserve Form */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Reserve Points</h3>
                            <form onSubmit={handleReserve} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="reserveAmount" value="Amount" />
                                    <TextInput
                                        id="reserveAmount"
                                        type="number"
                                        step="0.00000001"
                                        min="0.00000001"
                                        max={circulatingSupply}
                                        value={reserveForm.amount}
                                        onChange={(e) => setReserveForm(prev => ({
                                            ...prev,
                                            amount: e.target.value
                                        }))}
                                        required
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content={`Enter the amount to reserve. Maximum: ${formatNumber(circulatingSupply)}`}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="reserveReason" value="Reason" />
                                    <TextInput
                                        id="reserveReason"
                                        value={reserveForm.reason}
                                        onChange={(e) => setReserveForm(prev => ({
                                            ...prev,
                                            reason: e.target.value
                                        }))}
                                        placeholder="Reason for reserving"
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content="Optionally, provide a reason for this reserve transaction."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    data-tooltip-id="dashboard-tooltip"
                                    data-tooltip-content="Move points from circulating supply to the reserve."
                                >
                                    Add to Reserve
                                </button>
                            </form>
                        </div>

                        {/* Release Form */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Release Points</h3>
                            <form onSubmit={handleRelease} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="releaseAmount" value="Amount" />
                                    <TextInput
                                        id="releaseAmount"
                                        type="number"
                                        step="0.00000001"
                                        min="0.00000001"
                                        max={reservedSupply}
                                        value={releaseForm.amount}
                                        onChange={(e) => setReleaseForm(prev => ({
                                            ...prev,
                                            amount: e.target.value
                                        }))}
                                        required
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content={`Enter the amount to release. Maximum: ${formatNumber(reservedSupply)}`}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="releaseReason" value="Reason" />
                                    <TextInput
                                        id="releaseReason"
                                        value={releaseForm.reason}
                                        onChange={(e) => setReleaseForm(prev => ({
                                            ...prev,
                                            reason: e.target.value
                                        }))}
                                        placeholder="Reason for releasing"
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content="Optionally, provide a reason for this release transaction."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    data-tooltip-id="dashboard-tooltip"
                                    data-tooltip-content="Move points from the reserve back into the circulating supply."
                                >
                                    Reduce Reserve
                                </button>
                            </form>
                        </div>

                        {/* Transfer Form */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Transfer to User or Email</h3>
                            <form onSubmit={handleTransfer} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="transferEmail" value="Email Address" />
                                    <TextInput
                                        id="transferEmail"
                                        type="email"
                                        value={transferForm.email}
                                        onChange={(e) => setTransferForm(prev => ({
                                            ...prev,
                                            email: e.target.value
                                        }))}
                                        placeholder="Enter user email address"
                                        required
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content="Enter the recipient's email. If they don't have an account, an invitation will be sent."
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="transferAmount" value="Amount" />
                                    <TextInput
                                        id="transferAmount"
                                        type="number"
                                        step="0.00000001"
                                        min="0.00000001"
                                        max={reservedSupply}
                                        value={transferForm.amount}
                                        onChange={(e) => setTransferForm(prev => ({
                                            ...prev,
                                            amount: e.target.value
                                        }))}
                                        required
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content={`Enter the amount to transfer. Maximum: ${formatNumber(reservedSupply)}`}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="transferReason" value="Reason" />
                                    <TextInput
                                        id="transferReason"
                                        value={transferForm.reason}
                                        onChange={(e) => setTransferForm(prev => ({
                                            ...prev,
                                            reason: e.target.value
                                        }))}
                                        placeholder="Reason for transfer"
                                        data-tooltip-id="dashboard-tooltip"
                                        data-tooltip-content="Optionally, provide a reason for this transfer."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                    data-tooltip-id="dashboard-tooltip"
                                    data-tooltip-content="Transfer points from the reserve directly to a user's account or to an email address. If the user doesn't exist, they will be invited."
                                >
                                    Transfer to Email
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['ReserveTransaction', 'HandlePurchase', 'Beepurchase', 'HandleSales', 'Transactions', 'PendingTransfers', 'RefundTransfers', 'Invoices', 'Incentives'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab === 'ReserveTransaction' ? 'Recent Transactions' : 
                                     tab === 'HandlePurchase' ? 'Handle Purchases' : 
                                     tab === 'Beepurchase' ? 'Bee Purchase' : 
                                     tab === 'HandleSales' ? 'Handle Sales' : 
                                     tab === 'Transactions' ? 'Token Transactions' : 
                                     tab === 'PendingTransfers' ? 'Pending Transfers' : 
                                     tab === 'RefundTransfers' ? 'Refunded Transfers' : 
                                     tab === 'Incentives' ? 'Incentives' : 'Invoices'}
                                </button>
                            ))}
                        </nav>
                    </div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-800">Add Reserve</h3>
                                    <p className="text-2xl font-semibold text-green-900">
                                        {formatPoints(summary.add_reserve)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-800">Reduce Reserve</h3>
                                    <p className="text-2xl font-semibold text-red-900">
                                        {formatPoints(summary.reduce_reserve)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-800">Total Balance</h3>
                                    <p className="text-2xl font-semibold text-red-900">
                                        {formatPoints(summary.reserve_balance)}
                                    </p>
                                </div>
                            </div>
                    {/* Tab Content */}
                    {activeTab === 'ReserveTransaction' ? (
                        /* Recent Transactions */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Reason
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Invoice ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Admin
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                User/Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentTransactions.length > 0 ? (
                                            recentTransactions.map(transaction => (
                                                <tr key={transaction.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                transaction.transaction_type === 'reserve'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : transaction.transaction_type === 'release'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : transaction.transaction_type === 'transfer_to_user'
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                            data-tooltip-id="dashboard-tooltip"
                                                            data-tooltip-content={
                                                                transaction.transaction_type === 'reserve' ? 'Moved from circulating to reserve supply.' :
                                                                transaction.transaction_type === 'release' ? 'Moved from reserve to circulating supply.' :
                                                                transaction.transaction_type === 'transfer_to_user' ? 'Transferred from reserve to a user.' :
                                                                'Transaction type'
                                                            }
                                                        >
                                                            {transaction.transaction_type.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatNumber(transaction.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {transaction.reason || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {transaction.invoice?.invoice_number ? (
                                                            <button
                                                                onClick={() => openInvoice(transaction.invoice.id)}
                                                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                data-tooltip-id="dashboard-tooltip"
                                                                data-tooltip-content="Click to open invoice in a new tab"
                                                            >
                                                                {transaction.invoice.invoice_number}
                                                            </button>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {transaction.admin?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {transaction.transaction_type === 'transfer_to_user' && transaction.user ? (
                                                            <div>
                                                                <div className="font-medium">{transaction.user.name}</div>
                                                                <div className="text-xs text-gray-400">{transaction.user.email}</div>
                                                            </div>
                                                        ) : transaction.transaction_type === 'transfer_to_user' && transaction.recipient_email ? (
                                                            <div data-tooltip-id="dashboard-tooltip" data-tooltip-content="An invitation has been sent. The points will be credited once the user registers.">
                                                                <div className="font-medium text-gray-400">Pending Registration</div>
                                                                <div className="text-xs text-gray-400">{transaction.recipient_email}</div>
                                                            </div>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(transaction.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No recent transactions
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'HandlePurchase' ? (
                        /* Handle Purchases */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Handle Purchases</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleFilter} className="mb-6">
                                <div className="relative flex">
                                    <TextInput
                                        id="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search users by name or email..."
                                        className="w-full pr-12"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex">
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="px-3 text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bee Points</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {purchases.data.length > 0 ? (
                                            purchases.data.map((purchase) => (
                                                <tr key={purchase.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {purchase.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {purchase.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.bee_points_amount ? formatPoints(purchase.bee_points_amount) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.payment_method.toLowerCase() === 'bee' 
                                                            ? formatPoints(purchase.bee_points_amount)
                                                            : formatCurrency(purchase.amount, purchase.currency)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.payment_method === 'bee' ? 'EZ$' : purchase.payment_method}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.domain ? (
                                                            <a 
                                                                href={`http://${purchase.domain.url}`}
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {purchase.domain.url}
                                                                <span className="ml-1 text-xs text-gray-400">({purchase.domain.type})</span>
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(purchase.status)}`}>
                                                            {purchase.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(purchase.processed_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {purchase.invoice ? (
                                                            <a 
                                                                href={route('invoices.show', purchase.invoice.number)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {purchase.invoice.number}
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No purchases found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {purchases && purchases.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={purchases.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Beepurchase' ? (
                        /* Bee Purchase */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Bee Purchase</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleBeepurchaseFilter} className="mb-6">
                                <div className="relative flex">
                                    <TextInput
                                        id="beepurchaseSearch"
                                        value={beepurchaseSearch}
                                        onChange={(e) => setBeepurchaseSearch(e.target.value)}
                                        placeholder="Search users by name or email..."
                                        className="w-full pr-12"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex">
                                        {beepurchaseSearch && (
                                            <button
                                                type="button"
                                                onClick={resetBeepurchaseFilters}
                                                className="px-3 text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Point</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {beepurchases.data.length > 0 ? (
                                            beepurchases.data.map((beepurchases) => (
                                                <tr key={beepurchases.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {beepurchases.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {beepurchases.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatPoints(beepurchases.bee_points_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(beepurchases.fiat_amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(beepurchases.price_per_point)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(beepurchases.status)}`}>
                                                            {beepurchases.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {beepurchases.invoice_number ? (
                                                            <a 
                                                                href={route('point-purchases.show', beepurchases.invoice_number)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {beepurchases.invoice_number}
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(beepurchases.processed_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No purchases found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {beepurchases && beepurchases.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={beepurchases.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'HandleSales' ? (
                        /* Handle Sales */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Handle Sales</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleSalesFilter} className="mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            value={salesSearch}
                                            onChange={(e) => setSalesSearch(e.target.value)}
                                            placeholder="Search by buyer or seller email..."
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                                        </div>
                                        <SelectInput
                                            value={salesStatusFilter}
                                            onChange={(e) => setSalesStatusFilter(e.target.value)}
                                            className="pl-10 w-full"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </SelectInput>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Apply Filters
                                        </button>
                                        {(salesSearch || salesStatusFilter) && (
                                            <button
                                                type="button"
                                                onClick={resetSalesFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
							
                            {sales && sales.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faReceipt} className="text-gray-400 text-5xl mb-4" />
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">No sales found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Domain/Handle
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Invoice
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Seller Earnings
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Commission
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Method
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {sales.data.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {sale.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {sale.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {sale.domain ? (
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon 
                                                                    icon={sale.domain.type === 'custom' ? faLink : faGlobe} 
                                                                    className={`mr-2 ${sale.domain.type === 'custom' ? 'text-blue-400' : 'text-green-400'}`} 
                                                                />
                                                                <a 
                                                                    href={sale.domain.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm font-medium text-indigo-600 hover:underline"
                                                                >
                                                                    {sale.domain.url}
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {sale.invoice ? (
                                                            <Link 
                                                                href={`/invoices-sellhandle/${sale.invoice.number}`} 
                                                                target="_blank"
                                                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                                                            >
                                                                <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
                                                                {sale.invoice.number}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">N/A</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${formatAmount(sale.amount)} 
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-green-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${formatAmount(sale.seller_amount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-red-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${formatAmount(sale.commission)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-500 capitalize">
                                                            {sale.payment_method}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(sale.status)}
                                                            <span className="ml-2 text-sm text-gray-500 capitalize">
                                                                {sale.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 mr-2" />
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(sale.processed_at)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {sales && sales.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={sales.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Transactions' ? (
                        /* Token Transactions */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Token Transactions</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleTransactionFilter} className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            value={transactionSearch}
                                            onChange={(e) => setTransactionSearch(e.target.value)}
                                            placeholder="Search by user email..."
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                                        </div>
                                        <SelectInput
                                            value={transactionType}
                                            onChange={(e) => setTransactionType(e.target.value)}
                                            className="pl-10 w-full"
                                        >
                                            <option value="">All Types</option>
                                            <option value="purchase">Purchase</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="domain_purchase">Domain Purchase</option>
                                            <option value="domain_sale">Domain Sale</option>
                                            <option value="reserve">Reserve</option>
                                            <option value="release">Release</option>
                                        </SelectInput>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                        </div>
                                        <SelectInput
                                            value={dateRange}
                                            onChange={(e) => setDateRange(e.target.value)}
                                            className="pl-10 w-full"
                                        >
                                            <option value="">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="yesterday">Yesterday</option>
                                            <option value="this_week">This Week</option>
                                            <option value="last_week">Last Week</option>
                                            <option value="this_month">This Month</option>
                                            <option value='last_month'>Last Month</option>
                                        </SelectInput>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Apply Filters
                                        </button>
                                        {(transactionSearch || transactionType || dateRange) && (
                                            <button
                                                type="button"
                                                onClick={resetTransactionFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-800">Total Balance</h3>
                                    <p className="text-2xl font-semibold text-blue-900">
                                        {formatPoints(summary.total_balance)}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-800">Positive Balance</h3>
                                    <p className="text-2xl font-semibold text-green-900">
                                        {formatPoints(summary.positive_balance)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-800">Negative Balance</h3>
                                    <p className="text-2xl font-semibold text-red-900">
                                        {formatPoints(summary.negative_balance)}
                                    </p>
                                </div>
                            </div>
                            {transactions && transactions.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faFileInvoice} className="text-gray-400 text-5xl mb-4" />
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">No transactions found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Before</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transactions.data.length > 0 ? (
                                            transactions.data.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {transaction.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {transaction.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {formatPoints(transaction.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        {transaction.transaction_type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatPoints(transaction.balance_before)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatPoints(transaction.balance_after)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(transaction.created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {transactions && transactions.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={transactions.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'PendingTransfers' ? (
                        /* Pending Domain Transfers */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Pending Domain Transfers</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handlePendingTransfersFilter} className="mb-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            value={pendingTransfersSearch}
                                            onChange={(e) => setPendingTransfersSearch(e.target.value)}
                                            placeholder="Search by buyer or seller email..."
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                                        </div>
                                        <SelectInput
                                            value={pendingTransfersStatusFilter}
                                            onChange={(e) => setPendingTransfersStatusFilter(e.target.value)}
                                            className="pl-10 w-full"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value='completed'>Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </SelectInput>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Apply Filters
                                        </button>
                                        {(pendingTransfersSearch || pendingTransfersStatusFilter) && (
                                            <button
                                                type="button"
                                                onClick={resetPendingTransfersFilters}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {transfers && transfers.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faExchangeAlt} className="text-gray-400 text-5xl mb-4" />
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">No pending transfers found</h3>
                                    <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Domain/Handle
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Buyer
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Seller
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Seller Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Commission
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Expires
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transfers && transfers.data.map((transfer) => (
                                                <tr key={transfer.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon 
                                                                icon={transfer.domain.type === 'custom' ? faLink : faGlobe} 
                                                                className={`mr-2 ${transfer.domain.type === 'custom' ? 'text-blue-400' : 'text-green-400'}`} 
                                                            />
                                                            <a 
                                                                href={transfer.domain.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-indigo-600 hover:underline"
                                                            >
                                                                {transfer.domain.url}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {transfer.buyer ? (
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-900">
                                                                    {transfer.buyer.email}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Unknown</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {transfer.seller ? (
                                                            <div className="flex items-center">
                                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-900">
                                                                    {transfer.seller.email}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">Unknown</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${transfer.amount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-green-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${transfer.seller_amount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCoins} className="text-red-500 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                EZ${transfer.commission.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            transfer.status === 'completed' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : transfer.status === 'rejected'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {transfer.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 mr-2" />
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(transfer.expires_at)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {transfers && transfers.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={transfers.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'RefundTransfers' ? (
                        /* Refunded Transfers */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Refunded Transfers</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleRefundTransfersFilter} className="mb-6">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                  </div>
                                  <TextInput
                                    type="text"
                                    value={refundTransfersSearch}
                                    onChange={(e) => setRefundTransfersSearch(e.target.value)}
                                    placeholder="Search by email or invoice number..."
                                    className="pl-10 w-full"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                  >
                                    Search
                                  </button>
                                  {refundTransfersSearch && (
                                    <button
                                      type="button"
                                      onClick={resetRefundTransfersFilters}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                    >
                                      <FontAwesomeIcon icon={faTimesCircle} />
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>
                            </form>
                      
                            {refundtransfers && refundtransfers.data.length === 0 ? (
                              <div className="text-center py-12">
                                <FontAwesomeIcon icon={faUndo} className="text-gray-400 text-5xl mb-4" />
                                <h3 className="text-xl font-medium text-gray-300 mb-2">No refunded transfers found</h3>
                                <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Domain/Handle
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Buyer
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Seller
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoices
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Original Amount
                                      </th>
                                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Refund Amount
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Processed At
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {refundtransfers && refundtransfers.data.map((transfer) => (
                                      <tr key={transfer.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <FontAwesomeIcon 
                                              icon={transfer.domain.type === 'custom' ? faLink : faGlobe} 
                                              className={`mr-2 ${transfer.domain.type === 'custom' ? 'text-blue-400' : 'text-green-400'}`} 
                                            />
                                            <a 
                                              href={transfer.domain.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-sm font-medium text-indigo-600 hover:underline"
                                            >
                                              {transfer.domain.url}
                                            </a>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {transfer.buyer ? (
                                            <div className="flex items-center">
                                              <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                              <span className="text-sm text-gray-500">
                                                {transfer.buyer.email}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-sm text-gray-400">Unknown</span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {transfer.seller ? (
                                            <div className="flex items-center">
                                              <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                              <span className="text-sm text-gray-500">
                                                {transfer.seller.email}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-sm text-gray-400">Unknown</span>
                                          )}
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="flex flex-col gap-1">
                                            {transfer.invoices.length > 0 ? (
												transfer.invoices.map((invoice) => (
													<Link 
														key={invoice.number}
														href={getInvoiceLink(invoice)}
														target="_blank"
														className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
													>
														<FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
														{invoice.number} ({invoice.type})
													</Link>
												))
											) : (
												<span className="text-sm text-gray-400">N/A</span>
											)}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                              EZ${formatAmount(transfer.original_amount)}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCoins} className="text-teal-500 mr-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                              EZ${formatAmount(transfer.refund_amount)}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 mr-2" />
                                            <span className="text-sm text-gray-500">
                                              {formatDate(transfer.processed_at)}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                      
                            {refundtransfers && refundtransfers.data.length > 0 && (
                              <div className="mt-6">
                                <Pagination links={refundtransfers.links} />
                              </div>
                            )}
                        </div>
                    ) : activeTab === 'Invoices' ? (
                        /* Invoices */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Invoices</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleInvoicesFilter} className="mb-6">
                                <div className="relative flex">
                                    <TextInput
                                        id="invoicesSearch"
                                        value={invoicesSearch}
                                        onChange={(e) => setInvoicesSearch(e.target.value)}
                                        placeholder="Search by invoice number or user..."
                                        className="w-full pr-12"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex">
                                        {invoicesSearch && (
                                            <button
                                                type="button"
                                                onClick={resetInvoicesFilters}
                                                className="px-3 text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoices && invoices.data.length > 0 ? (
                                            invoices.data.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {invoice.invoice_number}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {getInvoiceTypeBadge(invoice.type)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {invoice.user ? (
                                                            <div>
                                                                <div className="font-medium">{invoice.user.name}</div>
                                                                <div className="text-xs text-gray-400">{invoice.user.email}</div>
                                                            </div>
                                                        ) : (
                                                            'System'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(invoice.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {invoice.issue_date ? formatDate(invoice.issue_date) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => openInvoice(invoice.invoice_number)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                            data-tooltip-id="dashboard-tooltip"
                                                            data-tooltip-content="View invoice details"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} size="sm" />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No invoices found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {invoices && invoices.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={invoices.links} />
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Incentives' ? (
                        /* Incentive Transactions */
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Incentive History</h3>
                            
                            {/* Filter Form */}
                            <form onSubmit={handleIncentivesFilter} className="mb-6">
                                <div className="relative flex">
                                    <TextInput
                                        id="incentivesSearch"
                                        value={incentivesSearch}
                                        onChange={(e) => setIncentivesSearch(e.target.value)}
                                        placeholder="Search by invoice number..."
                                        className="w-full pr-12"
                                    />
                                    <div className="absolute right-0 top-0 h-full flex">
                                        {incentivesSearch && (
                                            <button
                                                type="button"
                                                onClick={resetIncentivesFilters}
                                                className="px-3 text-gray-500 hover:text-gray-700"
                                                aria-label="Clear search"
                                            >
                                                ×
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributed At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {incentives && incentives.data.length > 0 ? (
                                            incentives.data.map((incentive) => (
                                                <tr key={incentive.incentive_history_id || incentive.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {incentive.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {incentive.user?.email || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(incentive.fiat_amount || incentive.amount || 0, 'EZ$')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {incentive.invoice_number ? (
                                                            <a 
                                                                href={route('incentive-history.invoice', incentive.invoice_number)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {incentive.invoice_number}
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        {incentive.incentive_type ? incentive.incentive_type.replace(/_/g, ' ') : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(incentive.status)}`}>
                                                            {incentive.status || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(incentive.distributed_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No incentive history found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {incentives && incentives.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination links={incentives.links} />
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}