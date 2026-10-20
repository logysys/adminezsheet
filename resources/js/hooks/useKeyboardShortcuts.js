import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = ({
  onDelete,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDuplicate,
  onSave,
  onSelectAll,
  onDeselectAll,
  onTogglePreview,
  onToggleGrid,
  selectedId,
  isPreview = false
}) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts if user is typing in an input or textarea
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable
    ) {
      // Allow some shortcuts even in inputs
      if (event.key === 'Escape') {
        event.target.blur();
      }
      return;
    }

    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Delete key
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedId && onDelete) {
        event.preventDefault();
        onDelete();
      }
    }

    // Ctrl+Z / Cmd+Z - Undo
    if (isCtrl && event.key === 'z' && !isShift) {
      event.preventDefault();
      if (onUndo) onUndo();
    }

    // Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y - Redo
    if ((isCtrl && isShift && event.key === 'z') || (isCtrl && event.key === 'y')) {
      event.preventDefault();
      if (onRedo) onRedo();
    }

    // Ctrl+C / Cmd+C - Copy
    if (isCtrl && event.key === 'c') {
      if (selectedId && onCopy) {
        event.preventDefault();
        onCopy();
      }
    }

    // Ctrl+V / Cmd+V - Paste
    if (isCtrl && event.key === 'v') {
      if (selectedId && onPaste) {
        event.preventDefault();
        onPaste();
      }
    }

    // Ctrl+D / Cmd+D - Duplicate
    if (isCtrl && event.key === 'd') {
      if (selectedId && onDuplicate) {
        event.preventDefault();
        onDuplicate();
      }
    }

    // Ctrl+S / Cmd+S - Save
    if (isCtrl && event.key === 's') {
      event.preventDefault();
      if (onSave) onSave();
    }

    // Ctrl+A / Cmd+A - Select All
    if (isCtrl && event.key === 'a') {
      event.preventDefault();
      if (onSelectAll) onSelectAll();
    }

    // Escape - Deselect
    if (event.key === 'Escape') {
      if (onDeselectAll) {
        event.preventDefault();
        onDeselectAll();
      }
    }

    // Space - Toggle Preview
    if (event.key === ' ' && !isPreview) {
      event.preventDefault();
      if (onTogglePreview) onTogglePreview();
    }

    // G - Toggle Grid
    if (event.key === 'g' || event.key === 'G') {
      event.preventDefault();
      if (onToggleGrid) onToggleGrid();
    }

    // Arrow keys for nudging (with shift for larger steps)
    if (selectedId && !isPreview) {
      const step = isShift ? 10 : 1;
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          // Handle up arrow - would update element position
          break;
        case 'ArrowDown':
          event.preventDefault();
          // Handle down arrow
          break;
        case 'ArrowLeft':
          event.preventDefault();
          // Handle left arrow
          break;
        case 'ArrowRight':
          event.preventDefault();
          // Handle right arrow
          break;
      }
    }

    // Number keys for quick element selection (1-9)
    if (!isCtrl && !isAlt && !isShift && /^[1-9]$/.test(event.key)) {
      // Could implement quick selection of elements in layers panel
    }

    // Alt+Number for viewport switching
    if (isAlt && /^[1-3]$/.test(event.key)) {
      event.preventDefault();
      // Alt+1: Desktop, Alt+2: Tablet, Alt+3: Mobile
    }
  }, [
    selectedId,
    isPreview,
    onDelete,
    onUndo,
    onRedo,
    onCopy,
    onPaste,
    onDuplicate,
    onSave,
    onSelectAll,
    onDeselectAll,
    onTogglePreview,
    onToggleGrid
  ]);

  useEffect(() => {
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Helper function to get shortcut description
  const getShortcutDescription = (action) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? '⌘' : 'Ctrl';

    const shortcuts = {
      delete: 'Delete or Backspace',
      undo: `${cmdKey} + Z`,
      redo: isMac ? '⌘ + ⇧ + Z' : 'Ctrl + Y',
      copy: `${cmdKey} + C`,
      paste: `${cmdKey} + V`,
      duplicate: `${cmdKey} + D`,
      save: `${cmdKey} + S`,
      selectAll: `${cmdKey} + A`,
      deselect: 'Esc',
      togglePreview: 'Space',
      toggleGrid: 'G',
      nudge: 'Arrow Keys',
      fastNudge: 'Shift + Arrow Keys'
    };

    return shortcuts[action] || '';
  };

  return {
    getShortcutDescription
  };
};

// Alternative: More comprehensive version with context menu support
export const useEnhancedKeyboardShortcuts = (config) => {
  const {
    elements = [],
    selectedId,
    setSelectedId,
    onUpdateElement,
    ...callbacks
  } = config;

  const baseShortcuts = useKeyboardShortcuts({
    selectedId,
    ...callbacks
  });

  // Additional shortcuts for specific contexts
  useEffect(() => {
    const handleContextMenu = (event) => {
      // Prevent default context menu on elements
      if (event.target.closest('[data-element-id]')) {
        event.preventDefault();
        // Could show custom context menu here
      }
    };

    const handleCopyEvent = (event) => {
      if (selectedId && event.clipboardData) {
        const element = elements.find(el => el.id === selectedId);
        if (element) {
          event.clipboardData.setData('application/json', JSON.stringify(element));
        }
      }
    };

    const handlePasteEvent = (event) => {
      if (selectedId && event.clipboardData) {
        try {
          const data = event.clipboardData.getData('application/json');
          if (data) {
            const parsed = JSON.parse(data);
            // Handle paste logic
            if (callbacks.onPaste) {
              callbacks.onPaste(parsed);
            }
          }
        } catch (error) {
          // Not JSON data
        }
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopyEvent);
    window.addEventListener('paste', handlePasteEvent);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopyEvent);
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, [selectedId, elements, callbacks]);

  // Function to handle element grouping
  const handleGroupElements = useCallback((elementIds) => {
    if (!elementIds || elementIds.length < 2) return;

    // Create a container and move selected elements into it
    const groupId = `group-${Date.now()}`;
    const groupElement = {
      id: groupId,
      type: 'container',
      name: 'Group',
      style: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: '8px'
      },
      children: []
    };

    // Logic to group elements would go here
    // This would require modifying the elements tree structure
  }, []);

  // Function to handle element ungrouping
  const handleUngroupElements = useCallback((groupId) => {
    // Logic to ungroup elements would go here
  }, []);

  return {
    ...baseShortcuts,
    handleGroupElements,
    handleUngroupElements
  };
};

export default useKeyboardShortcuts;