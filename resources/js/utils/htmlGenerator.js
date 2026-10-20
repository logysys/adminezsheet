// @/utils/htmlGenerator.js

// Helper: CamelCase to Kebab-Case (e.g. backgroundColor -> background-color)
export const camelToKebab = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Helper: Generate HTML fragment from elements
export const elementsToHtmlFragment = (elements, indent = 0) => {
  const spaces = '  '.repeat(indent);
  
  return elements.map(el => {
    // Convert style object to CSS string
    const styleStr = el.style 
      ? Object.entries(el.style)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
          .join('; ')
      : '';

    // Determine Tag Name
    let tagName = 'div';
    if (el.type === 'image') tagName = 'img';
    else if (el.type === 'button') tagName = el.href ? 'a' : 'button';
    else if (el.type === 'text') {
      // Determine appropriate text tag based on style
      if (el.style?.fontSize && parseInt(el.style.fontSize) >= 24) {
        tagName = 'h1';
      } else if (el.style?.fontSize && parseInt(el.style.fontSize) >= 20) {
        tagName = 'h2';
      } else if (el.style?.fontSize && parseInt(el.style.fontSize) >= 18) {
        tagName = 'h3';
      } else {
        tagName = 'p';
      }
    }

    // Attributes
    const attrs = [
      `id="${el.id}"`,
      `data-type="${el.type}"`,
      styleStr ? `style="${styleStr}"` : '',
      el.src ? `src="${el.src}"` : '',
      el.href ? `href="${el.href}"` : '',
      el.alt ? `alt="${el.alt}"` : '',
    ].filter(Boolean).join(' ');

    // Self-closing tags
    if (el.type === 'image') {
      return `${spaces}<${tagName} ${attrs} />`;
    }

    // Elements with text content
    if ((el.type === 'text' || el.type === 'button') && el.content) {
      return `${spaces}<${tagName} ${attrs}>${el.content}</${tagName}>`;
    }

    // Containers with children
    const childrenHtml = el.children && el.children.length > 0 
      ? `\n${elementsToHtmlFragment(el.children, indent + 1)}\n${spaces}` 
      : '';

    return `${spaces}<${tagName} ${attrs}>${childrenHtml}</${tagName}>`;
  }).join('\n');
};

// Generate full HTML template
export const getFullHtmlTemplate = (bodyContent, title = 'ez.wiki Export') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; }
    img { max-width: 100%; height: auto; }
    button, .button, a[href].button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    button:hover, .button:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
};

// Main function to generate HTML from elements
export const generateHtmlFromElements = (elements, title = 'ez.wiki Export') => {
  try {
    const fragment = elementsToHtmlFragment(elements, 2);
    return getFullHtmlTemplate(fragment, title);
  } catch (error) {
    console.error('Error generating HTML:', error);
    return '<!DOCTYPE html><html><body>Error generating HTML</body></html>';
  }
};