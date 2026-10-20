// Updated Toolbar.jsx with save button and back button
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faDownload, faSave, faLayerGroup, 
  faUndo, faRedo, faDesktop, faTabletScreenButton, faMobileScreenButton,
  faCode, faBars, faSliders, faFileExport, faFileCode,
  faThLarge, faRulerCombined, faHistory, faBoxesStacked,
  faCopy, faPaste, faClone, faSearch, faEye, faEyeSlash,
  faSpinner, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { usePage } from '@inertiajs/react';

export const Toolbar = ({ 
  onExportHTML,
  onExportJSON,
  onPreview, 
  isPreview, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  viewport, 
  setViewport,
  onOpenCodeEditor,
  onOpenTemplates,
  onOpenVersions,
  toggleLeftPanel,
  toggleRightPanel,
  gridMode,
  setGridMode,
  showGrid,
  setShowGrid,
  gridSize,
  setGridSize,
  gridSnap,
  setGridSnap,
  onSave,
  isSaving,
  wikiPageId,
  pageTitle
}) => {
  const { url } = usePage();
  
  // Check if we're in edit mode (wiki-pages/{id}/edit or wiki-pages/{id})
  const isEditPage = url.includes('/wiki-pages/') && 
    (url.endsWith('/edit') || 
     (url.match(/\/wiki-pages\/\d+$/) && !url.includes('/view')));

  return (
    <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 select-none">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Back Button - Only show on edit pages */}
          <a 
            href={route('wiki-pages.index')}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors mr-1"
            title="Back to Wiki Pages"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
        
        <button 
          onClick={toggleLeftPanel}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded-lg w-8 h-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-white text-sm" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:inline">
            {pageTitle ? `${pageTitle.substring(0, 20)}${pageTitle.length > 20 ? '...' : ''}` : 'ez.'}
            <span className="text-primary-500">wiki</span>
            {wikiPageId && (
              <span className="text-xs text-slate-500 ml-2">#{String(wikiPageId).substring(0, 6)}</span>
            )}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <FontAwesomeIcon icon={faUndo} className="text-sm" />
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 hover:text-white transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <FontAwesomeIcon icon={faRedo} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4">
        {/* Viewport Controls */}
        <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
          <button 
            onClick={() => setViewport('100%')}
            className={`w-9 h-7 rounded flex items-center justify-center transition-colors ${viewport === '100%' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="Desktop"
          >
            <FontAwesomeIcon icon={faDesktop} className="text-xs" />
          </button>
          <button 
            onClick={() => setViewport('768px')}
            className={`w-9 h-7 rounded flex items-center justify-center transition-colors ${viewport === '768px' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="Tablet"
          >
            <FontAwesomeIcon icon={faTabletScreenButton} className="text-xs" />
          </button>
          <button 
            onClick={() => setViewport('375px')}
            className={`w-9 h-7 rounded flex items-center justify-center transition-colors ${viewport === '375px' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            title="Mobile"
          >
            <FontAwesomeIcon icon={faMobileScreenButton} className="text-xs" />
          </button>
        </div>

        {/* Grid Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setGridMode(!gridMode)}
            className={`w-8 h-8 flex items-center justify-center rounded ${gridMode ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Toggle Grid Mode"
          >
            <FontAwesomeIcon icon={faThLarge} className="text-sm" />
          </button>
          {gridMode && (
            <>
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={`w-8 h-8 flex items-center justify-center rounded ${showGrid ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                title="Show/Hide Grid"
              >
                <FontAwesomeIcon icon={showGrid ? faEye : faEyeSlash} className="text-sm" />
              </button>
              <button 
                onClick={() => setGridSnap(!gridSnap)}
                className={`w-8 h-8 flex items-center justify-center rounded ${gridSnap ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                title="Toggle Grid Snap"
              >
                <FontAwesomeIcon icon={faRulerCombined} className="text-sm" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Templates */}
        <button 
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors"
          title="Templates"
        >
          <FontAwesomeIcon icon={faBoxesStacked} className="text-xs" />
          <span className="hidden md:inline">Templates</span>
        </button>

        {/* Code Editor */}
        <button 
          onClick={onOpenCodeEditor}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors"
          title="Edit Source Code"
        >
          <FontAwesomeIcon icon={faCode} className="text-xs" />
          <span className="hidden md:inline">Code</span>
        </button>

        {/* Version History */}
        <button 
          onClick={onOpenVersions}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors"
          title="Version History"
        >
          <FontAwesomeIcon icon={faHistory} className="text-xs" />
          <span className="hidden md:inline">History</span>
        </button>

        {/* Preview/Edit Toggle */}
        <button 
          onClick={onPreview}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isPreview ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          <FontAwesomeIcon icon={faPlay} className="text-xs" />
          <span className="hidden md:inline">{isPreview ? 'Edit' : 'Preview'}</span>
        </button>
        
        <div className="h-6 w-px bg-slate-800 mx-1" />

        {/* Export Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors">
            <FontAwesomeIcon icon={faFileExport} className="text-xs" />
            <span className="hidden md:inline">Export</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
            <button 
              onClick={onExportHTML}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFileCode} /> HTML File
            </button>
            <button 
              onClick={onExportJSON}
              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCode} /> JSON Project
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${isSaving ? 'bg-slate-700 text-slate-300 cursor-wait' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
        >
          {isSaving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="text-xs animate-spin" />
              <span className="hidden md:inline">Saving...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="text-xs" />
              <span className="hidden md:inline">{wikiPageId ? 'Save' : 'Save Page'}</span>
            </>
          )}
        </button>

        {/* Properties Toggle */}
        <button 
          onClick={toggleRightPanel}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Toggle Properties"
        >
          <FontAwesomeIcon icon={faSliders} />
        </button>
      </div>
    </div>
  );
};