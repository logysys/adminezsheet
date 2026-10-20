import React, { useState } from 'react';
import { EditorElement, ElementType } from '@/types';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  BoxSelect, 
  Maximize, 
  Palette, 
  Settings2, 
  Code, 
  Trash2, 
  Plus, 
  Link as LinkIcon, 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  X,
  Type,
  Bold,
  Italic,
  Underline,
  Image as ImageIcon,
  Link2,
  Globe,
  Eye,
  EyeOff,
  Layers,
  Droplets,
  Paintbrush,
  Square,
  Circle,
  Hash,
  Percent,
  Ruler,
  MoveVertical,
  MoveHorizontal,
  Filter,
  Zap,
  Sparkles,
  Columns
} from 'lucide-react';

interface PropertiesPanelProps {
  element: EditorElement | null;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  onDelete?: (id: string) => void;
}

// Helper input component with Tailwind styling
const Field = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  textarea, 
  type = 'text',
  min,
  max,
  step
}: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  placeholder?: string, 
  textarea?: boolean,
  type?: string,
  min?: number,
  max?: number,
  step?: number
}) => (
  <div className="mb-4 group">
    <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider mb-2 flex items-center gap-2">
      <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
        {label}
      </span>
    </label>
    {textarea ? (
      <textarea 
        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 text-sm resize-y transition-all duration-200 bg-white/80 shadow-sm focus:shadow-md outline-none font-medium"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    ) : (
      <input 
        type={type}
        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 text-sm transition-all duration-200 bg-white/80 shadow-sm focus:shadow-md outline-none font-medium"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    )}
    <div className="h-0.5 w-0 group-focus-within:w-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 mt-1"></div>
  </div>
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdate, onDelete }) => {
  const [showJson, setShowJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'advanced'>('content');
  const [fontWeight, setFontWeight] = useState(element?.styles.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');

  if (!element) {
    return (
      <div className="w-80 bg-gradient-to-br from-gray-50/80 to-white border-l border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Layers className="w-10 h-10 text-primary-300" />
        </div>
        <p className="text-lg font-semibold text-gray-600 mb-2">No Element Selected</p>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Click on any element in the canvas to edit its properties
        </p>
        <div className="flex gap-2 mt-6">
          <div className="w-3 h-3 rounded-full bg-primary-400 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-primary-400 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-primary-400 animate-pulse delay-200"></div>
        </div>
      </div>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [key]: value,
      },
    });
  };

  const handleMultipleStyleChanges = (updates: Record<string, string>) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        ...updates,
      },
    });
  };

  const isRichBlock = [
    ElementType.NAVBAR, 
    ElementType.HERO, 
    ElementType.FEATURES, 
    ElementType.GALLERY, 
    ElementType.PRODUCT_GRID, 
    ElementType.CONTACT_FORM, 
    ElementType.FOOTER, 
    ElementType.TWO_COL
  ].includes(element.type);

  const getBlockData = () => {
    try { 
      return JSON.parse(element.content); 
    } catch { 
      return {}; 
    }
  };

  const updateRootData = (newData: any) => {
    onUpdate(element.id, { content: JSON.stringify(newData, null, 2) });
  };

  const updateField = (key: string, value: any) => {
    const data = getBlockData();
    const newData = { ...data, [key]: value };
    updateRootData(newData);
  };

  const renderRichConfiguration = () => {
    const data = getBlockData();

    switch (element.type) {
      case ElementType.NAVBAR:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-100 mb-4">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                BRAND & LOGO
              </h4>
              <Field label="Brand Name" value={data.brand} onChange={v => updateField('brand', v)} />
              <Field label="Logo URL" value={data.logoSrc} onChange={v => updateField('logoSrc', v)} placeholder="https://example.com/logo.png" />
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/30 p-4 rounded-xl border border-purple-100 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-2">
                  <Link2 className="w-3 h-3" />
                  MENU LINKS
                </h4>
                <button 
                  onClick={() => {
                    const newLinks = [...(data.links || []), { text: "New Link", href: "#" }];
                    updateField('links', newLinks);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus size={12} /> Add Link
                </button>
              </div>
              <div className="space-y-3">
                {(data.links || []).map((link: any, i: number) => {
                  const text = typeof link === 'string' ? link : link.text;
                  const href = typeof link === 'string' ? '#' : link.href;
                  return (
                    <div key={i} className="flex gap-3 items-center bg-white/80 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors group">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <input 
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                            value={text}
                            placeholder="Link Text"
                            onChange={(e) => {
                              const newLinks = [...(data.links || [])];
                              newLinks[i] = { text: e.target.value, href };
                              updateField('links', newLinks);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <input 
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-mono text-gray-600"
                            value={href}
                            placeholder="URL (e.g. /about)"
                            onChange={(e) => {
                              const newLinks = [...(data.links || [])];
                              newLinks[i] = { text, href: e.target.value };
                              updateField('links', newLinks);
                            }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newLinks = [...(data.links || [])].filter((_, idx) => idx !== i);
                          updateField('links', newLinks);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
                {(!data.links || data.links.length === 0) && (
                  <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
                    <Link2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No links added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Add Link" to create your first menu item</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100/30 p-4 rounded-xl border border-green-100">
              <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Square className="w-3 h-3" />
                ACTION BUTTON
              </h4>
              <Field label="Button Text" value={data.buttonText} onChange={v => updateField('buttonText', v)} />
              <Field label="Button URL" value={data.buttonHref} onChange={v => updateField('buttonHref', v)} placeholder="#" />
            </div>
          </div>
        );
      
      case ElementType.HERO:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/30 p-4 rounded-xl border border-yellow-100">
              <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                HERO CONTENT
              </h4>
              <Field label="Headline" value={data.title} onChange={v => updateField('title', v)} />
              <Field label="Subtitle" value={data.subtitle} onChange={v => updateField('subtitle', v)} textarea />
              <Field label="CTA Button" value={data.cta} onChange={v => updateField('cta', v)} />
              <Field label="Button URL" value={data.ctaHref} onChange={v => updateField('ctaHref', v)} placeholder="#" />
            </div>
          </div>
        );
      
      case ElementType.GALLERY:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50 to-pink-100/30 p-4 rounded-xl border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" />
                  IMAGE GALLERY
                </h4>
                <button 
                  onClick={() => {
                    const images = data.images || [];
                    updateField('images', [...images, `https://picsum.photos/400/400?random=${images.length + 100}`]);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus size={12} /> Add Image
                </button>
              </div>
              <label className="text-xs font-bold text-gray-700 block uppercase tracking-wide mb-3">
                Image URLs (One per line)
              </label>
              <textarea 
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-pink-500/30 focus:border-pink-500 text-xs font-mono transition-all duration-200 bg-white/80 shadow-sm focus:shadow-md outline-none"
                rows={8}
                value={data.images?.map((i: any) => typeof i === 'string' ? i : 'Placeholder').join('\n') || ''} 
                onChange={e => {
                  const lines = e.target.value.split('\n');
                  const newImages = lines.map((line: string) => line.trim() === 'Placeholder' ? 1 : line);
                  updateField('images', newImages);
                }} 
                placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
Placeholder (for random image)"
              />
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <Sparkles className="w-3 h-3" />
                <p>Type "Placeholder" to generate a random image</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {(data.images || []).slice(0, 6).map((img: any, i: number) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-1 right-1">
                      <button 
                        onClick={() => {
                          const newImages = [...(data.images || [])].filter((_, idx) => idx !== i);
                          updateField('images', newImages);
                        }}
                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case ElementType.CONTACT_FORM:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100/30 p-4 rounded-xl border border-teal-100">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Square className="w-3 h-3" />
                FORM SETTINGS
              </h4>
              <Field label="Form Title" value={data.title} onChange={v => updateField('title', v)} />
              <Field label="Submit Button" value={data.buttonText} onChange={v => updateField('buttonText', v)} />
              <div className="bg-white/50 p-3 rounded-lg border border-teal-200 mt-4">
                <p className="text-xs font-bold text-teal-700 mb-2">Form Fields</p>
                <div className="grid grid-cols-2 gap-3">
                  {['firstName', 'lastName', 'email', 'message'].map((field) => (
                    <div key={field}>
                      <label className="text-xs text-gray-600 block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={data.labels?.[field] || field.replace(/([A-Z])/g, ' $1')}
                        onChange={(e) => {
                          const newLabels = { ...(data.labels || {}) };
                          newLabels[field] = e.target.value;
                          updateField('labels', newLabels);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <Eye className="w-3 h-3" />
                <p>Tip: Edit form labels directly on the canvas for live preview</p>
              </div>
            </div>
          </div>
        );
      
      case ElementType.FEATURES: {
        const items = Array.isArray(data) ? data : [];
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/30 p-4 rounded-xl border border-indigo-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  FEATURES GRID
                </h4>
                <button 
                  onClick={() => updateRootData([...items, { title: "New Feature", desc: "Feature description" }])}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus size={12} /> Add Feature
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item: any, i: number) => (
                  <div key={i} className="bg-white/80 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors relative group">
                    <div className="absolute -left-2 top-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {i + 1}
                      </div>
                    </div>
                    <button 
                      onClick={() => updateRootData(items.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 ml-8">
                      <input 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={item.title}
                        placeholder="Feature Title"
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[i] = { ...item, title: e.target.value };
                          updateRootData(newItems);
                        }}
                      />
                      <textarea 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                        rows={2}
                        value={item.desc}
                        placeholder="Feature description"
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[i] = { ...item, desc: e.target.value };
                          updateRootData(newItems);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {items.length === 0 && (
                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
                  <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">No features yet</p>
                  <p className="text-xs text-gray-500 mt-1">Add your first feature to get started</p>
                </div>
              )}
            </div>
          </div>
        );
      }
      
      case ElementType.PRODUCT_GRID: {
        const items = Array.isArray(data) ? data : [];
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/30 p-4 rounded-xl border border-orange-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wide flex items-center gap-2">
                  <Square className="w-3 h-3" />
                  PRODUCTS
                </h4>
                <button 
                  onClick={() => updateRootData([...items, { 
                    name: "New Product", 
                    price: "$99", 
                    buttonText: "Add to Cart",
                    image: "https://picsum.photos/400/300"
                  }])}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus size={12} /> Add Product
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item: any, i: number) => (
                  <div key={i} className="bg-white/80 p-4 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <input 
                          className="w-full p-2 border border-gray-300 rounded text-sm font-bold bg-white focus:ring-2 focus:ring-orange-500 outline-none mb-2"
                          value={item.name}
                          placeholder="Product Name"
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[i] = { ...item, name: e.target.value };
                            updateRootData(newItems);
                          }}
                        />
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                            value={item.price}
                            placeholder="Price"
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[i] = { ...item, price: e.target.value };
                              updateRootData(newItems);
                            }}
                          />
                          <button 
                            onClick={() => updateRootData(items.filter((_, idx) => idx !== i))}
                            className="px-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <ImageIcon className="w-3 h-3" />
                        <span>Image URL</span>
                      </div>
                      <input 
                        className="w-full p-2 border border-gray-300 rounded text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                        value={item.image || ''}
                        placeholder="https://example.com/product.jpg"
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[i] = { ...item, image: e.target.value };
                          updateRootData(newItems);
                        }}
                      />
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <input 
                          className="p-2 border border-gray-300 rounded text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                          value={item.buttonText || ''}
                          placeholder="Button Text"
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[i] = { ...item, buttonText: e.target.value };
                            updateRootData(newItems);
                          }}
                        />
                        <input 
                          className="p-2 border border-gray-300 rounded text-xs bg-white focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                          value={item.buttonHref || ''}
                          placeholder="Button URL"
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[i] = { ...item, buttonHref: e.target.value };
                            updateRootData(newItems);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      case ElementType.FOOTER: {
        const links = data.links || [];
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-xl border border-gray-700">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Square className="w-3 h-3" />
                FOOTER SETTINGS
              </h4>
              <Field label="Brand Name" value={data.brand} onChange={v => updateField('brand', v)} />
              <Field label="Copyright Text" value={data.copyright} onChange={v => updateField('copyright', v)} />
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/30 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  FOOTER COLUMNS
                </h4>
                <button 
                  onClick={() => updateField('links', [...links, { title: "New Column", items: ["Link 1", "Link 2"] }])}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus size={12} /> Add Column
                </button>
              </div>
              <div className="space-y-4">
                {links.map((col: any, colIdx: number) => (
                  <div key={colIdx} className="bg-white/80 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Square className="w-3 h-3 text-gray-400" />
                        <input 
                          className="bg-transparent border-b-2 border-gray-300 focus:border-primary-500 text-xs font-bold w-full outline-none px-2 py-1"
                          value={col.title}
                          onChange={(e) => {
                            const newLinks = [...links];
                            newLinks[colIdx] = { ...col, title: e.target.value };
                            updateField('links', newLinks);
                          }}
                          placeholder="Column Title"
                        />
                      </div>
                      <button 
                        onClick={() => updateField('links', links.filter((_, i) => i !== colIdx))} 
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="space-y-2 ml-6 pl-3 border-l-2 border-gray-200">
                      {col.items?.map((linkItem: string, itemIdx: number) => (
                        <div key={itemIdx} className="flex gap-2 items-center group">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                          <input 
                            className="flex-1 bg-white p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-primary-500 outline-none"
                            value={linkItem}
                            onChange={(e) => {
                              const newLinks = [...links];
                              const newItems = [...col.items];
                              newItems[itemIdx] = e.target.value;
                              newLinks[colIdx] = { ...col, items: newItems };
                              updateField('links', newLinks);
                            }}
                            placeholder="Link text"
                          />
                          <button 
                            onClick={() => {
                              const newLinks = [...links];
                              const newItems = col.items.filter((_, i) => i !== itemIdx);
                              newLinks[colIdx] = { ...col, items: newItems };
                              updateField('links', newLinks);
                            }} 
                            className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newLinks = [...links];
                          const newItems = [...(col.items || []), "New Link"];
                          newLinks[colIdx] = { ...col, items: newItems };
                          updateField('links', newLinks);
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 mt-2 flex items-center gap-1.5 font-medium ml-1"
                      >
                        <Plus size={10} /> Add Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      case ElementType.TWO_COL: {
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100/30 p-4 rounded-xl border border-cyan-100">
              <h4 className="text-xs font-bold text-cyan-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Columns className="w-3 h-3" />
                TWO COLUMN LAYOUT
              </h4>
              <Field label="Left Column Content" value={data.left} onChange={v => updateField('left', v)} textarea />
              <Field label="Right Column Content" value={data.right} onChange={v => updateField('right', v)} textarea />
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <Code className="w-3 h-3" />
                <p>Accepts HTML or plain text. Use HTML for advanced formatting.</p>
              </div>
            </div>
          </div>
        );
      }
      
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/30 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <Settings2 className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Advanced Configuration</h4>
                  <p className="text-xs text-yellow-700">Use JSON mode for full control</p>
                </div>
              </div>
              <button 
                onClick={() => setShowJson(true)}
                className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Code size={14} /> Switch to JSON Editor
              </button>
            </div>
          </div>
        );
    }
  };

  const renderTypographyControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Font Size</label>
          <div className="flex gap-2">
            <select
              value={element.styles.fontSize || '16px'}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="12px">Small (12px)</option>
              <option value="14px">Medium (14px)</option>
              <option value="16px">Normal (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="24px">X-Large (24px)</option>
              <option value="30px">XX-Large (30px)</option>
            </select>
            <input
              type="text"
              value={element.styles.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-16 p-2 border border-gray-300 rounded-lg text-sm text-center bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="px"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Font Weight</label>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: '300', label: 'Light', icon: Type },
              { value: '400', label: 'Normal', icon: Type },
              { value: '600', label: 'Bold', icon: Bold },
              { value: '700', label: 'Bolder', icon: Bold },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setFontWeight(value);
                  handleStyleChange('fontWeight', value);
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-md transition-all ${
                  fontWeight === value 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                title={label}
              >
                <Icon size={14} />
                <span className="text-[10px] mt-0.5">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newStyle = fontStyle === 'normal' ? 'italic' : 'normal';
              setFontStyle(newStyle);
              handleStyleChange('fontStyle', newStyle);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium ${
              fontStyle === 'italic' 
                ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <Italic size={14} /> Italic
          </button>
          <button
            onClick={() => {
              const newDecoration = textDecoration === 'none' ? 'underline' : 'none';
              setTextDecoration(newDecoration);
              handleStyleChange('textDecoration', newDecoration);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium ${
              textDecoration === 'underline' 
                ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <Underline size={14} /> Underline
          </button>
        </div>
      </div>
    </div>
  );

  const renderColorControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Text Color</label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={element.styles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-primary-500 transition-colors"
              />
              <div className="absolute inset-0 rounded-lg border border-white/50 pointer-events-none"></div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={element.styles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-xs font-mono bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Background</label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={element.styles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-primary-500 transition-colors"
              />
              <div className="absolute inset-0 rounded-lg border border-white/50 pointer-events-none"></div>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={element.styles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-xs font-mono bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Gradient Background</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { 
              tailwind: 'from-blue-500 to-violet-500', 
              value: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
              label: 'Blue-Purple' 
            },
            { 
              tailwind: 'from-emerald-500 to-blue-500', 
              value: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', 
              label: 'Green-Blue' 
            },
            { 
              tailwind: 'from-amber-500 to-red-500', 
              value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', 
              label: 'Orange-Red' 
            },
          ].map((gradient, i) => (
            <button
              key={i}
              onClick={() => handleStyleChange('background', gradient.value)}
              className="h-8 rounded-lg border border-gray-300 overflow-hidden group relative"
              title={gradient.label}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient.tailwind}`}></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBorderControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Width</label>
          <select
            value={element.styles.borderWidth || '0px'}
            onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="0px">None</option>
            <option value="1px">Thin (1px)</option>
            <option value="2px">Medium (2px)</option>
            <option value="4px">Thick (4px)</option>
            <option value="8px">Heavy (8px)</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={element.styles.borderColor || '#000000'}
              onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={element.styles.borderColor || '#000000'}
              onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              className="flex-1 p-1.5 border border-gray-300 rounded text-xs font-mono bg-white"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Radius</label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: '0px', label: 'None', icon: Square },
            { value: '4px', label: 'S', icon: Square },
            { value: '8px', label: 'M', icon: Square },
            { value: '16px', label: 'L', icon: Square },
            { value: '9999px', label: 'Full', icon: Circle },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleStyleChange('borderRadius', value)}
              className={`flex flex-col items-center justify-center py-2 rounded-lg ${
                element.styles.borderRadius === value
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
              title={label}
            >
              <Icon size={14} />
              <span className="text-[10px] mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Style</label>
        <div className="grid grid-cols-4 gap-2">
          {['solid', 'dashed', 'dotted', 'double'].map((style) => (
            <button
              key={style}
              onClick={() => handleStyleChange('borderStyle', style)}
              className={`py-1.5 text-xs capitalize rounded border ${
                element.styles.borderStyle === style
                  ? 'bg-primary-100 text-primary-700 border-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Width</label>
          <div className="flex gap-2">
            <select
              value={element.styles.width === '100%' ? 'full' : element.styles.width || 'auto'}
              onChange={(e) => {
                const value = e.target.value === 'full' ? '100%' : e.target.value;
                handleStyleChange('width', value);
              }}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="auto">Auto</option>
              <option value="full">100%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="33%">33%</option>
              <option value="25%">25%</option>
            </select>
            <input
              type="text"
              value={element.styles.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="w-16 p-2 border border-gray-300 rounded-lg text-sm text-center bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="px/%"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Height</label>
          <div className="flex gap-2">
            <select
              value={element.styles.height === '100%' ? 'full' : element.styles.height || 'auto'}
              onChange={(e) => {
                const value = e.target.value === 'full' ? '100%' : e.target.value;
                handleStyleChange('height', value);
              }}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="auto">Auto</option>
              <option value="full">100%</option>
              <option value="200px">200px</option>
              <option value="300px">300px</option>
              <option value="400px">400px</option>
            </select>
            <input
              type="text"
              value={element.styles.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              className="w-16 p-2 border border-gray-300 rounded-lg text-sm text-center bg-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="px"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Padding</label>
          <input
            type="text"
            value={element.styles.padding || '0px'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g. 16px"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Margin</label>
          <input
            type="text"
            value={element.styles.margin || '0px'}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g. 10px"
          />
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Text Alignment</label>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {[
            { value: 'left', icon: AlignLeft, label: 'Left' },
            { value: 'center', icon: AlignCenter, label: 'Center' },
            { value: 'right', icon: AlignRight, label: 'Right' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleStyleChange('textAlign', value)}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md ${
                element.styles.textAlign === value
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title={label}
            >
              <Icon size={16} />
              <span className="text-[10px] mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEffectsControls = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Shadow</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'none', label: 'None' },
            { value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', label: 'Small' },
            { value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', label: 'Medium' },
            { value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', label: 'Large' },
            { value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', label: 'X-Large' },
            { value: '0 25px 50px -12px rgb(0 0 0 / 0.25)', label: '2XL' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleStyleChange('boxShadow', value)}
              className={`py-2 rounded-lg text-xs ${
                element.styles.boxShadow === value
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Opacity</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={parseInt(element.styles.opacity || '100')}
            onChange={(e) => handleStyleChange('opacity', `${parseInt(e.target.value) / 100}`)}
            className="flex-1"
          />
          <span className="text-xs font-mono w-10 text-center">
            {parseInt(element.styles.opacity || '100')}%
          </span>
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-600 block mb-1.5">Transform</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const rotate = element.styles.transform?.includes('rotate') 
                ? element.styles.transform 
                : 'rotate(0deg)';
              const newRotate = rotate === 'rotate(0deg)' ? 'rotate(90deg)' : 'rotate(0deg)';
              handleStyleChange('transform', newRotate);
            }}
            className={`py-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
              element.styles.transform?.includes('rotate(90deg)')
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <MoveVertical size={12} /> Rotate 90°
          </button>
          <button
            onClick={() => handleStyleChange('transform', 'scaleX(-1)')}
            className={`py-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
              element.styles.transform?.includes('scaleX(-1)')
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <MoveHorizontal size={12} /> Flip
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50/30 border-l border-gray-200 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-inner">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50/50 flex justify-between items-center sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 uppercase tracking-wide text-sm flex items-center gap-2">
                PROPERTIES
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  v1.2
                </span>
              </h2>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5 bg-gray-100 px-2 py-1 rounded-md inline-block">
                ID: {element.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-3 py-2 rounded-lg text-xs font-bold border border-primary-200 uppercase shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
          {element.type}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white/50 px-5 pt-4">
        <div className="flex space-x-1">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'style', label: 'Style', icon: Palette },
            { id: 'layout', label: 'Layout', icon: Maximize },
            { id: 'advanced', label: 'Advanced', icon: Settings2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-t-lg transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-primary-600 border-t-2 border-primary-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fade-in">
            {/* Simple Text Content */}
            {(element.type === ElementType.HEADER || element.type === ElementType.PARAGRAPH || element.type === ElementType.BUTTON || element.type === ElementType.CONTAINER) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary-500" />
                    CONTENT
                  </label>
                  {element.type === ElementType.HEADER && (
                    <select
                      value={element.styles.fontSize || '24px'}
                      onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1"
                    >
                      <option value="18px">H3</option>
                      <option value="24px">H2</option>
                      <option value="30px">H1</option>
                    </select>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-4 rounded-xl border border-gray-200">
                  <textarea
                    value={element.content}
                    onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary-500/30 focus:border-primary-500 text-sm transition-all duration-200 bg-white shadow-sm focus:shadow-md outline-none resize-none"
                    rows={3}
                    placeholder={`Enter ${element.type.toLowerCase()} text...`}
                  />
                  
                  {element.type === ElementType.BUTTON && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <LinkIcon className="w-3 h-3 text-primary-500" />
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">LINK URL</label>
                      </div>
                      <Field 
                        label=""
                        value={element.href || ''} 
                        onChange={v => onUpdate(element.id, { href: v })} 
                        placeholder="https://example.com or #section-id" 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Source */}
            {element.type === ElementType.IMAGE && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary-500" />
                  IMAGE SETTINGS
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-4 rounded-xl border border-gray-200 space-y-4">
                  <Field label="Image Source" value={element.src || ''} onChange={v => onUpdate(element.id, { src: v })} placeholder="https://example.com/image.jpg" />
                  <Field label="Alt Text" value={element.alt || ''} onChange={v => onUpdate(element.id, { alt: v })} placeholder="Description for screen readers" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1.5">Width</label>
                      <input
                        type="text"
                        value={element.styles.width || '100%'}
                        onChange={(e) => handleStyleChange('width', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="100%"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1.5">Height</label>
                      <input
                        type="text"
                        value={element.styles.height || 'auto'}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rich Block Configuration */}
            {isRichBlock && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-primary-500" />
                    CONFIGURATION
                  </label>
                  <button 
                    onClick={() => setShowJson(!showJson)}
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium ${
                      showJson 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                    title="Toggle JSON Editor"
                  >
                    <Code size={14} />
                    {showJson ? 'Visual Editor' : 'JSON Editor'}
                  </button>
                </div>

                {/* Switch between User Friendly Fields and JSON */}
                {showJson ? (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary-400" />
                        JSON EDITOR
                      </label>
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {JSON.parse(element.content || '{}') ? 'Valid JSON' : 'Invalid'}
                      </span>
                    </div>
                    <textarea
                      value={element.content}
                      onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                      className="w-full p-4 border-2 border-gray-800 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-xs font-mono bg-gray-900 text-gray-100 focus:outline-none transition-all"
                      rows={12}
                      spellCheck="false"
                    />
                    <p className="text-xs text-gray-400 mt-2 bg-gray-800/50 p-2 rounded">
                      <Code className="w-3 h-3 inline mr-1" />
                      Directly editing JSON structure. Changes are applied immediately.
                    </p>
                  </div>
                ) : (
                  <div className="animate-slide-up">
                    {renderRichConfiguration()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/30 p-4 rounded-xl border border-purple-100">
              <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                COLORS & BACKGROUND
              </h3>
              {renderColorControls()}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Type className="w-4 h-4" />
                TYPOGRAPHY
              </h3>
              {renderTypographyControls()}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100/30 p-4 rounded-xl border border-green-100">
              <h3 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Square className="w-4 h-4" />
                BORDERS
              </h3>
              {renderBorderControls()}
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/30 p-4 rounded-xl border border-orange-100">
              <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Maximize className="w-4 h-4" />
                SIZE & SPACING
              </h3>
              {renderLayoutControls()}
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-pink-100/30 p-4 rounded-xl border border-pink-100">
              <h3 className="text-xs font-bold text-pink-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                EFFECTS & TRANSFORMS
              </h3>
              {renderEffectsControls()}
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100/30 p-4 rounded-xl border border-cyan-100">
              <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                DISPLAY & POSITION
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1.5">Display</label>
                  <select
                    value={element.styles.display || 'block'}
                    onChange={(e) => handleStyleChange('display', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="block">Block</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">Hidden</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1.5">Position</label>
                  <select
                    value={element.styles.position || 'static'}
                    onChange={(e) => handleStyleChange('position', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="static">Static</option>
                    <option value="relative">Relative</option>
                    <option value="absolute">Absolute</option>
                    <option value="fixed">Fixed</option>
                    <option value="sticky">Sticky</option>
                  </select>
                </div>
              </div>
              
              {element.styles.position !== 'static' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1.5">Top</label>
                    <input
                      type="text"
                      value={element.styles.top || '0px'}
                      onChange={(e) => handleStyleChange('top', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1.5">Left</label>
                    <input
                      type="text"
                      value={element.styles.left || '0px'}
                      onChange={(e) => handleStyleChange('left', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 rounded-xl border border-gray-700">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Code className="w-4 h-4" />
                CUSTOM CSS
              </h3>
              <textarea
                value={element.styles.customCss || ''}
                onChange={(e) => handleStyleChange('customCss', e.target.value)}
                className="w-full p-3 border-2 border-gray-700 rounded-lg text-xs font-mono bg-gray-900 text-gray-100 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                rows={6}
                placeholder="/* Add custom CSS here */
.custom-class {
  transform: rotate(5deg);
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.2));
}"
                spellCheck="false"
              />
              <p className="text-xs text-gray-400 mt-2">
                Custom CSS will be applied inline to this element
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/30 p-4 rounded-xl border border-yellow-200">
              <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                ANIMATIONS
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1.5">Animation</label>
                  <select
                    value={element.styles.animation || 'none'}
                    onChange={(e) => handleStyleChange('animation', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="none">None</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideInUp">Slide Up</option>
                    <option value="slideInLeft">Slide Left</option>
                    <option value="zoomIn">Zoom In</option>
                    <option value="bounce">Bounce</option>
                    <option value="pulse">Pulse</option>
                    <option value="spin">Spin</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1.5">Duration</label>
                    <select
                      value={element.styles.animationDuration || '0.3s'}
                      onChange={(e) => handleStyleChange('animationDuration', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="0.1s">Fast (0.1s)</option>
                      <option value="0.3s">Normal (0.3s)</option>
                      <option value="0.5s">Slow (0.5s)</option>
                      <option value="1s">Very Slow (1s)</option>
                      <option value="2s">Extra Slow (2s)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 block mb-1.5">Delay</label>
                    <select
                      value={element.styles.animationDelay || '0s'}
                      onChange={(e) => handleStyleChange('animationDelay', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="0s">None</option>
                      <option value="0.1s">0.1s</option>
                      <option value="0.2s">0.2s</option>
                      <option value="0.3s">0.3s</option>
                      <option value="0.5s">0.5s</option>
                      <option value="1s">1s</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100/30 p-4 rounded-xl border border-red-100">
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                VISIBILITY & INTERACTION
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Hide on mobile</label>
                  <button
                    onClick={() => handleStyleChange('hideOnMobile', element.styles.hideOnMobile ? '' : 'true')}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      element.styles.hideOnMobile ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 transform ${
                      element.styles.hideOnMobile ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Hide on desktop</label>
                  <button
                    onClick={() => handleStyleChange('hideOnDesktop', element.styles.hideOnDesktop ? '' : 'true')}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      element.styles.hideOnDesktop ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-all duration-200 transform ${
                      element.styles.hideOnDesktop ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                
                <div>
                  <label className="text-xs text-gray-600 block mb-1.5">Cursor Type</label>
                  <select
                    value={element.styles.cursor || 'default'}
                    onChange={(e) => handleStyleChange('cursor', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="default">Default</option>
                    <option value="pointer">Pointer</option>
                    <option value="text">Text</option>
                    <option value="move">Move</option>
                    <option value="not-allowed">Not Allowed</option>
                    <option value="wait">Wait</option>
                    <option value="grab">Grab</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100/30 p-4 rounded-xl border border-gray-200">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                ADVANCED SETTINGS
              </h3>
              <div className="space-y-3">
                <Field 
                  label="CSS Class" 
                  value={element.styles.className || ''} 
                  onChange={v => handleStyleChange('className', v)} 
                  placeholder="custom-class another-class" 
                />
                
                <Field 
                  label="Element ID" 
                  value={element.styles.id || ''} 
                  onChange={v => handleStyleChange('id', v)} 
                  placeholder="unique-id" 
                />
                
                <Field 
                  label="Data Attributes" 
                  value={element.styles.dataAttributes || ''} 
                  onChange={v => handleStyleChange('dataAttributes', v)} 
                  placeholder="data-modal='true' data-id='123'" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50/50 space-y-3 sticky bottom-0">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              // Reset styles
              onUpdate(element.id, { 
                styles: { 
                  ...element.styles,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderWidth: '0px',
                  borderRadius: '0px',
                  boxShadow: 'none',
                  padding: '0px',
                  margin: '0px'
                }
              });
            }}
            className="flex items-center justify-center gap-2 text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
          >
            <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <Square size={16} />
            </div>
            Reset Styles
          </button>
          
          <button 
            onClick={() => {
              // Copy element
              const newElement = { ...element, id: `el-${Date.now()}` };
              onUpdate(newElement.id, newElement);
            }}
            className="flex items-center justify-center gap-2 text-primary-700 bg-white border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
          >
            <div className="p-1.5 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Layers size={16} />
            </div>
            Duplicate
          </button>
        </div>
        
        <button 
          onClick={() => onDelete?.(element.id)}
          className="w-full flex items-center justify-center gap-3 text-red-600 bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-lg active:scale-95 group"
        >
          <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
            <Trash2 size={18} />
          </div>
          Delete Element
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-normal group-hover:bg-red-200">
            Irreversible
          </span>
        </button>
        
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            Element ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{element.id.slice(0, 12)}...</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;