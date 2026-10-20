// resources/js/Pages/WikiPages/Editor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { 
  Save, Eye, Download, AlertCircle, CheckCircle, Code, X, 
  Zap, Maximize2, Minimize2, RefreshCw, Copy, Palette, 
  Smartphone, Tablet, Monitor, Tv, Layout, Trash2, 
  Settings, Upload, Globe, Image, Type, Box, 
  ChevronRight, ChevronLeft, Menu, Grid, List, 
  FileText, Columns, Square, FileCode, BookOpen,
  Sparkles, Users, Mail, ShoppingBag, Camera,
  Maximize, Minimize, EyeOff, Eye as EyeIcon,
  Plus, Edit2, GripVertical, ArrowUp, ArrowDown,
  ExternalLink, Link as LinkIcon, Search,
  Heart, Star, ThumbsUp, MessageSquare,
  Share2, Bookmark, Filter, SortAsc,
  Bell, User, Home, Calendar, Clock,
  Folder, Tag, Hash, AtSign, DollarSign,
  Percent, PieChart, BarChart, TrendingUp,
  Shield, Lock, Key, Cloud, Database,
  Server, Cpu, HardDrive, Wifi, Bluetooth,
  Battery, BatteryCharging, Power,
  Volume2, VolumeX, Mic, Video,
  Headphones, Radio, Music,
  Camera as CameraIcon, Video as VideoIcon,
  Film, Image as ImageIcon,
  Map, Navigation, Compass,
  Globe as GlobeIcon, MapPin,
  Flag, Award, Trophy, Crown,
  Gift, Package, Truck, CreditCard,
  Wallet, Banknote, Coins, Bitcoin,
  CreditCard as CreditCardIcon,
  ShoppingCart, ShoppingBag as ShoppingBagIcon,
  Tag as TagIcon, Percent as PercentIcon,
  Ticket, Gem, Diamond, Crown as CrownIcon,
  Moon, Sun, Cloud as CloudIcon,
  Umbrella, CloudRain, CloudSnow,
  CloudLightning, Wind, Thermometer,
  Droplet, Sunrise, Sunset, ChevronDown,
  CloudSun, CloudMoon, Star as StarIcon,
  Heart as HeartIcon, ThumbsUp as ThumbsUpIcon
} from 'lucide-react';
import axios from 'axios';

// Import your editor components
import Sidebar from '@/Components/Editor/Sidebar';
import EditorCanvas from '@/Components/Editor/EditorCanvas';
import PropertiesPanel from '@/Components/Editor/PropertiesPanel';
import HtmlSourceEditor from '@/Components/Editor/HtmlSourceEditor';
import { ElementType } from '@/types';

// Debounce utility
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Tailwind CSS Helper - Convert styles to Tailwind classes
const stylesToTailwind = (styles) => {
    if (!styles) return '';
    
    const classes = [];
    
    // Map common styles to Tailwind classes
    // We prioritize JIT (Just-In-Time) arbitrary values for precise user control
    const mappings = {
        backgroundColor: (value) => value.startsWith('#') ? `bg-[${value}]` : `bg-${value}`,
        color: (value) => value.startsWith('#') ? `text-[${value}]` : `text-${value}`,
        padding: (value) => `p-[${value}]`,
        margin: (value) => `m-[${value}]`,
        fontSize: (value) => `text-[${value}]`,
        fontWeight: (value) => `font-[${value}]`,
        textAlign: (value) => `text-${value}`,
        borderRadius: (value) => `rounded-[${value}]`,
        boxShadow: (value) => `shadow-[${value}]`,
        borderWidth: (value) => `border-[${value}]`,
        borderColor: (value) => value.startsWith('#') ? `border-[${value}]` : `border-${value}`,
        width: (value) => value === '100%' ? 'w-full' : `w-[${value}]`,
        height: (value) => value === '100%' ? 'h-full' : `h-[${value}]`,
        gap: (value) => `gap-[${value}]`,
        display: (value) => value === 'none' ? 'hidden' : value,
        alignItems: (value) => {
            const map = { 'flex-start': 'items-start', 'flex-end': 'items-end', 'center': 'items-center' };
            return map[value] || `items-[${value}]`;
        },
        justifyContent: (value) => {
            const map = { 'flex-start': 'justify-start', 'flex-end': 'justify-end', 'center': 'justify-center', 'space-between': 'justify-between' };
            return map[value] || `justify-[${value}]`;
        },
        flexDirection: (value) => value.includes('row') ? 'flex-row' : 'flex-col',
        gridTemplateColumns: (value) => `grid-cols-[${value}]`,
        lineHeight: (value) => `leading-[${value}]`,
        letterSpacing: (value) => `tracking-[${value}]`,
        textTransform: (value) => value,
        textDecoration: (value) => value,
        opacity: (value) => `opacity-[${value}]`,
        zIndex: (value) => `z-[${value}]`,
        position: (value) => value,
        top: (value) => `top-[${value}]`,
        bottom: (value) => `bottom-[${value}]`,
        left: (value) => `left-[${value}]`,
        right: (value) => `right-[${value}]`,
        overflow: (value) => `overflow-${value}`,
        transition: (value) => 'transition-all duration-300 ease-in-out',
    };
    
    // Process each style property
    Object.entries(styles).forEach(([key, value]) => {
        if (value && mappings[key]) {
            const twClass = mappings[key](value);
            if (twClass) classes.push(twClass);
        }
    });
    
    return classes.join(' ');
};

