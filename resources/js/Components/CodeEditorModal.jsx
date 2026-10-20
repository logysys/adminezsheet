import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCode, faXmark, faSave, faCheck, faTriangleExclamation, 
  faCopy, faDownload, faFileCode, faUndo, faRedo, 
  faSearch, faExpand, faCompress, faEye, faCodeBranch
} from '@fortawesome/free-solid-svg-icons';

// Helper: CamelCase to Kebab-Case (e.g. backgroundColor -> background-color)
export const camelToKebab = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Helper: Kebab-Case to CamelCase
export const kebabToCamel = (str) => str.replace(/-./g, x => x[1].toUpperCase());

// Helper: Generate HTML string from Editor Elements
export const elementsToHtmlFragment = (elements, indent = 0) => {
  const spaces = '  '.repeat(indent);
  
  return elements.map(el => {
    // Convert style object to CSS string
    const styleStr = el.style 
      ? Object.entries(el.style)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
          .join('; ')
      : '';

    // Determine Tag Name
    let tagName = 'div';
    if (el.type === 'image') tagName = 'img';
    else if (el.type === 'button') tagName = el.href ? 'a' : 'button';
    else if (el.type === 'header') tagName = 'header';
    else if (el.type === 'footer') tagName = 'footer';
    else if (el.type === 'hero' || el.type === 'testimonial' || el.type === 'gallery') tagName = 'section';
    else if (el.type === 'product') tagName = 'article';
    else if (el.type === 'chart') tagName = 'div';
    else if (el.type === 'table') tagName = 'div';
    else if (el.type === 'input') tagName = 'input';
    else if (el.type === 'form') tagName = 'form';
    else if (el.type === 'text') {
      // Determine appropriate text tag based on style
      if (el.style?.fontSize && parseInt(el.style.fontSize) >= 24) {
        tagName = 'h1';
      } else if (el.style?.fontSize && parseInt(el.style.fontSize) >= 20) {
        tagName = 'h2';
      } else if (el.style?.fontSize && parseInt(el.style.fontSize) >= 18) {
        tagName = 'h3';
      } else {
        tagName = 'p';
      }
    }

    // Attributes
    const attrs = [
      `id="${el.id}"`,
      `data-type="${el.type}"`,
      styleStr ? `style="${styleStr}"` : '',
      el.src ? `src="${el.src}"` : '',
      el.href ? `href="${el.href}"` : '',
      el.target ? `target="${el.target}"` : '',
      el.alt ? `alt="${el.alt}"` : '',
      el.placeholder ? `placeholder="${el.placeholder}"` : '',
      el.type === 'input' && el.inputType ? `type="${el.inputType}"` : '',
      el.type === 'button' && !el.href ? `type="button"` : '',
      el.required ? 'required' : '',
      el.disabled ? 'disabled' : '',
      el.readOnly ? 'readonly' : '',
    ].filter(Boolean).join(' ');

    // Self-closing tags
    if (el.type === 'image' || el.type === 'input') {
      return `${spaces}<${tagName} ${attrs} />`;
    }

    // Chart special handling
    if (el.type === 'chart') {
      const chartData = el.chartData ? JSON.stringify(el.chartData) : '{}';
      return `${spaces}<div ${attrs} data-chart='${chartData}'>\n${spaces}  <canvas></canvas>\n${spaces}</div>`;
    }

    // Table handling
    if (el.type === 'table' && el.tableData) {
      const rowsHtml = el.tableData.rows.map((row, i) => 
        `${spaces}      <tr>\n${row.map(cell => `${spaces}        <td>${cell}</td>`).join('\n')}\n${spaces}      </tr>`
      ).join('\n');

      const headerHtml = `
${spaces}      <tr>
${el.tableData.headers.map(h => `${spaces}        <th>${h}</th>`).join('\n')}
${spaces}      </tr>`;

      return `${spaces}<div ${attrs}>
${spaces}  <div style="overflow-x:auto;">
${spaces}    <table>
${spaces}      <thead>${headerHtml}
${spaces}      </thead>
${spaces}      <tbody>
${rowsHtml}
${spaces}      </tbody>
${spaces}    </table>
${spaces}  </div>
${spaces}</div>`;
    }

    // Elements with text content
    if ((el.type === 'text' || el.type === 'button') && el.content) {
      return `${spaces}<${tagName} ${attrs}>${el.content}</${tagName}>`;
    }

    // Form handling
    if (el.type === 'form') {
      const childrenHtml = el.children && el.children.length > 0 
        ? `\n${elementsToHtmlFragment(el.children, indent + 1)}\n${spaces}` 
        : '';
      return `${spaces}<${tagName} ${attrs}>${childrenHtml}</${tagName}>`;
    }

    // Containers with children
    const childrenHtml = el.children && el.children.length > 0 
      ? `\n${elementsToHtmlFragment(el.children, indent + 1)}\n${spaces}` 
      : '';

    return `${spaces}<${tagName} ${attrs}>${childrenHtml}</${tagName}>`;
  }).join('\n');
};

