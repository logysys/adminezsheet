import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFont, faImage, faBox, faTableColumns, faSquare, faArrowPointer,
  faList, faPlus, faChevronRight, faChevronDown, faLayerGroup,
  faHeading, faImages, faQuoteLeft, faShoePrints, faChartPie, faTag, faTable,
  faBorderAll, faBars, faSearch, faFilter, faSlidersH,
  faCube, faShapes, faObjectGroup, faSquareFull, faCircle,
  faT, faFileLines, faSquarePollVertical
} from '@fortawesome/free-solid-svg-icons';

// Removed faInputPipe as it doesn't exist

const DraggableTool = ({ type, label, icon, color = 'text-slate-400', onDragStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeout = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/react-dnd', type);
    setIsDragging(true);
    onDragStart(type);
    
    // Clear timeout if exists
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
    
    // Reset dragging state after animation completes
    dragTimeout.current = setTimeout(() => {
      setIsDragging(false);
    }, 200);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-primary-500 rounded-lg cursor-grab active:cursor-grabbing transition-all group ${isDragging ? 'scale-95 opacity-70' : ''}`}
    >
      <div className={`${color} group-hover:text-primary-400 w-5 h-5 flex items-center justify-center rounded bg-slate-900/50`}>
        <FontAwesomeIcon icon={icon} className="text-sm" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white block">{label}</span>
        <span className="text-xs text-slate-500 group-hover:text-slate-400 block capitalize">{type}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <FontAwesomeIcon icon={faArrowPointer} className="text-slate-500 text-xs" />
      </div>
    </div>
  );
};

const LayerItem = ({ element, depth, selectedId, onSelect, searchQuery = '' }) => {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedId === element.id;
  const hasChildren = element.children && element.children.length > 0;

  // Determine icon based on type
  const getIconForType = (type) => {
    const icons = {
      container: faBox,
      text: faFont,
      image: faImage,
      button: faSquare,
      header: faHeading,
      footer: faShoePrints,
      hero: faTableColumns,
      testimonial: faQuoteLeft,
      gallery: faImages,
      chart: faChartPie,
      product: faTag,
      table: faTable,
      grid: faBorderAll,
      form: faFileLines,
      input: faT,
      card: faCube,
      navbar: faBars,
      divider: faSlidersH
    };
    return icons[type] || faCube;
  };

  const getColorForType = (type) => {
    const colors = {
      container: 'text-blue-400',
      text: 'text-green-400',
      image: 'text-purple-400',
      button: 'text-red-400',
      header: 'text-indigo-400',
      footer: 'text-gray-400',
      hero: 'text-cyan-400',
      chart: 'text-yellow-400',
      table: 'text-orange-400',
      grid: 'text-pink-400',
      form: 'text-teal-400',
      input: 'text-emerald-400'
    };
    return colors[type] || 'text-slate-400';
  };

  const icon = getIconForType(element.type);
  const color = getColorForType(element.type);

  // Filter children based on search query
  const filteredChildren = hasChildren && searchQuery 
    ? element.children.filter(child => 
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : element.children;

  const hasVisibleChildren = filteredChildren && filteredChildren.length > 0;

  return (
    <div>
      <div 
        onClick={() => onSelect(element.id)}
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors group ${isSelected ? 'bg-primary-900/40 text-primary-200 border-l-2 border-primary-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <div 
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className={`w-4 h-4 flex items-center justify-center ${hasChildren ? 'hover:text-white cursor-pointer' : 'opacity-0 cursor-default'}`}
        >
          {hasChildren && (
            <FontAwesomeIcon 
              icon={expanded ? faChevronDown : faChevronRight} 
              className="text-[10px] text-slate-500 group-hover:text-slate-400"
            />
          )}
        </div>
        
        <div className={`w-4 h-4 flex items-center justify-center ${color}`}>
          <FontAwesomeIcon icon={icon} className="text-xs" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs truncate select-none font-medium">
            {element.name || element.type}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {element.type} • {element.id.substring(0, 8)}
          </div>
        </div>
        
        {hasChildren && (
          <span className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
            {element.children.length}
          </span>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div>
          {filteredChildren.map(child => (
            <LayerItem 
              key={child.id} 
              element={child} 
              depth={depth + 1} 
              selectedId={selectedId} 
              onSelect={onSelect}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ 
  elements, 
  selectedId, 
  onSelect, 
  onDragStart,
  activeBreakpoint = 'desktop',
  setActiveBreakpoint
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState('all');

  const elementCategories = [
    {
      title: 'Layout',
      elements: [
        { type: 'container', label: 'Container', icon: faBox, color: 'text-blue-400' },
        { type: 'grid', label: 'Grid', icon: faBorderAll, color: 'text-pink-400' },
        { type: 'hero', label: 'Hero Section', icon: faTableColumns, color: 'text-cyan-400' },
        { type: 'header', label: 'Header', icon: faHeading, color: 'text-indigo-400' },
        { type: 'footer', label: 'Footer', icon: faShoePrints, color: 'text-gray-400' },
        { type: 'card', label: 'Card', icon: faCube, color: 'text-orange-400' },
      ]
    },
    {
      title: 'Content',
      elements: [
        { type: 'text', label: 'Text Block', icon: faFont, color: 'text-green-400' },
        { type: 'image', label: 'Image', icon: faImage, color: 'text-purple-400' },
        { type: 'button', label: 'Button', icon: faSquare, color: 'text-red-400' },
        { type: 'table', label: 'Table', icon: faTable, color: 'text-orange-400' },
        { type: 'chart', label: 'Chart', icon: faChartPie, color: 'text-yellow-400' },
        { type: 'divider', label: 'Divider', icon: faSlidersH, color: 'text-slate-400' },
      ]
    },
    {
      title: 'Forms',
      elements: [
        { type: 'form', label: 'Form', icon: faFileLines, color: 'text-teal-400' },
        { type: 'input', label: 'Input Field', icon: faT, color: 'text-emerald-400' },
      ]
    },
    {
      title: 'Advanced',
      elements: [
        { type: 'gallery', label: 'Gallery', icon: faImages, color: 'text-violet-400' },
        { type: 'testimonial', label: 'Testimonial', icon: faQuoteLeft, color: 'text-rose-400' },
        { type: 'product', label: 'Product Card', icon: faTag, color: 'text-amber-400' },
        { type: 'navbar', label: 'Navigation', icon: faBars, color: 'text-sky-400' },
      ]
    }
  ];

  // Filter elements based on search
  const filteredElements = searchQuery 
    ? elements.filter(el => 
        el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : elements;

  // Count total elements recursively
  const countTotalElements = (els) => {
    let count = els.length;
    els.forEach(el => {
      if (el.children && el.children.length > 0) {
        count += countTotalElements(el.children);
      }
    });
    return count;
  };

  const totalElements = countTotalElements(elements);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none z-10">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'add' ? 'text-white border-b-2 border-primary-500 bg-slate-800/50' : 'text-slate-500 hover:bg-slate-800/30'}`}
        >
          <FontAwesomeIcon icon={faPlus} /> Elements
        </button>
        <button 
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'layers' ? 'text-white border-b-2 border-primary-500 bg-slate-800/50' : 'text-slate-500 hover:bg-slate-800/30'}`}
        >
          <FontAwesomeIcon icon={faList} /> Layers ({totalElements})
        </button>
      </div>
      
      {activeTab === 'add' ? (
        <>
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Element Filter */}
          <div className="px-3 py-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-slate-500 text-xs" />
              <select
                value={elementFilter}
                onChange={(e) => setElementFilter(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
              >
                <option value="all">All Elements</option>
                <option value="layout">Layout Only</option>
                <option value="content">Content Only</option>
                <option value="form">Forms Only</option>
                <option value="advanced">Advanced Only</option>
              </select>
            </div>
          </div>

          {/* Elements Grid */}
          <div className="p-3 flex flex-col gap-4 overflow-y-auto flex-1">
            {elementCategories
              .filter(category => 
                elementFilter === 'all' || 
                elementFilter === 'layout' && category.title === 'Layout' ||
                elementFilter === 'content' && category.title === 'Content' ||
                elementFilter === 'form' && category.title === 'Forms' ||
                elementFilter === 'advanced' && category.title === 'Advanced'
              )
              .filter(category => 
                !searchQuery || 
                category.elements.some(el => 
                  el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  el.type.toLowerCase().includes(searchQuery.toLowerCase())
                )
              )
              .map(category => (
                <div key={category.title} className="mb-4">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>{category.title}</span>
                    <span className="text-slate-600 text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                      {category.elements.length}
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {category.elements
                      .filter(el => 
                        !searchQuery || 
                        el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        el.type.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(el => (
                        <DraggableTool 
                          key={el.type}
                          type={el.type}
                          label={el.label}
                          icon={el.icon}
                          color={el.color}
                          onDragStart={onDragStart}
                        />
                      ))}
                  </div>
                </div>
              ))}
            
            {searchQuery && (
              <div className="text-center py-8 text-slate-500 text-sm">
                <FontAwesomeIcon icon={faSearch} className="text-2xl mb-2 opacity-30" />
                <p>Searching for "{searchQuery}"</p>
                <p className="text-xs mt-1">Drag elements to the canvas</p>
              </div>
            )}
          </div>

          {/* Footer Help */}
          <div className="p-3 bg-slate-800/50 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <FontAwesomeIcon icon={faArrowPointer} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  <span className="text-slate-400 font-medium">Tip:</span> Drag elements onto the canvas
                </p>
                <p className="text-[10px] text-slate-600">
                  Use layers panel to organize and select elements
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Layers Search */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Search layers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Breakpoint Selector */}
          <div className="px-3 py-2 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faSlidersH} className="text-slate-500 text-xs" />
              <span className="text-xs text-slate-400">Breakpoint:</span>
            </div>
            <div className="flex bg-slate-800 rounded p-1">
              {['desktop', 'tablet', 'mobile'].map(bp => (
                <button
                  key={bp}
                  onClick={() => setActiveBreakpoint?.(bp)}
                  className={`flex-1 py-1 text-xs capitalize ${activeBreakpoint === bp ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  {bp}
                </button>
              ))}
            </div>
          </div>

          {/* Layers List */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredElements.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <FontAwesomeIcon icon={faLayerGroup} className="text-2xl mb-2 opacity-20" />
                <p>No layers found</p>
                {searchQuery && (
                  <p className="text-xs mt-1">No results for "{searchQuery}"</p>
                )}
              </div>
            ) : (
              <div>
                <div className="px-3 py-2 text-xs text-slate-500 flex justify-between">
                  <span>Name</span>
                  <span>Type</span>
                </div>
                {filteredElements.map(el => (
                  <LayerItem 
                    key={el.id} 
                    element={el} 
                    depth={0} 
                    selectedId={selectedId} 
                    onSelect={onSelect}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Layers Info Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-800/30">
            <div className="text-xs text-slate-500 flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Selected: {selectedId ? 'Yes' : 'None'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{totalElements} total</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;