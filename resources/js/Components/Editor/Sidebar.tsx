import React from 'react';
import { ElementType, EditorElement } from '@/types';
import { TEMPLATES } from '@/templates';
import { 
  Type, Image, FileText, Box, Columns, Square, LayoutTemplate, 
  Menu, Monitor, Grid, ShoppingBag, Mail, List, PanelBottom,
  BookTemplate, Search, ChevronDown, ChevronUp, Sparkles,
  Home, Palette, Grid3x3, Users, Calendar, MessageSquare,
  Star, Globe, Music, Video, Camera, Code, Database,
  Shield, Zap, Cloud, Bell, Heart, TrendingUp, Download,
  Upload, Folder, File, Settings, HelpCircle, Briefcase,
  // Merged additional icons from bottom of file
  Tag, Share2, Clock, Plus, MousePointer, Keyboard 
} from 'lucide-react';

interface SidebarProps {
  onAddElement: (type: ElementType) => void;
  onLoadTemplate: (elements: Partial<EditorElement>[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddElement, onLoadTemplate }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState({
    templates: true,
    sections: true,
    basics: true,
    media: true,
    business: true,
    social: true
  });

  // Basic Elements
  const basics = [
    { type: ElementType.HEADER, icon: Type, label: 'Heading', description: 'Add a heading element', color: 'from-blue-500 to-blue-600' },
    { type: ElementType.PARAGRAPH, icon: FileText, label: 'Paragraph', description: 'Add text content', color: 'from-green-500 to-green-600' },
    { type: ElementType.BUTTON, icon: Square, label: 'Button', description: 'Add a clickable button', color: 'from-purple-500 to-purple-600' },
    { type: ElementType.IMAGE, icon: Image, label: 'Image', description: 'Add an image', color: 'from-pink-500 to-pink-600' },
    { type: ElementType.CONTAINER, icon: Box, label: 'Container', description: 'Add a container box', color: 'from-orange-500 to-orange-600' },
    { type: ElementType.TWO_COL, icon: Columns, label: '2 Columns', description: 'Add two columns layout', color: 'from-indigo-500 to-indigo-600' },
  ];

  // Section Elements
  const sections = [
    { type: ElementType.NAVBAR, icon: Menu, label: 'Navbar', description: 'Navigation bar', color: 'from-gray-700 to-gray-800' },
    { type: ElementType.HERO, icon: Monitor, label: 'Hero', description: 'Hero section', color: 'from-cyan-500 to-cyan-600' },
    { type: ElementType.FEATURES, icon: List, label: 'Features', description: 'Features grid', color: 'from-emerald-500 to-emerald-600' },
    { type: ElementType.GALLERY, icon: Grid, label: 'Gallery', description: 'Image gallery', color: 'from-violet-500 to-violet-600' },
    { type: ElementType.PRODUCT_GRID, icon: ShoppingBag, label: 'Products', description: 'Product grid', color: 'from-rose-500 to-rose-600' },
    { type: ElementType.CONTACT_FORM, icon: Mail, label: 'Contact', description: 'Contact form', color: 'from-amber-500 to-amber-600' },
    { type: ElementType.FOOTER, icon: PanelBottom, label: 'Footer', description: 'Page footer', color: 'from-slate-700 to-slate-800' },
  ];

  // Media Elements
  const mediaElements = [
    { type: 'VIDEO' as ElementType, icon: Video, label: 'Video Player', description: 'Embed a video', color: 'from-red-500 to-red-600' },
    { type: 'AUDIO' as ElementType, icon: Music, label: 'Audio Player', description: 'Add audio player', color: 'from-yellow-500 to-yellow-600' },
    { type: 'SLIDER' as ElementType, icon: Camera, label: 'Slider', description: 'Image slider/carousel', color: 'from-fuchsia-500 to-fuchsia-600' },
    { type: 'MAP' as ElementType, icon: Globe, label: 'Map', description: 'Embed Google Maps', color: 'from-teal-500 to-teal-600' },
    { type: 'EMBED' as ElementType, icon: Code, label: 'Embed', description: 'Embed custom HTML', color: 'from-lime-500 to-lime-600' },
  ];

  // Business Elements
  const businessElements = [
    { type: 'PRICING' as ElementType, icon: Tag, label: 'Pricing', description: 'Pricing table', color: 'from-blue-600 to-blue-700' },
    { type: 'TEAM' as ElementType, icon: Users, label: 'Team', description: 'Team members section', color: 'from-green-600 to-green-700' },
    { type: 'TESTIMONIALS' as ElementType, icon: MessageSquare, label: 'Testimonials', description: 'Customer reviews', color: 'from-purple-600 to-purple-700' },
    { type: 'TIMELINE' as ElementType, icon: Calendar, label: 'Timeline', description: 'Project timeline', color: 'from-pink-600 to-pink-700' },
    { type: 'STATS' as ElementType, icon: TrendingUp, label: 'Stats', description: 'Statistics counter', color: 'from-orange-600 to-orange-700' },
    { type: 'FAQ' as ElementType, icon: HelpCircle, label: 'FAQ', description: 'FAQ section', color: 'from-indigo-600 to-indigo-700' },
  ];

  // Social Elements
  const socialElements = [
    { type: 'SOCIAL_SHARE' as ElementType, icon: Share2, label: 'Social Share', description: 'Social media buttons', color: 'from-cyan-600 to-cyan-700' },
    { type: 'NEWSLETTER' as ElementType, icon: Mail, label: 'Newsletter', description: 'Email signup form', color: 'from-emerald-600 to-emerald-700' },
    { type: 'SOCIAL_FEED' as ElementType, icon: Users, label: 'Social Feed', description: 'Social media feed', color: 'from-violet-600 to-violet-700' },
    { type: 'COMMENTS' as ElementType, icon: MessageSquare, label: 'Comments', description: 'Comments section', color: 'from-rose-600 to-rose-700' },
    { type: 'RATING' as ElementType, icon: Star, label: 'Rating', description: 'Star rating system', color: 'from-amber-600 to-amber-700' },
  ];

  // Filter elements based on search query
  const filteredBasics = basics.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSections = sections.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = TEMPLATES.filter(tpl =>
    tpl.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMedia = mediaElements.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBusiness = businessElements.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSocial = socialElements.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle drag start for elements
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('elementType', type);
    e.dataTransfer.effectAllowed = 'copy';
    // Add visual feedback
    e.currentTarget.classList.add('opacity-50', 'scale-95');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50', 'scale-95');
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to render a section
  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: Array<any>,
    expandedKey: string,
    color: string = 'from-primary-500 to-primary-600',
    gridCols: string = 'grid-cols-3'
  ) => {
    if (items.length === 0 && !searchQuery) return null;
    
    return (
      <div className="space-y-3">
        <button
          onClick={() => toggleSection(expandedKey)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
              {icon}
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-800 tracking-wider uppercase">{title}</h2>
              <p className="text-[10px] text-gray-500 font-medium">{items.length} elements</p>
            </div>
          </div>
          {expandedSections[expandedKey] ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </button>
        
        {expandedSections[expandedKey] && items.length > 0 && (
          <div className={`grid ${gridCols} gap-2 pl-10`}>
            {items.map((tool) => (
              <div
                key={tool.type}
                draggable
                onDragStart={(e) => handleDragStart(e, tool.type)}
                onDragEnd={handleDragEnd}
                onClick={() => onAddElement(tool.type)}
                className="flex flex-col items-center justify-center p-2 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group/element cursor-grab active:cursor-grabbing"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-1.5 group-hover/element:scale-110 transition-transform`}>
                  <tool.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-gray-700 group-hover/element:text-gray-900 truncate w-full text-center">
                  {tool.label}
                </span>
                <p className="text-[9px] text-gray-500 text-center opacity-0 group-hover/element:opacity-100 transition-opacity duration-200 mt-0.5 px-1 leading-tight">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {expandedSections[expandedKey] && items.length === 0 && searchQuery && (
          <div className="pl-10">
            <p className="text-xs text-gray-400 italic py-2">No elements found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 h-full flex flex-col bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-white via-white to-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Ez Builder</h1>
            <p className="text-xs text-gray-500 font-medium truncate">Visual Page Editor</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full border border-primary-100">
              v1.3.0
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">Beta</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Search elements, templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl bg-white/80 focus:bg-white focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20 outline-none transition-all duration-200 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
            >
              <div className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <span className="text-xs text-gray-500">×</span>
              </div>
            </button>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            <span>{TEMPLATES.length} Templates</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      {/* Replaced 'custom-scrollbar' with native tailwind classes */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Templates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-800 tracking-wider uppercase">Templates</h2>
                <p className="text-[10px] text-gray-500 font-medium">Pre-designed layouts</p>
              </div>
            </div>
            <button
              onClick={() => toggleSection('templates')}
              className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expandedSections.templates ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {expandedSections.templates && (
            <div className="space-y-2.5">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => onLoadTemplate(tpl.elements)}
                    className="w-full flex items-start gap-3 p-3.5 bg-white hover:bg-gradient-to-r hover:from-white hover:to-gray-50 border border-gray-200 hover:border-primary-300 hover:shadow-lg rounded-xl transition-all duration-300 text-left group/template active:scale-[0.98]"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/template:from-primary-100 group-hover/template:to-primary-200 transition-all">
                        <BookTemplate className="w-4.5 h-4.5 text-primary-600 group-hover/template:text-primary-700" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border border-white shadow-xs"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-gray-800 group-hover/template:text-primary-700 truncate">
                          {tpl.name}
                        </span>
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                          {tpl.elements.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Full page template with multiple sections
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                        <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                        <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-500"></div>
                        <span className="text-[10px] text-gray-400 ml-auto">Click to load</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <p className="text-sm text-gray-500">No templates found</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sections */}
        {renderSection(
          "Page Sections",
          <LayoutTemplate className="w-4 h-4 text-white" />,
          filteredSections,
          "sections",
          "from-blue-500 to-blue-600",
          "grid-cols-2"
        )}

        {/* Basic Elements */}
        {renderSection(
          "Basic Elements",
          <Box className="w-4 h-4 text-white" />,
          filteredBasics,
          "basics",
          "from-green-500 to-green-600",
          "grid-cols-3"
        )}

        {/* Media Elements */}
        {renderSection(
          "Media & Embeds",
          <Video className="w-4 h-4 text-white" />,
          filteredMedia,
          "media",
          "from-red-500 to-red-600",
          "grid-cols-3"
        )}

        {/* Business Elements */}
        {renderSection(
          "Business",
          <Briefcase className="w-4 h-4 text-white" />,
          filteredBusiness,
          "business",
          "from-indigo-500 to-indigo-600",
          "grid-cols-3"
        )}

        {/* Social Elements */}
        {renderSection(
          "Social & Forms",
          <Users className="w-4 h-4 text-white" />,
          filteredSocial,
          "social",
          "from-cyan-500 to-cyan-600",
          "grid-cols-3"
        )}

        {/* Divider */}
        <div className="pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Recent Elements (Placeholder) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xs font-bold text-gray-800 tracking-wider uppercase">Recently Used</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {basics.slice(0, 4).map((tool, i) => (
              <div
                key={i}
                onClick={() => onAddElement(tool.type)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer group/recent"
              >
                <div className={`w-5 h-5 bg-gradient-to-br ${tool.color} rounded flex items-center justify-center`}>
                  <tool.icon className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover/recent:text-gray-900">
                  {tool.label}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
              <Plus className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-white to-gray-50/50">
        <div className="p-4">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </button>
          </div>
          
          {/* Stats & Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span>Auto-save</span>
              </div>
              <span className="text-gray-300">•</span>
              <span>v1.3.0</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>EN</span>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">User Account</p>
              <p className="text-xs text-gray-500 truncate">Premium Plan</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600 font-medium">
              <p>Drag & drop elements</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Hold Ctrl to duplicate</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center">
                <MousePointer className="w-3 h-3 text-gray-600" />
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center">
                <Keyboard className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;