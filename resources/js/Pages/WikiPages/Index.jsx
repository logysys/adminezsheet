import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

export default function Index({ auth, wikipages }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Wiki Pages" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Your Wiki Pages</h2>
                                <Link 
                                    href={route('wikipages.create')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Wiki Page
                                </Link>
                            </div>
                            
                            {wikipages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <Plus className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No wiki pages yet</h3>
                                    <p className="text-gray-600 mb-6">Create your first wiki page to get started.</p>
                                    <Link 
                                        href={route('wikipages.create')}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Wiki Page
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {wikipages.map((wikipage) => (
                                        <div key={wikipage.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate" title={wikipage.title}>
                                                    {wikipage.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    wikipage.status === 'published' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {wikipage.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">Slug:</span>
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono truncate">
                                                        {wikipage.wiki_slug}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Created:</span>
                                                    <span>{new Date(wikipage.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <div className="flex space-x-2">
                                                    <Link 
                                                        href={route('wikipages.edit', wikipage.id)}
                                                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors duration-150"
                                                        title="Edit Wiki Page"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <Link 
                                                        href={route('wikipages.show', wikipage.wiki_slug)}
                                                        target="_blank"
                                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-150"
                                                        title="View Published Page"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link 
                                                        href={route('wikipages.preview', wikipage.wiki_slug)}
                                                        target="_blank"
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                                                        title="Preview (Draft/Published)"
                                                    >
                                                        <span className="text-xs font-medium">Preview</span>
                                                    </Link>
                                                </div>
                                                <Link 
                                                    method="delete"
                                                    href={route('wikipages.destroy', wikipage.id)}
                                                    as="button"
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                                                    confirm="Are you sure you want to delete this wiki page?"
                                                    title="Delete Wiki Page"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {wikipages.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Total Wiki Pages:</span> {wikipages.length}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span>Published: {wikipages.filter(p => p.status === 'published').length}</span>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                    <span>Draft: {wikipages.filter(p => p.status === 'draft').length}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}