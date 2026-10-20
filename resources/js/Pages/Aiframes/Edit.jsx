import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFillDrip,
  faFont,
  faTable,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import MDEditor, { commands } from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Enhanced color commands for MDEditor (same as in Create.jsx)
const createColorCommand = (isBackground = false) => {
  let colorPickerModal = null;

  return {
    name: isBackground ? 'backgroundColor' : 'color',
    keyCommand: isBackground ? 'backgroundColor' : 'color',
    buttonProps: {
      'aria-label': isBackground ? 'Add background color' : 'Add text color',
      'data-tooltip-id': 'mdeditor-tooltip',
      'data-tooltip-content': isBackground ? 'Background Color' : 'Text Color'
    },
    icon: (
      <div className="flex items-center justify-center w-5 h-5">
        <FontAwesomeIcon
          icon={isBackground ? faFillDrip : faFont}
          className="text-current text-sm"
        />
      </div>
    ),
    execute: (state, api) => {
      // Remove existing modal if any
      const existingModal = document.getElementById('color-picker-modal');
      if (existingModal) {
        document.body.removeChild(existingModal);
      }

      // Create modal container
      colorPickerModal = document.createElement('div');
      colorPickerModal.id = 'color-picker-modal';
      colorPickerModal.style.position = 'fixed';
      colorPickerModal.style.top = '0';
      colorPickerModal.style.left = '0';
      colorPickerModal.style.width = '100%';
      colorPickerModal.style.height = '100%';
      colorPickerModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      colorPickerModal.style.display = 'flex';
      colorPickerModal.style.alignItems = 'center';
      colorPickerModal.style.justifyContent = 'center';
      colorPickerModal.style.zIndex = '10000';
      colorPickerModal.style.backdropFilter = 'blur(8px)';

      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = '#2d3748';
      modalContent.style.padding = '24px';
      modalContent.style.borderRadius = '16px';
      modalContent.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
      modalContent.style.width = '90%';
      modalContent.style.maxWidth = '420px';
      modalContent.style.border = '1px solid #4a5568';

      // Create header
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '20px';

      const title = document.createElement('h3');
      title.textContent = isBackground ? 'Choose Background Color' : 'Choose Text Color';
      title.style.color = 'white';
      title.style.fontSize = '18px';
      title.style.fontWeight = 'bold';
      title.style.margin = '0';

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.color = 'white';
      closeBtn.style.fontSize = '24px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.width = '32px';
      closeBtn.style.height = '32px';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.display = 'flex';
      closeBtn.style.alignItems = 'center';
      closeBtn.style.justifyContent = 'center';
      closeBtn.style.transition = 'background-color 0.2s';

      closeBtn.onmouseenter = () => closeBtn.style.backgroundColor = '#4a5568';
      closeBtn.onmouseleave = () => closeBtn.style.backgroundColor = 'transparent';
      closeBtn.onclick = () => {
        if (colorPickerModal && colorPickerModal.parentNode) {
          document.body.removeChild(colorPickerModal);
        }
      };

      header.appendChild(title);
      header.appendChild(closeBtn);

      // Create color grid
      const colorGrid = document.createElement('div');
      colorGrid.style.display = 'grid';
      colorGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
      colorGrid.style.gap = '8px';
      colorGrid.style.marginBottom = '20px';

      const colorPresets = [
        '#FF0000', '#FF6B6B', '#FFA500', '#FFD93D', '#6BCF7F', '#4ECDC4',
        '#45B7D1', '#4D96FF', '#5D6DFF', '#9B59B6', '#FF9FF3', '#F368E0',
        '#FFFFFF', '#F1F2F6', '#DFE4EA', '#CED6E0', '#A4B0BE', '#747D8C',
        '#57606F', '#2F3542', '#000000', '#2D3436', '#636E72', '#B2BEC3'
      ];

      colorPresets.forEach(color => {
        const colorBtn = document.createElement('button');
        colorBtn.style.width = '40px';
        colorBtn.style.height = '40px';
        colorBtn.style.borderRadius = '8px';
        colorBtn.style.border = '2px solid #4a5568';
        colorBtn.style.cursor = 'pointer';
        colorBtn.style.transition = 'all 0.2s';
        colorBtn.style.backgroundColor = color;

        colorBtn.onmouseenter = () => {
          colorBtn.style.transform = 'scale(1.1)';
          colorBtn.style.borderColor = '#fff';
        };
        colorBtn.onmouseleave = () => {
          colorBtn.style.transform = 'scale(1)';
          colorBtn.style.borderColor = '#4a5568';
        };

        colorBtn.onclick = () => {
          const selectedColor = color;
          const markdown = isBackground
            ? `<span style="background-color: ${selectedColor}">${state.selectedText}</span>`
            : `<span style="color: ${selectedColor}">${state.selectedText}</span>`;

          api.replaceSelection(markdown);
          if (colorPickerModal && colorPickerModal.parentNode) {
            document.body.removeChild(colorPickerModal);
          }
        };

        colorGrid.appendChild(colorBtn);
      });

      // Create custom color input
      const customColorContainer = document.createElement('div');
      customColorContainer.style.marginBottom = '20px';

      const customColorLabel = document.createElement('label');
      customColorLabel.textContent = 'Custom Color:';
      customColorLabel.style.color = 'white';
      customColorLabel.style.display = 'block';
      customColorLabel.style.marginBottom = '8px';
      customColorLabel.style.fontSize = '14px';

      const customColorInput = document.createElement('input');
      customColorInput.type = 'color';
      customColorInput.value = '#FF0000';
      customColorInput.style.width = '60px';
      customColorInput.style.height = '60px';
      customColorInput.style.borderRadius = '12px';
      customColorInput.style.border = '2px solid #4a5568';
      customColorInput.style.cursor = 'pointer';

      const applyCustomColor = document.createElement('button');
      applyCustomColor.textContent = 'Apply Custom Color';
      applyCustomColor.style.marginLeft = '12px';
      applyCustomColor.style.padding = '12px 16px';
      applyCustomColor.style.backgroundColor = '#4299e1';
      applyCustomColor.style.color = 'white';
      applyCustomColor.style.border = 'none';
      applyCustomColor.style.borderRadius = '8px';
      applyCustomColor.style.cursor = 'pointer';
      applyCustomColor.style.fontWeight = 'bold';
      applyCustomColor.style.transition = 'background-color 0.2s';

      applyCustomColor.onmouseenter = () => applyCustomColor.style.backgroundColor = '#3182ce';
      applyCustomColor.onmouseleave = () => applyCustomColor.style.backgroundColor = '#4299e1';

      applyCustomColor.onclick = () => {
        const selectedColor = customColorInput.value;
        const markdown = isBackground
          ? `<span style="background-color: ${selectedColor}">${state.selectedText}</span>`
          : `<span style="color: ${selectedColor}">${state.selectedText}</span>`;

        api.replaceSelection(markdown);
        if (colorPickerModal && colorPickerModal.parentNode) {
          document.body.removeChild(colorPickerModal);
        }
      };

      const customColorRow = document.createElement('div');
      customColorRow.style.display = 'flex';
      customColorRow.style.alignItems = 'center';
      customColorRow.appendChild(customColorInput);
      customColorRow.appendChild(applyCustomColor);

      customColorContainer.appendChild(customColorLabel);
      customColorContainer.appendChild(customColorRow);

      // Assemble modal
      modalContent.appendChild(header);
      modalContent.appendChild(colorGrid);
      modalContent.appendChild(customColorContainer);
      colorPickerModal.appendChild(modalContent);

      // Close on background click
      colorPickerModal.onclick = (e) => {
        if (e.target === colorPickerModal) {
          if (colorPickerModal.parentNode) {
            document.body.removeChild(colorPickerModal);
          }
        }
      };

      document.body.appendChild(colorPickerModal);
    },
  };
};

