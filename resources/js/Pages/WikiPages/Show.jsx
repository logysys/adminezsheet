import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import PageRenderer from '@/Components/PageRenderer';
import { 
    Calendar, 
    User, 
    Clock, 
    Edit, 
    ArrowLeft,
    Share2,
    Printer,
    Download,
    EyeOff,
    Globe
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Show({ wikipage }) {
    const [isPrinting, setIsPrinting] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle print functionality
    const handlePrint = () => {
        setIsPrinting(true);
        setShowPrintDialog(true);
        
        // Small delay to ensure state updates
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setIsPrinting(false);
                setShowPrintDialog(false);
            }, 1000);
        }, 100);
    };

    // Handle download as HTML
    const handleDownload = () => {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wikipage.title} - Wiki Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .print-header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: none;
        }
        
        @media print {
            .print-header {
                display: block;
            }
            
            .no-print {
                display: none !important;
            }
            
            body {
                padding: 0;
            }
            
            a {
                color: #000 !important;
                text-decoration: none !important;
            }
            
            button, .actions {
                display: none !important;
            }
        }
        
        .page-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #111827;
        }
        
        .meta-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .actions {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
            border: 1px solid #d1d5db;
            background: white;
            color: #374151;
            text-decoration: none;
        }
        
        .btn:hover {
            background: #f3f4f6;
            border-color: #9ca3af;
        }
        
        .btn-primary {
            background: #4f46e5;
            color: white;
            border-color: #4f46e5;
        }
        
        .btn-primary:hover {
            background: #4338ca;
            border-color: #4338ca;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .status-published {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-draft {
            background: #fef3c7;
            color: #92400e;
        }
        
        .content-area {
            min-height: 400px;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.875rem;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .page-title {
                font-size: 2rem;
            }
            
            .meta-info {
                flex-direction: column;
                gap: 10px;
            }
            
            .actions {
                flex-direction: column;
            }
            
            .btn {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <h1>${wikipage.title}</h1>
        <p>Generated from Wiki Page - ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="no-print">
        <div class="meta-info">
            <div class="meta-item">
                <Calendar size={14} />
                <span>Created: ${formatDate(wikipage.created_at)}</span>
            </div>
            <div class="meta-item">
                <Clock size={14} />
                <span>Last Updated: ${formatDate(wikipage.updated_at)}</span>
            </div>
            <div class="meta-item">
                <User size={14} />
                <span>Author: ${wikipage.user?.name || 'Unknown'}</span>
            </div>
            <div class="status-badge ${wikipage.status === 'published' ? 'status-published' : 'status-draft'}">
                {wikipage.status === 'published' ? <Globe size={12} /> : <EyeOff size={12} />}
                <span>{wikipage.status}</span>
            </div>
        </div>
        
        <div class="actions">
            <a href="/wikipages" class="btn">
                <ArrowLeft size={16} />
                Back to Wiki Pages
            </a>
            
            {wikipage.user_id === auth().id && (
                <a href={route('wikipages.edit', wikipage.id)} class="btn btn-primary">
                    <Edit size={16} />
                    Edit Wiki Page
                </a>
            )}
            
            <button onclick="window.print()" class="btn">
                <Printer size={16} />
                Print
            </button>
            
            <button onclick="handleDownload()" class="btn">
                <Download size={16} />
                Download HTML
            </button>
            
            <button onclick="handleShare()" class="btn">
                <Share2 size={16} />
                Share
            </button>
        </div>
    </div>
    
    <div class="content-area">
        <!-- Page content will be rendered here -->
    </div>
    
    <div class="footer">
        <p>Wiki Page generated with Ez Builder • ${wikipage.wiki_slug}</p>
        <p class="text-xs mt-2">© ${new Date().getFullYear()} - All rights reserved</p>
    </div>
    
    <script>
        function handleDownload() {
            const element = document.createElement('a');
            const html = document.documentElement.outerHTML;
            const blob = new Blob([html], { type: 'text/html' });
            element.href = URL.createObjectURL(blob);
            element.download = '${wikipage.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        
        function handleShare() {
            if (navigator.share) {
                navigator.share({
                    title: '${wikipage.title}',
                    text: 'Check out this wiki page:',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        }
        
        // Add print styles
        const style = document.createElement('style');
        style.textContent = \`
            @media print {
                .no-print { display: none !important; }
                .print-header { display: block !important; }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${wikipage.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_wiki_page.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    // Handle share functionality
    const handleShare = async () => {
        const shareData = {
            title: wikipage.title,
            text: 'Check out this wiki page:',
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (clipboardErr) {
                alert('Could not share or copy link. Please copy the URL manually.');
            }
        }
    };

    useEffect(() => {
        // Add print styles when component mounts
        const printStyle = document.createElement('style');
        printStyle.textContent = `
            @media print {
                .no-print {
                    display: none !important;
                }
                .print-only {
                    display: block !important;
                }
            }
            .print-only {
                display: none;
            }
        `;
        document.head.appendChild(printStyle);

        return () => {
            document.head.removeChild(printStyle);
        };
    }, []);

    return (
        <>
            <Head title={wikipage.title}>
                <meta name="description" content={`Wiki page: ${wikipage.title}`} />
                <meta property="og:title" content={wikipage.title} />
                <meta property="og:description" content={`Wiki page created with Ez Builder`} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                {wikipage.status === 'published' && (
                    <>
                        <meta name="robots" content="index, follow" />
                        <link rel="canonical" href={window.location.href} />
                    </>
                )}
                {wikipage.status === 'draft' && (
                    <meta name="robots" content="noindex, nofollow" />
                )}
            </Head>

            {/* Print Header (only visible when printing) */}
            <div className="print-only fixed top-0 left-0 right-0 p-4 bg-white border-b border-gray-200 hidden">
                <h1 className="text-2xl font-bold">{wikipage.title}</h1>
                <p className="text-gray-600 text-sm">
                    Generated from Wiki Page • {new Date().toLocaleDateString()} • {wikipage.wiki_slug}
                </p>
            </div>

            <div className={`min-h-screen bg-gray-50 ${isPrinting ? 'print-mode' : ''}`}>
                {/* Header with metadata and actions */}
                <div className="no-print bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{wikipage.title}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        wikipage.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {wikipage.status === 'published' ? (
                                            <>
                                                <Globe className="w-3 h-3 mr-1" />
                                                Published
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-3 h-3 mr-1" />
                                                Draft
                                            </>
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                        {wikipage.wiki_slug}
                                    </code>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Link 
                                    href={route('wikipages.index')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Wiki
                                </Link>
                                
                                {wikipage.user_id === auth?.user?.id && (
                                    <Link 
                                        href={route('wikipages.edit', wikipage.id)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                )}
                            </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                <div>
                                    <span className="font-medium">Created:</span>
                                    <span className="ml-1">{formatDate(wikipage.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                <div>
                                    <span className="font-medium">Updated:</span>
                                    <span className="ml-1">{formatDate(wikipage.updated_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                                <div>
                                    <span className="font-medium">Author:</span>
                                    <span className="ml-1">{wikipage.user?.name || 'Unknown'}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                            <button
                                onClick={handlePrint}
                                disabled={isPrinting}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                {isPrinting ? 'Printing...' : 'Print'}
                            </button>
                            
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download HTML
                            </button>
                            
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <PageRenderer elements={wikipage.elements} />
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                        <p>Wiki Page generated with Ez Builder • {wikipage.wiki_slug}</p>
                        <p className="mt-1 text-xs">
                            © {new Date().getFullYear()} • All rights reserved
                            {wikipage.status === 'draft' && (
                                <span className="ml-2 text-yellow-600">
                                    • This is a draft page and not publicly indexed
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Dialog Overlay */}
            {showPrintDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Print Preview</h3>
                        <p className="text-gray-600 mb-6">
                            The print dialog should open shortly. If it doesn't, please check your browser settings.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPrintDialog(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    window.print();
                                    setShowPrintDialog(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                            >
                                Open Print Dialog
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}