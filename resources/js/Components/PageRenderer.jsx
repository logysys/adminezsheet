// resources/js/Components/PageRenderer.jsx
import React, { useState, useEffect } from 'react';
import { ElementType } from '@/types';
import { 
  ShoppingBag, Send, Menu, Image as ImageIcon, 
  ChevronRight, Star, CheckCircle, 
  Phone, Mail, MapPin, Clock, 
  Facebook, Twitter, Instagram, Linkedin,
  ArrowRight, Heart, User, Lock, Search,
  Grid, Layout, Shield, Zap, Globe,
  TrendingUp, Users, Award, Headphones
} from 'lucide-react';

// Helper component for rendering editable-like text in view mode
// REMOVED: style prop
const RenderText = ({ 
  tagName: Tag = 'div', 
  value, 
  className = '',
  children,
  ...props 
}) => {
  const safeValue = value || '';
  
  // Add safe HTML rendering for rich content
  if (typeof safeValue === 'string' && safeValue.includes('<')) {
    return (
      <Tag 
        className={className}
        dangerouslySetInnerHTML={{ __html: safeValue }}
        {...props}
      />
    );
  }
  
  return (
    <Tag className={className} {...props}>
      {safeValue}
      {children}
    </Tag>
  );
};

// Helper to convert styles to Tailwind classes using JIT Arbitrary Values
const stylesToTailwind = (styles) => {
  if (!styles) return '';
  
  const classes = [];
  
  // Helper to push class if value exists
  const addClass = (prefix, value) => {
    if (value && value !== 'none' && value !== '0px') {
      // Ensure spaces in complex values (like border params) don't break class compilation
      // though typically for dynamic JIT in browser, spaces are handled or need underscores.
      // For the CDN script, spaces inside [] usually work.
      classes.push(`${prefix}-[${value}]`);
    }
  };

  // Background colors
  if (styles.backgroundColor) {
    // Check for common named colors or use arbitrary
    classes.push(`bg-[${styles.backgroundColor}]`);
  }
  
  // Text colors
  if (styles.color) {
    classes.push(`text-[${styles.color}]`);
  }
  
  // Padding
  if (styles.padding) classes.push(`p-[${styles.padding}]`);
  if (styles.paddingTop) classes.push(`pt-[${styles.paddingTop}]`);
  if (styles.paddingBottom) classes.push(`pb-[${styles.paddingBottom}]`);
  if (styles.paddingLeft) classes.push(`pl-[${styles.paddingLeft}]`);
  if (styles.paddingRight) classes.push(`pr-[${styles.paddingRight}]`);
  
  // Margin
  if (styles.margin) classes.push(`m-[${styles.margin}]`);
  if (styles.marginTop) classes.push(`mt-[${styles.marginTop}]`);
  if (styles.marginBottom) classes.push(`mb-[${styles.marginBottom}]`);
  if (styles.marginLeft) classes.push(`ml-[${styles.marginLeft}]`);
  if (styles.marginRight) classes.push(`mr-[${styles.marginRight}]`);
  
  // Font size
  if (styles.fontSize) {
    classes.push(`text-[${styles.fontSize}]`);
  }
  
  // Font weight
  if (styles.fontWeight) {
    const weightMap = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      'normal': 'font-normal',
      'bold': 'font-bold',
    };
    classes.push(weightMap[styles.fontWeight] || `font-[${styles.fontWeight}]`);
  }
  
  // Text alignment
  if (styles.textAlign) {
    classes.push(`text-${styles.textAlign}`);
  }
  
  // Border radius
  if (styles.borderRadius) {
    classes.push(`rounded-[${styles.borderRadius}]`);
  }
  
  // Border width
  if (styles.borderWidth && styles.borderWidth !== '0px') {
    classes.push(`border-[${styles.borderWidth}]`);
  }
  
  // Border color
  if (styles.borderColor) {
    classes.push(`border-[${styles.borderColor}]`);
  }

  // Border style
  if (styles.borderStyle) {
    classes.push(`border-${styles.borderStyle}`);
  }
  
  // Width
  if (styles.width) {
    classes.push(styles.width === '100%' ? 'w-full' : `w-[${styles.width}]`);
  }
  
  // Height
  if (styles.height) {
    classes.push(styles.height === '100%' ? 'h-full' : `h-[${styles.height}]`);
  }

  // Min/Max Width/Height
  if (styles.maxWidth) classes.push(`max-w-[${styles.maxWidth}]`);
  if (styles.minWidth) classes.push(`min-w-[${styles.minWidth}]`);
  if (styles.maxHeight) classes.push(`max-h-[${styles.maxHeight}]`);
  if (styles.minHeight) classes.push(`min-h-[${styles.minHeight}]`);
  
  // Box shadow
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    // Clean up spaces for class syntax if necessary, or just rely on JIT parser
    classes.push(`shadow-[${styles.boxShadow}]`);
  }
  
  // Display
  if (styles.display) {
    classes.push(styles.display); // block, flex, grid, hidden, etc. match tailwind
  }
  
  // Flexbox properties
  if (styles.justifyContent) {
    const justifyMap = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'center': 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    };
    classes.push(justifyMap[styles.justifyContent] || `justify-[${styles.justifyContent}]`);
  }
  
  if (styles.alignItems) {
    const alignMap = {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'center': 'items-center',
      'stretch': 'items-stretch',
      'baseline': 'items-baseline',
    };
    classes.push(alignMap[styles.alignItems] || `items-[${styles.alignItems}]`);
  }

  if (styles.flexDirection) {
    const dirMap = {
      'row': 'flex-row',
      'column': 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse'
    };
    classes.push(dirMap[styles.flexDirection]);
  }
  
  if (styles.gap) {
    classes.push(`gap-[${styles.gap}]`);
  }
  
  // Grid columns
  if (styles.gridTemplateColumns) {
    // Sanitize spaces for class string if needed, or pass directly
    classes.push(`grid-cols-[${styles.gridTemplateColumns.replace(/\s+/g, '_')}]`);
  }
  
  // Line height
  if (styles.lineHeight) {
    classes.push(`leading-[${styles.lineHeight}]`);
  }

  // Opacity
  if (styles.opacity) {
    classes.push(`opacity-[${styles.opacity}]`);
  }

  // Z-Index
  if (styles.zIndex) {
    classes.push(`z-[${styles.zIndex}]`);
  }

  // Position
  if (styles.position) {
    classes.push(styles.position); // relative, absolute, fixed, etc.
  }
  if (styles.top) classes.push(`top-[${styles.top}]`);
  if (styles.bottom) classes.push(`bottom-[${styles.bottom}]`);
  if (styles.left) classes.push(`left-[${styles.left}]`);
  if (styles.right) classes.push(`right-[${styles.right}]`);
  
  // Add common utility classes
  classes.push('transition-all duration-200 box-border');
  
  return classes.join(' ');
};