// Generate full HTML template
export const getFullHtmlTemplate = (bodyContent, title = 'ez.wiki Export') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8fafc; font-weight: 600; }
    tr:nth-child(even) { background-color: #f8fafc; }
    input, textarea, select { 
      width: 100%; 
      padding: 10px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      font-size: 14px; 
    }
    button, .button, a[href].button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    button:hover, .button:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>
${bodyContent}
<script>
  // Initialize charts
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    document.querySelectorAll('[data-chart]').forEach(function(container) {
      try {
        const canvas = container.querySelector('canvas');
        const config = JSON.parse(container.getAttribute('data-chart'));
        
        if (canvas && config) {
          new Chart(canvas, {
            type: config.type,
            data: {
              labels: config.labels || [],
              datasets: config.datasets || []
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    });
    
    // Add form validation
    document.querySelectorAll('form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted! (This is a demo)');
      });
    });
  });
</script>
</body>
</html>`;
};

// Parse HTML back to elements
const parseNode = (node) => {
  // Skip scripts/styles
  if (['SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE', 'HEAD'].includes(node.tagName)) {
    return null;
  }

  const datasetType = node.getAttribute('data-type');
  let type = 'container';

  // Infer type from tag or data-type
  if (datasetType) {
    type = datasetType;
  } else {
    const tag = node.tagName.toLowerCase();
    if (tag === 'img') type = 'image';
    else if (tag === 'button') type = 'button';
    else if (tag === 'input') type = 'input';
    else if (tag === 'form') type = 'form';
    else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'section', 'article', 'header', 'footer'].includes(tag)) {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(tag)) {
        type = 'text';
      } else if (tag === 'header') {
        type = 'header';
      } else if (tag === 'footer') {
        type = 'footer';
      } else {
        type = 'container';
      }
    }
  }

  // Parse Style
  const style = {};
  if (node.hasAttribute('style')) {
    const styleDecl = node.getAttribute('style') || '';
    styleDecl.split(';').forEach(rule => {
      const [key, value] = rule.split(':');
      if (key && value) {
        style[kebabToCamel(key.trim())] = value.trim();
      }
    });
  }

  // Parse Chart Data
  let chartData = undefined;
  if (type === 'chart') {
    const json = node.getAttribute('data-chart');
    if (json) {
      try {
        chartData = JSON.parse(json);
      } catch (e) {
        console.error('Error parsing chart data:', e);
      }
    }
  }

  // Parse Table Data
  let tableData = undefined;
  if (type === 'table' || node.querySelector('table')) {
    const table = node.querySelector('table') || node;
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => 
      Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
    );
    
    if (headers.length > 0 || rows.length > 0) {
      tableData = { headers, rows };
    }
  }

  // Get content and attributes
  const content = ['text', 'button'].includes(type) ? node.textContent.trim() : undefined;
  const href = node.getAttribute('href') || undefined;
  const src = node.getAttribute('src') || undefined;
  const alt = node.getAttribute('alt') || undefined;
  const placeholder = node.getAttribute('placeholder') || undefined;
  const inputType = node.getAttribute('type') || undefined;
  const target = node.getAttribute('target') || undefined;
  const required = node.hasAttribute('required') || undefined;
  const disabled = node.hasAttribute('disabled') || undefined;

  const id = node.getAttribute('id') || `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Parse children (skip for certain types)
  const children = [];
  if (!['table', 'chart', 'input', 'img'].includes(type)) {
    Array.from(node.children).forEach(child => {
      const parsedChild = parseNode(child);
      if (parsedChild) children.push(parsedChild);
    });
  }

  return {
    id,
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1) + ' ' + id.slice(-4),
    style,
    content,
    src,
    alt,
    href,
    target,
    placeholder,
    inputType,
    required,
    disabled,
    chartData,
    tableData,
    children
  };
};

