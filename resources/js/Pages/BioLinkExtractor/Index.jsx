// resources/js/Pages/BioLinkExtractor/Index.jsx

import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Index({ auth, recentExtractions, stats }) {
    const [platform, setPlatform] = useState('');
    const [usernamesInput, setUsernamesInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('single');
    
    // New state for stored users and links
    const [storedUsers, setStoredUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userLinks, setUserLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(false);
    const [platformFilter, setPlatformFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    
    // Fetch stored users on component mount and when filters change
    useEffect(() => {
        fetchStoredUsers();
    }, [platformFilter, currentPage]);
    
    const fetchStoredUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await axios.get('/bio-link-extractor/users', {
                params: {
                    platform: platformFilter || undefined,
                    page: currentPage
                }
            });
            setStoredUsers(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total
            });
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };
    
    const fetchUserLinks = async (userId) => {
        setLoadingLinks(true);
        setSelectedUser(userId);
        try {
            const response = await axios.get(`/bio-link-extractor/users/${userId}/links`);
            setUserLinks(response.data.links);
        } catch (err) {
            console.error('Failed to fetch user links:', err);
            setUserLinks([]);
        } finally {
            setLoadingLinks(false);
        }
    };
    
    const handleExtractSingle = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const platform = formData.get('platform');
        const username = formData.get('username');
        
        if (!platform || !username) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/bio-link-extractor/extract-user', {
                platform,
                username
            });
            
            if (response.data.success) {
                setResults([response.data.data]);
                // Refresh the stored users list after extraction
                fetchStoredUsers();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Extraction failed');
        } finally {
            setLoading(false);
        }
    };
    
    const handleExtractBulk = async (e) => {
        e.preventDefault();
        
        const usernames = usernamesInput
            .split('\n')
            .map(u => u.trim())
            .filter(u => u);
        
        if (!platform || usernames.length === 0) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/bio-link-extractor/extract-platform', {
                platform,
                usernames,
                auto_discover: false,
            });
            
            if (response.data.success) {
                setResults(response.data.results);
                // Refresh the stored users list after extraction
                fetchStoredUsers();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Extraction failed');
        } finally {
            setLoading(false);
        }
    };
    
    const handleAutoDiscover = async () => {
        if (!platform) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/bio-link-extractor/extract-platform', {
                platform,
                auto_discover: true,
                limit: 50
            });
            
            if (response.data.success) {
                setResults(response.data.results);
                // Refresh the stored users list after extraction
                fetchStoredUsers();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Auto-discovery failed');
        } finally {
            setLoading(false);
        }
    };
    
    const copyAllLinks = () => {
        const allLinks = results.flatMap(r => 
            r.links?.map(l => `${r.username}: ${l.url}`) || []
        ).join('\n');
        navigator.clipboard.writeText(allLinks);
    };
    
    const exportResults = () => {
        const data = results.flatMap(r => 
            r.links?.map(l => ({
                username: r.username,
                profile_url: r.profile_url,
                link_title: l.title,
                link_url: l.url,
                link_type: l.type
            })) || []
        );
        
        const csv = ['Username,Profile URL,Link Title,Link URL,Link Type'];
        data.forEach(row => {
            csv.push(`"${row.username}","${row.profile_url}","${row.link_title}","${row.link_url}","${row.link_type}"`);
        });
        
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bio-links-${platform || 'export'}-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    // Get unique platforms for filter dropdown
    const uniquePlatforms = [...new Set(storedUsers.map(user => user.platform))];
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Bio Link Extractor
                    </h2>
                </div>
            }
        >
            <Head title="Bio Link Extractor" />
            
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-blue-600">{stats.total_users}</div>
                            <div className="text-sm text-gray-500">Total Users Extracted</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-green-600">{stats.total_links}</div>
                            <div className="text-sm text-gray-500">Total Links Extracted</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-purple-600">{stats.platforms.length}</div>
                            <div className="text-sm text-gray-500">Platforms</div>
                        </div>
                    </div>
                    
                    {/* Main Content - Two Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Extractor Forms */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                                    Extract New Links
                                </h3>
                                
                                {/* Platform Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Platform Website <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        placeholder="linktr.ee, beacons.ai, bio.link"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter only the website domain (e.g., linktr.ee, beacons.ai)
                                    </p>
                                </div>
                                
                                {/* Tab Navigation */}
                                <div className="border-b border-gray-200 mb-6">
                                    <nav className="-mb-px flex space-x-8">
                                        <button
                                            onClick={() => setActiveTab('single')}
                                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'single'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Single User
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('bulk')}
                                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'bulk'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Bulk Users
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('auto')}
                                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === 'auto'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Auto Discover
                                        </button>
                                    </nav>
                                </div>
                                
                                {/* Single User Form */}
                                {activeTab === 'single' && (
                                    <form onSubmit={handleExtractSingle} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="username"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || !platform}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Extract Links
                                        </button>
                                    </form>
                                )}
                                
                                {/* Bulk Users Form */}
                                {activeTab === 'bulk' && (
                                    <form onSubmit={handleExtractBulk} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Usernames (one per line)
                                            </label>
                                            <textarea
                                                value={usernamesInput}
                                                onChange={(e) => setUsernamesInput(e.target.value)}
                                                rows={5}
                                                placeholder="user1&#10;user2&#10;user3"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || !platform}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Extract All
                                        </button>
                                    </form>
                                )}
                                
                                {/* Auto Discover */}
                                {activeTab === 'auto' && (
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <p className="text-sm text-yellow-800">
                                                Auto-discover will attempt to find users on {platform || '[platform]'} 
                                                and extract their bio links automatically.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleAutoDiscover}
                                            disabled={loading || !platform}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Auto Discover & Extract
                                        </button>
                                    </div>
                                )}
                                
                                {/* Loading State */}
                                {loading && (
                                    <div className="mt-6 text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-500">Extracting links...</p>
                                    </div>
                                )}
                                
                                {/* Error Message */}
                                {error && (
                                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}
                                
                                {/* Extraction Results */}
                                {results.length > 0 && !loading && (
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold">
                                                Extraction Results ({results.reduce((sum, r) => sum + (r.links?.length || 0), 0)} links from {results.length} users)
                                            </h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={copyAllLinks}
                                                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                                                >
                                                    Copy All
                                                </button>
                                                <button
                                                    onClick={exportResults}
                                                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                >
                                                    Export CSV
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {results.map((result, idx) => (
                                            <div key={idx} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-medium text-gray-900">{result.username}</span>
                                                            {result.display_name && (
                                                                <span className="text-sm text-gray-500 ml-2">({result.display_name})</span>
                                                            )}
                                                        </div>
                                                        <a
                                                            href={result.profile_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            View Profile →
                                                        </a>
                                                    </div>
                                                    {result.bio && (
                                                        <p className="text-sm text-gray-600 mt-1">{result.bio}</p>
                                                    )}
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {result.link_count || 0} links found
                                                    </div>
                                                </div>
                                                
                                                {result.error ? (
                                                    <div className="p-4 text-red-500">Error: {result.error}</div>
                                                ) : (
                                                    <div className="divide-y divide-gray-100">
                                                        {result.links?.map((link, linkIdx) => (
                                                            <div key={linkIdx} className="px-4 py-2 hover:bg-gray-50 flex justify-between items-center">
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-medium text-gray-700">{link.title}</div>
                                                                    <a
                                                                        href={link.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-blue-500 hover:underline break-all"
                                                                    >
                                                                        {link.url}
                                                                    </a>
                                                                </div>
                                                                <span className="ml-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                                                    {link.type}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Right Column: Stored Users List */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                                    Extracted Users
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                        ({pagination?.total || 0} total)
                                    </span>
                                </h3>
                                
                                {/* Platform Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter by Platform
                                    </label>
                                    <select
                                        value={platformFilter}
                                        onChange={(e) => {
                                            setPlatformFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Platforms</option>
                                        {uniquePlatforms.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Users List */}
                                {loadingUsers ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-500">Loading users...</p>
                                    </div>
                                ) : storedUsers.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No users extracted yet.</p>
                                        <p className="text-sm mt-2">Use the forms on the left to extract bio links.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {storedUsers.map((user) => (
                                            <div key={user.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => fetchUserLinks(user.id)}
                                                    className="w-full text-left"
                                                >
                                                    <div className="bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors flex justify-between items-center">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {user.display_name || user.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.platform}/{user.username}
                                                            </div>
                                                            {user.bio && (
                                                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                                    {user.bio.substring(0, 100)}{user.bio.length > 100 ? '...' : ''}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                {user.bio_links_count || 0} links
                                                            </span>
                                                            <svg 
                                                                className={`w-5 h-5 text-gray-400 transition-transform ${selectedUser === user.id ? 'rotate-180' : ''}`}
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                {/* Links List (expanded) */}
                                                {selectedUser === user.id && (
                                                    <div className="border-t border-gray-200 bg-white">
                                                        {loadingLinks ? (
                                                            <div className="text-center py-4">
                                                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                                <p className="text-xs text-gray-500 mt-1">Loading links...</p>
                                                            </div>
                                                        ) : userLinks.length === 0 ? (
                                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                                No links found for this user.
                                                            </div>
                                                        ) : (
                                                            <div className="divide-y divide-gray-100">
                                                                {userLinks.map((link) => (
                                                                    <div key={link.id} className="px-4 py-2 hover:bg-gray-50">
                                                                        <div className="text-sm font-medium text-gray-700">
                                                                            {link.title || 'Untitled Link'}
                                                                        </div>
                                                                        <a
                                                                            href={link.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs text-blue-500 hover:underline break-all"
                                                                        >
                                                                            {link.url}
                                                                        </a>
                                                                        <div className="mt-1">
                                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                                                {link.type || 'website'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Pagination */}
                                {pagination && pagination.last_page > 1 && (
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Page {pagination.current_page} of {pagination.last_page}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                                            disabled={currentPage === pagination.last_page}
                                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}