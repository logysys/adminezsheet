import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faBullseye, faHandPointUp, faPalette, faMagic, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export const ElementStatesPanel = ({ element, onUpdate }) => {
  const [activeState, setActiveState] = useState('normal');
  
  const states = [
    { id: 'normal', label: 'Normal', icon: faMousePointer, color: 'text-slate-400' },
    { id: 'hover', label: 'Hover', icon: faHandPointUp, color: 'text-blue-400' },
    { id: 'focus', label: 'Focus', icon: faBullseye, color: 'text-purple-400' },
    { id: 'active', label: 'Active', icon: faHandPointUp, color: 'text-green-400' },
    { id: 'disabled', label: 'Disabled', icon: faMousePointer, color: 'text-gray-400' }
  ];

  const getStateStyles = () => {
    return element.states?.[activeState] || {};
  };

  const handleStateStyleChange = (key, value) => {
    const newStates = {
      ...element.states,
      [activeState]: {
        ...getStateStyles(),
        [key]: value
      }
    };
    
    onUpdate(element.id, { states: newStates });
  };

  const resetStateStyles = () => {
    const newStates = { ...element.states };
    delete newStates[activeState];
    
    onUpdate(element.id, { states: newStates });
  };

  const copyFromNormal = () => {
    if (activeState !== 'normal' && element.states?.normal) {
      onUpdate(element.id, {
        states: {
          ...element.states,
          [activeState]: { ...element.states.normal }
        }
      });
    }
  };

  if (!element) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
          <FontAwesomeIcon icon={faMagic} className="text-slate-500" />
          Element States
        </label>
        <div className="flex gap-1">
          <button
            onClick={copyFromNormal}
            disabled={activeState === 'normal'}
            className="text-xs text-slate-400 hover:text-slate-300 disabled:opacity-30 px-2 py-1 rounded hover:bg-slate-800"
            title="Copy from Normal State"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="text-xs mr-1" />
            Copy
          </button>
          <button
            onClick={resetStateStyles}
            className="text-xs text-slate-400 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800"
            title="Reset State Styles"
          >
            Reset
          </button>
        </div>
      </div>

      {/* State Selection Tabs */}
      <div className="flex border border-slate-700 rounded overflow-hidden">
        {states.map(state => (
          <button
            key={state.id}
            onClick={() => setActiveState(state.id)}
            className={`flex-1 py-2 text-xs capitalize flex flex-col items-center gap-1 ${activeState === state.id ? 'bg-primary-900/20 text-primary-400 border-b-2 border-primary-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <FontAwesomeIcon icon={state.icon} className={`text-sm ${state.color}`} />
            <span>{state.label}</span>
          </button>
        ))}
      </div>

      {/* State-specific Styles */}
      {activeState !== 'normal' && (
        <div className="space-y-3 p-3 bg-slate-800/30 rounded border border-slate-700">
          <div className="text-xs text-slate-400 mb-2">
            Styles for {activeState} state will override normal styles.
          </div>
          
          {/* Background and Text Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Background</span>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={getStateStyles().backgroundColor || (activeState === 'disabled' ? '#f3f4f6' : element.style.backgroundColor || '#ffffff')}
                  onChange={(e) => handleStateStyleChange('backgroundColor', e.target.value)}
                  className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0"
                />
                <input 
                  type="text"
                  value={getStateStyles().backgroundColor || ''}
                  onChange={(e) => handleStateStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 text-xs text-slate-200"
                  placeholder={activeState === 'disabled' ? '#f3f4f6' : element.style.backgroundColor || 'transparent'}
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Text Color</span>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={getStateStyles().color || (activeState === 'disabled' ? '#9ca3af' : element.style.color || '#000000')}
                  onChange={(e) => handleStateStyleChange('color', e.target.value)}
                  className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0"
                />
                <input 
                  type="text"
                  value={getStateStyles().color || ''}
                  onChange={(e) => handleStateStyleChange('color', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 text-xs text-slate-200"
                  placeholder={activeState === 'disabled' ? '#9ca3af' : element.style.color || '#000000'}
                />
              </div>
            </div>
          </div>

          {/* Border Color */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Border Color</span>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={getStateStyles().borderColor || element.style.borderColor || '#000000'}
                onChange={(e) => handleStateStyleChange('borderColor', e.target.value)}
                className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0"
              />
              <input 
                type="text"
                value={getStateStyles().borderColor || ''}
                onChange={(e) => handleStateStyleChange('borderColor', e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 text-xs text-slate-200"
                placeholder={element.style.borderColor || 'transparent'}
              />
            </div>
          </div>

          {/* Transform Effects */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Transform</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={getStateStyles().transform || ''}
                onChange={(e) => handleStateStyleChange('transform', e.target.value)}
                placeholder="scale(1.05)"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
              <select
                value={getStateStyles().transition || ''}
                onChange={(e) => handleStateStyleChange('transition', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              >
                <option value="">Default transition</option>
                <option value="all 0.2s ease">Fast (0.2s)</option>
                <option value="all 0.3s ease">Medium (0.3s)</option>
                <option value="all 0.5s ease">Slow (0.5s)</option>
                <option value="none">No transition</option>
              </select>
            </div>
          </div>

          {/* Opacity */}
          {activeState === 'disabled' && (
            <div>
              <span className="text-xs text-slate-400 block mb-1">Opacity</span>
              <div className="flex items-center gap-2">
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={getStateStyles().opacity || 0.6}
                  onChange={(e) => handleStateStyleChange('opacity', e.target.value)}
                  className="flex-1"
                />
                <span className="text-xs text-slate-400 w-8">
                  {((getStateStyles().opacity || 0.6) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          {/* Box Shadow for Hover/Focus */}
          {(activeState === 'hover' || activeState === 'focus') && (
            <div>
              <span className="text-xs text-slate-400 block mb-1">Box Shadow</span>
              <input 
                value={getStateStyles().boxShadow || ''}
                onChange={(e) => handleStateStyleChange('boxShadow', e.target.value)}
                placeholder="0 4px 12px rgba(0,0,0,0.15)"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          )}

          {/* Cursor Style */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Cursor</span>
            <select
              value={getStateStyles().cursor || ''}
              onChange={(e) => handleStateStyleChange('cursor', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
            >
              <option value="">Default</option>
              <option value="pointer">Pointer</option>
              <option value="not-allowed">Not Allowed</option>
              <option value="text">Text</option>
              <option value="wait">Wait</option>
              <option value="grab">Grab</option>
            </select>
          </div>

          {/* Preset Animations */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Animation Presets</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => handleStateStyleChange('transform', 'scale(1.05)')}
                className="py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded"
              >
                Scale Up
              </button>
              <button
                onClick={() => handleStateStyleChange('transform', 'translateY(-2px)')}
                className="py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded"
              >
                Lift Up
              </button>
              <button
                onClick={() => {
                  handleStateStyleChange('backgroundColor', '#2563eb');
                  handleStateStyleChange('color', '#ffffff');
                }}
                className="py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded"
              >
                Darken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Note */}
      <div className="text-xs text-slate-500 italic">
        💡 State styles are applied when users interact with the element in preview mode.
      </div>
    </div>
  );
};