export const CodeEditorModal = ({ isOpen, onClose, elements, onSave }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [codeHistory, setCodeHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const textareaRef = useRef(null);

  // Initialize code when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const fragment = elementsToHtmlFragment(elements, 2);
        const fullHtml = getFullHtmlTemplate(fragment);
        setCode(fullHtml);
        setError(null);
        
        // Initialize history
        setCodeHistory([fullHtml]);
        setHistoryIndex(0);
      } catch (e) {
        setError("Failed to generate HTML: " + e.message);
      }
    }
  }, [isOpen, elements]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Ctrl+Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Shift+Z or Ctrl+Y to redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
      
      // Ctrl+F to find
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowReplace(false);
        document.querySelector('#search-input')?.focus();
      }
      
      // Ctrl+H to replace
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowReplace(true);
        document.querySelector('#search-input')?.focus();
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  const handleSave = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      
      // Extract body children (excluding scripts)
      const bodyChildren = Array.from(doc.body.children)
        .filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
      
      const parsedElements = bodyChildren
        .map(child => parseNode(child))
        .filter(el => el !== null);

      onSave(parsedElements);
      onClose();
    } catch (e) {
      setError(`Error parsing HTML: ${e.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ez-wiki-page.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError(null);
    
    // Add to history if different from last
    if (newCode !== codeHistory[historyIndex]) {
      const newHistory = codeHistory.slice(0, historyIndex + 1);
      newHistory.push(newCode);
      setCodeHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCode(codeHistory[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  const handleSearch = () => {
    if (!searchQuery || !textareaRef.current) return;
    
    const text = textareaRef.current.value;
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    
    if (index !== -1) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(index, index + searchQuery.length);
    }
  };

  const handleReplace = () => {
    if (!searchQuery || !textareaRef.current) return;
    
    const text = textareaRef.current.value;
    const newText = text.replace(new RegExp(searchQuery, 'gi'), replaceQuery);
    handleCodeChange(newText);
  };

  const handleReplaceAll = () => {
    if (!searchQuery || !textareaRef.current) return;
    
    const text = textareaRef.current.value;
    const newText = text.replace(new RegExp(searchQuery, 'gi'), replaceQuery);
    handleCodeChange(newText);
  };

  const handleFormatCode = () => {
    // Simple code formatting - indent based on tags
    const lines = code.split('\n');
    let indent = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indent--;
      }
      
      const indentedLine = '  '.repeat(Math.max(0, indent)) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent++;
      }
      
      return indentedLine;
    }).join('\n');
    
    handleCodeChange(formatted);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-0 ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}>
      <div className={`bg-slate-900 border border-slate-700 rounded-xl w-full h-full shadow-2xl flex flex-col overflow-hidden ${isFullscreen ? 'rounded-none border-0' : 'max-w-6xl'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <FontAwesomeIcon icon={faCode} className="text-slate-200" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Source Code Editor</h3>
              <p className="text-xs text-slate-500">Edit HTML/CSS directly. Changes update the canvas.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="bg-slate-900 p-3 border-b border-slate-800 flex flex-wrap gap-2">
          {/* History Controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
              title="Undo (Ctrl+Z)"
            >
              <FontAwesomeIcon icon={faUndo} className="text-sm" />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= codeHistory.length - 1}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
              title="Redo (Ctrl+Y)"
            >
              <FontAwesomeIcon icon={faRedo} className="text-sm" />
            </button>
          </div>

          {/* Search/Replace */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1">
            <FontAwesomeIcon icon={faSearch} className="text-slate-500 text-sm" />
            <input
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-200 w-32"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={() => setShowReplace(!showReplace)}
              className="text-xs text-slate-500 hover:text-slate-300"
              title="Replace (Ctrl+H)"
            >
              Replace
            </button>
          </div>

          {showReplace && (
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1">
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-200 w-32"
              />
              <button 
                onClick={handleReplace}
                className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-slate-700 rounded"
              >
                Replace
              </button>
              <button 
                onClick={handleReplaceAll}
                className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-slate-700 rounded"
              >
                Replace All
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={handleFormatCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faCodeBranch} />
              Format
            </button>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
            >
              <FontAwesomeIcon icon={copyFeedback ? faCheck : faCopy} className={copyFeedback ? 'text-green-400' : ''} />
              {copyFeedback ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faDownload} />
              Download
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-slate-950 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="absolute inset-0 w-full h-full bg-slate-950 text-blue-100 font-mono text-sm p-6 outline-none resize-none"
            spellCheck="false"
            placeholder="<!DOCTYPE html>..."
            style={{ tabSize: 2 }}
          />
          
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900/50 border-r border-slate-800 overflow-hidden">
            <div className="text-right pr-3 py-6 font-mono text-xs text-slate-500 select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {error ? (
                <span className="text-red-400 text-sm flex items-center gap-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  {error}
                </span>
              ) : (
                <span className="text-emerald-500 text-sm flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} />
                  Valid HTML
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              Lines: {code.split('\n').length} • Characters: {code.length}
            </div>
            <div className="text-xs text-slate-500">
              History: {historyIndex + 1}/{codeHistory.length}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20"
            >
              <FontAwesomeIcon icon={faSave} />
              Apply Changes
            </button>
          </div>
        </div>

        {/* Quick Help */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-500">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">Ctrl+S</kbd>
              <span>Save</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">Ctrl+Z</kbd>
              <span>Undo</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">Ctrl+Y</kbd>
              <span>Redo</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">Ctrl+F</kbd>
              <span>Find</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">Ctrl+H</kbd>
              <span>Replace</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">ESC</kbd>
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Close'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorModal;