import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faDownload, faTrash, faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

export const VersionHistory = ({ isOpen, onClose, versions, onRestoreVersion, onSaveVersion }) => {
  if (!isOpen) return null;

  const handleExportVersion = (version) => {
    const dataStr = JSON.stringify(version.elements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ez-wiki-version-${version.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyVersion = (version) => {
    navigator.clipboard.writeText(JSON.stringify(version.elements, null, 2));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <FontAwesomeIcon icon={faClockRotateLeft} className="text-slate-200" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Version History</h3>
              <p className="text-xs text-slate-500">Restore previous versions of your project</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            {versions.length} version{versions.length !== 1 ? 's' : ''} saved
          </div>
          <button
            onClick={onSaveVersion}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-all"
          >
            <FontAwesomeIcon icon={faDownload} className="text-xs" />
            Save New Version
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-4">
          {versions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faClockRotateLeft} className="text-2xl text-slate-600" />
              </div>
              <h4 className="text-slate-300 font-medium mb-2">No versions saved yet</h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Save versions manually or they will be auto-saved every 5 minutes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="group relative bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 overflow-hidden transition-all"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${index === 0 ? 'text-primary-400' : 'text-white'}`}>
                            Version {versions.length - index}
                            {index === 0 && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-primary-900/30 text-primary-400 rounded-full">
                                Current
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {version.comment || 'Auto-saved version'}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {version.timestamp}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{version.elements?.length || 0} elements</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{JSON.stringify(version.elements).length / 1024} KB</span>
                      </div>
                    </div>

                    {/* Action Buttons (Visible on Hover) */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => handleCopyVersion(version)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        title="Copy JSON"
                      >
                        <FontAwesomeIcon icon={faCopy} className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleExportVersion(version)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        title="Export Version"
                      >
                        <FontAwesomeIcon icon={faDownload} className="text-xs" />
                      </button>
                      <button
                        onClick={() => onRestoreVersion(version)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-blue-700 hover:bg-blue-600 text-blue-100"
                        title="Restore Version"
                      >
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Restore Button (Always Visible) */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => onRestoreVersion(version)}
                      className="w-full py-2 text-sm bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 hover:text-blue-300 rounded border border-blue-800/50 transition-colors"
                    >
                      Restore This Version
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500">
              ⚡ Auto-save every 5 minutes
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};