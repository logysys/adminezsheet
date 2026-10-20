import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AuthenticatedLayout';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

export default function Index({ 
    conversations, 
    filters, 
    stats, 
    filterOptions 
}) {
    const [selectedConversations, setSelectedConversations] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [modelFilter, setModelFilter] = useState(filters.model || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ? new Date(filters.date_from) : null);
    const [dateTo, setDateTo] = useState(filters.date_to ? new Date(filters.date_to) : null);
    const [userId, setUserId] = useState(filters.user_id || '');
    const [minTokens, setMinTokens] = useState(filters.min_tokens || '');
    const [maxTokens, setMaxTokens] = useState(filters.max_tokens || '');
    const [perPage, setPerPage] = useState(filters.per_page || 15);
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [deletingConversation, setDeletingConversation] = useState(null);
    const [statusUpdateConversation, setStatusUpdateConversation] = useState(null);
    const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
    const [bulkStatusMode, setBulkStatusMode] = useState(false);
    const [newStatus, setNewStatus] = useState('public');
    const [processing, setProcessing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [localConversations, setLocalConversations] = useState(conversations);
    const [isDragging, setIsDragging] = useState(false);
    
    // New state for pin functionality
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinUpdateConversation, setPinUpdateConversation] = useState(null);
    const [bulkPinMode, setBulkPinMode] = useState(false);
    const [pinAction, setPinAction] = useState('pin'); // 'pin' or 'unpin'

    // Per page options
    const perPageOptions = [10, 15, 30, 60, 100];

    // Update local conversations when props change
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // Handle select all
    useEffect(() => {
        if (selectAll) {
            const allIds = conversations.data.map(c => c.conversation_id);
            setSelectedConversations(allIds);
        } else {
            setSelectedConversations([]);
        }
    }, [selectAll, conversations.data]);

    // Handle individual selection
    const handleSelect = (conversationId) => {
        setSelectedConversations(prev => {
            if (prev.includes(conversationId)) {
                return prev.filter(id => id !== conversationId);
            } else {
                return [...prev, conversationId];
            }
        });
        setSelectAll(false);
    };

    // Apply filters
    const applyFilters = () => {
        const params = {};
        
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (modelFilter) params.model = modelFilter;
        if (dateFrom) params.date_from = dateFrom.toISOString().split('T')[0];
        if (dateTo) params.date_to = dateTo.toISOString().split('T')[0];
        if (userId) params.user_id = userId;
        if (minTokens) params.min_tokens = minTokens;
        if (maxTokens) params.max_tokens = maxTokens;
        if (perPage) params.per_page = perPage;

        router.get(route('ai-history.index'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setModelFilter('');
        setDateFrom(null);
        setDateTo(null);
        setUserId('');
        setMinTokens('');
        setMaxTokens('');
        setPerPage(15);
        
        router.get(route('ai-history.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle per page change
    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        // Apply filters with new per page value
        const params = {};
        
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (modelFilter) params.model = modelFilter;
        if (dateFrom) params.date_from = dateFrom.toISOString().split('T')[0];
        if (dateTo) params.date_to = dateTo.toISOString().split('T')[0];
        if (userId) params.user_id = userId;
        if (minTokens) params.min_tokens = minTokens;
        if (maxTokens) params.max_tokens = maxTokens;
        params.per_page = newPerPage;

        router.get(route('ai-history.index'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Handle conversation deletion
    const handleDelete = (conversation) => {
        setDeletingConversation(conversation);
        setBulkDeleteMode(false);
        setShowDeleteModal(true);
    };

    // Handle status update (single)
    const handleStatusChange = (conversation) => {
        setStatusUpdateConversation(conversation);
        setNewStatus(conversation.status || 'public');
        setBulkStatusMode(false);
        setShowStatusModal(true);
    };

    // Handle pin/unpin (single)
    const handlePinToggle = (conversation) => {
        setPinUpdateConversation(conversation);
        setPinAction(conversation.pinned ? 'unpin' : 'pin');
        setBulkPinMode(false);
        setShowPinModal(true);
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedConversations.length === 0) return;
        setBulkDeleteMode(true);
        setShowDeleteModal(true);
    };

    // Handle bulk status update
    const handleBulkStatusUpdate = () => {
        if (selectedConversations.length === 0) return;
        setBulkStatusMode(true);
        setNewStatus('public');
        setShowStatusModal(true);
    };

    // Handle bulk pin
    const handleBulkPin = () => {
        if (selectedConversations.length === 0) return;
        
        // Check if any selected conversation is hidden
        const hasHiddenConversations = conversations.data.some(c => 
            selectedConversations.includes(c.conversation_id) && c.status === 'hidden'
        );
        
        if (hasHiddenConversations) {
            alert('Cannot pin hidden conversations. Please unselect hidden conversations or change their status first.');
            return;
        }
        
        setBulkPinMode(true);
        setPinAction('pin');
        setShowPinModal(true);
    };

    // Handle bulk unpin
    const handleBulkUnpin = () => {
        if (selectedConversations.length === 0) return;
        
        // Check if any selected conversation is hidden
        const hasHiddenConversations = conversations.data.some(c => 
            selectedConversations.includes(c.conversation_id) && c.status === 'hidden'
        );
        
        if (hasHiddenConversations) {
            alert('Cannot unpin hidden conversations. Please unselect hidden conversations or change their status first.');
            return;
        }
        
        setBulkPinMode(true);
        setPinAction('unpin');
        setShowPinModal(true);
    };

    // Handle manual reordering with arrow buttons
    const movePinnedItem = (index, direction) => {
        // Get all pinned conversations
        const pinnedItems = localConversations.data.filter(item => item.pinned && item.status !== 'hidden');
        const pinnedIndices = localConversations.data.reduce((acc, item, idx) => {
            if (item.pinned && item.status !== 'hidden') {
                acc.push(idx);
            }
            return acc;
        }, []);
        
        const pinnedIndex = pinnedIndices.indexOf(index);
        
        if (
            (direction === 'up' && pinnedIndex === 0) || 
            (direction === 'down' && pinnedIndex === pinnedItems.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' 
            ? pinnedIndices[pinnedIndex - 1] 
            : pinnedIndices[pinnedIndex + 1];

        // Swap the items
        const items = Array.from(localConversations.data);
        [items[index], items[newIndex]] = [items[newIndex], items[index]];

        // Update local state optimistically
        setLocalConversations({
            ...localConversations,
            data: items
        });

        // Get the IDs of pinned conversations in new order
        const pinnedIds = items
            .filter(item => item.pinned && item.status !== 'hidden')
            .map(item => item.conversation_id);

        // Send new order to server
        updatePinnedOrder(pinnedIds);
    };

    // Handle drag end for reordering pinned conversations
    const handleDragEnd = async (result) => {
        setIsDragging(false);
        
        if (!result.destination) return;
        
        // Only allow reordering of pinned items
        const sourceItem = localConversations.data[result.source.index];
        if (!sourceItem.pinned || sourceItem.status === 'hidden') return;
        
        const destinationItem = localConversations.data[result.destination.index];
        if (!destinationItem.pinned || destinationItem.status === 'hidden') return;
        
        const items = Array.from(localConversations.data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        // Update local state optimistically
        setLocalConversations({
            ...localConversations,
            data: items
        });

        // Get the IDs of pinned conversations in new order
        const pinnedIds = items
            .filter(item => item.pinned && item.status !== 'hidden')
            .map(item => item.conversation_id);

        // Send new order to server
        updatePinnedOrder(pinnedIds);
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    // Helper function to update pinned order
    const updatePinnedOrder = async (pinnedIds) => {
        try {
            const response = await axios.post(route('ai-history.update-pinned-order'), {
                ordered_ids: pinnedIds
            });

            if (!response.data.success) {
                throw new Error('Failed to update order');
            }
        } catch (error) {
            console.error('Failed to update pinned order:', error);
            alert('Failed to update pinned order. Please try again.');
            // Revert to original data
            setLocalConversations(conversations);
        }
    };

    // Confirm delete
    const confirmDelete = async () => {
        setProcessing(true);

        try {
            if (bulkDeleteMode) {
                // Bulk delete
                const response = await axios.post(route('ai-history.bulk-destroy'), {
                    conversation_ids: selectedConversations
                });

                if (response.data.success) {
                    // Refresh the page
                    router.reload();
                }
            } else {
                // Single delete
                const response = await axios.delete(route('ai-history.destroy', deletingConversation.conversation_id));

                if (response.data.success) {
                    // Refresh the page
                    router.reload();
                }
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete conversation(s). Please try again.');
        } finally {
            setProcessing(false);
            setShowDeleteModal(false);
            setDeletingConversation(null);
            setSelectedConversations([]);
        }
    };

    // Confirm status update
    const confirmStatusUpdate = async () => {
        setProcessing(true);

        try {
            if (bulkStatusMode) {
                // Bulk status update - we need to update each conversation
                const promises = selectedConversations.map(conversationId => 
                    axios.patch(route('ai-history.update-status', conversationId), {
                        status: newStatus
                    })
                );
                
                await Promise.all(promises);
                
                // Refresh the page
                router.reload();
            } else {
                // Single status update
                const response = await axios.patch(route('ai-history.update-status', statusUpdateConversation.conversation_id), {
                    status: newStatus
                });

                if (response.data.success) {
                    // Refresh the page
                    router.reload();
                }
            }
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setProcessing(false);
            setShowStatusModal(false);
            setStatusUpdateConversation(null);
            setBulkStatusMode(false);
            setSelectedConversations([]);
        }
    };

    // Confirm pin/unpin
    const confirmPinUpdate = async () => {
        setProcessing(true);

        try {
            if (bulkPinMode) {
                // Bulk pin/unpin
                const routeName = pinAction === 'pin' ? 'ai-history.bulk-pin' : 'ai-history.bulk-unpin';
                const response = await axios.post(route(routeName), {
                    conversation_ids: selectedConversations
                });

                if (response.data.success) {
                    // Refresh the page
                    router.reload();
                }
            } else {
                // Single pin/unpin
                const routeName = pinAction === 'pin' ? 'ai-history.pin' : 'ai-history.unpin';
                const response = await axios.patch(route(routeName, pinUpdateConversation.conversation_id));

                if (response.data.success) {
                    // Refresh the page
                    router.reload();
                }
            }
        } catch (error) {
            console.error('Pin update failed:', error);
            alert(`Failed to ${pinAction} conversation(s). Please try again.`);
        } finally {
            setProcessing(false);
            setShowPinModal(false);
            setPinUpdateConversation(null);
            setBulkPinMode(false);
            setSelectedConversations([]);
        }
    };

    // Handle inline status update (from dropdown)
    const handleInlineStatusUpdate = async (conversationId, newStatus) => {
        try {
            const response = await axios.patch(route('ai-history.update-status', conversationId), {
                status: newStatus
            });

            if (response.data.success) {
                // Update local state or refresh
                router.reload({ only: ['conversations'] });
            }
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    // Handle export
    const handleExport = async () => {
        setExporting(true);
        
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (modelFilter) params.model = modelFilter;
            if (dateFrom) params.date_from = dateFrom.toISOString().split('T')[0];
            if (dateTo) params.date_to = dateTo.toISOString().split('T')[0];

            const response = await axios.get(route('ai-history.export'), { params, responseType: 'blob' });

            // Create download
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `ai-conversations-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch(status) {
            case 'public':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Public</span>;
            case 'private':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Private</span>;
            case 'hidden':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Hidden</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    // Check if any hidden conversations are selected (for bulk actions)
    const hasHiddenSelected = () => {
        return conversations.data.some(c => 
            selectedConversations.includes(c.conversation_id) && c.status === 'hidden'
        );
    };

    // Format cost
    const formatCost = (cost) => {
        if (cost === undefined || cost === null) return '0.0000';
        return Number(cost).toFixed(4);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        AI Conversation History
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            data-tooltip-id="main-tooltip"
                            data-tooltip-content="Export filtered conversations"
                        >
                            {exporting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                    </svg>
                                    Export
                                </>
                            )}
                        </button>
                        <Link
                            href={route('ai-history.statistics')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            data-tooltip-id="main-tooltip"
                            data-tooltip-content="View detailed statistics"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            Statistics
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin - AI Conversation History" />

            <Tooltip 
                id="main-tooltip"
                place="top"
                className="!bg-gray-900 !text-white !text-xs !px-3 !py-2 !rounded-lg !z-[100] !shadow-xl"
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">Total Conversations</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats?.total_conversations || 0}</p>
                                </div>
                                <div className="ml-4">
                                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                <span className="text-green-600 font-medium mr-2">↑ {stats?.today_conversations || 0} today</span>
                                <span>• {stats?.this_week_conversations || 0} this week</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">Total Messages</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats?.total_messages || 0}</p>
                                </div>
                                <div className="ml-4">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Avg {stats?.avg_messages_per_conversation || 0} messages per conversation
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">Total Tokens</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats?.total_tokens?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="ml-4">
                                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Avg {stats?.avg_tokens_per_message || 0} tokens per message
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">Total Cost</p>
                                    <p className="text-2xl font-semibold text-gray-900">${stats?.total_cost || '0.00'}</p>
                                </div>
                                <div className="ml-4">
                                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                {stats?.unique_users || 0} users • {stats?.unique_sessions || 0} sessions
                            </div>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h3>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-sm text-gray-600">Public: {stats?.status_counts?.public || 0}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                <span className="text-sm text-gray-600">Private: {stats?.status_counts?.private || 0}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                <span className="text-sm text-gray-600">Hidden: {stats?.status_counts?.hidden || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                            <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </div>
                        
                        {showFilters && (
                            <div className="p-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Search */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by title, query, user..."
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="">All Statuses</option>
                                            {filterOptions?.statuses?.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Model */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                        <select
                                            value={modelFilter}
                                            onChange={(e) => setModelFilter(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="">All Models</option>
                                            {filterOptions?.models?.map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date From */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                                        <DatePicker
                                            selected={dateFrom}
                                            onChange={(date) => setDateFrom(date)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            placeholderText="Select start date"
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>

                                    {/* Date To */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                                        <DatePicker
                                            selected={dateTo}
                                            onChange={(date) => setDateTo(date)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            placeholderText="Select end date"
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>

                                    {/* User ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                        <input
                                            type="text"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            placeholder="Enter user ID"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Min Tokens */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Tokens</label>
                                        <input
                                            type="number"
                                            value={minTokens}
                                            onChange={(e) => setMinTokens(e.target.value)}
                                            placeholder="Minimum tokens"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Max Tokens */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                                        <input
                                            type="number"
                                            value={maxTokens}
                                            onChange={(e) => setMaxTokens(e.target.value)}
                                            placeholder="Maximum tokens"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Per Page */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
                                        <select
                                            value={perPage}
                                            onChange={(e) => setPerPage(Number(e.target.value))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        >
                                            {perPageOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pinned Order Info */}
                    {localConversations?.data?.some(c => c.pinned) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center text-sm text-yellow-700">
                                <span className="mr-2">📌</span>
                                <span>
                                    <strong>Tip:</strong> Use the ↑↓ arrows to reorder pinned conversations, or drag the ⋮⋮ handle. 
                                    Only visible pinned conversations can be reordered.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Bulk Actions */}
                    {selectedConversations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                            <span className="text-sm text-blue-700">
                                {selectedConversations.length} conversation(s) selected
                                {hasHiddenSelected() && (
                                    <span className="ml-2 text-red-600 text-xs">
                                        (Includes hidden conversations - pin/unpin disabled)
                                    </span>
                                )}
                            </span>
                            <div className="flex space-x-2">
                                {!hasHiddenSelected() ? (
                                    <>
                                        <button
                                            onClick={handleBulkPin}
                                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
                                            data-tooltip-id="main-tooltip"
                                            data-tooltip-content="📌 Pin selected conversations"
                                        >
                                            <span className="mr-1" role="img" aria-label="Pin">📌</span>
                                            Pin Selected
                                        </button>
                                        <button
                                            onClick={handleBulkUnpin}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                                            data-tooltip-id="main-tooltip"
                                            data-tooltip-content="📌 Unpin selected conversations"
                                        >
                                            <span className="mr-1" role="img" aria-label="Unpin">📌</span>
                                            Unpin Selected
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative group">
                                            <button
                                                disabled
                                                className="inline-flex items-center px-4 py-2 bg-yellow-300 text-white rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                                            >
                                                <span className="mr-1" role="img" aria-label="Pin">📌</span>
                                                Pin Selected
                                            </button>
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                Cannot pin/unpin hidden conversations
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                disabled
                                                className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                                            >
                                                <span className="mr-1" role="img" aria-label="Unpin">📌</span>
                                                Unpin Selected
                                            </button>
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                Cannot pin/unpin hidden conversations
                                            </div>
                                        </div>
                                    </>
                                )}
                                <button
                                    onClick={handleBulkStatusUpdate}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                >
                                    Change Status
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                                >
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Conversations Table with Drag and Drop */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <DragDropContext 
                                onDragEnd={handleDragEnd}
                                onDragStart={handleDragStart}
                            >
                                <Droppable droppableId="conversations">
                                    {(provided) => (
                                        <table 
                                            className="min-w-full divide-y divide-gray-200"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={() => setSelectAll(!selectAll)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center">
                                                            <span className="mr-1">📌</span>
                                                            Pin
                                                            {localConversations?.data?.some(c => c.pinned) && (
                                                                <span className="ml-2 text-xs font-normal text-gray-400">
                                                                    (Drag ⋮⋮ or use ↑↓)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversation</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {localConversations?.data?.map((conversation, index) => (
                                                    <Draggable
                                                        key={conversation.id}
                                                        draggableId={conversation.id.toString()}
                                                        index={index}
                                                        isDragDisabled={!conversation.pinned || conversation.status === 'hidden' || isDragging}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <tr
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`
                                                                    hover:bg-gray-50 
                                                                    ${conversation.pinned ? 'bg-yellow-50' : ''}
                                                                    ${snapshot.isDragging ? 'shadow-lg bg-yellow-100' : ''}
                                                                    ${!conversation.pinned || conversation.status === 'hidden' ? '' : 'cursor-move'}
                                                                `}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedConversations.includes(conversation.conversation_id)}
                                                                        onChange={() => handleSelect(conversation.conversation_id)}
                                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center space-x-1">
                                                                        {conversation.status === 'hidden' ? (
                                                                            <span 
                                                                                className="text-gray-300 text-lg cursor-not-allowed opacity-50"
                                                                                data-tooltip-id="main-tooltip"
                                                                                data-tooltip-content="Cannot pin hidden conversations"
                                                                            >
                                                                                📌
                                                                            </span>
                                                                        ) : conversation.pinned ? (
                                                                            <>
                                                                                {/* Large arrow buttons for manual reordering */}
                                                                                <div className="flex flex-col mr-2">
                                                                                    <button
                                                                                        onClick={() => movePinnedItem(index, 'up')}
                                                                                        disabled={index === 0 || !localConversations.data[index - 1]?.pinned || localConversations.data[index - 1]?.status === 'hidden'}
                                                                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold leading-5"
                                                                                        title="Move up"
                                                                                    >
                                                                                        ↑
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => movePinnedItem(index, 'down')}
                                                                                        disabled={index === localConversations.data.length - 1 || !localConversations.data[index + 1]?.pinned || localConversations.data[index + 1]?.status === 'hidden'}
                                                                                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold leading-5"
                                                                                        title="Move down"
                                                                                    >
                                                                                        ↓
                                                                                    </button>
                                                                                </div>
                                                                                {/* Drag handle */}
                                                                                <div
                                                                                    {...provided.dragHandleProps}
                                                                                    className="mr-1 text-gray-400 hover:text-gray-600"
                                                                                    data-tooltip-id="main-tooltip"
                                                                                    data-tooltip-content="Drag to reorder"
                                                                                >
                                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                                                                    </svg>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handlePinToggle(conversation)}
                                                                                    className="focus:outline-none transition-colors duration-200"
                                                                                    data-tooltip-id="main-tooltip"
                                                                                    data-tooltip-content="📌 Unpin conversation"
                                                                                >
                                                                                    <span className="text-yellow-500 text-xl" role="img" aria-label="Pinned">📌</span>
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => handlePinToggle(conversation)}
                                                                                className="focus:outline-none transition-colors duration-200 ml-7"
                                                                                data-tooltip-id="main-tooltip"
                                                                                data-tooltip-content="📌 Pin conversation"
                                                                            >
                                                                                <span className="text-gray-400 hover:text-yellow-500 text-xl cursor-pointer" role="img" aria-label="Unpinned">📌</span>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col">
                                                                        <div className="flex items-center">
                                                                            <Link
                                                                                href={route('ai-history.show', conversation.conversation_id)}
                                                                                className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline"
                                                                            >
                                                                                {conversation.conversation_title || 'Untitled Conversation'}
                                                                            </Link>
                                                                            {conversation.pinned && (
                                                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                                    📌 Pinned #{conversation.pinned_order || '?'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                            {conversation.query}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {conversation.user ? (
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium text-gray-900">{conversation.user.name}</span>
                                                                            <span className="text-xs text-gray-500">{conversation.user.email}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500">Guest</span>
                                                                    )}
                                                                    {conversation.ip_address && (
                                                                        <span className="text-xs text-gray-400 block mt-1">{conversation.ip_address}</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {conversation.message_count}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {conversation.total_tokens?.toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    ${formatCost(conversation.conversation_cost)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {conversation.model}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <select
                                                                        value={conversation.status || 'public'}
                                                                        onChange={(e) => handleInlineStatusUpdate(conversation.conversation_id, e.target.value)}
                                                                        className="text-xs border-0 bg-transparent focus:ring-0 cursor-pointer"
                                                                        data-tooltip-id="main-tooltip"
                                                                        data-tooltip-content="Change status"
                                                                    >
                                                                        <option value="public">Public</option>
                                                                        <option value="private">Private</option>
                                                                        <option value="hidden">Hidden</option>
                                                                    </select>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <div className="flex flex-col">
                                                                        <span>{conversation.created_at_formatted}</span>
                                                                        <span className="text-xs text-gray-400">Updated: {conversation.updated_at_formatted}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Link
                                                                            href={route('ai-history.show', conversation.conversation_id)}
                                                                            className="text-blue-600 hover:text-blue-900"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="View conversation"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                                            </svg>
                                                                        </Link>
                                                                        <a
                                                                            href={conversation.share_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-green-600 hover:text-green-900"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="View public page"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                                                            </svg>
                                                                        </a>
                                                                        {conversation.status !== 'hidden' && (
                                                                            <button
                                                                                onClick={() => handlePinToggle(conversation)}
                                                                                className={`${conversation.pinned ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'} text-lg`}
                                                                                data-tooltip-id="main-tooltip"
                                                                                data-tooltip-content={conversation.pinned ? '📌 Unpin conversation' : '📌 Pin conversation'}
                                                                            >
                                                                                📌
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleStatusChange(conversation)}
                                                                            className="text-yellow-600 hover:text-yellow-900"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="Change status"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                                                                            </svg>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(conversation)}
                                                                            className="text-red-600 hover:text-red-900"
                                                                            data-tooltip-id="main-tooltip"
                                                                            data-tooltip-content="Delete conversation"
                                                                        >
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </tbody>
                                        </table>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>

                        {/* Pagination */}
                        {conversations?.links && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{conversations.from}</span> to{' '}
                                        <span className="font-medium">{conversations.to}</span> of{' '}
                                        <span className="font-medium">{conversations.total}</span> results
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Per page selector */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Show:</span>
                                            <select
                                                value={perPage}
                                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                                className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                {perPageOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Pagination links */}
                                        <div className="flex space-x-2">
                                            {conversations.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (link.url && !link.active) {
                                                            router.get(link.url, {}, { preserveState: true });
                                                        }
                                                    }}
                                                    disabled={!link.url}
                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                {bulkDeleteMode ? 'Delete Conversations' : 'Delete Conversation'}
                            </h3>
                            
                            <p className="text-sm text-gray-500 text-center mb-6">
                                {bulkDeleteMode
                                    ? `Are you sure you want to delete ${selectedConversations.length} conversation(s)? This action cannot be undone.`
                                    : `Are you sure you want to delete "${deletingConversation?.conversation_title}"? This action cannot be undone.`
                                }
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeletingConversation(null);
                                        setBulkDeleteMode(false);
                                    }}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                                </svg>
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                {bulkStatusMode ? 'Change Status' : 'Change Conversation Status'}
                            </h3>
                            
                            <p className="text-sm text-gray-500 text-center mb-4">
                                {bulkStatusMode
                                    ? `Update status for ${selectedConversations.length} conversation(s)`
                                    : `Update status for "${statusUpdateConversation?.conversation_title}"`
                                }
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <label className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="public"
                                            checked={newStatus === 'public'}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${
                                            newStatus === 'public'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                            Public
                                        </span>
                                    </label>
                                    <label className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="private"
                                            checked={newStatus === 'private'}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${
                                            newStatus === 'private'
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                            Private
                                        </span>
                                    </label>
                                    <label className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="hidden"
                                            checked={newStatus === 'hidden'}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${
                                            newStatus === 'hidden'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                            Hidden
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={confirmStatusUpdate}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setStatusUpdateConversation(null);
                                        setBulkStatusMode(false);
                                    }}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pin Modal - Updated with 📌 emoji */}
            {showPinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
                                <span className="text-2xl" role="img" aria-label="Pin">📌</span>
                            </div>
                            
                            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                {bulkPinMode 
                                    ? (pinAction === 'pin' ? '📌 Pin Conversations' : '📌 Unpin Conversations')
                                    : (pinAction === 'pin' ? '📌 Pin Conversation' : '📌 Unpin Conversation')
                                }
                            </h3>
                            
                            <p className="text-sm text-gray-500 text-center mb-6">
                                {bulkPinMode
                                    ? `Are you sure you want to ${pinAction} ${selectedConversations.length} conversation(s)?`
                                    : `Are you sure you want to ${pinAction} "${pinUpdateConversation?.conversation_title}"?`
                                }
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={confirmPinUpdate}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : (pinAction === 'pin' ? '📌 Pin' : '📌 Unpin')}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPinModal(false);
                                        setPinUpdateConversation(null);
                                        setBulkPinMode(false);
                                    }}
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}