// Main Editor Component
export default function Editor({ wikipage = null }) {
    const { csrf_token } = usePage().props;
    
    // Set CSRF token for axios
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    const [data, setData] = useState({
        title: wikipage?.title || 'Untitled Wiki Page',
        elements: wikipage?.elements || [],
        status: wikipage?.status || 'draft'
    });
    
    const [selectedId, setSelectedId] = useState(null);
    const [viewMode, setViewMode] = useState('DESKTOP');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [lastSaveTime, setLastSaveTime] = useState(null);
    const [showHtmlEditor, setShowHtmlEditor] = useState(false);
    const [htmlSource, setHtmlSource] = useState('');
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Function to convert elements to HTML with Tailwind CSS
    const convertElementsToHtml = (elements) => {
        if (!elements || elements.length === 0) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Generated Wiki Page'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        * { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <p class="text-gray-500 text-center">Empty wiki page</p>
    </div>
</body>
</html>`;
        }

        const elementToHTML = (el) => {
            const tailwindClasses = stylesToTailwind(el.styles || {});
            
            // Utility to safely parse JSON content
            const contentData = el.content ? (()=>{ try { return JSON.parse(el.content); } catch { return {}; } })() : {};
            
            switch (el.type) {
                case ElementType.HEADER:
                    return `<h2 class="${tailwindClasses} font-bold mb-4">${el.content}</h2>`;
                case ElementType.PARAGRAPH:
                    return `<p class="${tailwindClasses} mb-6 leading-relaxed">${el.content}</p>`;
                case ElementType.BUTTON:
                    if (el.href) {
                        return `<a href="${el.href}" class="${tailwindClasses} inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg">${el.content}</a>`;
                    }
                    return `<button class="${tailwindClasses} inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg">${el.content}</button>`;
                case ElementType.IMAGE:
                    return `<img src="${el.src || 'https://picsum.photos/400/300'}" alt="${el.alt || ''}" class="${tailwindClasses} max-w-full h-auto rounded-lg shadow-md" />`;
                case ElementType.CONTAINER:
                    return `<div class="${tailwindClasses} border border-gray-200 rounded-lg p-4">${el.content}</div>`;
                
                // --- Complex Components with Tailwind ---
                case ElementType.NAVBAR: {
                    const linksHtml = (Array.isArray(contentData.links) ? contentData.links : []).map(link => {
                        const text = typeof link === 'string' ? link : link.text;
                        const href = typeof link === 'string' ? '#' : link.href;
                        return `<li><a href="${href}" class="text-gray-600 hover:text-primary-600 transition-colors duration-200">${text}</a></li>`;
                    }).join('\n');
                    
                    const buttonHtml = contentData.buttonText 
                        ? `<a href="${contentData.buttonHref || '#'}" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">${contentData.buttonText}</a>`
                        : '';

                    return `<nav class="${tailwindClasses} bg-white shadow-sm px-6 py-4">
                                <div class="container mx-auto flex items-center justify-between">
                                    <div class="text-xl font-bold text-gray-900">${contentData.brand || 'My Brand'}</div>
                                    <ul class="flex items-center space-x-6">
                                        ${linksHtml}
                                    </ul>
                                    ${buttonHtml}
                                </div>
                            </nav>`;
                }

                case ElementType.HERO: {
                    return `<section class="${tailwindClasses} bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 px-4">
                                <div class="container mx-auto text-center max-w-4xl">
                                    <h1 class="text-4xl md:text-5xl font-bold mb-6">${contentData.title || 'Hero Title'}</h1>
                                    <p class="text-xl mb-10 opacity-90">${contentData.subtitle || 'Hero Subtitle'}</p>
                                    <a href="${contentData.ctaHref || '#'}" class="inline-block bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                                        ${contentData.cta || 'Get Started'}
                                    </a>
                                </div>
                            </section>`;
                }

                case ElementType.FEATURES: {
                    const featuresHtml = (Array.isArray(contentData) ? contentData : []).map((f, i) => `
                        <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                                <span class="text-primary-600 font-bold text-xl">${i + 1}</span>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-4">${f.title || 'Feature'}</h3>
                            <p class="text-gray-600 leading-relaxed">${f.desc || 'Feature description'}</p>
                        </div>
                    `).join('\n');
                    
                    return `<section class="${tailwindClasses} py-16 px-4">
                                <div class="container mx-auto">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        ${featuresHtml}
                                    </div>
                                </div>
                            </section>`;
                }
                
                case ElementType.FOOTER: {
                    const linksHtml = (contentData.links || []).map(col => `
                        <div>
                            <h4 class="font-bold text-gray-900 mb-4 text-lg">${col.title || 'Column'}</h4>
                            <ul class="space-y-3">
                                ${(col.items || []).map(item => `<li><a href="#" class="text-gray-600 hover:text-primary-600 transition-colors duration-200">${item}</a></li>`).join('\n')}
                            </ul>
                        </div>
                    `).join('\n');

                    return `<footer class="${tailwindClasses} bg-gray-900 text-gray-300 py-12 px-4">
                                <div class="container mx-auto">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                                        <div class="lg:col-span-2">
                                            <div class="flex items-center gap-3 mb-6">
                                                <div class="w-10 h-10 bg-primary-600 rounded-lg"></div>
                                                <h3 class="text-2xl font-bold text-white">${contentData.brand || 'My Website'}</h3>
                                            </div>
                                            <p class="text-gray-400 max-w-md leading-relaxed">
                                                Empowering creators to build the web of tomorrow, block by block.
                                            </p>
                                        </div>
                                        ${linksHtml}
                                    </div>
                                    <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                                        <p class="text-gray-500">${contentData.copyright || '© 2024 My Website'}</p>
                                        <div class="flex space-x-6 mt-4 md:mt-0">
                                            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                                        </div>
                                    </div>
                                </div>
                            </footer>`;
                }

                case ElementType.TWO_COL:
                    return `<div class="${tailwindClasses} grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="p-6 bg-gray-50 rounded-lg">
                                    ${contentData.left || 'Left Column Content'}
                                </div>
                                <div class="p-6 bg-gray-50 rounded-lg">
                                    ${contentData.right || 'Right Column Content'}
                                </div>
                            </div>`;

                case ElementType.GALLERY:
                    const images = contentData.images || [1, 2, 3, 4];
                    const galleryHtml = images.map((img, i) => `
                        <div class="relative group overflow-hidden rounded-xl">
                            <img src="${typeof img === 'string' && img.startsWith('http') ? img : `https://picsum.photos/400/400?random=${i}`}" 
                                 alt="Gallery image ${i + 1}" 
                                 class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700">
                            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <i class="fas fa-search text-white text-2xl"></i>
                            </div>
                        </div>
                    `).join('\n');
                    
                    return `<section class="${tailwindClasses} py-12 px-4">
                                <div class="container mx-auto">
                                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        ${galleryHtml}
                                    </div>
                                </div>
                            </section>`;

                case ElementType.PRODUCT_GRID:
                    const products = Array.isArray(contentData) ? contentData : [];
                    const productsHtml = products.map((p, i) => `
                        <div class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div class="relative overflow-hidden h-48">
                                <img src="${p.image || `https://picsum.photos/400/300?product=${i}`}" 
                                     alt="${p.name || 'Product'}" 
                                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <div class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i class="fas fa-heart text-gray-400"></i>
                                </div>
                            </div>
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="font-bold text-gray-900 text-lg">${p.name || 'Product'}</h3>
                                    <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">${p.price || '$99'}</span>
                                </div>
                                <button class="w-full bg-gray-900 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                                    <i class="fas fa-shopping-cart"></i>
                                    ${p.buttonText || 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    `).join('\n');
                    
                    return `<section class="${tailwindClasses} py-12 px-4">
                                <div class="container mx-auto">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        ${productsHtml}
                                    </div>
                                </div>
                            </section>`;

                case ElementType.CONTACT_FORM:
                    const labels = contentData.labels || { 
                        firstName: 'First Name', 
                        lastName: 'Last Name', 
                        email: 'Email Address', 
                        message: 'Message' 
                    };
                    
                    return `<section class="${tailwindClasses} py-16 px-4">
                                <div class="container mx-auto max-w-2xl">
                                    <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                                        <div class="text-center mb-10">
                                            <h3 class="text-3xl font-bold text-gray-900 mb-4">${contentData.title || 'Contact Us'}</h3>
                                            <p class="text-gray-600">We typically reply within 2 hours.</p>
                                        </div>
                                        <form class="space-y-6">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label class="block text-sm font-bold text-gray-700 uppercase mb-2">${labels.firstName}</label>
                                                    <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John">
                                                </div>
                                                <div>
                                                    <label class="block text-sm font-bold text-gray-700 uppercase mb-2">${labels.lastName}</label>
                                                    <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Doe">
                                                </div>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-bold text-gray-700 uppercase mb-2">${labels.email}</label>
                                                <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-bold text-gray-700 uppercase mb-2">${labels.message}</label>
                                                <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all" placeholder="How can we help you?"></textarea>
                                            </div>
                                            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                                                <i class="fas fa-paper-plane"></i>
                                                ${contentData.buttonText || 'Send Message'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>`;

                default:
                    return `<div class="${tailwindClasses}">${el.content}</div>`;
            }
        };

        const htmlContent = elements.map(elementToHTML).join('\n');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Generated Wiki Page'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        * { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl animate-[fadeIn_0.6s_ease-out]">
        ${htmlContent}
    </div>
</body>
</html>`;
    };

    // Auto-save function
    const autoSave = useCallback(
        debounce(async () => {
            if (!wikipage?.id || data.elements.length === 0) return;
            
            try {
                // Generate HTML for auto-save
                const generatedHtml = convertElementsToHtml(data.elements);
                
                await axios.put(`/wikipages/${wikipage.id}/autosave`, {
                    elements: data.elements,
                    html_content: generatedHtml, // Save HTML with Tailwind
                    title: data.title,
                    status: data.status
                });
                
                setLastSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                setSaveMessage({
                    type: 'success',
                    text: `Auto-saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                });
                
                setTimeout(() => {
                    setSaveMessage({ type: '', text: '' });
                }, 3000);
            } catch (error) {
                console.error('Auto-save failed:', error);
                setSaveMessage({
                    type: 'error',
                    text: 'Auto-save failed. Please save manually.'
                });
            }
        }, 5000),
        [data.elements, data.title, data.status, wikipage?.id]
    );

    // Trigger auto-save on changes
    useEffect(() => {
        if (wikipage?.id) {
            autoSave();
        }
    }, [data.elements, data.title, data.status, wikipage?.id, autoSave]);

    // Handle fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Main save function - FIXED to save HTML with Tailwind
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });

        try {
            // Generate HTML with Tailwind CSS
            const generatedHtml = convertElementsToHtml(data.elements);
            
            let response;
            
            if (wikipage && wikipage.id) {
                response = await axios.put(`/wikipages/${wikipage.id}`, {
                    title: data.title,
                    elements: data.elements,
                    html_content: generatedHtml, // Save the generated HTML
                    status: data.status,
                    _method: 'PUT'
                });
            } else {
                response = await axios.post('/wikipages', {
                    title: data.title,
                    elements: data.elements,
                    html_content: generatedHtml, // Save the generated HTML
                    status: data.status
                });
            }

            setSaveMessage({
                type: 'success',
                text: 'Wiki page saved successfully!'
            });
            
            setLastSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            
            if (!wikipage?.id && response.data.wikipage) {
                window.location.href = `/wikipages/${response.data.wikipage.id}/edit`;
            }
            
            setTimeout(() => {
                setSaveMessage({ type: '', text: '' });
            }, 3000);
            
        } catch (error) {
            console.error('Error saving wiki page:', error);
            
            let errorMessage = 'Failed to save wiki page. Please try again.';
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                errorMessage = Object.values(errors)[0][0] || errorMessage;
            }
            
            setSaveMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Function to regenerate HTML and save to database
    const handleRegenerateHtml = async () => {
        if (!wikipage?.id) return;
        
        try {
            // Generate fresh HTML with current elements
            const generatedHtml = convertElementsToHtml(data.elements);
            
            const response = await axios.post(`/wikipages/${wikipage.id}/regenerate-html`, {
                html_content: generatedHtml
            });
            
            if (response.data.success) {
                setSaveMessage({
                    type: 'success',
                    text: 'HTML regenerated and saved to database!'
                });
                
                setTimeout(() => {
                    setSaveMessage({ type: '', text: '' });
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to regenerate HTML:', error);
            setSaveMessage({
                type: 'error',
                text: 'Failed to regenerate HTML.'
            });
        }
    };

    // Handle HTML editor apply
    const handleHtmlApply = (newElements) => {
        setData(prev => ({ ...prev, elements: newElements }));
        setShowHtmlEditor(false);
        
        // Auto-save after HTML editor changes
        if (wikipage?.id) {
            const generatedHtml = convertElementsToHtml(newElements);
            axios.put(`/wikipages/${wikipage.id}/autosave`, {
                elements: newElements,
                html_content: generatedHtml,
                title: data.title,
                status: data.status
            });
        }
    };

    // Handle HTML editor open
    const handleOpenHtmlEditor = () => {
        setHtmlSource(convertElementsToHtml(data.elements));
        setShowHtmlEditor(true);
    };

    // Handle preview generated HTML
    const handlePreviewHtml = () => {
        const html = convertElementsToHtml(data.elements);
        const newWindow = window.open();
        newWindow.document.write(html);
        newWindow.document.close();
    };

    // Handle copy HTML to clipboard
    const handleCopyHtml = async () => {
        try {
            const html = convertElementsToHtml(data.elements);
            await navigator.clipboard.writeText(html);
            setSaveMessage({
                type: 'success',
                text: 'HTML copied to clipboard!'
            });
            
            setTimeout(() => {
                setSaveMessage({ type: '', text: '' });
            }, 2000);
        } catch (error) {
            console.error('Failed to copy HTML:', error);
            setSaveMessage({
                type: 'error',
                text: 'Failed to copy HTML to clipboard'
            });
        }
    };

    // Handle export HTML
    const handleExportHTML = async () => {
        try {
            // Always generate fresh HTML for export
            const generatedHtml = convertElementsToHtml(data.elements);
            
            // If we have a wikipage ID, update database with latest HTML first
            if (wikipage?.id) {
                await axios.put(`/wikipages/${wikipage.id}`, {
                    html_content: generatedHtml,
                    _method: 'PUT'
                });
                
                // Then download from backend
                const response = await axios.get(`/wikipages/${wikipage.id}/export`, {
                    responseType: 'blob'
                });
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${data.title.replace(/\s+/g, '-').toLowerCase()}.html`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 100);
            } else {
                // Fallback to client-side generation for new pages
                const blob = new Blob([generatedHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${data.title.replace(/\s+/g, '-').toLowerCase()}.html`;
                a.click();
                
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 100);
            }
            
        } catch (error) {
            console.error('Export failed, falling back to client-side:', error);
            
            // Fallback to client-side generation
            const generatedHtml = convertElementsToHtml(data.elements);
            const blob = new Blob([generatedHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.title.replace(/\s+/g, '-').toLowerCase()}.html`;
            a.click();
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        }
    };

    const handleDuplicateWikiPage = async () => {
        if (!wikipage?.id) return;
        
        if (!confirm('Duplicate this wiki page?')) return;
        
        try {
            // Generate fresh HTML for the duplicate
            const generatedHtml = convertElementsToHtml(data.elements);
            
            const response = await axios.post(`/wikipages/${wikipage.id}/duplicate`, {
                html_content: generatedHtml
            });
            
            if (response.data.success && response.data.newWikiPage) {
                window.location.href = `/wikipages/${response.data.newWikiPage.id}/edit`;
            }
        } catch (error) {
            console.error('Failed to duplicate wiki page:', error);
            alert('Failed to duplicate wiki page. Please try again.');
        }
    };

    const handlePreviewToggle = () => {
        setIsPreviewMode(!isPreviewMode);
    };

    // Helper function to create new element
    const createNewElement = (type) => {
        const baseStyles = {
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '16px',
            margin: '0px',
            fontSize: '16px',
            borderRadius: '0px',
            width: '100%',
        };

        const element = {
            id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            content: 'New Element',
            styles: baseStyles,
        };

        switch (type) {
            case ElementType.HEADER:
                element.content = 'Heading';
                element.styles.fontSize = '24px';
                element.styles.fontWeight = 'bold';
                element.styles.color = '#1f2937';
                element.styles.marginBottom = '16px';
                break;
            case ElementType.PARAGRAPH:
                element.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
                element.styles.color = '#4b5563';
                element.styles.lineHeight = '1.625';
                element.styles.marginBottom = '24px';
                break;
            case ElementType.BUTTON:
                element.content = 'Click Me';
                element.styles.backgroundColor = '#3b82f6';
                element.styles.color = '#ffffff';
                element.styles.padding = '12px 24px';
                element.styles.borderRadius = '8px';
                element.styles.width = 'auto';
                element.styles.fontWeight = '600';
                element.styles.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                element.styles.transition = 'all 0.3s ease';
                break;
            case ElementType.IMAGE:
                element.src = 'https://picsum.photos/400/300';
                element.alt = 'Sample image';
                element.styles.width = '100%';
                element.styles.maxWidth = '400px';
                element.styles.height = 'auto';
                element.styles.borderRadius = '12px';
                element.styles.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
                element.styles.marginBottom = '24px';
                break;
            case ElementType.CONTAINER:
                element.content = 'Container content goes here. You can add any HTML or text content inside.';
                element.styles.border = '1px solid #e5e7eb';
                element.styles.backgroundColor = '#f9fafb';
                element.styles.padding = '24px';
                element.styles.borderRadius = '12px';
                element.styles.minHeight = '120px';
                element.styles.marginBottom = '24px';
                break;
            case ElementType.TWO_COL:
                element.content = JSON.stringify({ 
                    left: 'Left column content. This can be text, images, or any other elements.', 
                    right: 'Right column content. You can add different content here to create balanced layouts.' 
                });
                element.styles.display = 'grid';
                element.styles.gridTemplateColumns = '1fr 1fr';
                element.styles.gap = '32px';
                element.styles.padding = '32px';
                element.styles.backgroundColor = '#ffffff';
                element.styles.borderRadius = '16px';
                element.styles.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                element.styles.marginBottom = '32px';
                break;
            case ElementType.NAVBAR:
                element.content = JSON.stringify({
                    brand: 'My Brand',
                    links: ['Home', 'About', 'Services', 'Contact'],
                    buttonText: 'Get Started',
                    buttonHref: '#'
                });
                element.styles.backgroundColor = '#ffffff';
                element.styles.padding = '16px 32px';
                element.styles.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
                element.styles.position = 'sticky';
                element.styles.top = '0';
                element.styles.zIndex = '50';
                element.styles.width = '100%';
                break;
            case ElementType.HERO:
                element.content = JSON.stringify({
                    title: 'Welcome to Our Platform',
                    subtitle: 'Discover amazing features that will transform your workflow. Join thousands of satisfied users today.',
                    cta: 'Start Free Trial',
                    ctaHref: '#'
                });
                element.styles.backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                element.styles.padding = '80px 24px';
                element.styles.textAlign = 'center';
                element.styles.color = '#ffffff';
                element.styles.borderRadius = '0';
                element.styles.marginBottom = '48px';
                break;
            case ElementType.FEATURES:
                element.content = JSON.stringify([
                    { title: 'Fast Performance', desc: 'Lightning fast loading times and optimized performance for all devices.' },
                    { title: 'Easy to Use', desc: 'Intuitive interface that makes it easy for anyone to create beautiful pages.' },
                    { title: 'Secure & Reliable', desc: 'Bank-level security and 99.9% uptime guarantee for peace of mind.' }
                ]);
                element.styles.backgroundColor = '#ffffff';
                element.styles.padding = '64px 24px';
                element.styles.marginBottom = '48px';
                break;
            case ElementType.GALLERY:
                element.content = JSON.stringify({ 
                    images: [
                        'https://picsum.photos/400/300?random=1',
                        'https://picsum.photos/400/300?random=2',
                        'https://picsum.photos/400/300?random=3',
                        'https://picsum.photos/400/300?random=4'
                    ] 
                });
                element.styles.padding = '48px 24px';
                element.styles.backgroundColor = '#f8fafc';
                element.styles.marginBottom = '48px';
                break;
            case ElementType.PRODUCT_GRID:
                element.content = JSON.stringify([
                    { name: 'Premium Plan', price: '$99/month', buttonText: 'Buy Now', image: 'https://picsum.photos/400/300?product=1' },
                    { name: 'Business Plan', price: '$199/month', buttonText: 'Buy Now', image: 'https://picsum.photos/400/300?product=2' },
                    { name: 'Enterprise Plan', price: '$399/month', buttonText: 'Contact Sales', image: 'https://picsum.photos/400/300?product=3' }
                ]);
                element.styles.padding = '48px 24px';
                element.styles.backgroundColor = '#ffffff';
                element.styles.marginBottom = '48px';
                break;
            case ElementType.CONTACT_FORM:
                element.content = JSON.stringify({
                    title: 'Get in Touch',
                    buttonText: 'Send Message',
                    labels: { 
                        firstName: 'First Name', 
                        lastName: 'Last Name', 
                        email: 'Email Address', 
                        message: 'Your Message' 
                    }
                });
                element.styles.backgroundColor = '#f1f5f9';
                element.styles.padding = '64px 24px';
                element.styles.marginBottom = '48px';
                break;
            case ElementType.FOOTER:
                element.content = JSON.stringify({
                    brand: 'My Website',
                    copyright: '© 2024 My Website. All rights reserved.',
                    links: [
                        { title: 'Product', items: ['Features', 'Pricing', 'API'] },
                        { title: 'Company', items: ['About', 'Blog', 'Careers'] },
                        { title: 'Support', items: ['Help Center', 'Contact', 'Status'] }
                    ]
                });
                element.styles.backgroundColor = '#1f2937';
                element.styles.color = '#ffffff';
                element.styles.padding = '64px 24px';
                element.styles.marginBottom = '0';
                break;
        }

        return element;
    };

    // Show HTML Editor Mode
    if (showHtmlEditor) {
        return (
            <div className="h-screen">
                <Head title={`Editing HTML: ${data.title}`} />
                <HtmlSourceEditor
                    htmlSource={htmlSource}
                    onApply={handleHtmlApply}
                    onCancel={() => setShowHtmlEditor(false)}
                    onChange={setHtmlSource}
                />
            </div>
        );
    }

    // Show Visual Editor Mode
    return (
        <div className={`h-screen selection:bg-primary-500/30 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <Head title={wikipage ? `Editing: ${wikipage.title}` : 'Create New Wiki Page'} />
            
            <form onSubmit={handleSubmit} className="h-full">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`${isFullscreen ? 'border-b border-gray-200' : 'shadow-lg'} bg-white flex items-center justify-between px-6 py-4 z-50`}>
                        <div className="flex items-center space-x-6">
                            
                            {/* Title Input */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                                    className="text-xl font-bold bg-transparent border-0 focus:ring-0 focus:border-transparent px-3 py-2 rounded-lg hover:bg-gray-50 focus:bg-white focus:shadow-md transition-all duration-300 min-w-[300px]"
                                    placeholder="Untitled Wiki Page..."
                                />
                                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary-200 group-focus-within:border-primary-500 pointer-events-none transition-all duration-300"></div>
                            </div>
                            
                            {/* Status Selector */}
                            <div className="relative">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}
                                    className="appearance-none bg-white border-2 border-gray-200 hover:border-primary-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                                >
                                    <option value="draft" className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <span>Draft</span>
                                    </option>
                                    <option value="published" className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span>Published</span>
                                    </option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            
                            {/* Save Status Indicator */}
                            {saveMessage.text && (
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
                                    saveMessage.type === 'success' 
                                        ? 'bg-green-50 border-green-200 text-green-700' 
                                        : 'bg-red-50 border-red-200 text-red-700'
                                } transition-all duration-300`}>
                                    {saveMessage.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5" />
                                    )}
                                    <span className="text-sm font-medium">{saveMessage.text}</span>
                                </div>
                            )}
                            
                            {lastSaveTime && !saveMessage.text && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                    <Clock className="w-4 h-4" />
                                    <span>Saved {lastSaveTime}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {/* HTML Tools Dropdown */}
                            <div className="relative group">
                                <button
                                    type="button"
                                    onClick={handleOpenHtmlEditor}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                                >
                                    <div className="p-1.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
                                        <Code className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span>HTML Tools</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </button>
                                
                                {/* HTML Tools Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HTML Tools</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOpenHtmlEditor}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 group/item"
                                    >
                                        <div className="p-2 bg-primary-50 rounded-lg group-hover/item:bg-primary-100 transition-colors">
                                            <Code className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Edit HTML Source</p>
                                            <p className="text-xs text-gray-500">Edit raw HTML code</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePreviewHtml}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 group/item"
                                    >
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover/item:bg-blue-100 transition-colors">
                                            <EyeIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Preview HTML</p>
                                            <p className="text-xs text-gray-500">Open in new window</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCopyHtml}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 group/item"
                                    >
                                        <div className="p-2 bg-green-50 rounded-lg group-hover/item:bg-green-100 transition-colors">
                                            <Copy className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Copy HTML</p>
                                            <p className="text-xs text-gray-500">Copy to clipboard</p>
                                        </div>
                                    </button>
                                    {wikipage?.id && (
                                        <button
                                            type="button"
                                            onClick={handleRegenerateHtml}
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 group/item border-t border-gray-100"
                                        >
                                            <div className="p-2 bg-orange-50 rounded-lg group-hover/item:bg-orange-100 transition-colors">
                                                <RefreshCw className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Regenerate HTML</p>
                                                <p className="text-xs text-gray-500">Update database HTML</p>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Preview Toggle */}
                            <button
                                type="button"
                                onClick={handlePreviewToggle}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isPreviewMode 
                                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-200' 
                                        : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg ${
                                    isPreviewMode 
                                        ? 'bg-primary-200' 
                                        : 'bg-gray-100 group-hover:bg-gray-200'
                                } transition-colors`}>
                                    {isPreviewMode ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4" />
                                    )}
                                </div>
                                <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
                            </button>
                            
                            {/* Fullscreen Toggle */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                    {isFullscreen ? (
                                        <Minimize className="w-4 h-4" />
                                    ) : (
                                        <Maximize className="w-4 h-4" />
                                    )}
                                </div>
                                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                            </button>
                            
                            {/* Export HTML */}
                            <button
                                type="button"
                                onClick={handleExportHTML}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                                <div className="p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                    <Download className="w-4 h-4 text-green-600" />
                                </div>
                                <span>Export HTML</span>
                            </button>
                            
                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 border border-transparent rounded-xl font-semibold text-sm text-white tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Wiki Page</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Main Editor Area */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar Toggle */}
                        {!isPreviewMode && !sidebarCollapsed && (
                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(true)}
                                className="absolute left-64 top-24 z-40 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        
                        {!isPreviewMode && sidebarCollapsed && (
                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(false)}
                                className="absolute left-0 top-24 z-40 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        
                        {/* Sidebar */}
                        {!isPreviewMode && !sidebarCollapsed && (
                            <div className="w-72 border-r border-gray-200 bg-white shadow-inner">
                                <Sidebar 
                                    onAddElement={(type) => {
                                        const newElement = createNewElement(type);
                                        const newElements = [...data.elements, newElement];
                                        setData(prev => ({ ...prev, elements: newElements }));
                                        setSelectedId(newElement.id);
                                    }}
                                    onLoadTemplate={(templateElements) => {
                                        setData(prev => ({ ...prev, elements: templateElements }));
                                    }}
                                />
                            </div>
                        )}
                        
                        {/* Editor Canvas */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50/50 to-gray-100/30">
                            {/* View Mode Selector */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                                <div className="flex items-center justify-center gap-2">
                                    {[
                                        { mode: 'MOBILE', icon: Smartphone, label: 'Mobile' },
                                        { mode: 'TABLET', icon: Tablet, label: 'Tablet' },
                                        { mode: 'DESKTOP', icon: Monitor, label: 'Desktop' },
                                        { mode: 'TV', icon: Tv, label: 'Wide' }
                                    ].map(({ mode, icon: Icon, label }) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setViewMode(mode)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                                viewMode === mode 
                                                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200' 
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Canvas Container */}
                            <div className="flex-1 overflow-hidden">
                                <EditorCanvas
                                    elements={data.elements}
                                    selectedId={selectedId}
                                    onSelect={setSelectedId}
                                    onDelete={(id) => {
                                        const newElements = data.elements.filter(el => el.id !== id);
                                        setData(prev => ({ ...prev, elements: newElements }));
                                        if (selectedId === id) setSelectedId(null);
                                    }}
                                    onMove={(id, direction) => {
                                        const index = data.elements.findIndex(el => el.id === id);
                                        if (index === -1) return;
                                        
                                        const newIndex = direction === 'up' ? index - 1 : index + 1;
                                        if (newIndex < 0 || newIndex >= data.elements.length) return;
                                        
                                        const newElements = [...data.elements];
                                        const [movedElement] = newElements.splice(index, 1);
                                        newElements.splice(newIndex, 0, movedElement);
                                        setData(prev => ({ ...prev, elements: newElements }));
                                    }}
                                    onReorder={(dragIndex, hoverIndex) => {
                                        const newElements = [...data.elements];
                                        const [draggedElement] = newElements.splice(dragIndex, 1);
                                        newElements.splice(hoverIndex, 0, draggedElement);
                                        setData(prev => ({ ...prev, elements: newElements }));
                                    }}
                                    onInsert={(index, type) => {
                                        const newElement = createNewElement(type);
                                        const newElements = [...data.elements];
                                        newElements.splice(index, 0, newElement);
                                        setData(prev => ({ ...prev, elements: newElements }));
                                        setSelectedId(newElement.id);
                                    }}
                                    onUpdate={(id, updates) => {
                                        const newElements = data.elements.map(el => 
                                            el.id === id ? { ...el, ...updates } : el
                                        );
                                        setData(prev => ({ ...prev, elements: newElements }));
                                    }}
                                    previewMode={isPreviewMode}
                                    viewMode={viewMode}
                                />
                            </div>
                        </div>
                        
                        {/* Properties Panel Toggle */}
                        {!isPreviewMode && selectedId && !propertiesCollapsed && (
                            <button
                                type="button"
                                onClick={() => setPropertiesCollapsed(true)}
                                className="absolute right-80 top-24 z-40 bg-white border border-gray-200 rounded-l-lg p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        
                        {!isPreviewMode && propertiesCollapsed && (
                            <button
                                type="button"
                                onClick={() => setPropertiesCollapsed(false)}
                                className="absolute right-0 top-24 z-40 bg-white border border-gray-200 rounded-l-lg p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        
                        {/* Properties Panel */}
                        {!isPreviewMode && selectedId && !propertiesCollapsed && (
                            <div className="w-80 border-l border-gray-200 bg-white shadow-inner">
                                <PropertiesPanel
                                    element={data.elements.find(el => el.id === selectedId) || null}
                                    onUpdate={(id, updates) => {
                                        const newElements = data.elements.map(el => 
                                            el.id === id ? { ...el, ...updates } : el
                                        );
                                        setData(prev => ({ ...prev, elements: newElements }));
                                    }}
                                    onDelete={(id) => {
                                        const newElements = data.elements.filter(el => el.id !== id);
                                        setData(prev => ({ ...prev, elements: newElements }));
                                        setSelectedId(null);
                                    }}
                                />
                            </div>
                        )}
                        
                        {/* Empty Properties Panel */}
                        {!isPreviewMode && !selectedId && !propertiesCollapsed && (
                            <div className="w-80 border-l border-gray-200 bg-gradient-to-b from-white to-gray-50/30 p-8 flex flex-col items-center justify-center text-gray-400">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                        <Settings className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-600 mb-2">Select an Element</p>
                                        <p className="text-sm text-gray-500 max-w-xs">
                                            Click on any element in the canvas to edit its properties, styles, and content.
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse delay-100"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse delay-200"></div>
                                            <span className="ml-2">Waiting for selection...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom Status Bar */}
                    <div className="border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>Auto-save enabled</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Layout className="w-4 h-4" />
                                <span>{data.elements.length} elements</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span>{data.title}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowHtmlPreview(true)}
                                className="text-gray-500 hover:text-primary-600 transition-colors text-xs font-medium flex items-center gap-2"
                            >
                                <Code className="w-3 h-3" />
                                View HTML Source
                            </button>
                            {wikipage?.id && (
                                <button
                                    type="button"
                                    onClick={handleDuplicateWikiPage}
                                    className="text-gray-500 hover:text-primary-600 transition-colors text-xs font-medium flex items-center gap-2"
                                >
                                    <Copy className="w-3 h-3" />
                                    Duplicate Page
                                </button>
                            )}
                            <div className="text-xs text-gray-400">
                                Ez Builder v1.2.2
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* HTML Preview Modal */}
                {showHtmlPreview && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-[fadeIn_0.3s_ease-out]">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-5/6 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-white to-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">HTML Preview</h3>
                                    <p className="text-sm text-gray-500">Generated HTML source code</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleCopyHtml}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Copy HTML
                                    </button>
                                    <button
                                        onClick={() => setShowHtmlPreview(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-gray-900 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
                                <pre className="p-6 text-gray-100 text-sm font-mono overflow-auto">
                                    {convertElementsToHtml(data.elements)}
                                </pre>
                            </div>
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    Generated with Tailwind CSS • {new Date().toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowHtmlPreview(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close Preview
                                    </button>
                                    <button
                                        onClick={handleExportHTML}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
                                    >
                                        Download HTML
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
            
            {/* HTML Info Toast */}
            {saveMessage.type === 'success' && (
                <div className="fixed bottom-4 right-4 z-50 animate-[slideUp_0.3s_ease-out]">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 max-w-sm">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">HTML Ready</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Your page HTML has been updated with Tailwind CSS classes.
                                    Use the HTML tools menu to copy or export.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}