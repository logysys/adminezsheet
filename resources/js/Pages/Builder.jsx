// App.jsx - Main Application Entry Point (Builder.jsx renamed)
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/Components/Sidebar';
import { Toolbar } from '@/Components/Toolbar';
import { EditorCanvas } from '@/Components/EditorCanvas';
import { PropertiesPanel } from '@/Components/PropertiesPanel';
import { CodeEditorModal } from '@/Components/CodeEditorModal';
import { TemplatesPanel } from '@/Components/TemplatesPanel';
import { VersionHistory } from '@/Components/VersionHistory';
import { GridControls } from '@/Components/GridControls';
import { ElementStatesPanel } from '@/Components/ElementStatesPanel';
import { CustomCSSPanel } from '@/Components/CustomCSSPanel';
import { INITIAL_ELEMENTS, createElement, findElementById, addElementToParent, updateElementById, deleteElementById } from '@/types/types';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { generateHtmlFromElements } from '@/utils/htmlGenerator';

const Builder = () => {
  // Get initial data from Inertia
  const { props } = usePage();
  const initialWikiPage = props.initialWikiPage || null;
  const mode = props.mode || 'create';
  
  // Core State
  const [history, setHistory] = useState([INITIAL_ELEMENTS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [elements, setElements] = useState(INITIAL_ELEMENTS);
  const [selectedId, setSelectedId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [viewport, setViewport] = useState('100%');
  const [activeBreakpoint, setActiveBreakpoint] = useState('desktop');
  
  // Save/Load State
  const [saveMode, setSaveMode] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('My Wiki Page');
  const [pageSlug, setPageSlug] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [wikiPageId, setWikiPageId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // UI State
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activePropertiesTab, setActivePropertiesTab] = useState('styles');
  
  // Feature State
  const [versions, setVersions] = useState([]);
  const [copiedElement, setCopiedElement] = useState(null);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'info' });
  const [gridMode, setGridMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [gridSnap, setGridSnap] = useState(true);
  
  // Initialize from props if editing
  useEffect(() => {
    if (initialWikiPage) {
      const wikiPage = initialWikiPage;
      setPageTitle(wikiPage.title);
      setPageSlug(wikiPage.slug);
      setWikiPageId(wikiPage.id);
      setLastSaved(wikiPage.updated_at);
      
      // Load saved content if available
      if (wikiPage.content && Array.isArray(wikiPage.content)) {
        const savedElements = wikiPage.content.length > 0 ? wikiPage.content : INITIAL_ELEMENTS;
        const newHistory = [savedElements];
        setHistory(newHistory);
        setHistoryIndex(0);
        setElements(savedElements);
      }
      
      // Load saved settings from metadata
      if (wikiPage.metadata?.settings) {
        const settings = wikiPage.metadata.settings;
        setGridMode(settings.grid_mode || false);
        setGridSize(settings.grid_size || 20);
        setGridSnap(settings.grid_snap || true);
        setShowGrid(settings.show_grid || true);
        setViewport(settings.viewport || '100%');
        setActiveBreakpoint(settings.active_breakpoint || 'desktop');
      }
      
      // Load versions from metadata
      if (wikiPage.metadata?.autosaves) {
        const autosaves = wikiPage.metadata.autosaves.map(save => ({
          id: `autosave-${new Date(save.saved_at).getTime()}`,
          timestamp: new Date(save.saved_at).toLocaleString(),
          elements: save.content,
          comment: 'Auto-save'
        }));
        setVersions(autosaves);
      }
    }
  }, [initialWikiPage]);
  
  // Auto-save function - FIXED to use regular fetch instead of Inertia router
  useEffect(() => {
    if (wikiPageId && elements.length > 0) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSaveToServer();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [elements, wikiPageId]);
  
  const handleAutoSaveToServer = useCallback(() => {
    if (!wikiPageId || isSaving) return;
    
    setIsSaving(true);
    
    // Generate HTML content for auto-save
    const htmlContent = generateHtmlFromElements(elements, pageTitle);
    
    // Use regular fetch for auto-save to avoid Inertia response issues
    fetch(route('wiki-pages.autosave', wikiPageId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        content: elements,
        html_content: htmlContent
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setLastSaved(new Date().toISOString());
        showSnackbar('Auto-saved successfully', 'success');
      } else {
        console.error('Auto-save failed:', data.message);
      }
      setIsSaving(false);
    })
    .catch(error => {
      console.error('Auto-save error:', error);
      setIsSaving(false);
    });
  }, [wikiPageId, elements, isSaving, pageTitle]);
  
  // Responsive adjustments
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Sync elements when history index changes
  useEffect(() => {
    setElements(history[historyIndex]);
  }, [historyIndex, history]);
  
  // Auto-save versions every 5 minutes (client-side)
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [elements]);
  
  // History management
  const addToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      showSnackbar('Undo successful', 'success');
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      showSnackbar('Redo successful', 'success');
    }
  };
  
  // Element manipulation
  const findElement = useCallback((id, list = elements) => {
    return findElementById(list, id);
  }, [elements]);
  
  const handleUpdateElement = useCallback((id, updates) => {
    const nextElements = updateElementById(elements, id, updates);
    addToHistory(nextElements);
  }, [elements, addToHistory]);
  
  const handleDeleteElement = useCallback((id) => {
    const nextElements = deleteElementById(elements, id);
    addToHistory(nextElements);
    setSelectedId(null);
    showSnackbar('Element deleted', 'warning');
  }, [elements, addToHistory]);
  
  const handleDuplicateElement = useCallback(() => {
    if (selectedId) {
      const element = findElement(selectedId);
      if (element) {
        const parent = findParentElement(selectedId, elements);
        if (parent) {
          const duplicate = {
            ...JSON.parse(JSON.stringify(element)),
            id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: `${element.name} Copy`
          };
          const nextElements = addElementToParent(elements, parent.id, duplicate);
          addToHistory(nextElements);
          setSelectedId(duplicate.id);
          showSnackbar('Element duplicated', 'success');
        }
      }
    }
  }, [selectedId, elements, addToHistory]);
  
  const handleCopyElement = useCallback(() => {
    if (selectedId) {
      const element = findElement(selectedId);
      if (element) {
        setCopiedElement(JSON.parse(JSON.stringify(element)));
        showSnackbar('Element copied to clipboard', 'success');
      }
    }
  }, [selectedId, findElement]);
  
  const handlePasteElement = useCallback(() => {
    if (copiedElement && selectedId) {
      const parentElement = findElement(selectedId);
      if (parentElement && parentElement.children !== undefined) {
        const newElement = {
          ...copiedElement,
          id: `${copiedElement.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${copiedElement.name} (Pasted)`
        };
        const nextElements = addElementToParent(elements, selectedId, newElement);
        addToHistory(nextElements);
        setSelectedId(newElement.id);
        showSnackbar('Element pasted', 'success');
      }
    }
  }, [copiedElement, selectedId, elements, addToHistory]);
  
  // Helper functions
  const findParentElement = (childId, list = elements, parent = null) => {
    for (const element of list) {
      if (element.id === childId) return parent;
      if (element.children && element.children.length > 0) {
        const found = findParentElement(childId, element.children, element);
        if (found) return found;
      }
    }
    return null;
  };
  
  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar({ show: false, message: '', type: 'info' }), 3000);
  };
  
  const handleAutoSave = () => {
    const newVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      elements: JSON.parse(JSON.stringify(elements)),
      comment: 'Auto-save'
    };
    setVersions(prev => [newVersion, ...prev.slice(0, 19)]); // Keep last 20 versions
  };
  
  const handleSaveVersion = () => {
    const comment = prompt('Version comment (optional):', 'Manual save');
    if (comment !== null) {
      const newVersion = {
        id: `v${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        elements: JSON.parse(JSON.stringify(elements)),
        comment: comment || 'Manual save'
      };
      setVersions(prev => [newVersion, ...prev.slice(0, 19)]);
      showSnackbar('Version saved', 'success');
    }
  };
  
  const handleRestoreVersion = (version) => {
    if (confirm('Restore this version? Current changes will be lost.')) {
      addToHistory(version.elements);
      showSnackbar('Version restored', 'success');
    }
  };
  
  // Generate HTML function
  const generateFullHTML = (elements) => {
    return generateHtmlFromElements(elements, pageTitle || 'Exported from ez.wiki');
  };
  
  // Save function - FIXED for Inertia compatibility
  const handleSave = (publish = false) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    // Generate HTML content
    const htmlContent = generateFullHTML(elements);
    
    const wikiPageData = {
      title: pageTitle,
      content: elements,
      html_content: htmlContent,
      metadata: {
        description: '',
        keywords: [],
        og_image: null,
        stylesheet: '',
        scripts: '',
        settings: {
          grid_mode: gridMode,
          grid_size: gridSize,
          grid_snap: gridSnap,
          show_grid: showGrid,
          viewport: viewport,
          active_breakpoint: activeBreakpoint
        },
        last_saved: new Date().toISOString()
      },
      is_published: publish,
      status: publish ? 'published' : 'draft'
    };

    // Set headers to indicate JSON is expected
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json'
    };

    if (mode === 'create' || !wikiPageId) {
      // Create new wiki page
      router.post(route('wiki-pages.store'), wikiPageData, {
        headers: headers,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          // Check if response contains wiki_page in props or directly
          const responseData = page.props || page;
          const newWikiPage = responseData.wiki_page || (responseData.props && responseData.props.wiki_page);
          
          if (newWikiPage) {
            setWikiPageId(newWikiPage.id);
            setPageSlug(newWikiPage.slug);
            setLastSaved(new Date().toISOString());
            setIsSaving(false);
            showSnackbar(responseData.success || 'Wiki page saved successfully', 'success');
            setSaveDialogOpen(false);
            
            // Update URL without reload if we have an ID
            if (newWikiPage.id) {
              window.history.replaceState(null, '', route('wiki-pages.edit', newWikiPage.id));
            }
            
            // If redirect was provided, use it
            if (responseData.redirect) {
              router.visit(responseData.redirect);
            }
          } else {
            setIsSaving(false);
            showSnackbar('Page saved successfully!', 'success');
            setSaveDialogOpen(false);
          }
        },
        onError: (errors) => {
          setIsSaving(false);
          const errorMessage = errors.message || 
                               (errors.errors ? Object.values(errors.errors).join(', ') : 
                               'Error saving wiki page');
          showSnackbar(errorMessage, 'warning');
        }
      });
    } else {
      // Update existing wiki page
      router.put(route('wiki-pages.update', wikiPageId), wikiPageData, {
        headers: headers,
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          // Check if response contains wiki_page in props or directly
          const responseData = page.props || page;
          
          setLastSaved(new Date().toISOString());
          setIsSaving(false);
          showSnackbar(responseData.message || 'Wiki page updated successfully', 'success');
          setSaveDialogOpen(false);
        },
        onError: (errors) => {
          setIsSaving(false);
          const errorMessage = errors.message || 
                               (errors.errors ? Object.values(errors.errors).join(', ') : 
                               'Error updating wiki page');
          showSnackbar(errorMessage, 'warning');
        }
      });
    }
  };

  // Export functions
  const handleExportHTML = () => {
    if (wikiPageId) {
      window.open(route('wiki-pages.export.html', wikiPageId), '_blank');
      showSnackbar('HTML exported', 'success');
    } else {
      // Fallback to client-side export
      const html = generateFullHTML(elements);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ez-wiki-export.html';
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('HTML exported', 'success');
    }
  };
  
  const handleExportJSON = () => {
    if (wikiPageId) {
      window.open(route('wiki-pages.export.json', wikiPageId), '_blank');
      showSnackbar('JSON exported', 'success');
    } else {
      // Fallback to client-side export
      const json = JSON.stringify(elements, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ez-wiki-project.json';
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('JSON exported', 'success');
    }
  };
  
  // Drag and Drop
  const handleDropItem = (targetId, type) => {
    let newElement;
    
    // Handle move operations
    if (typeof type === 'object' && type.type === 'move') {
      const { elementId } = type;
      const elementToMove = findElement(elementId);
      const parentElement = findParentElement(elementId, elements);
      
      if (elementToMove && parentElement) {
        // Remove from current parent
        const elementsWithoutMoved = deleteElementById(elements, elementId);
        
        // Add to new parent
        const nextElements = addElementToParent(elementsWithoutMoved, targetId, elementToMove);
        addToHistory(nextElements);
        setSelectedId(elementToMove.id);
        showSnackbar('Element moved', 'success');
      }
      return;
    }
    
    // Create new element based on type
    if (typeof type === 'string') {
      switch (type) {
        case 'hero':
        case 'header':
        case 'pricing-cards':
        case 'grid':
          // Handle complex templates
          const timestamp = Date.now();
          switch (type) {
            case 'hero':
              newElement = {
                id: `hero-${timestamp}`,
                type: 'container',
                name: 'Hero Section',
                style: { 
                  padding: '80px 20px', 
                  backgroundColor: '#1e293b', 
                  color: 'white', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '24px',
                  textAlign: 'center',
                  width: '100%'
                },
                children: [
                  createElement('text', `hero-title-${timestamp}`, 'Hero Title', { fontSize: '48px', fontWeight: 'bold' }, 'Hero Section Title'),
                  createElement('text', `hero-subtitle-${timestamp}`, 'Hero Subtitle', { fontSize: '20px', color: '#94a3b8' }, 'Subtitle goes here'),
                  {
                    id: `hero-actions-${timestamp}`,
                    type: 'container',
                    name: 'Actions',
                    style: { display: 'flex', gap: '16px', justifyContent: 'center' },
                    children: [
                      createElement('button', `hero-button1-${timestamp}`, 'Primary Button', { padding: '12px 24px', backgroundColor: '#3b82f6', borderRadius: '8px' }, 'Get Started'),
                      createElement('button', `hero-button2-${timestamp}`, 'Secondary Button', { padding: '12px 24px', backgroundColor: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6' }, 'Learn More')
                    ]
                  }
                ]
              };
              break;
            case 'header':
              newElement = {
                id: `header-${timestamp}`,
                type: 'container',
                name: 'Header',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 40px',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  width: '100%'
                },
                children: [
                  createElement('text', `brand-${timestamp}`, 'Brand', { fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }, 'BrandName'),
                  {
                    id: `nav-${timestamp}`,
                    type: 'container',
                    name: 'Navigation',
                    style: { display: 'flex', gap: '24px', alignItems: 'center' },
                    children: [
                      createElement('text', `nav-link-${timestamp}-1`, 'Link 1', { fontSize: '14px', cursor: 'pointer', color: '#94a3b8' }, 'Home'),
                      createElement('text', `nav-link-${timestamp}-2`, 'Link 2', { fontSize: '14px', cursor: 'pointer', color: '#94a3b8' }, 'About'),
                      createElement('text', `nav-link-${timestamp}-3`, 'Link 3', { fontSize: '14px', cursor: 'pointer', color: '#94a3b8' }, 'Contact'),
                      createElement('button', `nav-button-${timestamp}`, 'CTA Button', { padding: '8px 16px', backgroundColor: '#3b82f6', borderRadius: '6px' }, 'Get Started')
                    ]
                  }
                ]
              };
              break;
            case 'pricing-cards':
              newElement = {
                id: `pricing-${timestamp}`,
                type: 'container',
                name: 'Pricing Cards',
                style: {
                  display: 'flex',
                  gap: '24px',
                  padding: '60px 20px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  backgroundColor: '#f8fafc'
                },
                children: [
                  {
                    id: `pricing-basic-${timestamp}`,
                    type: 'container',
                    name: 'Basic Card',
                    style: { padding: '32px', backgroundColor: 'white', borderRadius: '16px', flex: '1', minWidth: '280px', maxWidth: '320px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
                    children: [
                      createElement('text', `plan-title-${timestamp}`, 'Plan Title', { fontSize: '24px', fontWeight: 'bold' }, 'Basic'),
                      createElement('text', `plan-price-${timestamp}`, 'Price', { fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }, '$9/mo'),
                      createElement('text', `plan-features-${timestamp}`, 'Features', { whiteSpace: 'pre-line', lineHeight: '2' }, '✓ 10 Projects\n✓ Basic Support\n✓ 1GB Storage\n✓ Community Access'),
                      createElement('button', `plan-button-${timestamp}`, 'Get Started', { marginTop: '24px', width: '100%', padding: '12px' }, 'Get Started')
                    ]
                  },
                  {
                    id: `pricing-pro-${timestamp}`,
                    type: 'container',
                    name: 'Pro Card',
                    style: { padding: '32px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '16px', flex: '1', minWidth: '280px', maxWidth: '320px', boxShadow: '0 20px 25px -5px rgba(59,130,246,0.3)' },
                    children: [
                      createElement('text', `plan-title-pro-${timestamp}`, 'Plan Title Pro', { fontSize: '24px', fontWeight: 'bold' }, 'Pro'),
                      createElement('text', `plan-price-pro-${timestamp}`, 'Price Pro', { fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }, '$29/mo'),
                      createElement('text', `plan-features-pro-${timestamp}`, 'Features Pro', { whiteSpace: 'pre-line', lineHeight: '2' }, '✓ Unlimited Projects\n✓ Priority Support\n✓ 10GB Storage\n✓ Advanced Features'),
                      createElement('button', `plan-button-pro-${timestamp}`, 'Get Started Pro', { marginTop: '24px', width: '100%', padding: '12px', backgroundColor: 'white', color: '#3b82f6' }, 'Get Started')
                    ]
                  }
                ]
              };
              break;
            case 'grid':
              newElement = {
                id: `grid-${timestamp}`,
                type: 'container',
                name: 'Grid',
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '20px',
                  padding: '40px'
                },
                children: [
                  createElement('text', `grid-item-${timestamp}-1`, 'Grid Item 1', { padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }, 'Grid Item 1'),
                  createElement('text', `grid-item-${timestamp}-2`, 'Grid Item 2', { padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }, 'Grid Item 2'),
                  createElement('text', `grid-item-${timestamp}-3`, 'Grid Item 3', { padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }, 'Grid Item 3')
                ]
              };
              break;
            default:
              newElement = createElement(type);
          }
          break;
        default:
          // Basic element types
          newElement = createElement(type);
      }
    }
    
    if (!newElement) return;
    
    // Insert into target
    const insertIntoTarget = (list) => {
      return list.map(el => {
        if (el.id === targetId && el.children !== undefined) {
          return { ...el, children: [...el.children, newElement] };
        }
        if (el.children && el.children.length > 0) {
          return { ...el, children: insertIntoTarget(el.children) };
        }
        return el;
      });
    };
    
    const nextElements = insertIntoTarget(elements);
    addToHistory(nextElements);
    setSelectedId(newElement.id);
    showSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} added`, 'success');
  };
  
  // Insert template
  const handleInsertTemplate = (templateElements) => {
    const rootContainer = elements.find(el => el.type === 'container');
    if (rootContainer) {
      const nextElements = elements.map(el => {
        if (el.id === rootContainer.id) {
          return {
            ...el,
            children: [...el.children, ...templateElements.map(te => ({
              ...te,
              id: `${te.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
            }))]
          };
        }
        return el;
      });
      addToHistory(nextElements);
      setIsTemplatesOpen(false);
      showSnackbar('Template inserted', 'success');
    }
  };
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onDelete: () => selectedId && handleDeleteElement(selectedId),
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: handleCopyElement,
    onPaste: handlePasteElement,
    onDuplicate: handleDuplicateElement,
    selectedId
  });
  
  const selectedElement = selectedId ? findElement(selectedId) : null;

  // Save Dialog Component
  const SaveDialog = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Save Wiki Page</h3>
          <p className="text-sm text-slate-400 mt-1">Save your current work</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Page Title *</label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200"
              placeholder="Enter wiki page title"
              disabled={isSaving}
            />
            {!pageTitle.trim() && (
              <p className="text-xs text-red-400 mt-1">Title is required</p>
            )}
          </div>
          
          {pageSlug && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">/wiki/</span>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200"
                  placeholder="url-slug"
                  disabled={isSaving}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Published pages will be accessible at this URL
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || !pageTitle.trim()}
              className={`py-2 rounded ${isSaving || !pageTitle.trim() ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 text-white'}`}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving || !pageTitle.trim()}
              className={`py-2 rounded ${isSaving || !pageTitle.trim() ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
          
          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
              {isSaving ? 'Saving...' : 'Auto-save enabled every 30 seconds'}
            </p>
            {lastSaved && (
              <p>Last saved: {new Date(lastSaved).toLocaleString()}</p>
            )}
            <p>Elements: {elements.length}</p>
            <p>History steps: {history.length}</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setSaveDialogOpen(false)}
            disabled={isSaving}
            className="w-full py-2 text-slate-400 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Status Bar Component
  const StatusBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
          <span>{isSaving ? 'Saving...' : 'Saved'}</span>
        </div>
        {wikiPageId && (
          <span className="text-slate-500">ID: {String(wikiPageId).substring(0, 8)}</span>
        )}
        <span className="text-slate-500">Elements: {elements.length}</span>
        <span className="text-slate-500">History: {historyIndex + 1}/{history.length}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {lastSaved && (
          <span className="text-slate-500">
            Last saved: {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <span className="text-slate-500 capitalize">{mode} mode</span>
        {wikiPageId && (
          <a
            href={route('wiki.show-slug', pageSlug)}
            target="_blank"
            className="text-blue-400 hover:text-blue-300"
            title="View published page"
          >
            View Live
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Snackbar */}
      {snackbar.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
          snackbar.type === 'success' ? 'bg-green-900 text-green-100' :
          snackbar.type === 'warning' ? 'bg-amber-900 text-amber-100' :
          'bg-blue-900 text-blue-100'
        }`}>
          <span>{snackbar.message}</span>
          <button 
            onClick={() => setSnackbar({ show: false, message: '', type: 'info' })} 
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
      
      <Toolbar 
        onExportHTML={handleExportHTML}
        onExportJSON={handleExportJSON}
        onPreview={() => {
          setIsPreview(!isPreview);
          setSelectedId(null);
        }}
        isPreview={isPreview}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        viewport={viewport}
        setViewport={setViewport}
        onOpenCodeEditor={() => setIsCodeEditorOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenVersions={() => setIsVersionsOpen(true)}
        toggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        toggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        gridMode={gridMode}
        setGridMode={setGridMode}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridSize={gridSize}
        setGridSize={setGridSize}
        gridSnap={gridSnap}
        setGridSnap={setGridSnap}
        onSave={() => setSaveDialogOpen(true)}
        isSaving={isSaving}
        wikiPageId={wikiPageId}
        pageTitle={pageTitle}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        {!isPreview && (
          <>
            <div 
              className={`absolute md:relative z-20 h-full transition-all duration-300 ease-in-out ${
                leftPanelOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:opacity-0 md:overflow-hidden'
              }`}
            >
              <Sidebar 
                elements={elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDragStart={() => {
                  if (window.innerWidth < 768) setLeftPanelOpen(false);
                }}
                activeBreakpoint={activeBreakpoint}
                setActiveBreakpoint={setActiveBreakpoint}
              />
            </div>
            {leftPanelOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-10 md:hidden" 
                onClick={() => setLeftPanelOpen(false)}
              />
            )}
          </>
        )}
        
        {/* Main Canvas */}
        <main className="flex-1 relative bg-slate-900/50 flex flex-col items-center overflow-hidden">
          {gridMode && showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                 linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                backgroundSize: `${gridSize}px ${gridSize}px`
              }}
            />
          )}
          
          <EditorCanvas 
            elements={elements} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
            onDropItem={handleDropItem}
            isPreview={isPreview}
            viewport={viewport}
            gridMode={gridMode && gridSnap}
            gridSize={gridSize}
          />
        </main>
        
        {/* Right Sidebar */}
        {!isPreview && (
          <>
            <div 
              className={`absolute right-0 md:relative z-20 h-full transition-all duration-300 ease-in-out ${
                rightPanelOpen ? 'translate-x-0' : 'translate-x-full md:w-0 md:opacity-0 md:overflow-hidden'
              }`}
            >
              <PropertiesPanel 
                element={selectedElement}
                onUpdate={handleUpdateElement}
                onDelete={handleDeleteElement}
                onDuplicate={handleDuplicateElement}
                activeTab={activePropertiesTab}
                setActiveTab={setActivePropertiesTab}
                activeBreakpoint={activeBreakpoint}
                gridMode={gridMode}
              />
            </div>
            {rightPanelOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-10 md:hidden"
                onClick={() => setRightPanelOpen(false)}
              />
            )}
          </>
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar />
      
      {/* Modals */}
      <CodeEditorModal 
        isOpen={isCodeEditorOpen} 
        onClose={() => setIsCodeEditorOpen(false)} 
        elements={elements}
        onSave={(newElements) => {
          addToHistory(newElements);
          setIsCodeEditorOpen(false);
          showSnackbar('Code applied', 'success');
        }}
      />
      
      <TemplatesPanel 
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onInsertTemplate={handleInsertTemplate}
      />
      
      <VersionHistory 
        isOpen={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        versions={versions}
        onRestoreVersion={handleRestoreVersion}
        onSaveVersion={handleSaveVersion}
      />
      
      {/* Save Dialog */}
      {saveDialogOpen && <SaveDialog />}
      
      {/* Grid Controls Floating Button */}
      {gridMode && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-4 shadow-lg z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Grid Size:</span>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-24"
              disabled={isPreview}
            />
            <span className="text-xs text-slate-300 w-8">{gridSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Snap:</span>
            <input
              type="checkbox"
              checked={gridSnap}
              onChange={(e) => setGridSnap(e.target.checked)}
              className="toggle toggle-sm"
              disabled={isPreview}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Show:</span>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="toggle toggle-sm"
              disabled={isPreview}
            />
          </div>
        </div>
      )}
      
      {/* Unsaved Changes Warning */}
      {history.length > 1 && !wikiPageId && !saveDialogOpen && (
        <div className="fixed bottom-4 right-4 bg-amber-900/80 text-amber-100 px-4 py-2 rounded-lg shadow-lg z-30 flex items-center gap-3">
          <span className="text-sm">⚠️ Unsaved changes</span>
          <button
            onClick={() => setSaveDialogOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm"
          >
            Save Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Builder;