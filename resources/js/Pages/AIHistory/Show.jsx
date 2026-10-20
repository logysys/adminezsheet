import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AuthenticatedLayout';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function Show({ conversation, messages }) {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageAction, setMessageAction] = useState(null);
    const [updatingMessage, setUpdatingMessage] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Handle conversation status update
    const handleStatusUpdate = async (newStatus) => {
        setUpdatingStatus(true);
        
        try {
            const response = await axios.patch(
                route('ai-history.update-status', conversation.id),
                { status: newStatus }
            );

            if (response.data.success) {
                // Update local state or refresh
                router.reload({ only: ['conversation'] });
            }
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Handle message status update
    const handleMessageStatus = async (message, newStatus) => {
        setUpdatingMessage(message.id);
        
        try {
            const response = await axios.patch(
                route('ai-history.update-message-status', message.slug),
                { status: newStatus }
            );

            if (response.data.success) {
                // Update local state
                router.reload({ only: ['messages'] });
            }
        } catch (error) {
            console.error('Message status update failed:', error);
            alert('Failed to update message status. Please try again.');
        } finally {
            setUpdatingMessage(null);
        }
    };

    // Handle message deletion
    const handleMessageDelete = async (message) => {
        if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }
        
        setUpdatingMessage(message.id);
        
        try {
            const response = await axios.delete(
                route('ai-history.delete-message', message.slug)
            );

            if (response.data.success) {
                // Remove message from list or refresh
                router.reload({ only: ['messages', 'conversation'] });
            }
        } catch (error) {
            console.error('Message deletion failed:', error);
            alert('Failed to delete message. Please try again.');
        } finally {
            setUpdatingMessage(null);
        }
    };

    // Handle conversation deletion
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this entire conversation? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await axios.delete(
                route('ai-history.destroy', conversation.id)
            );

            if (response.data.success) {
                router.visit(route('ai-history.index'));
            }
        } catch (error) {
            console.error('Conversation deletion failed:', error);
            alert('Failed to delete conversation. Please try again.');
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

    // Get role badge
    const getRoleBadge = (role) => {
        switch(role) {
            case 'user':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">User</span>;
            case 'assistant':
                return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Assistant</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">System</span>;
        }
    };

    // Format JSON for display
    const formatJson = (data) => {
        if (!data) return 'None';
        return JSON.stringify(data, null, 2);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('ai-history.index')}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Conversation: {conversation.title}
                        </h2>
                        {getStatusBadge(conversation.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                        <a
                            href={`/X/${messages[0]?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                            View Public
                        </a>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Admin - Conversation: ${conversation.title}`} />

            <Tooltip 
                id="main-tooltip"
                place="top"
                className="!bg-gray-900 !text-white !text-xs !px-3 !py-2 !rounded-lg !z-[100] !shadow-xl"
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Conversation Info */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</p>
                                    <p className="mt-1 text-sm text-gray-900">{conversation.created_at_formatted}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</p>
                                    <p className="mt-1 text-sm text-gray-900">{conversation.updated_at_formatted}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</p>
                                    <p className="mt-1 text-sm text-gray-900">{conversation.message_count}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</p>
                                    <p className="mt-1 text-sm text-gray-900">${conversation.total_cost}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* User Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">User Information</h4>
                                    {conversation.user ? (
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium">Name:</span> {conversation.user.name}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Email:</span> {conversation.user.email}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">ID:</span> {conversation.user.id}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Guest User</p>
                                    )}
                                </div>

                                {/* Session Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Session Information</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Session ID:</span> {conversation.session_id || 'N/A'}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">IP Address:</span> {conversation.ip_address || 'N/A'}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">User Agent:</span> 
                                            <span className="block text-xs text-gray-500 mt-1 break-all">{conversation.user_agent || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Token Stats */}
                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Token Usage</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Prompt Tokens</p>
                                        <p className="text-lg font-semibold text-gray-900">{conversation.token_breakdown.prompt_tokens.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Completion Tokens</p>
                                        <p className="text-lg font-semibold text-gray-900">{conversation.token_breakdown.completion_tokens.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total Tokens</p>
                                        <p className="text-lg font-semibold text-gray-900">{conversation.total_tokens.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Controls */}
                            <div className="mt-4 flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700">Change Status:</span>
                                <select
                                    value={conversation.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={updatingStatus}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                                {updatingStatus && (
                                    <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Messages ({messages.length})</h3>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {messages.map((message, index) => (
                                <div key={message.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            {getRoleBadge(message.message_role)}
                                            <span className="text-sm text-gray-500">
                                                {message.created_at_formatted}
                                            </span>
                                            {getStatusBadge(message.status)}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {/* Status toggle */}
                                            <select
                                                value={message.status}
                                                onChange={(e) => handleMessageStatus(message, e.target.value)}
                                                disabled={updatingMessage === message.id}
                                                className="text-xs border-0 bg-transparent focus:ring-0 cursor-pointer"
                                            >
                                                <option value="public">Public</option>
                                                <option value="hidden">Hidden</option>
                                            </select>

                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleMessageDelete(message)}
                                                disabled={updatingMessage === message.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                data-tooltip-id="main-tooltip"
                                                data-tooltip-content="Delete message"
                                            >
                                                {updatingMessage === message.id ? (
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* User Query */}
                                        {message.message_role === 'user' && (
                                            <div className="col-span-2">
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.query}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Assistant Response */}
                                        {message.message_role === 'assistant' && (
                                            <>
                                                <div className="col-span-2">
                                                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.response}</p>
                                                    </div>
                                                </div>

                                                {/* Metadata */}
                                                <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                                    <div className="bg-gray-50 rounded p-3">
                                                        <p className="text-xs text-gray-500">Model</p>
                                                        <p className="text-sm font-medium">{message.model}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded p-3">
                                                        <p className="text-xs text-gray-500">Temperature</p>
                                                        <p className="text-sm font-medium">{message.temperature}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded p-3">
                                                        <p className="text-xs text-gray-500">Max Tokens</p>
                                                        <p className="text-sm font-medium">{message.max_tokens}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded p-3">
                                                        <p className="text-xs text-gray-500">Finish Reason</p>
                                                        <p className="text-sm font-medium">{message.finish_reason || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                {/* Token Usage */}
                                                {message.usage && (
                                                    <div className="col-span-2 mt-2">
                                                        <details className="bg-gray-50 rounded-lg p-3">
                                                            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                                                Token Usage Details
                                                            </summary>
                                                            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                                                                {formatJson(message.usage)}
                                                            </pre>
                                                        </details>
                                                    </div>
                                                )}

                                                {/* Sources */}
                                                {message.sources && message.sources.length > 0 && (
                                                    <div className="col-span-2 mt-2">
                                                        <details className="bg-gray-50 rounded-lg p-3">
                                                            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                                                Sources ({message.sources.length})
                                                            </summary>
                                                            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                                                                {formatJson(message.sources)}
                                                            </pre>
                                                        </details>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Message Metadata */}
                                    <div className="mt-4 text-xs text-gray-400 border-t border-gray-100 pt-3">
                                        <div className="flex flex-wrap gap-3">
                                            <span>ID: {message.id}</span>
                                            <span>•</span>
                                            <span>Slug: {message.slug}</span>
                                            {message.ip_address && (
                                                <>
                                                    <span>•</span>
                                                    <span>IP: {message.ip_address}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}