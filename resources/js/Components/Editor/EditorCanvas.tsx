import React, { useState, useRef, useEffect } from 'react';
import { EditorElement, ElementType } from '@/types';
import { Trash2, ArrowUp, ArrowDown, ShoppingBag, Send, Menu, Image as ImageIcon, X, Check, GripVertical, Edit2, Maximize2, Minimize2, Smartphone, Tablet, Monitor, Tv } from 'lucide-react';
import { ViewMode } from '../App';

interface EditorCanvasProps {
  elements: EditorElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onInsert: (index: number, type: ElementType) => void;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  previewMode: boolean;
  viewMode: ViewMode;
}

interface EditableTextProps { 
    tagName?: any; 
    value: string; 
    onChange: (val: string) => void; 
    style?: React.CSSProperties; 
    className?: string;
    previewMode: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ 
    tagName: Tag = 'div', 
    value, 
    onChange, 
    style, 
    className,
    previewMode
}) => { 
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const textRef = useRef<HTMLElement>(null);

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (previewMode) return;
        e.stopPropagation();
        setIsEditing(true);
        setTempValue(value);
        setTimeout(() => {
            if (textRef.current) {
                textRef.current.focus();
                const range = document.createRange();
                range.selectNodeContents(textRef.current);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }, 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onChange(tempValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        } else if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (previewMode) {
        return <Tag style={style} className={className}>{value}</Tag>;
    }

    if (isEditing) {
        return (
            <Tag
                ref={textRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={style}
                className={`${className} outline-none ring-2 ring-primary-500 ring-opacity-50 rounded px-2 transition-all bg-white/90 backdrop-blur-sm`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                dangerouslySetInnerHTML={{ __html: tempValue }}
                onInput={(e: any) => setTempValue(e.currentTarget.innerHTML)}
            />
        );
    }

    return (
        <Tag
            onDoubleClick={handleDoubleClick}
            style={style}
            className={`${className} transition-all duration-200 hover:bg-gray-50/50 hover:rounded-lg hover:px-2 cursor-text select-none group`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            title="Double-click to edit"
        >
            {value}
            {!previewMode && (
                <span className="invisible group-hover:visible text-xs text-gray-400 ml-2 font-normal">
                    ✏️
                </span>
            )}
        </Tag>
    );
};

const DropZone: React.FC<{
    index: number;
    onDrop: (index: number, type: ElementType) => void;
}> = ({ index, onDrop }) => {
    const [isActive, setIsActive] = useState(false);
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsActive(true);
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsActive(false);
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsActive(false);
        setIsOver(false);
        const type = e.dataTransfer.getData('elementType') as ElementType;
        if (type) {
            onDrop(index, type);
        }
    };

    return (
        <div 
            className={`relative transition-all duration-300 ${isActive ? 'h-12' : 'h-2'} ${isOver ? 'scale-105' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isActive 
                    ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-2 border-dashed border-primary-500 rounded-xl opacity-100' 
                    : 'bg-transparent border-2 border-dashed border-transparent opacity-0 hover:opacity-100 hover:border-gray-300'
            }`}>
                {isActive && (
                    <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                        <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600">+</span>
                        </div>
                        <span>Drop element here</span>
                    </div>
                )}
                {!isActive && (
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-50"></div>
                )}
            </div>
        </div>
    );
};

const ResizeHandle = ({ direction, onMouseDown }: { direction: 'e' | 's' | 'se', onMouseDown: (e: React.MouseEvent) => void }) => {
    const cursor = direction === 'e' ? 'cursor-ew-resize' : direction === 's' ? 'cursor-ns-resize' : 'cursor-nwse-resize';
    const pos = direction === 'e' 
        ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-12 w-2.5' 
        : direction === 's' 
            ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-2.5' 
            : 'bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-5 h-5';
    
    const displayClass = direction === 'se' 
        ? 'rounded-full bg-gradient-to-br from-primary-500 to-primary-600 border-3 border-white shadow-lg hover:scale-110' 
        : 'rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-white shadow-md hover:scale-105';

    return (
        <div 
            className={`absolute z-50 transition-all duration-200 hover:from-primary-600 hover:to-primary-700 active:scale-95 ${pos} ${cursor} ${displayClass}`}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown(e);
            }}
            title={`Resize ${direction === 'e' ? 'width' : direction === 's' ? 'height' : 'both'}`}
        />
    )
};

const CanvasElement: React.FC<{
  el: EditorElement;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  previewMode: boolean;
  viewMode: ViewMode;
}> = ({ el, index, isSelected, onSelect, onDelete, onMove, onDragStart, onDragEnter, onDragEnd, onUpdate, previewMode, viewMode }) => {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const isInline = el.type === ElementType.BUTTON || el.type === ElementType.IMAGE;
    
    const wrapperClass = previewMode 
      ? `relative transition-all duration-300 ${isInline ? 'inline-block' : 'w-full'}`
      : `relative group transition-all duration-300 ${
          isSelected 
            ? 'ring-3 ring-primary-500 ring-offset-2 shadow-lg z-10 scale-[1.02]' 
            : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-1 hover:shadow-md hover:z-5'
        } ${isInline ? 'inline-block' : 'w-full'} rounded-xl overflow-hidden`;

    const Toolbar = () => (
      !previewMode && isSelected && (
        <div className="absolute -top-12 right-0 flex gap-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-3 py-2 text-xs shadow-2xl z-50 animate-slide-up">
           <button 
             onClick={(e) => { e.stopPropagation(); onMove(el.id, 'up'); }} 
             className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" 
             title="Move Up"
           >
             <ArrowUp size={16} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onMove(el.id, 'down'); }} 
             className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" 
             title="Move Down"
           >
             <ArrowDown size={16} />
           </button>
           <div className="w-px bg-white/30 mx-1"></div>
           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(el.id); }} 
             className="hover:bg-red-500/90 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" 
             title="Delete"
           >
             <Trash2 size={16} />
           </button>
        </div>
      )
    );

    const DragHandle = () => (
      !previewMode && (
          <div 
             className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-l-xl p-3 cursor-grab active:cursor-grabbing shadow-lg z-40 flex items-center justify-center drag-handle hover:scale-105 active:scale-95"
             title="Drag to reorder"
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
          >
              <GripVertical size={18} className={isHovered ? 'animate-pulse' : ''} />
          </div>
      )
    );

    const handleResizeMouseDown = (e: React.MouseEvent, direction: 'e' | 's' | 'se') => {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = elementRef.current?.offsetWidth || 0;
        const startHeight = elementRef.current?.offsetHeight || 0;

        const onMouseMove = (moveEvent: MouseEvent) => {
            moveEvent.preventDefault();
            const updates: any = { styles: { ...el.styles } };

            if (direction === 'e' || direction === 'se') {
                 const diffX = moveEvent.clientX - startX;
                 updates.styles.width = `${Math.max(50, startWidth + diffX)}px`;
            }
            if (direction === 's' || direction === 'se') {
                 const diffY = moveEvent.clientY - startY;
                 updates.styles.height = `${Math.max(20, startHeight + diffY)}px`;
            }
            onUpdate(el.id, updates);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const getBlockData = () => {
        try { return JSON.parse(el.content); } catch { return {}; }
    };

    const updateBlockData = (key: string, val: any) => {
        const data = getBlockData();
        data[key] = val;
        onUpdate(el.id, { content: JSON.stringify(data, null, 2) });
    };

    const updateArrayItem = (arrayKey: string, index: number, field: string | null, val: any) => {
        const data = getBlockData();
        const arr = data[arrayKey] || [];
        if (field) {
            if (arr[index]) arr[index][field] = val;
        } else {
            if (arr[index]) arr[index] = val;
        }
        data[arrayKey] = arr;
        onUpdate(el.id, { content: JSON.stringify(data, null, 2) });
    };
    
    const updateNestedObject = (parentKey: string, key: string, val: any) => {
        const data = getBlockData();
        if (!data[parentKey]) data[parentKey] = {};
        data[parentKey][key] = val;
        onUpdate(el.id, { content: JSON.stringify(data, null, 2) });
    };

    const updateFooterLink = (colIndex: number, itemIndex: number, val: string) => {
        const data = getBlockData();
        if (data.links && data.links[colIndex] && data.links[colIndex].items) {
            data.links[colIndex].items[itemIndex] = val;
            onUpdate(el.id, { content: JSON.stringify(data, null, 2) });
        }
    };
    
    const updateFooterColTitle = (colIndex: number, val: string) => {
        const data = getBlockData();
        if (data.links && data.links[colIndex]) {
            data.links[colIndex].title = val;
            onUpdate(el.id, { content: JSON.stringify(data, null, 2) });
        }
    };

    const handleImageDoubleClick = (currentSrc: string, key?: string, index?: number, field?: string) => {
        if (previewMode) return;
        const newSrc = prompt("Enter image URL:", currentSrc);
        if (newSrc) {
            if (key) {
                if (typeof index === 'number') {
                    if (field) {
                        updateArrayItem(key, index, field, newSrc);
                    } else {
                         updateArrayItem(key, index, null, newSrc);
                    }
                } else {
                    updateBlockData(key, newSrc);
                }
            } else {
                onUpdate(el.id, { src: newSrc });
            }
        }
    };

    // Separate styles into structural (wrapper) and visual (inner) for user overrides
    // Wrapper handles sizing and positioning from user resize events
    const wrapperUserStyle: React.CSSProperties = {
        width: el.styles.width,
        height: el.styles.height,
        margin: el.styles.margin,
    };

    // Inner handles colors, borders, shadows from user configuration
    const innerUserStyle: React.CSSProperties = { 
        ...el.styles,
        // Remove structural props that are handled by the wrapper or default classes
        width: undefined,
        height: undefined,
        margin: undefined,
        // Ensure standard behavior for user styles
        borderStyle: el.styles.borderStyle || (el.styles.borderWidth ? 'solid' : undefined),
    };

    const getTextSize = (mobile: string, tablet: string, desktop: string) => {
        switch(viewMode) {
            case 'MOBILE': return mobile;
            case 'TABLET': return tablet;
            case 'DESKTOP':
            case 'TV':
            default: return desktop;
        }
    };

    const renderContent = () => {
        switch (el.type) {
            case ElementType.HEADER:
              const headerSize = getTextSize('text-xl font-bold', 'text-2xl font-bold', 'text-2xl sm:text-3xl md:text-4xl font-bold');
              return (
                  <EditableText 
                    tagName="h2" 
                    value={el.content} 
                    onChange={(val) => onUpdate(el.id, { content: val })} 
                    style={innerUserStyle}
                    className={`${headerSize} w-full h-full max-w-full break-words bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent border-box`}
                    previewMode={previewMode} 
                  />
              );
            case ElementType.PARAGRAPH:
              const paraSize = getTextSize('text-sm leading-relaxed', 'text-base leading-relaxed', 'text-base sm:text-lg leading-relaxed');
              return (
                   <EditableText 
                    tagName="p" 
                    value={el.content} 
                    onChange={(val) => onUpdate(el.id, { content: val })} 
                    style={innerUserStyle}
                    className={`${paraSize} w-full h-full max-w-full break-words text-gray-700 border-box`}
                    previewMode={previewMode} 
                  />
              );
            case ElementType.BUTTON:
              const buttonSize = getTextSize('text-xs px-4 py-2.5', 'text-sm px-5 py-3', 'text-sm sm:text-base px-6 py-3.5');
              const buttonClass = `inline-flex w-full h-full items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${buttonSize} box-border`;
              
              if (el.href) {
                  return (
                      <a 
                        href={previewMode ? el.href : '#'} 
                        onClick={e => !previewMode && e.preventDefault()} 
                        style={innerUserStyle} 
                        className={`${buttonClass} bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800`}
                      >
                           <EditableText 
                            tagName="span" 
                            value={el.content} 
                            onChange={(val) => onUpdate(el.id, { content: val })} 
                            className="whitespace-nowrap"
                            previewMode={previewMode} 
                          />
                      </a>
                  );
              }
              return (
                  <button style={innerUserStyle} className={`${buttonClass} bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800`}>
                       <EditableText 
                            tagName="span" 
                            value={el.content} 
                            onChange={(val) => onUpdate(el.id, { content: val })} 
                            className="whitespace-nowrap"
                            previewMode={previewMode} 
                          />
                  </button>
              );
            case ElementType.IMAGE:
              return (
                <div className="w-full overflow-hidden rounded-xl group/image">
                  <img 
                    src={el.src || 'https://picsum.photos/600/400'} 
                    alt={el.alt || 'Image'} 
                    style={innerUserStyle} 
                    className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover/image:scale-105 group-hover/image:brightness-110 box-border"
                    onDoubleClick={() => handleImageDoubleClick(el.src || '')}
                    title={previewMode ? '' : 'Double-click to change image'}
                  />
                  {!previewMode && !el.src && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                      <div className="text-center p-6">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 font-medium">No image selected</p>
                        <p className="text-xs text-gray-500 mt-1">Double-click to add image URL</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            case ElementType.CONTAINER:
                const isHtml = /<[a-z][\s\S]*>/i.test(el.content);
                const containerClass = `w-full h-full max-w-full rounded-xl transition-all duration-300 box-border ${
                    !previewMode ? "border-2 border-dashed border-gray-300 hover:border-primary-400 bg-gradient-to-br from-gray-50 to-white" : "bg-white"
                } ${previewMode ? 'min-h-0' : 'min-h-[80px]'}`;
                
                return (
                    <div 
                        style={innerUserStyle} 
                        className={containerClass}
                    >
                         {isHtml ? (
                             <div 
                               dangerouslySetInnerHTML={{__html: el.content}} 
                               className="max-w-full p-4"
                             />
                         ) : (
                             <div className="p-6">
                                 <EditableText 
                                    value={el.content || 'Container content...'} 
                                    onChange={(val) => onUpdate(el.id, { content: val })} 
                                    className="max-w-full break-words text-gray-700 min-h-[40px]"
                                    previewMode={previewMode} 
                                  />
                             </div>
                         )}
                         {!previewMode && !el.content && (
                             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                 <div className="text-center">
                                     <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                                         <span className="text-gray-500">📦</span>
                                     </div>
                                     <p className="text-sm">Empty container</p>
                                     <p className="text-xs">Double-click to edit</p>
                                 </div>
                             </div>
                         )}
                    </div>
                );
            case ElementType.TWO_COL:
               const data = getBlockData();
               const twoColGrid = viewMode === 'MOBILE' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6 md:gap-8';
               return (
                 <div className={`grid ${twoColGrid} w-full h-full max-w-full rounded-xl box-border`} style={innerUserStyle}>
                   <div className={`rounded-xl ${!previewMode ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-dashed border-blue-200 min-h-[120px] flex items-center justify-center group' : 'bg-white p-6'}`}>
                     <div className="w-full">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                           <span className="text-blue-600 font-bold">L</span>
                         </div>
                         <span className="text-xs font-medium text-blue-600">Left Column</span>
                       </div>
                       <EditableText 
                         value={data.left || 'Left column content...'} 
                         onChange={(v) => updateBlockData('left', v)} 
                         previewMode={previewMode} 
                         className="w-full text-gray-700 min-h-[60px]" 
                       />
                     </div>
                   </div>
                   <div className={`rounded-xl ${!previewMode ? 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-dashed border-purple-200 min-h-[120px] flex items-center justify-center group' : 'bg-white p-6'}`}>
                     <div className="w-full">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                           <span className="text-purple-600 font-bold">R</span>
                         </div>
                         <span className="text-xs font-medium text-purple-600">Right Column</span>
                       </div>
                       <EditableText 
                         value={data.right || 'Right column content...'} 
                         onChange={(v) => updateBlockData('right', v)} 
                         previewMode={previewMode} 
                         className="w-full text-gray-700 min-h-[60px]" 
                       />
                     </div>
                   </div>
                 </div>
               );
            
            case ElementType.NAVBAR: {
                const data = getBlockData();
                const showMobileMenu = viewMode === 'MOBILE' || viewMode === 'TABLET';
                const navPadding = viewMode === 'MOBILE' ? 'px-4 py-3' : 
                                  viewMode === 'TABLET' ? 'px-6 py-4' : 
                                  'px-8 py-5';
                
                return (
                    <nav style={innerUserStyle} className={`w-full max-w-full h-full relative rounded-xl overflow-hidden box-border ${navPadding} bg-gradient-to-r from-white to-gray-50 border-b border-gray-100`}>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                {data.logoSrc ? (
                                    <img 
                                        src={data.logoSrc} 
                                        alt="Logo" 
                                        className={`${viewMode === 'MOBILE' ? 'h-7' : 'h-8 sm:h-10'} w-auto object-contain rounded-lg`} 
                                        onDoubleClick={() => handleImageDoubleClick(data.logoSrc, 'logoSrc')}
                                    />
                                ) : (
                                    <div className={`${viewMode === 'MOBILE' ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center`}>
                                        <span className={`${viewMode === 'MOBILE' ? 'text-sm' : 'text-base'} font-bold text-white`}>{data.brand?.[0] || 'B'}</span>
                                    </div>
                                )}
                                <EditableText 
                                    tagName="span" 
                                    value={data.brand || 'Brand'} 
                                    onChange={(v) => updateBlockData('brand', v)} 
                                    className={`font-bold truncate ${viewMode === 'MOBILE' ? 'text-base' : 'text-lg sm:text-xl'} bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`}
                                    previewMode={previewMode} 
                                />
                            </div>

                            {!showMobileMenu ? (
                                <div className="flex items-center gap-4 lg:gap-8">
                                    {(data.links || ['Home', 'About', 'Contact']).map((link: any, i: number) => {
                                        const text = typeof link === 'string' ? link : link.text;
                                        const href = typeof link === 'string' ? '#' : link.href;
                                        return (
                                            <EditableText 
                                                key={i}
                                                tagName="a" 
                                                className="text-sm lg:text-base font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                                                value={text} 
                                                onChange={(v) => updateArrayItem('links', i, 'text', v)} 
                                                previewMode={previewMode} 
                                            />
                                        );
                                    })}
                                    {data.buttonText && (
                                        data.buttonHref ? (
                                             <a 
                                               href={data.buttonHref} 
                                               onClick={e => !previewMode && e.preventDefault()} 
                                               className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg inline-block no-underline whitespace-nowrap"
                                             >
                                                <EditableText tagName="span" value={data.buttonText} onChange={(v) => updateBlockData('buttonText', v)} previewMode={previewMode} />
                                            </a>
                                        ) : (
                                            <button className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap">
                                                <EditableText tagName="span" value={data.buttonText} onChange={(v) => updateBlockData('buttonText', v)} previewMode={previewMode} />
                                            </button>
                                        )
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    {isMenuOpen ? (
                                        <X size={viewMode === 'MOBILE' ? 22 : 26} className="text-gray-700" />
                                    ) : (
                                        <Menu size={viewMode === 'MOBILE' ? 22 : 26} className="text-gray-700" />
                                    )}
                                </button>
                            )}
                        </div>
                        
                        {showMobileMenu && isMenuOpen && !previewMode && (
                            <div className="mt-4 bg-white rounded-xl shadow-xl p-5 w-full animate-slide-up border border-gray-100">
                                <div className="space-y-3">
                                    {(data.links || ['Home', 'About', 'Contact']).map((link: any, i: number) => {
                                        const text = typeof link === 'string' ? link : link.text;
                                        return (
                                            <div key={i} className="py-3 border-b border-gray-100 last:border-0">
                                                <EditableText 
                                                    tagName="a" 
                                                    className="text-base font-medium text-gray-800 hover:text-primary-600 transition-colors duration-200 cursor-pointer block"
                                                    value={text} 
                                                    onChange={(v) => updateArrayItem('links', i, 'text', v)} 
                                                    previewMode={previewMode} 
                                                />
                                            </div>
                                        );
                                    })}
                                    {data.buttonText && (
                                        <div className="pt-4">
                                            <button className="w-full px-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-base font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md">
                                                <EditableText tagName="span" value={data.buttonText} onChange={(v) => updateBlockData('buttonText', v)} previewMode={previewMode} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </nav>
                );
            }
            
            case ElementType.HERO: {
                const data = getBlockData();
                const heroTitleSize = getTextSize('text-2xl md:text-3xl font-black', 'text-3xl md:text-4xl font-black', 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black');
                const heroSubtitleSize = getTextSize('text-sm md:text-base', 'text-base md:text-lg', 'text-base sm:text-lg md:text-xl lg:text-2xl');
                const heroPadding = viewMode === 'MOBILE' ? 'px-4 py-12' : 
                                  viewMode === 'TABLET' ? 'px-6 py-16' : 
                                  'px-8 py-20 sm:px-12 sm:py-24';
                
                return (
                    <div style={innerUserStyle} className={`flex flex-col items-center justify-center text-center ${heroPadding} w-full h-full rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 box-border`}>
                        <EditableText 
                            tagName="h1" 
                            className={`${heroTitleSize} mb-4 md:mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`} 
                            value={data.title || 'Hero Title'} 
                            onChange={(v) => updateBlockData('title', v)} 
                            previewMode={previewMode}
                        />
                        <EditableText 
                            tagName="p"
                            className={`${heroSubtitleSize} mb-8 md:mb-10 max-w-2xl leading-relaxed text-gray-600`} 
                            value={data.subtitle || 'Hero subtitle text goes here...'} 
                            onChange={(v) => updateBlockData('subtitle', v)} 
                            previewMode={previewMode}
                        />
                        <a href={data.ctaHref || '#'} className={`${viewMode === 'MOBILE' ? 'w-full max-w-xs' : 'w-auto min-w-[200px]'}`}>
                            <button className={`${viewMode === 'MOBILE' ? 'w-full px-6 py-3.5 text-sm' : 'px-8 py-4 text-base md:text-lg'} bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2`}>
                                 <EditableText 
                                    tagName="span" 
                                    value={data.cta || 'Get Started'} 
                                    onChange={(v) => updateBlockData('cta', v)} 
                                    previewMode={previewMode}
                                 />
                                 <span className="text-lg">→</span>
                            </button>
                        </a>
                    </div>
                );
            }

            case ElementType.FEATURES: {
                const data = getBlockData();
                const items = Array.isArray(data) ? data : [];
                
                const featuresGrid = viewMode === 'MOBILE' ? 'grid-cols-1' : 
                                  viewMode === 'TABLET' ? 'grid-cols-2' : 
                                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
                const featuresPadding = viewMode === 'MOBILE' ? 'px-4 gap-6' : 
                                      viewMode === 'TABLET' ? 'px-6 gap-8' : 
                                      'px-8 gap-8 md:gap-10';
                const featuresContainerClass = `rounded-2xl ${!previewMode ? 'bg-gradient-to-br from-gray-50 to-white border border-gray-100' : ''}`;
                
                return (
                    <div style={innerUserStyle} className={`${featuresContainerClass} ${featuresPadding} py-8 md:py-12 w-full h-full box-border`}>
                        <div className="text-center mb-10 md:mb-14">
                            <h2 className={`${getTextSize('text-xl md:text-2xl', 'text-2xl md:text-3xl', 'text-3xl md:text-4xl')} font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`}>
                                Features
                            </h2>
                            <p className={`${getTextSize('text-sm', 'text-base', 'text-base md:text-lg')} text-gray-600 max-w-2xl mx-auto`}>
                                Everything you need to build amazing products
                            </p>
                        </div>
                        
                        <div className={`grid ${featuresGrid} gap-6 md:gap-8`}>
                            {items.map((item: any, i: number) => {
                                const iconSize = viewMode === 'MOBILE' ? 'w-10 h-10' : 'w-12 h-12';
                                const itemPadding = viewMode === 'MOBILE' ? 'p-5' : 'p-6';
                                const titleSize = viewMode === 'MOBILE' ? 'text-lg' : 'text-xl';
                                const descSize = viewMode === 'MOBILE' ? 'text-sm' : 'text-base';
                                
                                return (
                                    <div key={i} className={`flex flex-col items-start ${itemPadding} rounded-xl shadow-sm border border-gray-200 bg-white/80 hover:bg-white hover:shadow-xl transition-all duration-300 group/feature`}>
                                        <div className={`${iconSize} bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mb-4 md:mb-5 text-primary-600 group-hover/feature:scale-110 transition-transform duration-300`}>
                                            <span className={`font-bold ${viewMode === 'MOBILE' ? 'text-lg' : 'text-xl'}`}>{i + 1}</span>
                                        </div>
                                        <EditableText 
                                            tagName="h3"
                                            className={`${titleSize} font-bold mb-2 md:mb-3 text-gray-900`}
                                            value={item.title || `Feature ${i + 1}`}
                                            onChange={(v) => {
                                                const newData = [...items];
                                                newData[i].title = v;
                                                onUpdate(el.id, { content: JSON.stringify(newData, null, 2) });
                                            }}
                                            previewMode={previewMode}
                                        />
                                        <EditableText 
                                            tagName="p"
                                            className={`leading-relaxed ${descSize} text-gray-600`}
                                            value={item.desc || `Description for feature ${i + 1}`}
                                            onChange={(v) => {
                                                const newData = [...items];
                                                newData[i].desc = v;
                                                onUpdate(el.id, { content: JSON.stringify(newData, null, 2) });
                                            }}
                                            previewMode={previewMode}
                                        />
                                    </div>
                                );
                            })}
                            
                            {!previewMode && items.length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">No features yet</h3>
                                    <p className="text-gray-500 text-sm">Add features using the properties panel</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case ElementType.GALLERY: {
                const data = getBlockData();
                const images = data.images || [1,2,3,4,5,6]; 
                
                const galleryGrid = viewMode === 'MOBILE' ? 'grid-cols-2' : 
                                  viewMode === 'TABLET' ? 'grid-cols-3' : 
                                  'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
                const galleryPadding = viewMode === 'MOBILE' ? 'p-4 gap-3' : 
                                     viewMode === 'TABLET' ? 'p-6 gap-4' : 
                                     'p-8 gap-4 md:gap-6';
                
                return (
                    <div style={innerUserStyle} className={`rounded-2xl ${!previewMode ? 'bg-gradient-to-br from-gray-50 to-white border border-gray-100' : ''} w-full h-full box-border`}>
                        <div className="text-center mb-6 md:mb-8 pt-8 px-4">
                            <h2 className={`${getTextSize('text-xl md:text-2xl', 'text-2xl md:text-3xl', 'text-3xl md:text-4xl')} font-bold mb-2 md:mb-3 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`}>
                                Gallery
                            </h2>
                            <p className={`${getTextSize('text-sm', 'text-base', 'text-base md:text-lg')} text-gray-600 max-w-2xl mx-auto`}>
                                Beautiful collection of images
                            </p>
                        </div>
                        
                        <div className={`grid ${galleryGrid} ${galleryPadding} pb-8`}>
                            {images.map((img: any, i: number) => (
                                <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform duration-500">
                                    <img 
                                        src={typeof img === 'string' && img.startsWith('http') ? img : `https://picsum.photos/600/600?random=${i + 100}`} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt="Gallery" 
                                        onDoubleClick={() => handleImageDoubleClick(typeof img === 'string' ? img : '', 'images', i)}
                                        title={previewMode ? '' : 'Double-click to change image'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                            <ImageIcon className={`text-gray-700 ${viewMode === 'MOBILE' ? 'w-4 h-4' : 'w-5 h-5'}`} />
                                        </div>
                                    </div>
                                    {!previewMode && (
                                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            #{i + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            case ElementType.PRODUCT_GRID: {
                const data = getBlockData();
                const products = Array.isArray(data) ? data : [];
                
                const productGrid = viewMode === 'MOBILE' ? 'grid-cols-1' : 
                                  viewMode === 'TABLET' ? 'grid-cols-2' : 
                                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
                const productPadding = viewMode === 'MOBILE' ? 'p-4 gap-4' : 
                                     viewMode === 'TABLET' ? 'p-6 gap-6' : 
                                     'p-8 gap-6 md:gap-8';
                
                return (
                    <div style={innerUserStyle} className={`rounded-2xl ${!previewMode ? 'bg-gradient-to-br from-gray-50 to-white border border-gray-100' : ''} w-full h-full box-border`}>
                        <div className="text-center mb-8 md:mb-12 pt-8 px-4">
                            <h2 className={`${getTextSize('text-xl md:text-2xl', 'text-2xl md:text-3xl', 'text-3xl md:text-4xl')} font-bold mb-2 md:mb-3 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`}>
                                Products
                            </h2>
                            <p className={`${getTextSize('text-sm', 'text-base', 'text-base md:text-lg')} text-gray-600 max-w-2xl mx-auto`}>
                                Discover our amazing collection
                            </p>
                        </div>
                        
                        <div className={`grid ${productGrid} ${productPadding} pb-8`}>
                            {products.map((p: any, i: number) => {
                                const imageHeight = viewMode === 'MOBILE' ? 'h-48' : 
                                                  viewMode === 'TABLET' ? 'h-56' : 
                                                  'h-60 sm:h-64 md:h-72';
                                const cardPadding = viewMode === 'MOBILE' ? 'p-4' : 'p-5';
                                const titleSize = viewMode === 'MOBILE' ? 'text-base' : 'text-lg';
                                
                                return (
                                    <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                                        <div className={`${imageHeight} bg-gradient-to-br from-gray-100 to-gray-200 w-full overflow-hidden relative cursor-pointer`} title={previewMode ? '' : 'Double-click to change image'}>
                                            <img 
                                                src={p.image || `https://picsum.photos/600/500?random=${i+10}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                alt="Product"
                                                onDoubleClick={() => handleImageDoubleClick(p.image || '', 'products', i, 'image')}
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Edit2 size={viewMode === 'MOBILE' ? 12 : 14} className="text-gray-700"/>
                                            </div>
                                            {!previewMode && (
                                                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                                                    {i + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className={cardPadding}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                                <EditableText 
                                                    tagName="h3"
                                                    className={`${titleSize} font-bold text-gray-900 truncate`}
                                                    value={p.name || `Product ${i + 1}`}
                                                    onChange={(v) => {
                                                        const newData = [...products];
                                                        newData[i].name = v;
                                                        onUpdate(el.id, { content: JSON.stringify(newData, null, 2) });
                                                    }}
                                                    previewMode={previewMode}
                                                />
                                                <EditableText 
                                                    tagName="span"
                                                    className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-bold w-fit"
                                                    value={p.price || '$99.99'}
                                                    onChange={(v) => {
                                                        const newData = [...products];
                                                        newData[i].price = v;
                                                        onUpdate(el.id, { content: JSON.stringify(newData, null, 2) });
                                                    }}
                                                    previewMode={previewMode}
                                                />
                                            </div>
                                            <button className={`w-full py-3 ${viewMode === 'MOBILE' ? 'text-sm' : 'text-base'} bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/button`}>
                                                <ShoppingBag size={viewMode === 'MOBILE' ? 16 : 18} className="group-hover/button:scale-110 transition-transform"/> 
                                                <EditableText 
                                                    tagName="span"
                                                    value={p.buttonText || 'Add to Cart'}
                                                    onChange={(v) => {
                                                        const newData = [...products];
                                                        newData[i].buttonText = v;
                                                        onUpdate(el.id, { content: JSON.stringify(newData, null, 2) });
                                                    }}
                                                    previewMode={previewMode}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {!previewMode && products.length === 0 && (
                                <div className="col-span-full text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No products yet</h3>
                                    <p className="text-gray-500">Add products using the properties panel</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case ElementType.CONTACT_FORM: {
                 const data = getBlockData();
                 const labels = data.labels || { firstName: "First Name", lastName: "Last Name", email: "Email Address", message: "Message" };
                 
                 const formPadding = viewMode === 'MOBILE' ? 'p-6' : 
                                   viewMode === 'TABLET' ? 'p-8' : 
                                   'p-8 md:p-12';
                 const titleSize = viewMode === 'MOBILE' ? 'text-xl' : 
                                 viewMode === 'TABLET' ? 'text-2xl' : 
                                 'text-2xl md:text-3xl';
                 const inputText = viewMode === 'MOBILE' ? 'text-sm' : 'text-base';
                 const labelSize = viewMode === 'MOBILE' ? 'text-xs' : 'text-sm';
                 const buttonText = viewMode === 'MOBILE' ? 'text-base' : 'text-lg';
                 const gridCols = viewMode === 'MOBILE' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
                 
                 return (
                     <div style={innerUserStyle} className={`w-full max-w-2xl mx-auto h-full box-border ${formPadding} bg-gradient-to-br from-white to-gray-50 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100`}>
                         <div className="text-center mb-8 md:mb-12">
                             <EditableText 
                                tagName="h3"
                                className={`${titleSize} font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent`}
                                value={data.title || 'Contact Us'}
                                onChange={(v) => updateBlockData('title', v)}
                                previewMode={previewMode}
                             />
                             <p className={`text-gray-600 mt-2 ${viewMode === 'MOBILE' ? 'text-sm' : 'text-base md:text-lg'}`}>We typically reply within 2 hours.</p>
                         </div>
                         <div className="space-y-6 text-left">
                             <div className={`grid ${gridCols} gap-6`}>
                                 <div className="space-y-2">
                                    <label className={`block ${labelSize} font-bold text-gray-700 uppercase tracking-wider`}>
                                        <EditableText value={labels.firstName} onChange={v => updateNestedObject('labels', 'firstName', v)} previewMode={previewMode} />
                                    </label>
                                    <input type="text" className={`w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all duration-300 ${inputText} shadow-sm`} placeholder="John"/>
                                 </div>
                                 <div className="space-y-2">
                                     <label className={`block ${labelSize} font-bold text-gray-700 uppercase tracking-wider`}>
                                        <EditableText value={labels.lastName} onChange={v => updateNestedObject('labels', 'lastName', v)} previewMode={previewMode} />
                                    </label>
                                    <input type="text" className={`w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all duration-300 ${inputText} shadow-sm`} placeholder="Doe"/>
                                 </div>
                             </div>
                             <div className="space-y-2">
                                <label className={`block ${labelSize} font-bold text-gray-700 uppercase tracking-wider`}>
                                    <EditableText value={labels.email} onChange={v => updateNestedObject('labels', 'email', v)} previewMode={previewMode} />
                                </label>
                                <input type="email" className={`w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all duration-300 ${inputText} shadow-sm`} placeholder="john@example.com"/>
                             </div>
                             <div className="space-y-2">
                                <label className={`block ${labelSize} font-bold text-gray-700 uppercase tracking-wider`}>
                                    <EditableText value={labels.message} onChange={v => updateNestedObject('labels', 'message', v)} previewMode={previewMode} />
                                </label>
                                <textarea rows={viewMode === 'MOBILE' ? 4 : 5} className={`w-full p-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all duration-300 resize-none ${inputText} shadow-sm`} placeholder="Your message..."></textarea>
                             </div>
                             <button className={`w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 ${buttonText}`}>
                                 <Send size={viewMode === 'MOBILE' ? 18 : 20}/> 
                                 <EditableText 
                                    tagName="span"
                                    value={data.buttonText || 'Send Message'}
                                    onChange={(v) => updateBlockData('buttonText', v)}
                                    previewMode={previewMode}
                                 />
                             </button>
                         </div>
                     </div>
                 );
            }

            case ElementType.FOOTER: {
                const data = getBlockData();
                const links = data.links || [
                    { title: "Product", items: ["Features", "Templates", "Pricing"] },
                    { title: "Company", items: ["About", "Careers", "Contact"] },
                    { title: "Resources", items: ["Docs", "Blog", "Help"] }
                ];

                const footerGrid = viewMode === 'MOBILE' ? 'grid-cols-1' : 
                                 viewMode === 'TABLET' ? 'grid-cols-2' : 
                                 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
                const footerPadding = viewMode === 'MOBILE' ? 'px-6 py-8 gap-8' : 
                                    viewMode === 'TABLET' ? 'px-8 py-12 gap-10' : 
                                    'px-12 py-16 gap-12 md:gap-16';
                const brandSize = viewMode === 'MOBILE' ? 'text-xl' : 'text-2xl md:text-3xl';
                const textSize = viewMode === 'MOBILE' ? 'text-sm' : 'text-base';
                const copyrightSize = viewMode === 'MOBILE' ? 'text-xs' : 'text-sm';

                return (
                    <footer style={innerUserStyle} className={`w-full h-full box-border ${footerPadding} max-w-full bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-t-3xl`}>
                        <div className={`grid ${footerGrid} gap-8 md:gap-12 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-white/10`}>
                            <div className="space-y-4">
                                <div className={`${brandSize} font-bold flex items-center gap-3`}>
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-black text-lg">E</span>
                                    </div> 
                                    <EditableText 
                                        tagName="span" 
                                        value={data.brand || 'Ez Builder'} 
                                        onChange={(v) => updateBlockData('brand', v)} 
                                        previewMode={previewMode} 
                                        className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                    />
                                </div>
                                <p className={`max-w-xs leading-relaxed text-gray-300 ${textSize}`}>
                                    Empowering creators to build the web of tomorrow, block by block.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                        <span className="text-sm">𝕏</span>
                                    </div>
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                        <span className="text-sm">f</span>
                                    </div>
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                        <span className="text-sm">in</span>
                                    </div>
                                </div>
                            </div>
                            
                            {links.map((col: any, i: number) => (
                                <div key={i} className="space-y-4">
                                    <EditableText 
                                        tagName="h4"
                                        className={`font-bold ${viewMode === 'MOBILE' ? 'text-base' : 'text-lg'} text-white`}
                                        value={col.title || `Column ${i + 1}`}
                                        onChange={(v) => updateFooterColTitle(i, v)}
                                        previewMode={previewMode}
                                    />
                                    <ul className={`space-y-3 ${viewMode === 'MOBILE' ? 'text-sm' : 'text-base'} text-gray-300`}>
                                        {(col.items || []).map((item: string, j: number) => (
                                            <li key={j} className="hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-2 group">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                <EditableText 
                                                    tagName="span"
                                                    value={item || `Link ${j + 1}`}
                                                    onChange={(v) => updateFooterLink(i, j, v)}
                                                    previewMode={previewMode}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className={`flex flex-col ${viewMode === 'MOBILE' ? 'sm:flex-row' : 'sm:flex-row'} justify-between items-center ${copyrightSize} text-gray-400 space-y-4 sm:space-y-0`}>
                            <div className="text-center sm:text-left">
                                <EditableText 
                                    tagName="span"
                                    value={data.copyright || '© 2024 Ez Builder Inc. All rights reserved.'}
                                    onChange={(v) => updateBlockData('copyright', v)}
                                    previewMode={previewMode}
                                />
                            </div>
                            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
                                <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                                {viewMode !== 'MOBILE' && <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>}
                            </div>
                        </div>
                    </footer>
                );
            }

            default:
              return (
                  <div className="w-full p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl">❓</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">Unknown Element</h3>
                      <p className="text-gray-500 text-sm">This element type is not supported</p>
                      <p className="text-xs text-gray-400 mt-1">Type: {el.type}</p>
                  </div>
              );
          }
    };

    return (
        <div 
          onClick={(e) => { 
              if (previewMode) return;
              e.stopPropagation(); 
              onSelect(el.id); 
          }}
          className={`${wrapperClass} max-w-full relative overflow-hidden`}
          style={wrapperUserStyle}
          draggable={!previewMode}
          onDragStart={(e) => onDragStart(e, index)}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={elementRef}
        >
          <DragHandle />
          <Toolbar />
          {renderContent()}
          {!previewMode && isSelected && (
              <>
                <ResizeHandle direction="e" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
                <ResizeHandle direction="s" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
                <ResizeHandle direction="se" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
              </>
          )}
          
          {/* Element type badge */}
          {!previewMode && isHovered && !isSelected && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {el.type.toLowerCase().replace('_', ' ')}
              </div>
          )}
        </div>
    );
};

const EditorCanvas: React.FC<EditorCanvasProps> = ({ 
    elements, 
    selectedId, 
    onSelect, 
    onDelete, 
    onMove, 
    onReorder, 
    onInsert, 
    onUpdate, 
    previewMode, 
    viewMode 
}) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        
        // Add drag image
        const dragImage = document.createElement('div');
        dragImage.innerHTML = '📦 Dragging element';
        dragImage.className = 'absolute px-3 py-2 rounded-md text-xs z-[9999] opacity-80 text-white bg-gradient-to-br from-[#667eea] to-[#764ba2]';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 10, 10);
        
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        
        onReorder(draggedIndex, index);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setIsDragging(false);
    };
    
    // Viewport settings
    const viewportSettings = {
        'MOBILE': {
            maxWidth: 'max-w-[375px]',
            scale: 'scale-[0.85]',
            padding: 'p-2',
            deviceFrame: true
        },
        'TABLET': {
            maxWidth: 'max-w-[768px]',
            scale: 'scale-[0.9]',
            padding: 'p-4',
            deviceFrame: true
        },
        'DESKTOP': {
            maxWidth: 'max-w-[1280px]',
            scale: 'scale-100',
            padding: 'p-6 lg:p-8',
            deviceFrame: false
        },
        'TV': {
            maxWidth: 'max-w-[1920px]',
            scale: 'scale-100',
            padding: 'p-8 lg:p-12',
            deviceFrame: false
        }
    };

    const settings = viewportSettings[viewMode];
    const deviceFrameClass = settings.deviceFrame ? 'rounded-3xl border-8 border-gray-800 shadow-2xl relative' : '';
    const deviceNotch = settings.deviceFrame ? (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl flex items-center justify-center">
            <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
            <div className="absolute right-8 w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
    ) : null;

    const viewModeIcons = {
        'MOBILE': <Smartphone size={18} />,
        'TABLET': <Tablet size={18} />,
        'DESKTOP': <Monitor size={18} />,
        'TV': <Tv size={18} />
    };
    
    // Background and frame classes
    const canvasBgClass = previewMode ? 'bg-white' : 'bg-[#f8fafc] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[length:40px_40px]';
    const canvasMarginClass = settings.deviceFrame ? 'my-8 mx-auto' : 'mx-auto';
    const canvasOriginClass = 'origin-top-center';

    return (
        <div 
            ref={canvasRef}
            className={`flex-1 h-full overflow-y-auto custom-scrollbar ${settings.padding} transition-all duration-300 bg-gradient-to-br from-gray-50 via-white to-gray-50/50`}
            onClick={() => onSelect(null)}
        >
            {/* View Mode Indicator */}
            {!previewMode && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-xl border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-700">
                            {viewModeIcons[viewMode]}
                            <span className="text-sm font-medium capitalize">{viewMode.toLowerCase()}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="text-xs text-gray-500">
                            {elements.length} element{elements.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            )}

            <div 
                className={`${settings.maxWidth} ${canvasMarginClass} transition-all duration-500 min-h-[calc(100vh-4rem)] ${previewMode ? 'bg-white shadow-3xl rounded-3xl overflow-hidden' : deviceFrameClass} ${settings.scale} ${canvasOriginClass} ${canvasBgClass}`}
            >
                {deviceNotch}
                
                {/* Canvas Content Area */}
                <div className={`${settings.deviceFrame ? 'pt-8' : ''} ${previewMode ? 'min-h-screen' : 'min-h-[calc(100vh-8rem)]'}`}>
                    {!previewMode && <DropZone index={0} onDrop={onInsert} />}
                    
                    {elements.map((el, index) => (
                        <React.Fragment key={el.id}>
                            <CanvasElement
                                el={el}
                                index={index}
                                isSelected={selectedId === el.id}
                                onSelect={onSelect}
                                onDelete={onDelete}
                                onMove={onMove}
                                onUpdate={onUpdate}
                                previewMode={previewMode}
                                viewMode={viewMode}
                                onDragStart={handleDragStart}
                                onDragEnter={handleDragEnter}
                                onDragEnd={handleDragEnd}
                            />
                            {!previewMode && <DropZone index={index + 1} onDrop={onInsert} />}
                        </React.Fragment>
                    ))}

                    {elements.length === 0 && !previewMode && (
                        <div className={`h-[500px] border-3 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center text-gray-400 gap-4 mx-4 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm`}>
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center shadow-inner animate-pulse">
                                    <GripVertical size={40} className="text-primary-500" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">+</span>
                                </div>
                            </div>
                            <div className="text-center max-w-md">
                                <h3 className={`font-bold ${viewMode === 'MOBILE' ? 'text-xl' : 'text-2xl'} text-gray-700 mb-2`}>Welcome to your canvas! ✨</h3>
                                <p className={`text-sm ${viewMode === 'MOBILE' ? 'text-sm' : 'text-base'} text-gray-500 mb-6`}>
                                    Start building your page by dragging elements from the sidebar or choosing a template
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                            <span className="text-blue-600 text-xs">📦</span>
                                        </div>
                                        <span className="text-sm text-gray-700">Drag & Drop</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                            <span className="text-purple-600 text-xs">🎨</span>
                                        </div>
                                        <span className="text-sm text-gray-700">Edit Properties</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                            <span className="text-green-600 text-xs">📱</span>
                                        </div>
                                        <span className="text-sm text-gray-700">Responsive</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-3 h-3 rounded-full bg-primary-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                        </div>
                    )}

                    {/* Bottom padding */}
                    {!previewMode && elements.length > 0 && (
                        <div className="h-20 flex items-center justify-center">
                            <div className="text-center text-gray-400 text-sm">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                </div>
                                <p className="mt-2">End of page</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Drag overlay */}
            {isDragging && !previewMode && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 backdrop-blur-[1px]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-xl">👇</span>
                            </div>
                            <div>
                                <p className="font-bold">Drop element here</p>
                                <p className="text-sm opacity-90">Release to place on canvas</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorCanvas;