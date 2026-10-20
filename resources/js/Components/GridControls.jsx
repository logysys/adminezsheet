import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faGrip, faArrowsAltH, faArrowsAltV, faCompress } from '@fortawesome/free-solid-svg-icons';

export const GridControls = ({ element, onUpdate }) => {
  const handleGridChange = (key, value) => {
    onUpdate(element.id, {
      style: { 
        ...element.style, 
        display: 'grid',
        [key]: value 
      }
    });
  };

  const gridTemplates = [
    { value: '1fr', label: '1 Column' },
    { value: '1fr 1fr', label: '2 Columns' },
    { value: '1fr 1fr 1fr', label: '3 Columns' },
    { value: '1fr 1fr 1fr 1fr', label: '4 Columns' },
    { value: 'repeat(auto-fit, minmax(200px, 1fr))', label: 'Auto Fit' },
  ];

  const gapSizes = [
    { value: '0px', label: 'None' },
    { value: '8px', label: 'Small' },
    { value: '16px', label: 'Medium' },
    { value: '24px', label: 'Large' },
    { value: '32px', label: 'X-Large' },
  ];

  const alignOptions = [
    { value: 'stretch', label: 'Stretch' },
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FontAwesomeIcon icon={faBorderAll} className="text-slate-500" />
        <label className="text-xs font-semibold text-slate-500 uppercase">Grid Layout</label>
      </div>
      
      {/* Grid Template */}
      <div>
        <span className="text-xs text-slate-400 block mb-2">Grid Template</span>
        <div className="grid grid-cols-2 gap-2">
          {gridTemplates.map(template => (
            <button
              key={template.value}
              onClick={() => handleGridChange('gridTemplateColumns', template.value)}
              className={`py-2 px-3 rounded text-xs border transition-colors ${
                element.style.gridTemplateColumns === template.value 
                  ? 'border-primary-500 bg-primary-900/20 text-primary-400' 
                  : 'border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Grid Template */}
      <div>
        <span className="text-xs text-slate-400 block mb-1">Custom Columns</span>
        <input
          value={element.style.gridTemplateColumns || '1fr'}
          onChange={(e) => handleGridChange('gridTemplateColumns', e.target.value)}
          placeholder="1fr 1fr 1fr or repeat(3, 1fr)"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
        />
      </div>

      {/* Rows */}
      <div>
        <span className="text-xs text-slate-400 block mb-1">Rows</span>
        <input
          value={element.style.gridTemplateRows || 'auto'}
          onChange={(e) => handleGridChange('gridTemplateRows', e.target.value)}
          placeholder="auto auto"
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
        />
      </div>

      {/* Gap Controls */}
      <div>
        <span className="text-xs text-slate-400 block mb-2">Gap</span>
        <div className="grid grid-cols-5 gap-1">
          {gapSizes.map(gap => (
            <button
              key={gap.value}
              onClick={() => handleGridChange('gap', gap.value)}
              className={`py-1.5 rounded text-xs ${
                element.style.gap === gap.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={gap.label}
            >
              {gap.value.replace('px', '')}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="range"
            min="0"
            max="40"
            step="4"
            value={parseInt(element.style.gap) || 0}
            onChange={(e) => handleGridChange('gap', `${e.target.value}px`)}
            className="w-full"
          />
        </div>
      </div>

      {/* Alignment Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowsAltH} className="text-xs" />
            Justify Items
          </span>
          <select
            value={element.style.justifyItems || 'stretch'}
            onChange={(e) => handleGridChange('justifyItems', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
          >
            {alignOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowsAltV} className="text-xs" />
            Align Items
          </span>
          <select
            value={element.style.alignItems || 'stretch'}
            onChange={(e) => handleGridChange('alignItems', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
          >
            {alignOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Auto Flow */}
      <div>
        <span className="text-xs text-slate-400 block mb-1">Auto Flow</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleGridChange('gridAutoFlow', 'row')}
            className={`flex-1 py-1.5 px-2 rounded text-xs border ${
              element.style.gridAutoFlow === 'row' 
                ? 'border-primary-500 bg-primary-900/20 text-primary-400' 
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Row
          </button>
          <button
            onClick={() => handleGridChange('gridAutoFlow', 'column')}
            className={`flex-1 py-1.5 px-2 rounded text-xs border ${
              element.style.gridAutoFlow === 'column' 
                ? 'border-primary-500 bg-primary-900/20 text-primary-400' 
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Column
          </button>
          <button
            onClick={() => handleGridChange('gridAutoFlow', 'dense')}
            className={`flex-1 py-1.5 px-2 rounded text-xs border ${
              element.style.gridAutoFlow === 'dense' 
                ? 'border-primary-500 bg-primary-900/20 text-primary-400' 
                : 'border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Dense
          </button>
        </div>
      </div>

      {/* Grid Areas */}
      {element.style.display === 'grid' && (
        <div>
          <span className="text-xs text-slate-400 block mb-1">Grid Areas</span>
          <textarea
            value={element.style.gridTemplateAreas || ''}
            onChange={(e) => handleGridChange('gridTemplateAreas', e.target.value)}
            placeholder='"header header header" "sidebar content content"'
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 min-h-[60px] font-mono"
          />
        </div>
      )}

      {/* Reset Grid */}
      <div className="pt-2 border-t border-slate-800">
        <button
          onClick={() => {
            onUpdate(element.id, {
              style: {
                ...element.style,
                display: 'flex',
                gridTemplateColumns: undefined,
                gridTemplateRows: undefined,
                gap: undefined,
                justifyItems: undefined,
                alignItems: undefined,
                gridAutoFlow: undefined
              }
            });
          }}
          className="w-full py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faCompress} className="text-xs" />
          Switch to Flexbox
        </button>
      </div>
    </div>
  );
};