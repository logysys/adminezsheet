import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    // Don't show if insufficient pages (only showing when we have more than 3 links: prev, 1, next)
    if (links.length <= 3) return null;

    // Get the page links without the previous and next buttons
    const pageLinks = links.slice(1, -1);

    return (
        <nav className="flex items-center justify-between mt-8" aria-label="Pagination">
            {/* Previous Button */}
            <div className="flex-1 flex justify-start">
                {links[0].url ? (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        preserveScroll
                        aria-label="Previous page"
                    >
                        &larr; Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-md cursor-not-allowed">
                        &larr; Previous
                    </span>
                )}
            </div>

            {/* Page Numbers - Hidden on mobile if too many pages */}
            <div className="hidden sm:flex">
                <nav className="flex -space-x-px" aria-label="Page navigation">
                    {pageLinks.map((link, index) => (
                        <React.Fragment key={index}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                                        link.active
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                    } ${index === 0 ? 'rounded-l-md' : ''} ${
                                        index === pageLinks.length - 1 ? 'rounded-r-md' : ''
                                    } focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                    preserveScroll
                                    aria-current={link.active ? 'page' : undefined}
                                    aria-label={`Go to page ${link.label}`}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <span
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 border border-gray-300 bg-gray-50"
                                    aria-disabled="true"
                                >
                                    {link.label}
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Mobile compact pagination */}
            <div className="flex sm:hidden">
                <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pageLinks.find(link => link.active)?.label || '1'} of {pageLinks.length}
                </span>
            </div>

            {/* Next Button */}
            <div className="flex-1 flex justify-end">
                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        preserveScroll
                        aria-label="Next page"
                    >
                        Next &rarr;
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-300 rounded-md cursor-not-allowed">
                        Next &rarr;
                    </span>
                )}
            </div>
        </nav>
    );
}