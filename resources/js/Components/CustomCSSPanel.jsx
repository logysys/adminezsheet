import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faRedo, faCode, faPalette } from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons'; // Changed from faCss3 to faCss3Alt

export const CustomCSSPanel = ({ element, onUpdate }) => {
  const [customCSS, setCustomCSS] = useState(element.customCSS || '');
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [cssPreview, setCssPreview] = useState('');
  
  // Update local state when element changes
  useEffect(() => {
    setCustomCSS(element.customCSS || '');
    validateCSS(element.customCSS || '');
  }, [element.id, element.customCSS]);

  const validateCSS = (css) => {
    // Simple CSS validation - check for balanced braces
    const stack = [];
    for (let char of css) {
      if (char === '{') stack.push('{');
      if (char === '}') {
        if (stack.length === 0) {
          setIsValid(false);
          return;
        }
        stack.pop();
      }
    }
    setIsValid(stack.length === 0);
  };

  const handleCSSChange = (value) => {
    setCustomCSS(value);
    validateCSS(value);
    
    // Update preview
    setCssPreview(value);
  };

  const handleSave = () => {
    if (isValid) {
      onUpdate(element.id, { customCSS });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCustomCSS('');
    setCssPreview('');
    onUpdate(element.id, { customCSS: '' });
  };

  const handleApplyPreset = (preset) => {
    let newCSS = '';
    switch (preset) {
      case 'hover':
        newCSS = `#${element.id}:hover {\n  transform: scale(1.05);\n  transition: transform 0.3s ease;\n}`;
        break;
      case 'focus':
        newCSS = `#${element.id}:focus {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}`;
        break;
      case 'animation':
        newCSS = `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n#${element.id} {\n  animation: fadeIn 0.5s ease-in-out;\n}`;
        break;
      case 'responsive':
        newCSS = `@media (max-width: 768px) {\n  #${element.id} {\n    width: 100% !important;\n    margin: 10px 0;\n  }\n}`;
        break;
    }
    handleCSSChange(newCSS);
  };

  const cssPresets = [
    { id: 'hover', label: 'Hover Effect', description: 'Add scale animation on hover' },
    { id: 'focus', label: 'Focus Style', description: 'Add focus outline for accessibility' },
    { id: 'animation', label: 'Fade Animation', description: 'Add fade-in animation' },
    { id: 'responsive', label: 'Mobile Responsive', description: 'Make element responsive on mobile' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
          <FontAwesomeIcon icon={faCss3Alt} className="text-blue-400" /> {/* Changed to faCss3Alt */}
          Custom CSS
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            title="Copy CSS"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-green-400' : ''} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            title="Reset CSS"
          >
            <FontAwesomeIcon icon={faRedo} className="text-xs" />
            Reset
          </button>
        </div>
      </div>
      
      {/* CSS Editor */}
      <div className="relative">
        <textarea
          value={customCSS}
          onChange={(e) => handleCSSChange(e.target.value)}
          className={`w-full bg-slate-950 border ${isValid ? 'border-slate-700' : 'border-red-500'} rounded px-3 py-2 text-sm font-mono text-green-400 min-h-[150px] max-h-[300px] resize-y`}
          placeholder={`/* Add custom CSS for ${element.name} */
#${element.id} {
  /* Your custom styles here */
}`}
          spellCheck="false"
        />
        <div className="absolute bottom-2 right-2 text-xs">
          {isValid ? (
            <span className="text-green-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faCheck} className="text-xs" />
              Valid CSS
            </span>
          ) : (
            <span className="text-red-400">⚠️ Unbalanced braces</span>
          )}
        </div>
      </div>

      {/* CSS Preview */}
      {cssPreview && (
        <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faCode} className="text-slate-400 text-xs" />
            <span className="text-xs text-slate-400">Preview:</span>
          </div>
          <style dangerouslySetInnerHTML={{ __html: cssPreview }} />
          <div 
            className="text-xs text-slate-300 font-mono whitespace-pre overflow-x-auto max-h-[100px] p-2 bg-slate-900 rounded"
            style={{ fontSize: '11px' }}
          >
            {cssPreview}
          </div>
        </div>
      )}

      {/* CSS Presets */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FontAwesomeIcon icon={faPalette} className="text-slate-400 text-xs" />
          <span className="text-xs text-slate-400">Quick Presets:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cssPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-left transition-colors group"
            >
              <div className="text-xs font-medium text-slate-300 group-hover:text-white">
                {preset.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CSS Variables Reference */}
      <div className="p-3 bg-slate-800/30 rounded border border-slate-700">
        <div className="text-xs text-slate-400 mb-2">💡 CSS Variables Available:</div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--primary-color)</code>
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--secondary-color)</code>
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--text-color)</code>
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--bg-color)</code>
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--border-radius)</code>
          <code className="bg-slate-800 p-1 rounded text-blue-300">var(--spacing-unit)</code>
        </div>
      </div>

      {/* Target Reference */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>🎯 Target this element:</p>
        <code className="block bg-slate-800 p-2 rounded font-mono text-green-400">
          #{element.id}
        </code>
        <p>🎯 Target children:</p>
        <code className="block bg-slate-800 p-2 rounded font-mono text-green-400">
          #{element.id} {'>'} *
        </code>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleSave}
        disabled={!isValid}
        className={`w-full py-2 rounded text-sm font-medium transition-all ${isValid ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
      >
        {isValid ? 'Apply CSS Styles' : 'Fix CSS Errors First'}
      </button>
    </div>
  );
};