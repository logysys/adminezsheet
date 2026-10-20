export const ElementType = {
  CONTAINER: 'container',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  HERO: 'hero',
  HEADER: 'header',
  FOOTER: 'footer',
  TESTIMONIAL: 'testimonial',
  GALLERY: 'gallery',
  CHART: 'chart',
  PRODUCT: 'product',
  TABLE: 'table',
  GRID: 'grid',
  FORM: 'form',
  INPUT: 'input',
  NAVBAR: 'navbar',
  CARD: 'card',
  ACCORDION: 'accordion',
  MODAL: 'modal',
  DIVIDER: 'divider',
  ICON: 'icon',
  VIDEO: 'video'
};

export const DEFAULT_STYLES = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px'
  },
  text: {
    fontSize: '16px',
    color: '#000000',
    lineHeight: '1.5'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  header: {
    padding: '16px 32px',
    backgroundColor: '#0f172a',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  hero: {
    padding: '80px 20px',
    backgroundColor: '#1e293b',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center'
  },
  footer: {
    padding: '40px 20px',
    backgroundColor: '#020617',
    color: '#64748b',
    textAlign: 'center',
    width: '100%'
  },
  testimonial: {
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  gallery: {
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  chart: {
    width: '100%',
    height: '300px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  product: {
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    overflowX: 'auto',
    padding: '0px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    padding: '20px'
  },
  form: {
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  input: {
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%'
  },
  card: {
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  },
  navbar: {
    padding: '16px 32px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '20px 0'
  }
};

export const DEFAULT_CONTENT = {
  text: 'New Text Block',
  button: 'Click Me',
  header: 'Header Title',
  hero: 'Hero Section',
  footer: '© 2024 Company. All rights reserved.',
  testimonial: '"This is an amazing product!" - Happy Customer',
  chart: 'Chart Data',
  product: 'Product Name',
  table: 'Table Data',
  input: 'Enter text...',
  divider: ''
};

export const createElement = (type, customId = null, customName = null, customStyle = {}, customContent = '', customProps = {}) => {
  const id = customId || `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const name = customName || `${type.charAt(0).toUpperCase() + type.slice(1)} ${id.slice(-4)}`;
  const style = { ...DEFAULT_STYLES[type], ...customStyle };
  const content = customContent || DEFAULT_CONTENT[type] || '';
  
  const baseElement = {
    id,
    type,
    name,
    style,
    children: [],
    ...customProps
  };

  // Add content for appropriate elements
  if (type === 'text' || type === 'button') {
    baseElement.content = content;
  }

  // Add specific properties for certain types
  switch (type) {
    case 'image':
      baseElement.src = 'https://via.placeholder.com/300x200';
      baseElement.alt = 'Image';
      break;
    case 'button':
      baseElement.href = '#';
      baseElement.target = '_self';
      baseElement.states = {
        hover: { backgroundColor: '#2563eb' },
        active: { transform: 'scale(0.98)' }
      };
      break;
    case 'chart':
      baseElement.chartData = {
        type: 'bar',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        }]
      };
      break;
    case 'table':
      baseElement.tableData = {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
          ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
          ['Row 3 Cell 1', 'Row 3 Cell 2', 'Row 3 Cell 3']
        ]
      };
      break;
    case 'input':
      baseElement.placeholder = 'Enter text...';
      baseElement.inputType = 'text';
      break;
    case 'form':
      baseElement.children = [
        createElement('text', `form-title-${id}`, 'Form Title', { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }, 'Contact Us'),
        createElement('input', `input-name-${id}`, 'Name Input', { marginBottom: '16px' }),
        createElement('input', `input-email-${id}`, 'Email Input', { marginBottom: '16px' }),
        createElement('button', `submit-btn-${id}`, 'Submit Button', { width: '100%', padding: '12px' }, 'Submit')
      ];
      break;
    case 'divider':
      baseElement.style = { ...style, content: 'none' };
      break;
  }

  return baseElement;
};

export const createComplexElement = (type) => {
  const timestamp = Date.now();
  
  switch (type) {
    case 'hero':
      return {
        id: `hero-${timestamp}`,
        type: 'hero',
        name: 'Hero Section',
        style: DEFAULT_STYLES.hero,
        children: [
          createElement('text', `hero-title-${timestamp}`, 'Hero Title', { fontSize: '48px', fontWeight: 'bold' }, 'Hero Section Title'),
          createElement('text', `hero-subtitle-${timestamp}`, 'Hero Subtitle', { fontSize: '20px', color: '#94a3b8' }, 'Subtitle goes here'),
          createElement('button', `hero-button-${timestamp}`, 'Hero Button', { padding: '12px 24px', backgroundColor: '#3b82f6' }, 'Get Started')
        ]
      };

    case 'pricing-cards':
      return {
        id: `pricing-${timestamp}`,
        type: 'container',
        name: 'Pricing Cards',
        style: { display: 'flex', gap: '24px', padding: '60px 20px', justifyContent: 'center', flexWrap: 'wrap' },
        children: [
          {
            id: `card-basic-${timestamp}`,
            type: 'card',
            name: 'Basic Card',
            style: { padding: '32px', maxWidth: '320px', flex: 1 },
            children: [
              createElement('text', `card-title-${timestamp}`, 'Card Title', { fontSize: '24px', fontWeight: 'bold' }, 'Basic'),
              createElement('text', `card-price-${timestamp}`, 'Card Price', { fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }, '$9/mo'),
              createElement('text', `card-features-${timestamp}`, 'Card Features', { whiteSpace: 'pre-line', lineHeight: '2' }, '✓ 10 Projects\n✓ Basic Support\n✓ 1GB Storage'),
              createElement('button', `card-button-${timestamp}`, 'Card Button', { width: '100%', marginTop: '24px' }, 'Get Started')
            ]
          }
        ]
      };

    case 'contact-form':
      return {
        id: `form-${timestamp}`,
        type: 'form',
        name: 'Contact Form',
        style: { maxWidth: '500px', margin: '0 auto' },
        children: [
          createElement('text', `form-title-${timestamp}`, 'Form Title', { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }, 'Contact Us'),
          createElement('text', `label-name-${timestamp}`, 'Name Label', { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, 'Name'),
          createElement('input', `input-name-${timestamp}`, 'Name Input', { marginBottom: '16px' }),
          createElement('text', `label-email-${timestamp}`, 'Email Label', { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, 'Email'),
          createElement('input', `input-email-${timestamp}`, 'Email Input', { marginBottom: '16px' }),
          createElement('text', `label-message-${timestamp}`, 'Message Label', { fontSize: '14px', fontWeight: '500', marginBottom: '4px' }, 'Message'),
          createElement('textarea', `textarea-message-${timestamp}`, 'Message Textarea', { 
            minHeight: '100px',
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            width: '100%',
            marginBottom: '24px'
          }),
          createElement('button', `submit-btn-${timestamp}`, 'Submit Button', { width: '100%', padding: '12px' }, 'Send Message')
        ]
      };

    default:
      return createElement(type);
  }
};

export const INITIAL_ELEMENTS = [
  {
    id: 'root-container',
    type: 'container',
    name: 'Main Container',
    style: {
      padding: '0px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    },
    children: [
      {
        id: 'header-demo',
        type: 'header',
        name: 'Header',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          width: '100%'
        },
        children: [
          {
            id: 'brand-logo',
            type: 'text',
            name: 'Logo',
            content: 'ez.wiki',
            style: { fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' },
            children: []
          },
          {
            id: 'nav-links',
            type: 'container',
            name: 'Navigation',
            style: { display: 'flex', gap: '24px', alignItems: 'center' },
            children: [
              { id: 'nav-1', type: 'text', name: 'Link', content: 'Features', style: { color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }, children: [] },
              { id: 'nav-2', type: 'text', name: 'Link', content: 'Pricing', style: { color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }, children: [] },
              { id: 'nav-3', type: 'text', name: 'Link', content: 'About', style: { color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }, children: [] },
              { id: 'nav-btn', type: 'button', name: 'CTA', content: 'Get Started', style: { padding: '8px 16px', backgroundColor: '#3b82f6', borderRadius: '6px', color: 'white', fontSize: '14px' }, children: [] }
            ]
          }
        ]
      },
      {
        id: 'hero-section',
        type: 'hero',
        name: 'Hero Section',
        style: {
          padding: '80px 20px',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          textAlign: 'center'
        },
        children: [
          {
            id: 'hero-text',
            type: 'text',
            name: 'Heading',
            content: 'Build faster with ez.wiki',
            style: {
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#0f172a'
            },
            children: []
          },
          {
            id: 'hero-sub',
            type: 'text',
            name: 'Subheading',
            content: 'Drag, drop, and edit the code directly to build perfect layouts in minutes.',
            style: {
              fontSize: '18px',
              textAlign: 'center',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 0 20px 0'
            },
            children: []
          },
          {
            id: 'hero-actions',
            type: 'container',
            name: 'Actions',
            style: { display: 'flex', gap: '16px', justifyContent: 'center' },
            children: [
              { id: 'hero-cta-1', type: 'button', name: 'Primary Button', content: 'Start Free Trial', style: { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: '600' }, children: [] },
              { id: 'hero-cta-2', type: 'button', name: 'Secondary Button', content: 'View Demo', style: { padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '8px', fontWeight: '600' }, children: [] }
            ]
          }
        ]
      },
      {
        id: 'features-section',
        type: 'container',
        name: 'Features',
        style: {
          padding: '80px 20px',
          backgroundColor: '#f8fafc',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        },
        children: [
          {
            id: 'feature-1',
            type: 'card',
            name: 'Feature Card 1',
            style: { padding: '32px', textAlign: 'center' },
            children: [
              createElement('text', 'feature-title-1', 'Feature Title', { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }, 'Drag & Drop'),
              createElement('text', 'feature-desc-1', 'Feature Description', { fontSize: '14px', color: '#64748b' }, 'Intuitive drag and drop interface for building layouts visually.')
            ]
          },
          {
            id: 'feature-2',
            type: 'card',
            name: 'Feature Card 2',
            style: { padding: '32px', textAlign: 'center' },
            children: [
              createElement('text', 'feature-title-2', 'Feature Title', { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }, 'Real-time Code'),
              createElement('text', 'feature-desc-2', 'Feature Description', { fontSize: '14px', color: '#64748b' }, 'Edit code directly and see changes instantly on the canvas.')
            ]
          },
          {
            id: 'feature-3',
            type: 'card',
            name: 'Feature Card 3',
            style: { padding: '32px', textAlign: 'center' },
            children: [
              createElement('text', 'feature-title-3', 'Feature Title', { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }, 'Export Anywhere'),
              createElement('text', 'feature-desc-3', 'Feature Description', { fontSize: '14px', color: '#64748b' }, 'Export clean HTML, CSS, and JavaScript for any project.')
            ]
          }
        ]
      }
    ]
  }
];

// Utility functions
export const findElementById = (elements, id) => {
  for (const element of elements) {
    if (element.id === id) return element;
    if (element.children && element.children.length > 0) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateElementById = (elements, id, updates) => {
  return elements.map(element => {
    if (element.id === id) {
      return { ...element, ...updates };
    }
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementById(element.children, id, updates)
      };
    }
    return element;
  });
};

export const deleteElementById = (elements, id) => {
  return elements
    .filter(element => element.id !== id)
    .map(element => {
      if (element.children && element.children.length > 0) {
        return {
          ...element,
          children: deleteElementById(element.children, id)
        };
      }
      return element;
    });
};

export const addElementToParent = (elements, parentId, newElement) => {
  return elements.map(element => {
    if (element.id === parentId) {
      return {
        ...element,
        children: [...(element.children || []), newElement]
      };
    }
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: addElementToParent(element.children, parentId, newElement)
      };
    }
    return element;
  });
};

export const moveElement = (elements, elementId, newParentId, index = -1) => {
  const element = findElementById(elements, elementId);
  if (!element) return elements;
  
  // Remove element from current position
  let removedElements = deleteElementById(elements, elementId);
  
  // Add element to new position
  return addElementToParent(removedElements, newParentId, element);
};

export const CHART_TYPES = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'];
export const CHART_COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6'
};

export default {
  ElementType,
  DEFAULT_STYLES,
  DEFAULT_CONTENT,
  createElement,
  createComplexElement,
  INITIAL_ELEMENTS,
  findElementById,
  updateElementById,
  deleteElementById,
  addElementToParent,
  moveElement,
  CHART_TYPES,
  CHART_COLORS
};