// Advanced table command with more options (same as in Create.jsx)
const advancedTableCommand = {
  name: 'advancedTable',
  keyCommand: 'advancedTable',
  buttonProps: {
    'aria-label': 'Insert advanced table',
    'data-tooltip-id': 'mdeditor-tooltip',
    'data-tooltip-content': 'Advanced Table'
  },
  icon: (
    <div className="flex items-center justify-center w-5 h-5">
      <FontAwesomeIcon icon={faTable} className="text-current text-sm" />
    </div>
  ),
  execute: (state, api) => {
    const tableModal = document.createElement('div');
    tableModal.id = 'table-modal';
    tableModal.style.position = 'fixed';
    tableModal.style.top = '0';
    tableModal.style.left = '0';
    tableModal.style.width = '100%';
    tableModal.style.height = '100%';
    tableModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tableModal.style.display = 'flex';
    tableModal.style.alignItems = 'center';
    tableModal.style.justifyContent = 'center';
    tableModal.style.zIndex = '10000';
    tableModal.style.backdropFilter = 'blur(8px)';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#2d3748';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '16px';
    modalContent.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.border = '1px solid #4a5568';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';

    const title = document.createElement('h3');
    title.textContent = 'Create Table';
    title.style.color = 'white';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    title.style.margin = '0';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.width = '32px';
    closeBtn.style.height = '32px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.transition = 'background-color 0.2s';

    closeBtn.onmouseenter = () => closeBtn.style.backgroundColor = '#4a5568';
    closeBtn.onmouseleave = () => closeBtn.style.backgroundColor = 'transparent';
    closeBtn.onclick = () => {
      if (tableModal.parentNode) {
        document.body.removeChild(tableModal);
      }
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Table Configuration
    const configContainer = document.createElement('div');
    configContainer.style.marginBottom = '20px';

    // Rows input
    const rowsContainer = document.createElement('div');
    rowsContainer.style.marginBottom = '12px';

    const rowsLabel = document.createElement('label');
    rowsLabel.textContent = 'Number of Rows:';
    rowsLabel.style.color = 'white';
    rowsLabel.style.display = 'block';
    rowsLabel.style.marginBottom = '4px';

    const rowsInput = document.createElement('input');
    rowsInput.type = 'number';
    rowsInput.min = '1';
    rowsInput.max = '20';
    rowsInput.value = '3';
    rowsInput.style.width = '100%';
    rowsInput.style.padding = '8px';
    rowsInput.style.backgroundColor = '#4a5568';
    rowsInput.style.border = '1px solid #718096';
    rowsInput.style.borderRadius = '4px';
    rowsInput.style.color = 'white';

    rowsContainer.appendChild(rowsLabel);
    rowsContainer.appendChild(rowsInput);

    // Columns input
    const colsContainer = document.createElement('div');
    colsContainer.style.marginBottom = '12px';

    const colsLabel = document.createElement('label');
    colsLabel.textContent = 'Number of Columns:';
    colsLabel.style.color = 'white';
    colsLabel.style.display = 'block';
    colsLabel.style.marginBottom = '4px';

    const colsInput = document.createElement('input');
    colsInput.type = 'number';
    colsInput.min = '1';
    colsInput.max = '10';
    colsInput.value = '3';
    colsInput.style.width = '100%';
    colsInput.style.padding = '8px';
    colsInput.style.backgroundColor = '#4a5568';
    colsInput.style.border = '1px solid #718096';
    colsInput.style.borderRadius = '4px';
    colsInput.style.color = 'white';

    colsContainer.appendChild(colsLabel);
    colsContainer.appendChild(colsInput);

    // Include header checkbox
    const headerContainer = document.createElement('div');
    headerContainer.style.marginBottom = '12px';

    const headerCheckbox = document.createElement('input');
    headerCheckbox.type = 'checkbox';
    headerCheckbox.id = 'includeHeader';
    headerCheckbox.checked = true;
    headerCheckbox.style.marginRight = '8px';

    const headerLabel = document.createElement('label');
    headerLabel.htmlFor = 'includeHeader';
    headerLabel.textContent = 'Include header row';
    headerLabel.style.color = 'white';

    headerContainer.appendChild(headerCheckbox);
    headerContainer.appendChild(headerLabel);

    configContainer.appendChild(rowsContainer);
    configContainer.appendChild(colsContainer);
    configContainer.appendChild(headerContainer);

    // Generate button
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Table';
    generateButton.style.width = '100%';
    generateButton.style.padding = '12px';
    generateButton.style.backgroundColor = '#4299e1';
    generateButton.style.color = 'white';
    generateButton.style.border = 'none';
    generateButton.style.borderRadius = '8px';
    generateButton.style.cursor = 'pointer';
    generateButton.style.fontWeight = 'bold';
    generateButton.style.transition = 'background-color 0.2s';

    generateButton.onmouseenter = () => generateButton.style.backgroundColor = '#3182ce';
    generateButton.onmouseleave = () => generateButton.style.backgroundColor = '#4299e1';

    generateButton.onclick = () => {
      const rows = parseInt(rowsInput.value);
      const cols = parseInt(colsInput.value);
      const includeHeader = headerCheckbox.checked;

      let tableMarkdown = '';

      if (includeHeader) {
        // Header row
        tableMarkdown += '|';
        for (let i = 0; i < cols; i++) {
          tableMarkdown += ` Header ${i + 1} |`;
        }
        tableMarkdown += '\n|';

        // Separator row
        for (let i = 0; i < cols; i++) {
          tableMarkdown += '----------|';
        }
        tableMarkdown += '\n';
      }

      // Data rows
      const startRow = includeHeader ? 0 : 1;
      const totalRows = includeHeader ? rows : rows + 1;

      for (let i = startRow; i < totalRows; i++) {
        tableMarkdown += '|';
        for (let j = 0; j < cols; j++) {
          tableMarkdown += ` Cell ${i + 1}-${j + 1} |`;
        }
        if (i < totalRows - 1) {
          tableMarkdown += '\n';
        }
      }

      api.replaceSelection(tableMarkdown);
      if (tableModal.parentNode) {
        document.body.removeChild(tableModal);
      }
    };

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(configContainer);
    modalContent.appendChild(generateButton);
    tableModal.appendChild(modalContent);

    // Close on background click
    tableModal.onclick = (e) => {
      if (e.target === tableModal) {
        if (tableModal.parentNode) {
          document.body.removeChild(tableModal);
        }
      }
    };

    document.body.appendChild(tableModal);
  },
};

// Add macros command (same as in Create.jsx)
const macrosCommand = {
  name: 'macros',
  keyCommand: 'macros',
  buttonProps: {
    'aria-label': 'Insert macros',
    'data-tooltip-id': 'mdeditor-tooltip',
    'data-tooltip-content': 'Insert Macros'
  },
  icon: (
    <div className="flex items-center justify-center w-5 h-5">
      <FontAwesomeIcon icon={faBolt} className="text-current text-sm" />
    </div>
  ),
  execute: (state, api) => {
    // Create modal for macros selection
    const macrosModal = document.createElement('div');
    macrosModal.id = 'macros-modal';
    macrosModal.style.position = 'fixed';
    macrosModal.style.top = '0';
    macrosModal.style.left = '0';
    macrosModal.style.width = '100%';
    macrosModal.style.height = '100%';
    macrosModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    macrosModal.style.display = 'flex';
    macrosModal.style.alignItems = 'center';
    macrosModal.style.justifyContent = 'center';
    macrosModal.style.zIndex = '10000';
    macrosModal.style.backdropFilter = 'blur(8px)';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#2d3748';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '16px';
    modalContent.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.border = '1px solid #4a5568';

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';

    const title = document.createElement('h3');
    title.textContent = 'Insert Macros';
    title.style.color = 'white';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    title.style.margin = '0';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.width = '32px';
    closeBtn.style.height = '32px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.transition = 'background-color 0.2s';

    closeBtn.onmouseenter = () => closeBtn.style.backgroundColor = '#4a5568';
    closeBtn.onmouseleave = () => closeBtn.style.backgroundColor = 'transparent';
    closeBtn.onclick = () => {
      if (macrosModal.parentNode) {
        document.body.removeChild(macrosModal);
      }
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Macros Grid
    const macrosGrid = document.createElement('div');
    macrosGrid.style.display = 'grid';
    macrosGrid.style.gridTemplateColumns = '1fr';
    macrosGrid.style.gap = '12px';

    const macrosList = [
      {
        name: 'Current Date',
        description: 'Insert current date',
        code: `{{date:YYYY-MM-DD}}`
      },
      {
        name: 'Current Time',
        description: 'Insert current time',
        code: `{{time:HH:mm}}`
      },
      {
        name: 'User Name',
        description: 'Insert current user name',
        code: `{{user:name}}`
      },
      {
        name: 'Random Number',
        description: 'Generate random number',
        code: `{{random:1-100}}`
      },
      {
        name: 'Page Title',
        description: 'Insert page title',
        code: `{{page:title}}`
      },
      {
        name: 'Custom Variable',
        description: 'Insert custom variable',
        code: `{{var:variable_name}}`
      }
    ];

    macrosList.forEach(macro => {
      const macroButton = document.createElement('button');
      macroButton.style.padding = '16px';
      macroButton.style.backgroundColor = '#4a5568';
      macroButton.style.border = '1px solid #718096';
      macroButton.style.borderRadius = '8px';
      macroButton.style.cursor = 'pointer';
      macroButton.style.transition = 'all 0.2s';
      macroButton.style.textAlign = 'left';
      macroButton.style.color = 'white';

      macroButton.onmouseenter = () => {
        macroButton.style.backgroundColor = '#5a67d8';
        macroButton.style.borderColor = '#5a67d8';
        macroButton.style.transform = 'translateY(-2px)';
      };

      macroButton.onmouseleave = () => {
        macroButton.style.backgroundColor = '#4a5568';
        macroButton.style.borderColor = '#718096';
        macroButton.style.transform = 'translateY(0)';
      };

      macroButton.onclick = () => {
        api.replaceSelection(macro.code);
        if (macrosModal.parentNode) {
          document.body.removeChild(macrosModal);
        }
      };

      const macroName = document.createElement('div');
      macroName.textContent = macro.name;
      macroName.style.fontWeight = 'bold';
      macroName.style.marginBottom = '4px';

      const macroDesc = document.createElement('div');
      macroDesc.textContent = macro.description;
      macroDesc.style.fontSize = '12px';
      macroDesc.style.color = '#cbd5e0';

      const macroCode = document.createElement('div');
      macroCode.textContent = macro.code;
      macroCode.style.fontFamily = 'monospace';
      macroCode.style.fontSize = '11px';
      macroCode.style.color = '#90cdf4';
      macroCode.style.marginTop = '8px';
      macroCode.style.padding = '4px 8px';
      macroCode.style.backgroundColor = '#2d3748';
      macroCode.style.borderRadius = '4px';

      macroButton.appendChild(macroName);
      macroButton.appendChild(macroDesc);
      macroButton.appendChild(macroCode);

      macrosGrid.appendChild(macroButton);
    });

    // Custom Macro Input
    const customMacroContainer = document.createElement('div');
    customMacroContainer.style.marginTop = '20px';
    customMacroContainer.style.paddingTop = '20px';
    customMacroContainer.style.borderTop = '1px solid #4a5568';

    const customLabel = document.createElement('label');
    customLabel.textContent = 'Custom Macro:';
    customLabel.style.color = 'white';
    customLabel.style.display = 'block';
    customLabel.style.marginBottom = '8px';
    customLabel.style.fontSize = '14px';

    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.placeholder = 'Enter custom macro code...';
    customInput.style.width = '100%';
    customInput.style.padding = '12px';
    customInput.style.backgroundColor = '#4a5568';
    customInput.style.border = '1px solid #718096';
    customInput.style.borderRadius = '8px';
    customInput.style.color = 'white';
    customInput.style.marginBottom = '12px';

    const insertCustomButton = document.createElement('button');
    insertCustomButton.textContent = 'Insert Custom Macro';
    insertCustomButton.style.width = '100%';
    insertCustomButton.style.padding = '12px';
    insertCustomButton.style.backgroundColor = '#4299e1';
    insertCustomButton.style.color = 'white';
    insertCustomButton.style.border = 'none';
    insertCustomButton.style.borderRadius = '8px';
    insertCustomButton.style.cursor = 'pointer';
    insertCustomButton.style.fontWeight = 'bold';
    insertCustomButton.style.transition = 'background-color 0.2s';

    insertCustomButton.onmouseenter = () => insertCustomButton.style.backgroundColor = '#3182ce';
    insertCustomButton.onmouseleave = () => insertCustomButton.style.backgroundColor = '#4299e1';

    insertCustomButton.onclick = () => {
      if (customInput.value.trim()) {
        api.replaceSelection(customInput.value.trim());
        if (macrosModal.parentNode) {
          document.body.removeChild(macrosModal);
        }
      }
    };

    customMacroContainer.appendChild(customLabel);
    customMacroContainer.appendChild(customInput);
    customMacroContainer.appendChild(insertCustomButton);

    // Assemble modal
    modalContent.appendChild(header);
    modalContent.appendChild(macrosGrid);
    modalContent.appendChild(customMacroContainer);
    macrosModal.appendChild(modalContent);

    // Close on background click
    macrosModal.onclick = (e) => {
      if (e.target === macrosModal) {
        if (macrosModal.parentNode) {
          document.body.removeChild(macrosModal);
        }
      }
    };

    document.body.appendChild(macrosModal);
  },
};

// Enhanced MDEditor with color commands (same as in Create.jsx)
const EnhancedMDEditor = ({ value, onChange }) => {
  const customCommands = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.group(
      [
        commands.title1,
        commands.title2,
        commands.title3,
        commands.title4,
        commands.title5,
        commands.title6,
      ],
      {
        name: 'title',
        groupName: 'title',
        buttonProps: {
          'aria-label': 'Insert title',
          'data-tooltip-id': 'mdeditor-tooltip',
          'data-tooltip-content': 'Headings'
        },
      }
    ),
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.comment,
    commands.image,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    advancedTableCommand,
    macrosCommand,
    commands.divider,
    createColorCommand(false), // Text color
    createColorCommand(true),  // Background color
  ];

  return (
    <div className="enhanced-md-editor">
      <MDEditor
        value={value}
        onChange={onChange}
        commands={customCommands}
        data-color-mode="dark"
      />
      <Tooltip id="mdeditor-tooltip" />
    </div>
  );
};

export default function Edit({ auth, aiframe, domains = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        domain_id: aiframe.domain_id || '',
        type: aiframe.type || 'TOP',
        content: aiframe.content || '',
        status: aiframe.status || true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('aiframes.update', aiframe.id));
    };

    const handleTypeChange = (e) => {
        setData('type', e.target.value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Aiframe</h2>}
        >
            <Head title={`Edit Aiframe - ${aiframe.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Domain */}
                                    <div>
                                        <label htmlFor="domain_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Domain <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="domain_id"
                                            name="domain_id"
                                            value={data.domain_id}
                                            onChange={(e) => setData('domain_id', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.domain_id ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">Select a domain...</option>
                                            {domains.length > 0 ? (
                                                domains.map((domain) => (
                                                    <option key={domain.id} value={domain.id}>
                                                        {domain.domain || domain.name || `Domain ${domain.id}`}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No domains available</option>
                                            )}
                                        </select>
                                        {errors.domain_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.domain_id}</p>
                                        )}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            onChange={handleTypeChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="TOP">TOP</option>
                                            <option value="BOTTOM">BOTTOM</option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>

                                    {/* Content - Using EnhancedMDEditor */}
                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                            Content <span className="text-red-500">*</span>
                                        </label>
                                        <EnhancedMDEditor
                                            value={data.content}
                                            onChange={(value) => setData('content', value || '')}
                                        />
                                        {errors.content && (
                                            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status.toString()}
                                            onChange={(e) => setData('status', e.target.value === 'true')}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Error Summary */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600 font-medium">Please fix the following errors:</p>
                                        <ul className="mt-1 list-disc list-inside text-sm text-red-600">
                                            {Object.entries(errors).map(([key, value]) => (
                                                <li key={key}>{value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <Link
                                        href={route('aiframes.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : 'Update Aiframe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add the required styles for MDEditor */}
            <style>{`
                .enhanced-md-editor .w-md-editor {
                    border: 1px solid #4a5568 !important;
                    border-radius: 0.75rem !important;
                    overflow: hidden;
                }

                .enhanced-md-editor .w-md-editor-toolbar {
                    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%) !important;
                    border-bottom: 1px solid #4a5568 !important;
                    padding: 12px !important;
                    border-radius: 0.75rem 0.75rem 0 0 !important;
                }

                .enhanced-md-editor .w-md-editor-toolbar button {
                    color: #cbd5e0 !important;
                    border-radius: 0.5rem !important;
                    margin: 0 2px !important;
                    padding: 6px 8px !important;
                    transition: all 0.2s ease !important;
                }

                .enhanced-md-editor .w-md-editor-toolbar button:hover {
                    background: linear-gradient(135deg, #4a5568 0%, #5a67d8 100%) !important;
                    color: white !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                }

                .enhanced-md-editor .w-md-editor-content {
                    background-color: #1a202c !important;
                }

                .enhanced-md-editor .w-md-editor-text {
                    background-color: #1a202c !important;
                    color: white !important;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
                }

                .enhanced-md-editor .w-md-editor-text-pre {
                    color: white !important;
                }

                .enhanced-md-editor .w-md-editor-preview {
                    background-color: #1a202c !important;
                    color: white !important;
                    border-left: 1px solid #4a5568 !important;
                }

                .enhanced-md-editor ::-webkit-scrollbar {
                    width: 8px;
                }

                .enhanced-md-editor ::-webkit-scrollbar-track {
                    background: #2d3748;
                }

                .enhanced-md-editor ::-webkit-scrollbar-thumb {
                    background: #4a5568;
                    border-radius: 4px;
                }

                .enhanced-md-editor ::-webkit-scrollbar-thumb:hover {
                    background: #5a67d8;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}