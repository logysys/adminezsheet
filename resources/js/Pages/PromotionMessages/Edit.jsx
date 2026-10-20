import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBold, 
    faItalic, 
    faStrikethrough, 
    faHeading, 
    faLink, 
    faQuoteRight, 
    faCode, 
    faListUl, 
    faListOl, 
    faTable,
    faBolt,
    faFont,
    faFillDrip
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Import MDEditor
import MDEditor, { commands } from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";

// Advanced table command
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

// Add macros command
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

// Enhanced MDEditor with custom commands
const EnhancedMDEditor = ({ value, onChange, error }) => {
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
        commands.image,
        commands.divider,
        commands.unorderedListCommand,
        commands.orderedListCommand,
        commands.checkedListCommand,
        advancedTableCommand,
        macrosCommand,
    ];

    return (
        <div className="enhanced-md-editor">
            <MDEditor
                value={value}
                onChange={onChange}
                commands={customCommands}
            />
            <Tooltip id="mdeditor-tooltip" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default function Edit({ auth, promotionMessage, coupons }) {
    const { data, setData, put, processing, errors } = useForm({
        domain: promotionMessage.domain,
        coupon_id: promotionMessage.coupon_id,
        message: promotionMessage.message,
        display_order: promotionMessage.display_order || 0,
        status: promotionMessage.status,
        start_date: promotionMessage.start_date ? new Date(promotionMessage.start_date).toISOString().slice(0, 16) : '',
        end_date: promotionMessage.end_date ? new Date(promotionMessage.end_date).toISOString().slice(0, 16) : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('promotion-messages.update', promotionMessage.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Promotion Message</h2>}
        >
            <Head title={`Edit Promotion Message - ${promotionMessage.domain}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Domain */}
                                    <div>
                                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                                            Domain *
                                        </label>
                                        <input
                                            id="domain"
                                            name="domain"
                                            type="text"
                                            value={data.domain}
                                            onChange={(e) => setData('domain', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.domain ? 'border-red-500' : ''
                                            }`}
                                            placeholder="example.com"
                                            required
                                        />
                                        {errors.domain && <p className="mt-1 text-sm text-red-600">{errors.domain}</p>}
                                    </div>

                                    {/* Coupon */}
                                    <div>
                                        <label htmlFor="coupon_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon Code *
                                        </label>
                                        <select
                                            id="coupon_id"
                                            name="coupon_id"
                                            value={data.coupon_id}
                                            onChange={(e) => setData('coupon_id', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.coupon_id ? 'border-red-500' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">Select Coupon</option>
                                            {coupons.map((coupon) => (
                                                <option key={coupon.id} value={coupon.id}>
                                                    {coupon.coupon} - {coupon.type === 'percentage' ? `${coupon.offer}%` : `$${coupon.offer}`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.coupon_id && <p className="mt-1 text-sm text-red-600">{errors.coupon_id}</p>}
                                    </div>

                                    {/* Message */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Promotion Message *
                                        </label>
                                        <div className={`border rounded-md ${
                                            errors.message ? 'border-red-500' : 'border-gray-300'
                                        }`}>
                                            <EnhancedMDEditor
                                                value={data.message}
                                                onChange={(value) => setData('message', value || '')}
                                                error={errors.message}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Maximum 500 characters</p>
                                    </div>

                                    {/* Display Order */}
                                    <div>
                                        <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
                                            Display Order
                                        </label>
                                        <input
                                            id="display_order"
                                            name="display_order"
                                            type="number"
                                            min="0"
                                            value={data.display_order}
                                            onChange={(e) => setData('display_order', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date (Optional)
                                        </label>
                                        <input
                                            id="start_date"
                                            name="start_date"
                                            type="datetime-local"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            id="end_date"
                                            name="end_date"
                                            type="datetime-local"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                errors.end_date ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('promotion-messages.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-3"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Updating...' : 'Update Promotion Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                /* MDEditor custom styles for light theme */
                .enhanced-md-editor .w-md-editor {
                    border: 1px solid #e5e7eb !important;
                    border-radius: 0.5rem !important;
                    overflow: hidden;
                }
                
                .enhanced-md-editor .w-md-editor-toolbar {
                    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%) !important;
                    border-bottom: 1px solid #e5e7eb !important;
                    padding: 12px !important;
                    border-radius: 0.5rem 0.5rem 0 0 !important;
                }
                
                .enhanced-md-editor .w-md-editor-toolbar button {
                    color: #6b7280 !important;
                    border-radius: 0.375rem !important;
                    margin: 0 2px !important;
                    padding: 6px 8px !important;
                    transition: all 0.2s ease !important;
                }
                
                .enhanced-md-editor .w-md-editor-toolbar button:hover {
                    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%) !important;
                    color: #374151 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .enhanced-md-editor .w-md-editor-content {
                    background-color: #ffffff !important;
                }
                
                .enhanced-md-editor .w-md-editor-text {
                    background-color: #ffffff !important;
                    color: #1f2937 !important;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
                }
                
                .enhanced-md-editor .w-md-editor-text-pre {
                    color: #1f2937 !important;
                }
                
                .enhanced-md-editor .w-md-editor-preview {
                    background-color: #ffffff !important;
                    color: #1f2937 !important;
                    border-left: 1px solid #e5e7eb !important;
                }

                /* Custom scrollbar for MDEditor */
                .enhanced-md-editor ::-webkit-scrollbar {
                    width: 8px;
                }

                .enhanced-md-editor ::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }

                .enhanced-md-editor ::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }

                .enhanced-md-editor ::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
                
                /* Tooltip styles */
                .react-tooltip {
                    z-index: 99999 !important;
                    opacity: 1 !important;
                    font-size: 12px;
                    padding: 4px 8px;
                    background: #374151 !important;
                    color: white !important;
                    border-radius: 6px !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}