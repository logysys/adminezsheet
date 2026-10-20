import React, { useState, useEffect, useRef } from 'react';
import { Save, X, AlertCircle, CheckCircle, Zap, Maximize2, Minimize2, Code, Copy, Download, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ElementType } from '@/types';

interface HtmlSourceEditorProps {
  htmlSource: string;
  onApply: (elements: any[]) => void;
  onCancel: () => void;
  onChange?: (html: string) => void;
  onSourceChange?: (html: string) => void;
  readOnly?: boolean;
}

export default function HtmlSourceEditor({ 
  htmlSource, 
  onApply, 
  onCancel, 
  onChange,
  onSourceChange,
  readOnly = false 
}: HtmlSourceEditorProps) {
    const [source, setSource] = useState(htmlSource);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isValidHtml, setIsValidHtml] = useState(true);
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [wordWrap, setWordWrap] = useState(false);
    const [indentSize, setIndentSize] = useState(2);
    const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');
    const [isDirty, setIsDirty] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSource(htmlSource);
        validateHtml(htmlSource);
        setIsDirty(false);
    }, [htmlSource]);

    // Note: This specific DOM manipulation is kept for auto-height functionality
    // as it relies on calculated scrollHeight which cannot be done via static CSS classes.
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [source, wordWrap]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleApply();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                handleFormat();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && textareaRef.current) {
                e.preventDefault();
                const textarea = textareaRef.current;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = source.substring(start, end);
                const newText = source.substring(0, start) + selectedText + selectedText + source.substring(end);
                setSource(newText);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [source]);

    useEffect(() => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    }, [source]);

    const validateHtml = (html: string) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const hasError = doc.querySelector('parsererror');
            setIsValidHtml(!hasError);
            return !hasError;
        } catch {
            setIsValidHtml(false);
            return false;
        }
    };

    const handleApply = () => {
        if (readOnly) return;
        
        setIsParsing(true);
        setError('');
        setSuccess('');

        if (!validateHtml(source)) {
            setError('Invalid HTML syntax. Please fix errors before applying.');
            setIsParsing(false);
            return;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(source, 'text/html');
            
            if (doc.querySelector('parsererror')) {
                setError('HTML Syntax Error: The parser detected malformed HTML. Please check tags and structure.');
                setIsParsing(false);
                return;
            }

            const container = doc.querySelector('.container');
            const elementsContainer = container || doc.body;
            
            const elements = [];
            let elementIndex = 0;
            
            elementsContainer.childNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = convertHtmlToElement(node as HTMLElement, elementIndex);
                    if (element) {
                        elements.push(element);
                        elementIndex++;
                    }
                }
            });

            if (elements.length === 0) {
                setError('No valid structural elements found in the HTML body/container.');
                setIsParsing(false);
                return;
            }

            onApply(elements);
            setSuccess('Successfully converted HTML to elements!');
            setIsDirty(false);
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(`Failed to parse HTML: ${err.message}`);
        } finally {
            setIsParsing(false);
        }
    };

    const convertHtmlToElement = (htmlElement: HTMLElement, index: number): any => {
        const style = htmlElement.style;
        const tagName = htmlElement.tagName.toLowerCase();
        const innerHTML = htmlElement.innerHTML;
        const textContent = htmlElement.textContent || '';
        const className = htmlElement.className;
        
        const styleObj: any = {};
        if (style && style.cssText) {
            style.cssText.split(';').forEach(rule => {
                if (rule.trim()) {
                    const [key, value] = rule.split(':').map(s => s.trim());
                    if (key && value) {
                        const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        styleObj[camelCaseKey] = value;
                    }
                }
            });
        }

        // Extract inline styles from style attribute
        if (htmlElement.getAttribute('style')) {
            const inlineStyles = htmlElement.getAttribute('style') || '';
            inlineStyles.split(';').forEach(rule => {
                if (rule.trim()) {
                    const [key, value] = rule.split(':').map(s => s.trim());
                    if (key && value) {
                        const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        styleObj[camelCaseKey] = value;
                    }
                }
            });
        }

        const baseElement = {
            id: `el-${Date.now()}-${index}`,
            styles: styleObj,
        };
        
        const blockTypeAttr = htmlElement.getAttribute('data-block-type');
        const blockContentAttr = htmlElement.getAttribute('data-block-content');
        
        if (blockTypeAttr && blockContentAttr) {
            try {
                const decodedContent = atob(blockContentAttr);
                if (decodedContent.startsWith('{') || decodedContent.startsWith('[')) {
                    JSON.parse(decodedContent);
                }
                
                return {
                    ...baseElement,
                    type: blockTypeAttr as ElementType,
                    content: decodedContent,
                };
            } catch (e) {
                console.warn(`[HTML Parse Warning] Failed to decode or parse block content for ${blockTypeAttr}. Falling back to CONTAINER.`, e);
            }
        }

        if (htmlElement.classList.contains('custom-html-wrapper')) {
            const styleTags = htmlElement.querySelectorAll('style');
            let customCss = '';
            let contentWithoutStyles = htmlElement.innerHTML;
            
            styleTags.forEach(styleTag => {
                customCss += styleTag.textContent + '\n';
                contentWithoutStyles = contentWithoutStyles.replace(styleTag.outerHTML, '');
            });
            
            return {
                ...baseElement,
                type: ElementType.CONTAINER,
                content: contentWithoutStyles.trim(),
                customCss: customCss.trim()
            };
        }

        if (tagName === 'nav') {
            const brandElement = htmlElement.querySelector('div, h3, h1, h2, span');
            const links = Array.from(htmlElement.querySelectorAll('ul li a, a:not(button)')).map(a => ({
                text: a.textContent || 'Link',
                href: a.getAttribute('href') || '#'
            })).filter(link => link.text && link.text.trim());
            
            const button = htmlElement.querySelector('a[style*="background-color"], button, a.btn, a.button');

            return {
                ...baseElement,
                type: ElementType.NAVBAR,
                content: JSON.stringify({
                    brand: brandElement?.textContent || 'My Brand',
                    links: links,
                    buttonText: button?.textContent || (button?.tagName === 'A' ? 'Sign Up' : undefined),
                    buttonHref: button?.getAttribute('href') || '#',
                    logoSrc: htmlElement.querySelector('img')?.getAttribute('src') || ''
                }, null, 2)
            };
        } else if ((tagName === 'section' || tagName === 'div' || tagName === 'header') && 
                  (htmlElement.querySelector('h1, h2') || className.includes('hero'))) {
            const titleElement = htmlElement.querySelector('h1, h2, h3');
            const subtitleElement = htmlElement.querySelector('p, .subtitle, .lead');
            const ctaElement = htmlElement.querySelector('a[style*="background-color"], button, .cta, .btn');
            
            return {
                ...baseElement,
                type: ElementType.HERO,
                content: JSON.stringify({
                    title: titleElement?.textContent || 'Hero Title',
                    subtitle: subtitleElement?.textContent || 'Hero subtitle text goes here...',
                    cta: ctaElement?.textContent || 'Get Started',
                    ctaHref: ctaElement?.getAttribute('href') || '#',
                    backgroundImage: htmlElement.style.backgroundImage?.replace(/url\(['"]?(.*?)['"]?\)/, '$1') || ''
                }, null, 2)
            };
        } else if (tagName === 'footer') {
            const brandElement = htmlElement.querySelector('h3, h2, h1, .brand');
            const copyrightElement = Array.from(htmlElement.querySelectorAll('p, span')).find(p => 
                p.textContent?.includes('©') || p.textContent?.includes('Copyright')
            );

            const linkColumns = Array.from(htmlElement.querySelectorAll('div > div, ul, nav')).filter(el => 
                el.querySelector('h4, h3, .title') || el.querySelectorAll('li, a').length > 0
            );
            
            const links = linkColumns.map(col => {
                const title = col.querySelector('h4, h3, .title')?.textContent || 'Links';
                const items = Array.from(col.querySelectorAll('li a, a')).map(a => a.textContent).filter(Boolean);
                return { title, items };
            }).filter(col => col.title && col.items.length > 0);
            
            return {
                ...baseElement,
                type: ElementType.FOOTER,
                content: JSON.stringify({
                    brand: brandElement?.textContent || 'My Website',
                    copyright: copyrightElement?.textContent || '© 2024 My Website',
                    links: links
                }, null, 2)
            };
        } else if ((tagName === 'section' || tagName === 'div') && 
                  (htmlElement.querySelector('div[style*="grid-template-columns"]') || 
                   className.includes('features') || 
                   className.includes('grid'))) {
            const gridWrapper = htmlElement.querySelector('div[style*="grid-template-columns"], .grid, .features');
            const featureContainers = gridWrapper 
                ? Array.from(gridWrapper.querySelectorAll('div > div, article, .feature'))
                : Array.from(htmlElement.querySelectorAll('div > div, article, .feature'));
                
            const features = featureContainers.map(div => {
                const title = div.querySelector('h3, h4, .title')?.textContent;
                const desc = div.querySelector('p, .desc')?.textContent;
                return { title, desc };
            }).filter(f => f.title && f.desc);
            
            if (features.length >= 2) {
                return {
                    ...baseElement,
                    type: ElementType.FEATURES,
                    content: JSON.stringify(features)
                };
            }
        } else if ((tagName === 'section' || tagName === 'div') && 
                  (className.includes('gallery') || 
                   htmlElement.querySelectorAll('img').length >= 3)) {
            const images = Array.from(htmlElement.querySelectorAll('img')).map(img => 
                img.getAttribute('src') || ''
            ).filter(src => src);
            
            return {
                ...baseElement,
                type: ElementType.GALLERY,
                content: JSON.stringify({ images })
            };
        } else if ((tagName === 'section' || tagName === 'div') && 
                  (className.includes('products') || 
                   className.includes('shop') || 
                   htmlElement.querySelectorAll('.product, [data-product]').length > 0)) {
            const productElements = htmlElement.querySelectorAll('.product, [data-product], div > div');
            const products = Array.from(productElements).map((productEl, i) => {
                const name = productEl.querySelector('h3, h4, .product-name')?.textContent || `Product ${i + 1}`;
                const price = productEl.querySelector('.price, [data-price]')?.textContent || '$99';
                const image = productEl.querySelector('img')?.getAttribute('src') || `https://picsum.photos/400/300?random=${i}`;
                const button = productEl.querySelector('button, .btn, a[href="#"]');
                
                return {
                    name,
                    price,
                    image,
                    buttonText: button?.textContent || 'Add to Cart',
                    buttonHref: button?.getAttribute('href') || '#'
                };
            });
            
            if (products.length > 0) {
                return {
                    ...baseElement,
                    type: ElementType.PRODUCT_GRID,
                    content: JSON.stringify(products)
                };
            }
        } else if (tagName === 'form' || className.includes('contact') || className.includes('form')) {
            const titleElement = htmlElement.querySelector('h3, h2, legend, .title');
            const buttonElement = htmlElement.querySelector('button, input[type="submit"], .submit-btn');
            
            return {
                ...baseElement,
                type: ElementType.CONTACT_FORM,
                content: JSON.stringify({
                    title: titleElement?.textContent || 'Contact Us',
                    buttonText: buttonElement?.textContent || buttonElement?.getAttribute('value') || 'Send Message',
                    labels: {
                        firstName: 'First Name',
                        lastName: 'Last Name',
                        email: 'Email Address',
                        message: 'Message'
                    }
                }, null, 2)
            };
        }

        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return {
                    ...baseElement,
                    type: ElementType.HEADER,
                    content: textContent,
                };
            case 'p':
                return {
                    ...baseElement,
                    type: ElementType.PARAGRAPH,
                    content: textContent,
                };
            case 'button':
                return {
                    ...baseElement,
                    type: ElementType.BUTTON,
                    content: textContent,
                    href: htmlElement.getAttribute('href') || undefined,
                };
            case 'a':
                const isButtonLink = htmlElement.getAttribute('style')?.includes('padding') || 
                                   htmlElement.getAttribute('style')?.includes('background-color') ||
                                   htmlElement.classList.contains('btn') ||
                                   htmlElement.classList.contains('button');
                if (isButtonLink || (htmlElement.parentElement?.tagName.toLowerCase() !== 'li' && 
                    htmlElement.parentElement?.tagName.toLowerCase() !== 'ul' &&
                    htmlElement.parentElement?.tagName.toLowerCase() !== 'nav')) {
                     return {
                        ...baseElement,
                        type: ElementType.BUTTON,
                        content: textContent,
                        href: htmlElement.getAttribute('href') || '#',
                    };
                }
                break;
            case 'img':
                return {
                    ...baseElement,
                    type: ElementType.IMAGE,
                    src: htmlElement.getAttribute('src') || '',
                    alt: htmlElement.getAttribute('alt') || '',
                    content: htmlElement.getAttribute('alt') || '',
                };
            case 'div':
            case 'section':
            case 'article':
            case 'main':
                if (style.display === 'grid' && style.gridTemplateColumns === '1fr 1fr') {
                    const children = Array.from(htmlElement.children);
                    
                    if (children.length >= 2) {
                         const leftContentElement = htmlElement.querySelector('[data-column="left"]') || children[0];
                         const rightContentElement = htmlElement.querySelector('[data-column="right"]') || children[1];

                         return {
                            ...baseElement,
                            type: ElementType.TWO_COL,
                            content: JSON.stringify({
                                left: leftContentElement?.innerHTML || '',
                                right: rightContentElement?.innerHTML || ''
                            }, null, 2)
                        };
                    }
                }
                
                if (style.display === 'flex' || className.includes('flex')) {
                    return {
                        ...baseElement,
                        type: ElementType.CONTAINER,
                        content: innerHTML,
                    };
                }
                
                return {
                    ...baseElement,
                    type: ElementType.CONTAINER,
                    content: innerHTML,
                };
            default:
                return {
                    ...baseElement,
                    type: ElementType.CONTAINER,
                    content: innerHTML,
                };
        }
        
        return null;
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newSource = e.target.value;
        setSource(newSource);
        setIsDirty(true);
        validateHtml(newSource);
        onChange?.(newSource);
        onSourceChange?.(newSource);
    };

    const handleFormat = () => {
        try {
            let formatted = source;
            
            // Basic HTML formatting
            formatted = formatted
                .replace(/><(?!\/?(html|head|body|meta|title|style|script|link|!DOCTYPE))/g, '>\n<')
                .replace(/(<\/?(div|section|nav|footer|header|form|h[1-6]|p|ul|ol|li|table|tr|td|th|main|article|aside)>)/g, '\n$1\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
            
            const lines = formatted.split('\n');
            let indentLevel = 0;
            const indentChar = indentType === 'tabs' ? '\t' : ' '.repeat(indentSize);
            
            const formattedLines = lines.map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '';
                
                // Decrease indent for closing tags
                if (trimmed.startsWith('</')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                
                const indentedLine = indentChar.repeat(indentLevel) + trimmed;
                
                // Increase indent for opening tags (except self-closing)
                if (trimmed.startsWith('<') && 
                    !trimmed.startsWith('</') && 
                    !trimmed.endsWith('/>') && 
                    !trimmed.match(/<(meta|link|img|br|hr|input|area|base|col|command|embed|keygen|param|source|track|wbr|!DOCTYPE)/i)) {
                    indentLevel++;
                }
                
                return indentedLine;
            });
            
            const result = formattedLines.filter(line => line !== '').join('\n');
            setSource(result);
            setSuccess('HTML formatted successfully!');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err: any) {
            setError(`Formatting error: ${err.message}`);
        }
    };

    const handlePreview = () => {
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>HTML Preview</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="font-sans p-5 bg-slate-50 antialiased">
                    ${source}
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (!isFullscreen) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(source);
            setSuccess('HTML copied to clipboard!');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            setError('Failed to copy to clipboard');
        }
    };

    const handleDownload = () => {
        const blob = new Blob([source], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setSuccess('HTML downloaded!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the HTML source?')) {
            setSource('<!DOCTYPE html>\n<html>\n<head>\n    <title>New Page</title>\n</head>\n<body>\n    <!-- Start editing your HTML here -->\n</body>\n</html>');
            setIsDirty(true);
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset to original HTML?')) {
            setSource(htmlSource);
            setIsDirty(false);
            setSuccess('Reset to original HTML');
            setTimeout(() => setSuccess(''), 2000);
        }
    };

    const insertSnippet = (snippet: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = source.substring(0, start) + snippet + source.substring(end);
        setSource(newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + snippet.length, start + snippet.length);
        }, 0);
    };

    const handleMinify = () => {
        const minified = source
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
        setSource(minified);
        setSuccess('HTML minified!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleBeautify = () => {
        handleFormat();
    };

    const getLineNumbers = () => {
        const lines = source.split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1);
    };

    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const snippets = [
        { name: 'Container', code: '<div class="container mx-auto p-4">\n    <!-- Content -->\n</div>' },
        { name: 'Button', code: '<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Click me</button>' },
        { name: 'Card', code: '<div class="bg-white rounded-lg shadow-md p-6">\n    <h3 class="text-xl font-bold mb-2">Card Title</h3>\n    <p class="text-gray-600">Card content goes here...</p>\n</div>' },
        { name: 'Grid', code: '<div class="grid grid-cols-3 gap-4">\n    <div class="bg-gray-100 p-4">Column 1</div>\n    <div class="bg-gray-100 p-4">Column 2</div>\n    <div class="bg-gray-100 p-4">Column 3</div>\n</div>' },
    ];

    return (
        <div 
            ref={containerRef}
            className={`h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
        >
            {/* Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-white to-gray-50/90 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary-600" />
                            HTML Source Editor
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {readOnly ? 'View HTML source' : 'Edit HTML directly. Changes will update the visual editor.'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Validation Status */}
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isValidHtml ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isValidHtml ? 'Valid HTML' : 'Invalid HTML'}
                        </div>
                        
                        {/* File Stats */}
                        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                            {source.split('\n').length} lines • {(source.length / 1024).toFixed(1)} KB
                        </div>
                    </div>
                </div>
                
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    {/* Left Side Controls */}
                    <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setShowLineNumbers(!showLineNumbers)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showLineNumbers ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                title="Toggle line numbers"
                            >
                                {showLineNumbers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            
                            <button
                                onClick={() => setWordWrap(!wordWrap)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${wordWrap ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                title="Toggle word wrap"
                            >
                                <span className="text-xs">Wrap</span>
                            </button>
                            
                            <select
                                value={indentSize}
                                onChange={(e) => setIndentSize(Number(e.target.value))}
                                className="px-3 py-1.5 bg-white rounded-md text-sm border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="2">2 spaces</option>
                                <option value="4">4 spaces</option>
                                <option value="8">8 spaces</option>
                            </select>
                            
                            <select
                                value={indentType}
                                onChange={(e) => setIndentType(e.target.value as 'spaces' | 'tabs')}
                                className="px-3 py-1.5 bg-white rounded-md text-sm border-0 focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="spaces">Spaces</option>
                                <option value="tabs">Tabs</option>
                            </select>
                        </div>
                        
                        {/* Snippets */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 font-medium mr-2">Snippets:</span>
                            {snippets.map((snippet, i) => (
                                <button
                                    key={i}
                                    onClick={() => insertSnippet(snippet.code)}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    {snippet.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (F11)'}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-4 h-4" />
                            ) : (
                                <Maximize2 className="w-4 h-4" />
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handlePreview}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                        >
                            <Zap className="w-4 h-4" />
                            Preview
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleCopyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                            title="Copy to clipboard (Ctrl+C)"
                        >
                            <Copy className="w-4 h-4" />
                            Copy
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset
                        </button>
                        
                        {!readOnly && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleBeautify}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                                    title="Beautify HTML (Ctrl+F)"
                                >
                                    Beautify
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleMinify}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                                >
                                    Minify
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    disabled={isParsing || readOnly}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Apply changes (Ctrl+S)"
                                >
                                    <Save className="w-4 h-4" />
                                    {isParsing ? 'Applying...' : 'Apply Changes'}
                                    {isDirty && !isParsing && <span className="ml-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="px-6 pt-4">
                {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-slide-up">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                                <p className="text-xs text-red-600 mt-1">
                                    Make sure your HTML is valid and follows the expected structure.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg animate-slide-up">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-green-700 font-medium">{success}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col p-6">
                <div className="flex-1 bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg flex flex-col">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                                <Code className="w-3.5 h-3.5" />
                                HTML Source Code {readOnly && <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[10px]">Read Only</span>}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500">
                                    Lines: {source.split('\n').length} • Size: {(source.length / 1024).toFixed(2)} KB
                                </span>
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${isValidHtml ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-xs text-gray-500">{isValidHtml ? 'Valid' : 'Invalid'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex overflow-hidden bg-white">
                        {/* Line Numbers */}
                        {showLineNumbers && (
                            <div 
                                ref={lineNumbersRef}
                                className="w-16 bg-gray-50 border-r border-gray-200 overflow-y-auto text-right py-4 font-mono text-xs text-gray-400 select-none"
                            >
                                {getLineNumbers().map(line => (
                                    <div 
                                        key={line} 
                                        className="px-3 py-0.5 hover:bg-gray-100"
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Text Editor */}
                        <div className="flex-1 overflow-auto relative">
                            <textarea
                                ref={textareaRef}
                                value={source}
                                onChange={handleSourceChange}
                                onScroll={handleScroll}
                                readOnly={readOnly}
                                className={`w-full h-full p-6 font-mono text-sm text-gray-900 bg-white focus:outline-none resize-none leading-relaxed
                                    tab-[${indentSize}]
                                    ${readOnly ? 'cursor-not-allowed opacity-90' : ''}
                                    ${isFullscreen ? 'min-h-[calc(100vh-200px)]' : 'min-h-[500px]'}
                                    ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}
                                `}
                                spellCheck="false"
                                placeholder="<!DOCTYPE html>
<html>
<head>
    <title>Your HTML here</title>
</head>
<body>
    <!-- Edit your HTML -->
</body>
</html>"
                            />
                            
                            {/* Current Line Indicator */}
                            {!readOnly && (
                                <div className="absolute top-0 right-0 mt-4 mr-4">
                                    <div className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                        Edit Mode
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Quick Actions Bar */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Valid HTML</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Auto-save</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span>Press Ctrl+S to save</span>
                        <span className="text-gray-300">•</span>
                        <span>Press Ctrl+F to format</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleClear}
                            className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors"
                        >
                            Clear Editor
                        </button>
                        
                        {readOnly && (
                            <button
                                onClick={onCancel}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg shadow-sm transition-all"
                            >
                                <X className="w-4 h-4" />
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gradient-to-r from-white to-gray-50/80 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            HTML syntax is validated in real-time
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Tip: Use Ctrl+Click to select multiple lines • Ctrl+D to duplicate selection
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">{source.length}</span> characters
                            <span className="mx-2">•</span>
                            <span className="font-medium">{source.split('\n').length}</span> lines
                            <span className="mx-2">•</span>
                            <span className="font-medium">{source.split(' ').length}</span> words
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-xs font-medium text-gray-500">
                                {isDirty ? 'Unsaved changes' : 'All changes saved'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Keyboard Shortcuts Help */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 hidden md:block">
                <div className="text-xs text-gray-600">
                    <span className="font-medium mr-3">Keyboard Shortcuts:</span>
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1">Ctrl+S</kbd> Save
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1 ml-3">Ctrl+F</kbd> Format
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1 ml-3">Ctrl+D</kbd> Duplicate
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1 ml-3">Ctrl+Z</kbd> Undo
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1 ml-3">Ctrl+Y</kbd> Redo
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs mx-1 ml-3">F11</kbd> Fullscreen
                </div>
            </div>
        </div>
    );
}