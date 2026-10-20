import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLayerGroup, faCopy, faPaste, faClone } from '@fortawesome/free-solid-svg-icons';

export const PropertiesPanel = ({ element, onUpdate, onDelete, onDuplicate, activeTab = 'styles', setActiveTab, activeBreakpoint = 'desktop', gridMode = false }) => {
  if (!element) {
    return (
      <div className="w-72 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center h-full select-none">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-slate-600" />
        </div>
        <h3 className="text-slate-300 font-medium mb-2">No Selection</h3>
        <p className="text-sm text-slate-500">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleStyleChange = (key, value) => {
    onUpdate(element.id, {
      style: { ...element.style, [key]: value }
    });
  };

  const updateChartData = (key, value) => {
    if (!element.chartData) return;
    
    const newChartData = { ...element.chartData };
    
    if (key === 'type') newChartData.type = value;
    if (key === 'labels') newChartData.labels = value.split(',').map((s) => s.trim());
    if (key === 'label') newChartData.datasets[0].label = value;
    if (key === 'data') newChartData.datasets[0].data = value.split(',').map((s) => Number(s.trim()));
    
    onUpdate(element.id, { chartData: newChartData });
  };

  const updateTableData = (key, value) => {
    if (!element.tableData) return;
    
    const newTableData = { ...element.tableData };
    
    if (key === 'headers') {
      newTableData.headers = value.split(',').map(s => s.trim());
    }
    if (key === 'rows') {
      newTableData.rows = value.split('\n').map(line => line.split(',').map(cell => cell.trim()));
    }
    
    onUpdate(element.id, { tableData: newTableData });
  };

  // Tabs for properties panel
  const tabs = [
    { id: 'styles', label: 'Styles' },
    { id: 'layout', label: 'Layout' },
    { id: 'content', label: 'Content' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Header with element info and actions */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-200">Properties</h2>
          <p className="text-xs text-slate-500 capitalize">{element.type} • {element.id.substring(0, 8)}</p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onDuplicate(element.id)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 w-8 h-8 flex items-center justify-center rounded transition-colors"
            title="Duplicate Element"
          >
            <FontAwesomeIcon icon={faClone} className="text-sm" />
          </button>
          <button 
            onClick={() => onDelete(element.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 w-8 h-8 flex items-center justify-center rounded transition-colors"
            title="Delete Element"
          >
            <FontAwesomeIcon icon={faTrash} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 px-4 pt-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab?.(tab.id)}
            className={`flex-1 py-2 text-xs font-medium ${activeTab === tab.id ? 'text-primary-500 border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Identity Section */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase">Identity</label>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">ID</span>
              <input 
                disabled
                value={element.id}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-500"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Name</span>
              <input 
                value={element.name}
                onChange={(e) => onUpdate(element.id, { name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Chart Configuration */}
        {element.type === 'chart' && element.chartData && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Chart Config</label>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Type</span>
              <select 
                value={element.chartData.type}
                onChange={(e) => updateChartData('type', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="doughnut">Doughnut</option>
              </select>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Labels (comma separated)</span>
              <input 
                value={element.chartData.labels.join(', ')}
                onChange={(e) => updateChartData('labels', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Dataset Label</span>
              <input 
                value={element.chartData.datasets[0].label}
                onChange={(e) => updateChartData('label', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Values (comma separated)</span>
              <input 
                value={element.chartData.datasets[0].data.join(', ')}
                onChange={(e) => updateChartData('data', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          </div>
        )}
        
        {/* Table Configuration */}
        {element.type === 'table' && element.tableData && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Table Data</label>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Headers (comma separated)</span>
              <input 
                value={element.tableData.headers.join(', ')}
                onChange={(e) => updateTableData('headers', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Rows (CSV format)</span>
              <textarea 
                value={element.tableData.rows.map(row => row.join(', ')).join('\n')}
                onChange={(e) => updateTableData('rows', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200 min-h-[100px]"
                placeholder="Cell 1, Cell 2&#10;Cell 3, Cell 4"
              />
            </div>
          </div>
        )}

        {/* Content for text and button elements */}
        {(element.type === 'text' || element.type === 'button') && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Content</label>
            <textarea
              value={element.content || ''}
              onChange={(e) => onUpdate(element.id, { content: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-2 text-sm text-slate-200 focus:border-primary-500 outline-none min-h-[80px]"
            />
          </div>
        )}
        
        {/* Link URL for Buttons */}
        {element.type === 'button' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Action</label>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Link URL</span>
              <input 
                value={element.href || ''}
                onChange={(e) => onUpdate(element.id, { href: e.target.value })}
                placeholder="https:// or #"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Target</span>
              <select 
                value={element.target || '_self'}
                onChange={(e) => onUpdate(element.id, { target: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              >
                <option value="_self">Same Tab</option>
                <option value="_blank">New Tab</option>
              </select>
            </div>
          </div>
        )}

        {/* Image Source */}
        {element.type === 'image' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase">Source URL</label>
            <input
              value={element.src || ''}
              onChange={(e) => onUpdate(element.id, { src: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200 focus:border-primary-500 outline-none"
            />
            <div>
              <span className="text-xs text-slate-400 block mb-1">Alt Text</span>
              <input
                value={element.alt || ''}
                onChange={(e) => onUpdate(element.id, { alt: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Styles Section */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase">Appearance</label>
          
          {/* Background and Text Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Background</span>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={element.style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0"
                />
                <input 
                  type="text"
                  value={element.style.backgroundColor || ''}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 text-xs text-slate-200"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Text Color</span>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={element.style.color || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0"
                />
                <input 
                  type="text"
                  value={element.style.color || ''}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-1 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Width and Height */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Width</span>
              <input 
                value={element.style.width || 'auto'}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Height</span>
              <input 
                value={element.style.height || 'auto'}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          </div>

          {/* Padding and Margin */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Padding</span>
              <input 
                value={element.style.padding || '0px'}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Margin</span>
              <input 
                value={element.style.margin || '0px'}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          </div>

          {/* Gap and Border Radius */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Gap</span>
              <input 
                value={element.style.gap || '0px'}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Border Radius</span>
              <input 
                value={element.style.borderRadius || '0px'}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          </div>

          {/* Font Size */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Font Size</span>
            <input 
              value={element.style.fontSize || '16px'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </div>

          {/* Text Alignment */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Alignment</span>
            <div className="flex border border-slate-700 rounded overflow-hidden">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => handleStyleChange('textAlign', align)}
                  className={`flex-1 py-1 text-xs capitalize ${element.style.textAlign === align ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          {/* Border */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Border Width</span>
              <input 
                value={element.style.borderWidth || '0px'}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Border Color</span>
              <input 
                type="color"
                value={element.style.borderColor || '#000000'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-full h-8 bg-transparent border-0 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Flex Layout for Containers */}
          {element.type === 'container' && (
            <div>
              <span className="text-xs text-slate-400 block mb-1">Flex Layout</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    handleStyleChange('display', 'flex');
                    handleStyleChange('flexDirection', 'row');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded text-xs border ${element.style.flexDirection === 'row' ? 'border-primary-500 bg-primary-900/20 text-primary-400' : 'border-slate-700 text-slate-400'}`}
                >
                  Row
                </button>
                <button 
                  onClick={() => {
                    handleStyleChange('display', 'flex');
                    handleStyleChange('flexDirection', 'column');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded text-xs border ${element.style.flexDirection === 'column' ? 'border-primary-500 bg-primary-900/20 text-primary-400' : 'border-slate-700 text-slate-400'}`}
                >
                  Column
                </button>
              </div>
            </div>
          )}

          {/* Grid Layout for Grid Elements */}
          {element.type === 'grid' && (
            <div>
              <span className="text-xs text-slate-400 block mb-1">Grid Columns</span>
              <input 
                value={element.style.gridTemplateColumns || '1fr 1fr'}
                onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                placeholder="1fr 1fr 1fr"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
              />
            </div>
          )}

          {/* Opacity */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Opacity</span>
            <div className="flex items-center gap-2">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={element.style.opacity || 1}
                onChange={(e) => handleStyleChange('opacity', e.target.value)}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-8">
                {((element.style.opacity || 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Box Shadow */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Box Shadow</span>
            <input 
              value={element.style.boxShadow || ''}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              placeholder="0 2px 8px rgba(0,0,0,0.1)"
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </div>
        </div>

        {/* Responsive Breakpoints */}
        {activeBreakpoint !== 'desktop' && (
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-300">
                Editing for {activeBreakpoint} viewport
              </span>
            </div>
            <p className="text-xs text-blue-400">
              Changes made here will only apply to this screen size.
            </p>
          </div>
        )}

        {/* Grid Mode Helper */}
        {gridMode && (
          <div className="p-3 bg-slate-800 border border-slate-700 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-xs font-medium text-slate-300">
                Grid Mode Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Element position will snap to grid ({gridMode ? 'on' : 'off'}).
            </p>
          </div>
        )}
      </div>

      {/* Footer with additional actions */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(JSON.stringify(element, null, 2))}
            className="text-slate-400 hover:text-slate-300"
          >
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
};