// Parse content safely
const parseContent = (content) => {
  if (!content) return {};
  
  if (typeof content === 'string') {
    try {
      // Check if it's JSON
      if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
        return JSON.parse(content);
      }
      // Return as text if not JSON
      return { text: content };
    } catch (e) {
      // If JSON parsing fails, return as text
      return { text: content };
    }
  }
  
  return content;
};

const PageRenderer = ({ elements, title = "Generated Page", className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const renderElement = (element, index) => {
    if (!element) return null;
    
    const { type, content = '', styles = {}, src, alt, href, id } = element;
    const parsedContent = parseContent(content);
    const tailwindClasses = stylesToTailwind(styles);
    
    // Base element wrapper - REMOVED INLINE STYLE PROP
    const ElementWrapper = ({ children, wrapperClass = "", ...props }) => (
      <div 
        key={id || `element-${index}`}
        className={`${tailwindClasses} ${wrapperClass}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
    
    switch (type) {
      case ElementType.HEADER:
        return (
          <ElementWrapper key={id || index}>
            <RenderText 
              tagName="h2" 
              value={typeof parsedContent === 'object' ? parsedContent.text || '' : parsedContent}
              className="font-bold"
            />
          </ElementWrapper>
        );
        
      case ElementType.PARAGRAPH:
        return (
          <ElementWrapper key={id || index}>
            <RenderText 
              tagName="p" 
              value={typeof parsedContent === 'object' ? parsedContent.text || '' : parsedContent}
              className="leading-relaxed"
            />
          </ElementWrapper>
        );
        
      case ElementType.BUTTON:
        const buttonContent = typeof parsedContent === 'object' ? parsedContent.text || '' : parsedContent;
        const buttonHref = href || parsedContent.href || '#';
        
        return (
          <ElementWrapper key={id || index} wrapperClass="inline-block">
            <a 
              href={buttonHref}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <RenderText tagName="span" value={buttonContent} />
            </a>
          </ElementWrapper>
        );
        
      case ElementType.IMAGE:
        return (
          <ElementWrapper key={id || index} wrapperClass="overflow-hidden">
            <img 
              src={src || parsedContent.src || 'https://picsum.photos/400/300'}
              alt={alt || parsedContent.alt || ''}
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </ElementWrapper>
        );
        
      case ElementType.CONTAINER:
        const containerContent = typeof parsedContent === 'object' ? parsedContent.text || parsedContent.html || '' : parsedContent;
        
        return (
          <ElementWrapper key={id || index} wrapperClass="border border-gray-200 rounded-lg p-4">
            <RenderText value={containerContent} />
          </ElementWrapper>
        );
        
      case ElementType.TWO_COL:
        const leftContent = parsedContent.left || 'Left Column Content';
        const rightContent = parsedContent.right || 'Right Column Content';
        
        return (
          <ElementWrapper key={id || index} wrapperClass="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <RenderText value={leftContent} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <RenderText value={rightContent} />
            </div>
          </ElementWrapper>
        );
        
      case ElementType.NAVBAR:
        const brand = parsedContent.brand || 'My Brand';
        const links = parsedContent.links || [{ text: 'Home', href: '#' }, { text: 'About', href: '#' }];
        const buttonText = parsedContent.buttonText || 'Sign Up';
        const navButtonHref = parsedContent.buttonHref || '#';
        const logoSrc = parsedContent.logoSrc;
        
        return (
          <ElementWrapper key={id || index} wrapperClass="sticky top-0 z-50">
            <nav className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    {logoSrc && (
                      <img 
                        src={logoSrc} 
                        alt={brand} 
                        className="h-8 w-auto mr-3"
                      />
                    )}
                    <RenderText 
                      tagName="span" 
                      value={brand} 
                      className="text-xl font-bold text-gray-900"
                    />
                  </div>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {links.map((link, linkIndex) => {
                        const linkText = typeof link === 'string' ? link : link.text;
                        const linkHref = typeof link === 'string' ? '#' : link.href;
                        
                        return (
                          <a
                            key={linkIndex}
                            href={linkHref}
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            {linkText}
                          </a>
                        );
                      })}
                      
                      {buttonText && (
                        <a
                          href={navButtonHref}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {links.map((link, linkIndex) => {
                      const linkText = typeof link === 'string' ? link : link.text;
                      const linkHref = typeof link === 'string' ? '#' : link.href;
                      
                      return (
                        <a
                          key={linkIndex}
                          href={linkHref}
                          className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                        >
                          {linkText}
                        </a>
                      );
                    })}
                    
                    {buttonText && (
                      <a
                        href={navButtonHref}
                        className="mt-3 block px-3 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {buttonText}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </nav>
          </ElementWrapper>
        );
        
      case ElementType.HERO:
        const heroTitle = parsedContent.title || 'Hero Title';
        const subtitle = parsedContent.subtitle || 'Hero subtitle text goes here...';
        const cta = parsedContent.cta || 'Get Started';
        const ctaHref = parsedContent.ctaHref || '#';
        
        return (
          <ElementWrapper key={id || index} wrapperClass="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
              <div className="text-center">
                <RenderText 
                  tagName="h1" 
                  value={heroTitle}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                />
                <RenderText 
                  tagName="p" 
                  value={subtitle}
                  className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                />
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <a
                      href={ctaHref}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      {cta}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
        
      case ElementType.FEATURES:
        const features = Array.isArray(parsedContent) ? parsedContent : 
                        parsedContent.items || parsedContent.features || 
                        [{ title: 'Feature 1', desc: 'Description 1' }, { title: 'Feature 2', desc: 'Description 2' }];
        
        return (
          <ElementWrapper key={id || index} wrapperClass="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Everything you need
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  All the tools and features to help your business grow
                </p>
              </div>
              
              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
                  {features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div className="ml-16">
                        <RenderText 
                          tagName="h3" 
                          value={feature.title || `Feature ${featureIndex + 1}`}
                          className="text-lg leading-6 font-medium text-gray-900"
                        />
                        <RenderText 
                          tagName="p" 
                          value={feature.desc || `Description for feature ${featureIndex + 1}`}
                          className="mt-2 text-base text-gray-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
        
      case ElementType.GALLERY:
        const images = parsedContent.images || [1, 2, 3, 4, 5, 6];
        
        return (
          <ElementWrapper key={id || index} wrapperClass="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Gallery</h2>
                <p className="mt-4 text-xl text-gray-600">A visual showcase of our work</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, imgIndex) => {
                  const imgSrc = typeof img === 'string' && img.startsWith('http') ? img : 
                               `https://picsum.photos/400/300?random=${imgIndex + 100}`;
                  
                  return (
                    <div key={imgIndex} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src={imgSrc}
                          alt={`Gallery image ${imgIndex + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ImageIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ElementWrapper>
        );
        
      case ElementType.PRODUCT_GRID:
        const products = Array.isArray(parsedContent) ? parsedContent : 
                        parsedContent.products || parsedContent.items || 
                        [
                          { name: 'Product 1', price: '$99', buttonText: 'Add to Cart' },
                          { name: 'Product 2', price: '$149', buttonText: 'Add to Cart' },
                          { name: 'Product 3', price: '$199', buttonText: 'Add to Cart' }
                        ];
        
        return (
          <ElementWrapper key={id || index} wrapperClass="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900">Our Products</h2>
                <p className="mt-4 text-xl text-gray-600">Quality products at great prices</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, productIndex) => {
                  const productName = product.name || `Product ${productIndex + 1}`;
                  const productPrice = product.price || '$99';
                  const productImage = product.image || `https://picsum.photos/400/300?random=${productIndex + 200}`;
                  const productButtonText = product.buttonText || 'Add to Cart';
                  const productButtonHref = product.buttonHref || '#';
                  
                  return (
                    <div key={productIndex} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <RenderText 
                            tagName="h3" 
                            value={productName}
                            className="text-lg font-semibold text-gray-900"
                          />
                          <span className="text-lg font-bold text-blue-600">{productPrice}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          {product.desc || 'High-quality product with excellent features.'}
                        </p>
                        <a
                          href={productButtonHref}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black transition-colors"
                        >
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          {productButtonText}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ElementWrapper>
        );
        
      case ElementType.CONTACT_FORM:
        const formTitle = parsedContent.title || 'Contact Us';
        const formButtonText = parsedContent.buttonText || 'Send Message';
        const labels = parsedContent.labels || {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email Address',
          message: 'Message'
        };
        
        return (
          <ElementWrapper key={id || index} wrapperClass="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <RenderText 
                    tagName="h2" 
                    value={formTitle}
                    className="text-3xl font-extrabold text-gray-900"
                  />
                  <p className="mt-4 text-lg text-gray-600">
                    Have questions? We'd love to hear from you.
                  </p>
                </div>
                
                <form className="bg-white shadow-xl rounded-lg p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {labels.firstName}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {labels.lastName}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.email}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.message}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Your message here..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {formButtonText}
                  </button>
                </form>
                
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <Phone className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                    <p className="mt-2 text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Mail className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="mt-2 text-gray-600">support@example.com</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Visit Us</h3>
                    <p className="mt-2 text-gray-600">123 Main St, City, State</p>
                  </div>
                </div>
              </div>
            </div>
          </ElementWrapper>
        );
        
      case ElementType.FOOTER:
        const footerBrand = parsedContent.brand || 'My Website';
        const copyright = parsedContent.copyright || '© 2024 My Website. All rights reserved.';
        const footerLinks = parsedContent.links || [
          { title: 'Product', items: ['Features', 'Pricing', 'API'] },
          { title: 'Company', items: ['About', 'Blog', 'Careers'] },
          { title: 'Support', items: ['Help Center', 'Contact', 'Status'] }
        ];
        const socialLinks = parsedContent.social || [
          { platform: 'Facebook', url: '#' },
          { platform: 'Twitter', url: '#' },
          { platform: 'Instagram', url: '#' },
          { platform: 'LinkedIn', url: '#' }
        ];
        
        return (
          <ElementWrapper key={id || index} wrapperClass="bg-gray-900 text-white">
            <footer className="w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                  {/* Brand column */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xl">E</span>
                      </div>
                      <RenderText 
                        tagName="span" 
                        value={footerBrand}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <p className="text-gray-400 mt-4 max-w-md">
                      Building amazing digital experiences for businesses worldwide. 
                      We help you create, design, and launch your perfect website.
                    </p>
                    
                    {/* Social links */}
                    <div className="flex space-x-4 mt-6">
                      {socialLinks.map((social, socialIndex) => {
                        let Icon = Globe;
                        let platform = social.platform?.toLowerCase() || 'website';
                        
                        if (platform.includes('facebook')) Icon = Facebook;
                        else if (platform.includes('twitter') || platform.includes('x')) Icon = Twitter;
                        else if (platform.includes('instagram')) Icon = Instagram;
                        else if (platform.includes('linkedin')) Icon = Linkedin;
                        
                        return (
                          <a
                            key={socialIndex}
                            href={social.url || '#'}
                            className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                            aria-label={social.platform || 'Social media'}
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Link columns */}
                  {footerLinks.map((column, columnIndex) => (
                    <div key={columnIndex}>
                      <RenderText 
                        tagName="h3" 
                        value={column.title || `Column ${columnIndex + 1}`}
                        className="text-lg font-semibold mb-4"
                      />
                      <ul className="space-y-3">
                        {(column.items || []).map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a
                              href="#"
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="border-t border-gray-800 mt-10 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      {copyright}
                    </p>
                    
                    <div className="flex space-x-6 mt-4 md:mt-0">
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Privacy Policy
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Terms of Service
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Cookie Policy
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-gray-500 text-xs">
                    <p>Made with ❤️ using Ez Builder • Page generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </footer>
          </ElementWrapper>
        );
        
      default:
        // Fallback for unknown element types
        return (
          <ElementWrapper key={id || index} wrapperClass="p-4 border border-gray-300 rounded-lg">
            <div className="text-gray-600">
              <RenderText value={content} />
              <div className="mt-2 text-xs text-gray-400">
                Element type: {type}
              </div>
            </div>
          </ElementWrapper>
        );
    }
  };
  
  if (!elements || elements.length === 0) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Layout className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Empty Page</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              This page doesn't have any content yet. Add elements to create your page.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${className}`}>
      {/* Add Tailwind CSS via CDN for standalone rendering */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* Page content */}
      <div className="space-y-0">
        {elements.map((element, index) => (
          <React.Fragment key={element.id || `element-${index}`}>
            {renderElement(element, index)}
          </React.Fragment>
        ))}
      </div>
      
      {/* Generated by footer for standalone pages */}
      {elements.length > 0 && (
        <div className="bg-gray-900 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              Generated with Ez Builder • Page: {title} • {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              This page was automatically generated from visual elements
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageRenderer;