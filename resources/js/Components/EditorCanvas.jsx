import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale
);

const RenderNode = ({ 
  element, 
  selectedId, 
  onSelect, 
  onDrop, 
  isPreview, 
  gridMode,
  gridSize,
  level = 0 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  
  const isSelected = selectedId === element.id;
  const isContainerType = ['container', 'hero', 'header', 'footer', 'testimonial', 'gallery', 'product', 'grid', 'form', 'card'].includes(element.type);

  const handleDragStart = (e) => {
    if (isPreview || element.type === 'root') return;
    
    e.dataTransfer.setData('application/react-dnd', 'move');
    e.dataTransfer.setData('elementId', element.id);
    e.dataTransfer.setData('type', element.type);
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isPreview && isContainerType) {
      setIsDragOver(true);
      
      // Add visual feedback for grid snapping
      if (gridMode && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Snap to grid
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;
        
        // Show snapping guide
        elementRef.current.style.setProperty('--snap-x', `${snappedX}px`);
        elementRef.current.style.setProperty('--snap-y', `${snappedY}px`);
      }
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const type = e.dataTransfer.getData('application/react-dnd');
    const elementId = e.dataTransfer.getData('elementId');
    const elementType = e.dataTransfer.getData('type');
    
    if (type === 'move' && elementId && elementId !== element.id) {
      // Handle element movement
      onDrop(element.id, { type: 'move', elementId, elementType });
    } else if (type) {
      onDrop(element.id, type);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isPreview) {
      onSelect(element.id);
    }
  };

  const handleMouseDown = (e) => {
    if (isPreview || !gridMode || !isSelected) return;
    
    // Only start drag for selected elements
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isPreview || !gridMode || !elementRef.current) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Snap to grid
    const snappedDeltaX = Math.round(deltaX / gridSize) * gridSize;
    const snappedDeltaY = Math.round(deltaY / gridSize) * gridSize;
    
    setPosition({ x: snappedDeltaX, y: snappedDeltaY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Apply position to element style
      if (position.x !== 0 || position.y !== 0) {
        // This would update the element's position in the parent component
        // For now, we just reset the position
      }
      setPosition({ x: 0, y: 0 });
    }
  };

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, gridMode, gridSize]);

  // Apply state styles for preview
  const applyStateStyles = (baseStyle) => {
    if (!isPreview || !element.states) return baseStyle;
    
    // In preview mode, we could apply hover/focus states based on interaction
    // For now, we just return the base style
    return baseStyle;
  };

  const baseStyles = applyStateStyles({
    ...element.style,
    position: isDragging ? 'relative' : 'static',
    outline: isSelected && !isPreview ? '2px solid #3b82f6' : 'none',
    outlineOffset: '-2px',
    cursor: isPreview ? (element.href ? 'pointer' : 'default') : 'pointer',
    minHeight: isContainerType && element.children?.length === 0 ? '80px' : undefined,
    boxShadow: isSelected && !isPreview ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : element.style.boxShadow || 'none',
    transition: 'all 0.2s ease-in-out',
    transform: `translate(${position.x}px, ${position.y}px)`,
    zIndex: isSelected ? 1000 : level,
  });

  // Add drag overlay styles
  if (isDragOver && !isPreview) {
    baseStyles.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    baseStyles.border = '2px dashed #3b82f6';
  }

  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return (
          <img 
            src={element.src || 'https://via.placeholder.com/300x200'} 
            alt={element.alt || element.name}
            style={{ width: '100%', height: '100%', objectFit: element.style.objectFit || 'cover' }}
            draggable={false}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        );
      
      case 'text':
        return <span style={{ display: 'block', width: '100%', height: '100%' }}>{element.content || 'Text'}</span>;
      
      case 'button':
        const ButtonTag = element.href && isPreview ? 'a' : 'button';
        const buttonProps = element.href && isPreview ? { 
          href: element.href,
          target: element.target || '_self'
        } : {};
        
        return (
          <ButtonTag 
            {...buttonProps}
            type={element.buttonType || 'button'}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
          >
            {element.content || 'Button'}
          </ButtonTag>
        );
      
      case 'chart':
        if (!element.chartData) return <div className="p-4 text-slate-400">No Chart Data</div>;
        
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: element.chartData.datasets?.[0]?.label || 'Chart'
            }
          }
        };
        
        const chartProps = {
          data: element.chartData,
          options: chartOptions,
          redraw: true
        };
        
        return (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {element.chartData.type === 'bar' && <Bar {...chartProps} />}
            {element.chartData.type === 'line' && <Line {...chartProps} />}
            {element.chartData.type === 'pie' && <Pie {...chartProps} />}
            {element.chartData.type === 'doughnut' && <Doughnut {...chartProps} />}
          </div>
        );
      
      case 'table':
        if (!element.tableData) return <div className="p-4 text-slate-400">No Table Data</div>;
        
        return (
          <div style={{ width: '100%', height: '100%', overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: element.style.fontSize || '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: element.style.theadBackground || '#f1f5f9' }}>
                  {element.tableData.headers.map((header, index) => (
                    <th 
                      key={index}
                      style={{ 
                        padding: '12px 16px',
                        borderBottom: '2px solid #e2e8f0',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#475569'
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {element.tableData.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    style={{ 
                      backgroundColor: element.style.stripedRows && rowIndex % 2 === 0 
                        ? '#f8fafc' 
                        : '#ffffff'
                    }}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e2e8f0',
                          color: '#334155'
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'input':
        return (
          <input
            type={element.inputType || 'text'}
            placeholder={element.placeholder || 'Enter text...'}
            required={element.required || false}
            style={{ 
              width: '100%',
              padding: element.style.padding || '10px 16px',
              border: element.style.border || '1px solid #d1d5db',
              borderRadius: element.style.borderRadius || '6px',
              fontSize: element.style.fontSize || '14px'
            }}
            disabled={isPreview ? false : true}
            readOnly={!isPreview}
          />
        );
      
      case 'divider':
        return (
          <hr style={{
            width: '100%',
            height: element.style.height || '1px',
            backgroundColor: element.style.backgroundColor || '#e2e8f0',
            border: 'none',
            margin: element.style.margin || '20px 0'
          }} />
        );
      
      default:
        return null;
    }
  };

  // Container element
  if (isContainerType) {
    return (
      <div 
        ref={elementRef}
        draggable={!isPreview && !gridMode}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        style={baseStyles}
        className={`relative ${!isPreview && !isSelected ? 'hover:outline hover:outline-1 hover:outline-blue-500/30' : ''}`}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {/* Grid snapping guides */}
        {gridMode && isDragOver && !isPreview && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at var(--snap-x, 0) var(--snap-y, 0), #3b82f6 2px, transparent 2px)`
            }}
          />
        )}
        
        {/* Selection indicator */}
        {isSelected && !isPreview && (
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-primary-500 pointer-events-none rounded z-10" />
        )}
        
        {/* Empty container helper */}
        {!isPreview && element.children?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 bg-slate-50/5 pointer-events-none border-2 border-dashed border-slate-300/20 m-1 rounded">
            {isDragOver ? 'Drop Here!' : 'Drop items here'}
          </div>
        )}
        
        {/* Resize handles for selected elements */}
        {isSelected && !isPreview && gridMode && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary-500 rounded-full cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary-500 rounded-full cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary-500 rounded-full cursor-se-resize" />
          </>
        )}
        
        {/* Element label in edit mode */}
        {!isPreview && (
          <div className="absolute -top-6 left-0 bg-slate-800 text-xs text-slate-300 px-2 py-1 rounded-t pointer-events-none">
            {element.name} ({element.type})
          </div>
        )}
        
        {/* Render children */}
        {element.children?.map(child => (
          <RenderNode 
            key={child.id}
            element={child}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrop={onDrop}
            isPreview={isPreview}
            gridMode={gridMode}
            gridSize={gridSize}
            level={level + 1}
          />
        ))}
      </div>
    );
  }

  // Non-container element
  return (
    <div 
      ref={elementRef}
      draggable={!isPreview && !gridMode}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={baseStyles}
      className={`relative ${!isPreview && !isSelected ? 'hover:outline hover:outline-1 hover:outline-blue-500/30' : ''}`}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Selection indicator */}
      {isSelected && !isPreview && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-primary-500 pointer-events-none rounded z-10" />
      )}
      
      {/* Element label in edit mode */}
      {!isPreview && (
        <div className="absolute -top-6 left-0 bg-slate-800 text-xs text-slate-300 px-2 py-1 rounded-t pointer-events-none">
          {element.name} ({element.type})
        </div>
      )}
      
      {/* Render content */}
      {renderContent()}
      
      {/* Render children if any (for nested structures) */}
      {element.children?.map(child => (
        <RenderNode 
          key={child.id}
          element={child}
          selectedId={selectedId}
          onSelect={onSelect}
          onDrop={onDrop}
          isPreview={isPreview}
          gridMode={gridMode}
          gridSize={gridSize}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export const EditorCanvas = ({ 
  elements, 
  selectedId, 
  onSelect, 
  onDropItem,
  isPreview,
  viewport,
  gridMode,
  gridSize
}) => {
  const canvasRef = useRef(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  const handleCanvasClick = (e) => {
    // Only deselect if clicking on canvas background (not an element)
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid')) {
      onSelect('');
    }
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('application/react-dnd');
    if (type && type !== 'move') {
      // Add to root container
      const rootContainer = elements.find(el => el.type === 'container');
      if (rootContainer) {
        onDropItem(rootContainer.id, type);
      }
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        setCanvasDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      ref={canvasRef}
      className="h-full w-full overflow-y-auto canvas-grid p-4 md:p-8 flex justify-center"
      onClick={handleCanvasClick}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
      style={{
        background: gridMode 
          ? `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`
          : 'none',
        backgroundSize: gridMode ? `${gridSize}px ${gridSize}px` : 'auto',
        minHeight: '100%'
      }}
    >
      <div 
        className={`min-h-[800px] transition-all duration-300 ease-in-out ${isPreview ? 'bg-white' : 'bg-slate-50'} relative`}
        style={{ 
          width: viewport === '100%' ? '100%' : viewport,
          maxWidth: viewport === '100%' ? '1200px' : '100%',
          boxShadow: isPreview ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.3)',
          margin: '0 auto'
        }}
      >
        {/* Canvas background pattern */}
        {!isPreview && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #94a3b8 2px, transparent 2%)`,
              backgroundSize: '50px 50px'
            }}
          />
        )}
        
        {/* Render all elements */}
        {elements.map(el => (
          <RenderNode 
            key={el.id}
            element={el}
            selectedId={selectedId}
            onSelect={onSelect}
            onDrop={(targetId, data) => {
              if (typeof data === 'string') {
                onDropItem(targetId, data);
              } else if (data.type === 'move') {
                onDropItem(targetId, data);
              }
            }}
            isPreview={isPreview}
            gridMode={gridMode}
            gridSize={gridSize}
          />
        ))}
        
        {/* Drop zone overlay for root level */}
        {!isPreview && elements.length === 0 && (
          <div 
            className="absolute inset-0 flex items-center justify-center border-4 border-dashed border-slate-300 m-4 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleCanvasDrop}
          >
            <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-lg">
              <div className="text-4xl mb-4 text-slate-400">📄</div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Drop elements here</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
                Drag components from the sidebar to start building your page
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Containers</div>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Text</div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Images</div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Buttons</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Viewport label */}
      {!isPreview && (
        <div className="fixed md:absolute top-4 right-4 bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full shadow-lg z-20">
          {viewport === '100%' ? 'Desktop' : viewport === '768px' ? 'Tablet' : 'Mobile'}
          {gridMode && ` • Grid: ${gridSize}px`}
        </div>
      )}

      {/* Canvas dimensions info */}
      {!isPreview && (
        <div className="fixed md:absolute bottom-4 left-4 bg-slate-800/80 text-slate-300 text-xs px-3 py-1 rounded-full shadow-lg z-20 backdrop-blur-sm">
          {canvasDimensions.width} × {canvasDimensions.height}
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;