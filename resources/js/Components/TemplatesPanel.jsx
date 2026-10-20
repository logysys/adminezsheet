// components/TemplatesPanel.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faSearch, faStar, faClock, 
  faUser, faShoppingCart, faEnvelope, 
  faImage, faColumns, faBars, faChartBar,
  faTable, faQuoteRight, faBoxOpen,
  faMobileAlt, faDesktop, faLayerGroup,
  faArrowRight, faPlus, faHeart
} from '@fortawesome/free-solid-svg-icons';

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: faLayerGroup },
  { id: 'hero', label: 'Hero Sections', icon: faStar },
  { id: 'pricing', label: 'Pricing', icon: faShoppingCart },
  { id: 'contact', label: 'Contact Forms', icon: faEnvelope },
  { id: 'gallery', label: 'Galleries', icon: faImage },
  { id: 'dashboard', label: 'Dashboards', icon: faColumns },
  { id: 'blog', label: 'Blog Layouts', icon: faBars },
  { id: 'data', label: 'Data Display', icon: faChartBar },
  { id: 'mobile', label: 'Mobile First', icon: faMobileAlt },
];

const TEMPLATES = [
  {
    id: 'hero-modern',
    name: 'Modern Hero',
    description: 'Clean hero section with gradient background and CTA buttons',
    category: 'hero',
    icon: faStar,
    difficulty: 'Easy',
    elements: [
      {
        id: 'hero-modern-container',
        type: 'hero',
        name: 'Modern Hero',
        style: {
          padding: '100px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          minHeight: '600px',
        },
        children: [
          {
            id: 'hero-modern-title',
            type: 'text',
            name: 'Hero Title',
            content: 'Transform Your Digital Presence',
            style: {
              fontSize: '64px',
              fontWeight: 'bold',
              marginBottom: '24px',
              maxWidth: '800px',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
            children: []
          },
          {
            id: 'hero-modern-subtitle',
            type: 'text',
            name: 'Hero Subtitle',
            content: 'Build stunning websites without writing a single line of code. Drag, drop, and deploy in minutes.',
            style: {
              fontSize: '20px',
              marginBottom: '48px',
              maxWidth: '600px',
              opacity: '0.9',
              lineHeight: '1.6',
            },
            children: []
          },
          {
            id: 'hero-modern-actions',
            type: 'container',
            name: 'Action Buttons',
            style: {
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            },
            children: [
              {
                id: 'hero-modern-cta-primary',
                type: 'button',
                name: 'Primary CTA',
                content: 'Start Free Trial',
                style: {
                  padding: '16px 32px',
                  backgroundColor: 'white',
                  color: '#764ba2',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                },
                states: {
                  hover: {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  }
                },
                children: []
              },
              {
                id: 'hero-modern-cta-secondary',
                type: 'button',
                name: 'Secondary CTA',
                content: 'View Demo',
                style: {
                  padding: '16px 32px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: '2px solid white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                },
                states: {
                  hover: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'pricing-three-tier',
    name: 'Three-Tier Pricing',
    description: 'Pricing cards with three tiers and feature comparison',
    category: 'pricing',
    icon: faShoppingCart,
    difficulty: 'Medium',
    elements: [
      {
        id: 'pricing-container',
        type: 'container',
        name: 'Pricing Section',
        style: {
          padding: '80px 20px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        },
        children: [
          {
            id: 'pricing-title',
            type: 'text',
            name: 'Section Title',
            content: 'Simple, Transparent Pricing',
            style: {
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '16px',
              color: '#1e293b',
            },
            children: []
          },
          {
            id: 'pricing-subtitle',
            type: 'text',
            name: 'Section Subtitle',
            content: 'Choose the perfect plan for your needs. All plans include our core features.',
            style: {
              fontSize: '18px',
              textAlign: 'center',
              color: '#64748b',
              marginBottom: '64px',
              maxWidth: '600px',
            },
            children: []
          },
          {
            id: 'pricing-cards',
            type: 'container',
            name: 'Pricing Cards',
            style: {
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '1200px',
              width: '100%',
            },
            children: [
              // Basic Plan
              {
                id: 'pricing-card-basic',
                type: 'card',
                name: 'Basic Plan',
                style: {
                  flex: '1',
                  minWidth: '280px',
                  maxWidth: '350px',
                  padding: '40px 32px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: [
                  {
                    id: 'plan-basic-header',
                    type: 'container',
                    name: 'Plan Header',
                    style: {
                      marginBottom: '32px',
                      textAlign: 'center',
                    },
                    children: [
                      {
                        id: 'plan-basic-name',
                        type: 'text',
                        name: 'Plan Name',
                        content: 'Basic',
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-basic-price',
                        type: 'text',
                        name: 'Plan Price',
                        content: '$19',
                        style: {
                          fontSize: '48px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-basic-period',
                        type: 'text',
                        name: 'Billing Period',
                        content: 'per month',
                        style: {
                          fontSize: '14px',
                          color: '#64748b',
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'plan-basic-features',
                    type: 'container',
                    name: 'Plan Features',
                    style: {
                      flex: '1',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        id: 'feature-list-basic',
                        type: 'container',
                        name: 'Feature List',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        },
                        children: [
                          {
                            id: 'feature-1-basic',
                            type: 'text',
                            name: 'Feature 1',
                            content: '✓ Up to 5 projects',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-2-basic',
                            type: 'text',
                            name: 'Feature 2',
                            content: '✓ Basic support',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-3-basic',
                            type: 'text',
                            name: 'Feature 3',
                            content: '✓ 1GB storage',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-4-basic',
                            type: 'text',
                            name: 'Feature 4',
                            content: '✗ Advanced analytics',
                            style: {
                              fontSize: '16px',
                              color: '#94a3b8',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'plan-basic-button',
                    type: 'button',
                    name: 'Choose Basic',
                    content: 'Get Started',
                    style: {
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    },
                    children: []
                  }
                ]
              },
              // Pro Plan (Featured)
              {
                id: 'pricing-card-pro',
                type: 'card',
                name: 'Pro Plan',
                style: {
                  flex: '1',
                  minWidth: '280px',
                  maxWidth: '350px',
                  padding: '48px 32px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                  border: '2px solid #3b82f6',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: 'scale(1.05)',
                  position: 'relative',
                  overflow: 'hidden',
                },
                children: [
                  {
                    id: 'plan-pro-badge',
                    type: 'container',
                    name: 'Featured Badge',
                    style: {
                      position: 'absolute',
                      top: '0',
                      right: '32px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    },
                    children: [
                      {
                        id: 'badge-text',
                        type: 'text',
                        name: 'Badge',
                        content: 'Most Popular',
                        style: {
                          color: 'white',
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'plan-pro-header',
                    type: 'container',
                    name: 'Plan Header',
                    style: {
                      marginBottom: '32px',
                      textAlign: 'center',
                    },
                    children: [
                      {
                        id: 'plan-pro-name',
                        type: 'text',
                        name: 'Plan Name',
                        content: 'Professional',
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-pro-price',
                        type: 'text',
                        name: 'Plan Price',
                        content: '$49',
                        style: {
                          fontSize: '48px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-pro-period',
                        type: 'text',
                        name: 'Billing Period',
                        content: 'per month',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'plan-pro-features',
                    type: 'container',
                    name: 'Plan Features',
                    style: {
                      flex: '1',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        id: 'feature-list-pro',
                        type: 'container',
                        name: 'Feature List',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        },
                        children: [
                          {
                            id: 'feature-1-pro',
                            type: 'text',
                            name: 'Feature 1',
                            content: '✓ Unlimited projects',
                            style: {
                              fontSize: '16px',
                              opacity: '0.95',
                            },
                            children: []
                          },
                          {
                            id: 'feature-2-pro',
                            type: 'text',
                            name: 'Feature 2',
                            content: '✓ Priority support',
                            style: {
                              fontSize: '16px',
                              opacity: '0.95',
                            },
                            children: []
                          },
                          {
                            id: 'feature-3-pro',
                            type: 'text',
                            name: 'Feature 3',
                            content: '✓ 10GB storage',
                            style: {
                              fontSize: '16px',
                              opacity: '0.95',
                            },
                            children: []
                          },
                          {
                            id: 'feature-4-pro',
                            type: 'text',
                            name: 'Feature 4',
                            content: '✓ Advanced analytics',
                            style: {
                              fontSize: '16px',
                              opacity: '0.95',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'plan-pro-button',
                    type: 'button',
                    name: 'Choose Pro',
                    content: 'Get Started',
                    style: {
                      width: '100%',
                      padding: '16px',
                      backgroundColor: 'white',
                      color: '#3b82f6',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    },
                    children: []
                  }
                ]
              },
              // Enterprise Plan
              {
                id: 'pricing-card-enterprise',
                type: 'card',
                name: 'Enterprise Plan',
                style: {
                  flex: '1',
                  minWidth: '280px',
                  maxWidth: '350px',
                  padding: '40px 32px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: [
                  {
                    id: 'plan-enterprise-header',
                    type: 'container',
                    name: 'Plan Header',
                    style: {
                      marginBottom: '32px',
                      textAlign: 'center',
                    },
                    children: [
                      {
                        id: 'plan-enterprise-name',
                        type: 'text',
                        name: 'Plan Name',
                        content: 'Enterprise',
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-enterprise-price',
                        type: 'text',
                        name: 'Plan Price',
                        content: '$99',
                        style: {
                          fontSize: '48px',
                          fontWeight: 'bold',
                          color: '#8b5cf6',
                          marginBottom: '8px',
                        },
                        children: []
                      },
                      {
                        id: 'plan-enterprise-period',
                        type: 'text',
                        name: 'Billing Period',
                        content: 'per month',
                        style: {
                          fontSize: '14px',
                          color: '#64748b',
                        },
                        children: []
                      }
                    ]
                  },
                  {
                    id: 'plan-enterprise-features',
                    type: 'container',
                    name: 'Plan Features',
                    style: {
                      flex: '1',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        id: 'feature-list-enterprise',
                        type: 'container',
                        name: 'Feature List',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        },
                        children: [
                          {
                            id: 'feature-1-enterprise',
                            type: 'text',
                            name: 'Feature 1',
                            content: '✓ Unlimited everything',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-2-enterprise',
                            type: 'text',
                            name: 'Feature 2',
                            content: '✓ 24/7 dedicated support',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-3-enterprise',
                            type: 'text',
                            name: 'Feature 3',
                            content: '✓ Custom integrations',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          },
                          {
                            id: 'feature-4-enterprise',
                            type: 'text',
                            name: 'Feature 4',
                            content: '✓ White-label solution',
                            style: {
                              fontSize: '16px',
                              color: '#475569',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'plan-enterprise-button',
                    type: 'button',
                    name: 'Contact Sales',
                    content: 'Contact Sales',
                    style: {
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'contact-form-modern',
    name: 'Modern Contact Form',
    description: 'Clean contact form with validation and social links',
    category: 'contact',
    icon: faEnvelope,
    difficulty: 'Easy',
    elements: [
      {
        id: 'contact-form-container',
        type: 'form',
        name: 'Contact Form',
        style: {
          padding: '60px 40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          maxWidth: '600px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'form-header',
            type: 'container',
            name: 'Form Header',
            style: {
              marginBottom: '40px',
              textAlign: 'center',
            },
            children: [
              {
                id: 'form-title',
                type: 'text',
                name: 'Form Title',
                content: 'Get in Touch',
                style: {
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '12px',
                },
                children: []
              },
              {
                id: 'form-subtitle',
                type: 'text',
                name: 'Form Subtitle',
                content: 'Have a project in mind? Send us a message and we\'ll get back to you within 24 hours.',
                style: {
                  fontSize: '16px',
                  color: '#64748b',
                  lineHeight: '1.6',
                },
                children: []
              }
            ]
          },
          {
            id: 'form-fields',
            type: 'container',
            name: 'Form Fields',
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            },
            children: [
              {
                id: 'name-field',
                type: 'container',
                name: 'Name Field',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                },
                children: [
                  {
                    id: 'name-label',
                    type: 'text',
                    name: 'Name Label',
                    content: 'Full Name',
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#334155',
                    },
                    children: []
                  },
                  {
                    id: 'name-input',
                    type: 'input',
                    name: 'Name Input',
                    placeholder: 'Enter your full name',
                    required: true,
                    style: {
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                    },
                    states: {
                      focus: {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      }
                    },
                    children: []
                  }
                ]
              },
              {
                id: 'email-field',
                type: 'container',
                name: 'Email Field',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                },
                children: [
                  {
                    id: 'email-label',
                    type: 'text',
                    name: 'Email Label',
                    content: 'Email Address',
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#334155',
                    },
                    children: []
                  },
                  {
                    id: 'email-input',
                    type: 'input',
                    name: 'Email Input',
                    placeholder: 'you@example.com',
                    inputType: 'email',
                    required: true,
                    style: {
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                    },
                    states: {
                      focus: {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      }
                    },
                    children: []
                  }
                ]
              },
              {
                id: 'message-field',
                type: 'container',
                name: 'Message Field',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                },
                children: [
                  {
                    id: 'message-label',
                    type: 'text',
                    name: 'Message Label',
                    content: 'Message',
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#334155',
                    },
                    children: []
                  },
                  {
                    id: 'message-textarea',
                    type: 'textarea',
                    name: 'Message Textarea',
                    placeholder: 'Tell us about your project...',
                    required: true,
                    style: {
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '16px',
                      minHeight: '150px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    },
                    states: {
                      focus: {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      }
                    },
                    children: []
                  }
                ]
              },
              {
                id: 'submit-button',
                type: 'button',
                name: 'Submit Button',
                content: 'Send Message',
                buttonType: 'submit',
                style: {
                  padding: '16px 32px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '16px',
                },
                states: {
                  hover: {
                    backgroundColor: '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                  }
                },
                children: []
              }
            ]
          },
          {
            id: 'form-footer',
            type: 'container',
            name: 'Form Footer',
            style: {
              marginTop: '40px',
              paddingTop: '40px',
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
            },
            children: [
              {
                id: 'footer-text',
                type: 'text',
                name: 'Footer Text',
                content: 'Prefer email? Reach us at',
                style: {
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '8px',
                },
                children: []
              },
              {
                id: 'contact-email',
                type: 'text',
                name: 'Contact Email',
                content: 'hello@example.com',
                style: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#3b82f6',
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'image-gallery-grid',
    name: 'Image Gallery Grid',
    description: 'Responsive masonry grid gallery with hover effects',
    category: 'gallery',
    icon: faImage,
    difficulty: 'Medium',
    elements: [
      {
        id: 'gallery-container',
        type: 'gallery',
        name: 'Image Gallery',
        style: {
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          width: '100%',
        },
        children: [
          {
            id: 'gallery-header',
            type: 'container',
            name: 'Gallery Header',
            style: {
              textAlign: 'center',
              marginBottom: '48px',
            },
            children: [
              {
                id: 'gallery-title',
                type: 'text',
                name: 'Gallery Title',
                content: 'Our Gallery',
                style: {
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '16px',
                },
                children: []
              },
              {
                id: 'gallery-subtitle',
                type: 'text',
                name: 'Gallery Subtitle',
                content: 'A collection of our favorite moments and projects',
                style: {
                  fontSize: '18px',
                  color: '#64748b',
                  maxWidth: '600px',
                  margin: '0 auto',
                },
                children: []
              }
            ]
          },
          {
            id: 'gallery-grid',
            type: 'container',
            name: 'Gallery Grid',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto',
            },
            children: [
              {
                id: 'gallery-item-1',
                type: 'container',
                name: 'Gallery Item 1',
                style: {
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                },
                children: [
                  {
                    id: 'gallery-image-1',
                    type: 'image',
                    name: 'Gallery Image 1',
                    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    children: []
                  },
                  {
                    id: 'image-overlay-1',
                    type: 'container',
                    name: 'Image Overlay',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease',
                    },
                    children: [
                      {
                        id: 'image-title-1',
                        type: 'text',
                        name: 'Image Title',
                        content: 'Mountain Landscape',
                        style: {
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        },
                        children: []
                      },
                      {
                        id: 'image-desc-1',
                        type: 'text',
                        name: 'Image Description',
                        content: 'Beautiful mountain view at sunrise',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'gallery-item-2',
                type: 'container',
                name: 'Gallery Item 2',
                style: {
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                },
                children: [
                  {
                    id: 'gallery-image-2',
                    type: 'image',
                    name: 'Gallery Image 2',
                    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    children: []
                  },
                  {
                    id: 'image-overlay-2',
                    type: 'container',
                    name: 'Image Overlay',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease',
                    },
                    children: [
                      {
                        id: 'image-title-2',
                        type: 'text',
                        name: 'Image Title',
                        content: 'Night Sky',
                        style: {
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        },
                        children: []
                      },
                      {
                        id: 'image-desc-2',
                        type: 'text',
                        name: 'Image Description',
                        content: 'Starry night with Milky Way',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'gallery-item-3',
                type: 'container',
                name: 'Gallery Item 3',
                style: {
                  position: 'relative',
                  overflow: 'hidden',
                  gridRow: 'span 2',
                  borderRadius: '16px',
                  cursor: 'pointer',
                },
                children: [
                  {
                    id: 'gallery-image-3',
                    type: 'image',
                    name: 'Gallery Image 3',
                    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    children: []
                  },
                  {
                    id: 'image-overlay-3',
                    type: 'container',
                    name: 'Image Overlay',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease',
                    },
                    children: [
                      {
                        id: 'image-title-3',
                        type: 'text',
                        name: 'Image Title',
                        content: 'Ocean Waves',
                        style: {
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        },
                        children: []
                      },
                      {
                        id: 'image-desc-3',
                        type: 'text',
                        name: 'Image Description',
                        content: 'Powerful waves crashing on shore',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'gallery-item-4',
                type: 'container',
                name: 'Gallery Item 4',
                style: {
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                },
                children: [
                  {
                    id: 'gallery-image-4',
                    type: 'image',
                    name: 'Gallery Image 4',
                    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    children: []
                  },
                  {
                    id: 'image-overlay-4',
                    type: 'container',
                    name: 'Image Overlay',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease',
                    },
                    children: [
                      {
                        id: 'image-title-4',
                        type: 'text',
                        name: 'Image Title',
                        content: 'Forest Path',
                        style: {
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        },
                        children: []
                      },
                      {
                        id: 'image-desc-4',
                        type: 'text',
                        name: 'Image Description',
                        content: 'Sunlight through dense forest',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'gallery-item-5',
                type: 'container',
                name: 'Gallery Item 5',
                style: {
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                },
                children: [
                  {
                    id: 'gallery-image-5',
                    type: 'image',
                    name: 'Gallery Image 5',
                    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    },
                    children: []
                  },
                  {
                    id: 'image-overlay-5',
                    type: 'container',
                    name: 'Image Overlay',
                    style: {
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      transform: 'translateY(100%)',
                      transition: 'transform 0.3s ease',
                    },
                    children: [
                      {
                        id: 'image-title-5',
                        type: 'text',
                        name: 'Image Title',
                        content: 'Misty Mountains',
                        style: {
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '4px',
                        },
                        children: []
                      },
                      {
                        id: 'image-desc-5',
                        type: 'text',
                        name: 'Image Description',
                        content: 'Fog rolling over mountain peaks',
                        style: {
                          fontSize: '14px',
                          opacity: '0.9',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dashboard-stats',
    name: 'Dashboard Stats',
    description: 'Analytics dashboard with charts and metrics',
    category: 'dashboard',
    icon: faColumns,
    difficulty: 'Advanced',
    elements: [
      {
        id: 'dashboard-container',
        type: 'container',
        name: 'Dashboard',
        style: {
          padding: '32px',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          width: '100%',
        },
        children: [
          {
            id: 'dashboard-header',
            type: 'container',
            name: 'Dashboard Header',
            style: {
              marginBottom: '32px',
            },
            children: [
              {
                id: 'dashboard-title',
                type: 'text',
                name: 'Dashboard Title',
                content: 'Analytics Dashboard',
                style: {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px',
                },
                children: []
              },
              {
                id: 'dashboard-subtitle',
                type: 'text',
                name: 'Dashboard Subtitle',
                content: 'Overview of your business metrics and performance',
                style: {
                  fontSize: '16px',
                  color: '#64748b',
                },
                children: []
              }
            ]
          },
          {
            id: 'stats-grid',
            type: 'container',
            name: 'Stats Grid',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            },
            children: [
              {
                id: 'stat-card-revenue',
                type: 'card',
                name: 'Revenue Card',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid #10b981',
                },
                children: [
                  {
                    id: 'stat-title-revenue',
                    type: 'container',
                    name: 'Stat Title',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        id: 'stat-name-revenue',
                        type: 'text',
                        name: 'Stat Name',
                        content: 'Total Revenue',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        },
                        children: []
                      },
                      {
                        id: 'stat-icon-revenue',
                        type: 'container',
                        name: 'Stat Icon',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#10b98120',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#10b981',
                        },
                        children: [
                          {
                            id: 'icon-revenue',
                            type: 'text',
                            name: 'Icon',
                            content: '$',
                            style: {
                              fontSize: '18px',
                              fontWeight: 'bold',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'stat-value-revenue',
                    type: 'text',
                    name: 'Stat Value',
                    content: '$124,568',
                    style: {
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                    },
                    children: []
                  },
                  {
                    id: 'stat-change-revenue',
                    type: 'container',
                    name: 'Stat Change',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        id: 'change-indicator-revenue',
                        type: 'text',
                        name: 'Change Indicator',
                        content: '↑ 12.5%',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#10b981',
                        },
                        children: []
                      },
                      {
                        id: 'change-period-revenue',
                        type: 'text',
                        name: 'Change Period',
                        content: 'from last month',
                        style: {
                          fontSize: '12px',
                          color: '#94a3b8',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'stat-card-users',
                type: 'card',
                name: 'Users Card',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid #3b82f6',
                },
                children: [
                  {
                    id: 'stat-title-users',
                    type: 'container',
                    name: 'Stat Title',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        id: 'stat-name-users',
                        type: 'text',
                        name: 'Stat Name',
                        content: 'Active Users',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        },
                        children: []
                      },
                      {
                        id: 'stat-icon-users',
                        type: 'container',
                        name: 'Stat Icon',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#3b82f620',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3b82f6',
                        },
                        children: [
                          {
                            id: 'icon-users',
                            type: 'text',
                            name: 'Icon',
                            content: '👥',
                            style: {
                              fontSize: '18px',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'stat-value-users',
                    type: 'text',
                    name: 'Stat Value',
                    content: '8,924',
                    style: {
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                    },
                    children: []
                  },
                  {
                    id: 'stat-change-users',
                    type: 'container',
                    name: 'Stat Change',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        id: 'change-indicator-users',
                        type: 'text',
                        name: 'Change Indicator',
                        content: '↑ 5.2%',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#10b981',
                        },
                        children: []
                      },
                      {
                        id: 'change-period-users',
                        type: 'text',
                        name: 'Change Period',
                        content: 'from last week',
                        style: {
                          fontSize: '12px',
                          color: '#94a3b8',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'stat-card-conversion',
                type: 'card',
                name: 'Conversion Card',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid #8b5cf6',
                },
                children: [
                  {
                    id: 'stat-title-conversion',
                    type: 'container',
                    name: 'Stat Title',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        id: 'stat-name-conversion',
                        type: 'text',
                        name: 'Stat Name',
                        content: 'Conversion Rate',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        },
                        children: []
                      },
                      {
                        id: 'stat-icon-conversion',
                        type: 'container',
                        name: 'Stat Icon',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#8b5cf620',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8b5cf6',
                        },
                        children: [
                          {
                            id: 'icon-conversion',
                            type: 'text',
                            name: 'Icon',
                            content: '%',
                            style: {
                              fontSize: '18px',
                              fontWeight: 'bold',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'stat-value-conversion',
                    type: 'text',
                        name: 'Stat Value',
                    content: '3.24%',
                    style: {
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                    },
                    children: []
                  },
                  {
                    id: 'stat-change-conversion',
                    type: 'container',
                    name: 'Stat Change',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        id: 'change-indicator-conversion',
                        type: 'text',
                        name: 'Change Indicator',
                        content: '↓ 0.8%',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ef4444',
                        },
                        children: []
                      },
                      {
                        id: 'change-period-conversion',
                        type: 'text',
                        name: 'Change Period',
                        content: 'from last quarter',
                        style: {
                          fontSize: '12px',
                          color: '#94a3b8',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                id: 'stat-card-orders',
                type: 'card',
                name: 'Orders Card',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  borderLeft: '4px solid #f59e0b',
                },
                children: [
                  {
                    id: 'stat-title-orders',
                    type: 'container',
                    name: 'Stat Title',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        id: 'stat-name-orders',
                        type: 'text',
                        name: 'Stat Name',
                        content: 'Total Orders',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        },
                        children: []
                      },
                      {
                        id: 'stat-icon-orders',
                        type: 'container',
                        name: 'Stat Icon',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f59e0b20',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f59e0b',
                        },
                        children: [
                          {
                            id: 'icon-orders',
                            type: 'text',
                            name: 'Icon',
                            content: '📦',
                            style: {
                              fontSize: '18px',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'stat-value-orders',
                    type: 'text',
                    name: 'Stat Value',
                    content: '1,258',
                    style: {
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1e293b',
                      marginBottom: '8px',
                    },
                    children: []
                  },
                  {
                    id: 'stat-change-orders',
                    type: 'container',
                    name: 'Stat Change',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        id: 'change-indicator-orders',
                        type: 'text',
                        name: 'Change Indicator',
                        content: '↑ 18.3%',
                        style: {
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#10b981',
                        },
                        children: []
                      },
                      {
                        id: 'change-period-orders',
                        type: 'text',
                        name: 'Change Period',
                        content: 'from last month',
                        style: {
                          fontSize: '12px',
                          color: '#94a3b8',
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'charts-section',
            type: 'container',
            name: 'Charts Section',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '32px',
              marginBottom: '48px',
            },
            children: [
              {
                id: 'revenue-chart',
                type: 'chart',
                name: 'Revenue Chart',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  height: '300px',
                },
                chartData: {
                  type: 'line',
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [{
                    label: 'Revenue (in thousands)',
                    data: [65, 78, 66, 89, 96, 112, 128],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                  }]
                },
                children: []
              },
              {
                id: 'users-chart',
                type: 'chart',
                name: 'Users Chart',
                style: {
                  padding: '24px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  height: '300px',
                },
                chartData: {
                  type: 'bar',
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [{
                    label: 'New Users',
                    data: [240, 310, 280, 360, 420, 510, 580],
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                  }]
                },
                children: []
              }
            ]
          },
          {
            id: 'recent-activity',
            type: 'card',
            name: 'Recent Activity',
            style: {
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            },
            children: [
              {
                id: 'activity-title',
                type: 'text',
                name: 'Activity Title',
                content: 'Recent Activity',
                style: {
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '24px',
                },
                children: []
              },
              {
                id: 'activity-list',
                type: 'container',
                name: 'Activity List',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                },
                children: [
                  {
                    id: 'activity-item-1',
                    type: 'container',
                    name: 'Activity Item 1',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                    },
                    children: [
                      {
                        id: 'activity-avatar-1',
                        type: 'container',
                        name: 'Activity Avatar',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        },
                        children: [
                          {
                            id: 'avatar-text-1',
                            type: 'text',
                            name: 'Avatar Text',
                            content: 'JD',
                            style: {
                              fontSize: '14px',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-content-1',
                        type: 'container',
                        name: 'Activity Content',
                        style: {
                          flex: '1',
                        },
                        children: [
                          {
                            id: 'activity-text-1',
                            type: 'text',
                            name: 'Activity Text',
                            content: 'John Doe placed a new order #ORD-7890',
                            style: {
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#334155',
                              marginBottom: '4px',
                            },
                            children: []
                          },
                          {
                            id: 'activity-time-1',
                            type: 'text',
                            name: 'Activity Time',
                            content: '2 minutes ago',
                            style: {
                              fontSize: '12px',
                              color: '#94a3b8',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-badge-1',
                        type: 'container',
                        name: 'Activity Badge',
                        style: {
                          padding: '4px 12px',
                          backgroundColor: '#10b98120',
                          color: '#10b981',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        },
                        children: [
                          {
                            id: 'badge-text-1',
                            type: 'text',
                            name: 'Badge Text',
                            content: 'Order',
                            style: {
                              fontSize: '12px',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'activity-item-2',
                    type: 'container',
                    name: 'Activity Item 2',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                    },
                    children: [
                      {
                        id: 'activity-avatar-2',
                        type: 'container',
                        name: 'Activity Avatar',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#8b5cf6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        },
                        children: [
                          {
                            id: 'avatar-text-2',
                            type: 'text',
                            name: 'Avatar Text',
                            content: 'AS',
                            style: {
                              fontSize: '14px',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-content-2',
                        type: 'container',
                        name: 'Activity Content',
                        style: {
                          flex: '1',
                        },
                        children: [
                          {
                            id: 'activity-text-2',
                            type: 'text',
                            name: 'Activity Text',
                            content: 'Alice Smith updated her account information',
                            style: {
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#334155',
                              marginBottom: '4px',
                            },
                            children: []
                          },
                          {
                            id: 'activity-time-2',
                            type: 'text',
                            name: 'Activity Time',
                            content: '15 minutes ago',
                            style: {
                              fontSize: '12px',
                              color: '#94a3b8',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-badge-2',
                        type: 'container',
                        name: 'Activity Badge',
                        style: {
                          padding: '4px 12px',
                          backgroundColor: '#3b82f620',
                          color: '#3b82f6',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        },
                        children: [
                          {
                            id: 'badge-text-2',
                            type: 'text',
                            name: 'Badge Text',
                            content: 'Account',
                            style: {
                              fontSize: '12px',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: 'activity-item-3',
                    type: 'container',
                    name: 'Activity Item 3',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                    },
                    children: [
                      {
                        id: 'activity-avatar-3',
                        type: 'container',
                        name: 'Activity Avatar',
                        style: {
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#f59e0b',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        },
                        children: [
                          {
                            id: 'avatar-text-3',
                            type: 'text',
                            name: 'Avatar Text',
                            content: 'RJ',
                            style: {
                              fontSize: '14px',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-content-3',
                        type: 'container',
                        name: 'Activity Content',
                        style: {
                          flex: '1',
                        },
                        children: [
                          {
                            id: 'activity-text-3',
                            type: 'text',
                            name: 'Activity Text',
                            content: 'Robert Johnson submitted a support ticket',
                            style: {
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#334155',
                              marginBottom: '4px',
                            },
                            children: []
                          },
                          {
                            id: 'activity-time-3',
                            type: 'text',
                            name: 'Activity Time',
                            content: '1 hour ago',
                            style: {
                              fontSize: '12px',
                              color: '#94a3b8',
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        id: 'activity-badge-3',
                        type: 'container',
                        name: 'Activity Badge',
                        style: {
                          padding: '4px 12px',
                          backgroundColor: '#f59e0b20',
                          color: '#f59e0b',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        },
                        children: [
                          {
                            id: 'badge-text-3',
                            type: 'text',
                            name: 'Badge Text',
                            content: 'Support',
                            style: {
                              fontSize: '12px',
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'blog-layout-modern',
    name: 'Modern Blog Layout',
    description: 'Clean blog layout with featured post and sidebar',
    category: 'blog',
    icon: faBars,
    difficulty: 'Medium',
    elements: [
      {
        id: 'blog-container',
        type: 'container',
        name: 'Blog Layout',
        style: {
          padding: '60px 20px',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          width: '100%',
        },
        children: [
          {
            id: 'blog-header',
            type: 'container',
            name: 'Blog Header',
            style: {
              textAlign: 'center',
              marginBottom: '60px',
              maxWidth: '800px',
              margin: '0 auto 60px',
            },
            children: [
              {
                id: 'blog-title',
                type: 'text',
                name: 'Blog Title',
                content: 'Our Blog',
                style: {
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '16px',
                },
                children: []
              },
              {
                id: 'blog-description',
                type: 'text',
                name: 'Blog Description',
                content: 'Latest news, tutorials, and insights from our team',
                style: {
                  fontSize: '18px',
                  color: '#64748b',
                  lineHeight: '1.6',
                },
                children: []
              }
            ]
          },
          {
            id: 'blog-content',
            type: 'container',
            name: 'Blog Content',
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 350px',
              gap: '48px',
              maxWidth: '1200px',
              margin: '0 auto',
            },
            children: [
              {
                id: 'main-content',
                type: 'container',
                name: 'Main Content',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '48px',
                },
                children: [
                  // Featured Post
                  {
                    id: 'featured-post',
                    type: 'card',
                    name: 'Featured Post',
                    style: {
                      overflow: 'hidden',
                      borderRadius: '20px',
                      backgroundColor: 'white',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                    },
                    children: [
                      {
                        id: 'featured-post-image',
                        type: 'image',
                        name: 'Featured Post Image',
                        src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
                        style: {
                          width: '100%',
                          height: '400px',
                          objectFit: 'cover',
                        },
                        children: []
                      },
                      {
                        id: 'featured-post-content',
                        type: 'container',
                        name: 'Featured Post Content',
                        style: {
                          padding: '40px',
                        },
                        children: [
                          {
                            id: 'featured-post-badge',
                            type: 'container',
                            name: 'Featured Badge',
                            style: {
                              display: 'inline-block',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '6px 16px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '16px',
                            },
                            children: [
                              {
                                id: 'badge-text-featured',
                                type: 'text',
                                name: 'Badge Text',
                                content: 'Featured',
                                style: {
                                  fontSize: '12px',
                                },
                                children: []
                              }
                            ]
                          },
                          {
                            id: 'featured-post-title',
                            type: 'text',
                            name: 'Featured Post Title',
                            content: 'The Future of Web Development in 2024',
                            style: {
                              fontSize: '32px',
                              fontWeight: 'bold',
                              color: '#1e293b',
                              marginBottom: '16px',
                              lineHeight: '1.3',
                            },
                            children: []
                          },
                          {
                            id: 'featured-post-excerpt',
                            type: 'text',
                            name: 'Featured Post Excerpt',
                            content: 'Explore the latest trends and technologies shaping the future of web development, from AI-powered tools to new frameworks and best practices.',
                            style: {
                              fontSize: '18px',
                              color: '#64748b',
                              lineHeight: '1.6',
                              marginBottom: '24px',
                            },
                            children: []
                          },
                          {
                            id: 'featured-post-meta',
                            type: 'container',
                            name: 'Post Meta',
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              gap: '24px',
                              paddingTop: '24px',
                              borderTop: '1px solid #e2e8f0',
                            },
                            children: [
                              {
                                id: 'post-author',
                                type: 'container',
                                name: 'Post Author',
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                },
                                children: [
                                  {
                                    id: 'author-avatar',
                                    type: 'container',
                                    name: 'Author Avatar',
                                    style: {
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: '#f1f5f9',
                                      borderRadius: '50%',
                                      overflow: 'hidden',
                                    },
                                    children: [
                                      {
                                        id: 'avatar-image',
                                        type: 'image',
                                        name: 'Avatar Image',
                                        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
                                        style: {
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        },
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    id: 'author-info',
                                    type: 'container',
                                    name: 'Author Info',
                                    style: {
                                      display: 'flex',
                                      flexDirection: 'column',
                                    },
                                    children: [
                                      {
                                        id: 'author-name',
                                        type: 'text',
                                        name: 'Author Name',
                                        content: 'John Doe',
                                        style: {
                                          fontSize: '14px',
                                          fontWeight: '600',
                                          color: '#334155',
                                        },
                                        children: []
                                      },
                                      {
                                        id: 'author-role',
                                        type: 'text',
                                        name: 'Author Role',
                                        content: 'Senior Developer',
                                        style: {
                                          fontSize: '12px',
                                          color: '#94a3b8',
                                        },
                                        children: []
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                id: 'post-date',
                                type: 'container',
                                name: 'Post Date',
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                },
                                children: [
                                  {
                                    id: 'date-icon',
                                    type: 'container',
                                    name: 'Date Icon',
                                    style: {
                                      color: '#94a3b8',
                                    },
                                    children: [
                                      {
                                        id: 'icon-text',
                                        type: 'text',
                                        name: 'Icon',
                                        content: '📅',
                                        style: {
                                          fontSize: '14px',
                                        },
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    id: 'date-text',
                                    type: 'text',
                                    name: 'Date Text',
                                    content: 'Mar 15, 2024',
                                    style: {
                                      fontSize: '14px',
                                      color: '#64748b',
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                id: 'post-read-time',
                                type: 'container',
                                name: 'Read Time',
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                },
                                children: [
                                  {
                                    id: 'time-icon',
                                    type: 'container',
                                    name: 'Time Icon',
                                    style: {
                                      color: '#94a3b8',
                                    },
                                    children: [
                                      {
                                        id: 'time-icon-text',
                                        type: 'text',
                                        name: 'Time Icon',
                                        content: '⏱️',
                                        style: {
                                          fontSize: '14px',
                                        },
                                        children: []
                                      }
                                    ]
                                  },
                                  {
                                    id: 'time-text',
                                    type: 'text',
                                    name: 'Time Text',
                                    content: '8 min read',
                                    style: {
                                      fontSize: '14px',
                                      color: '#64748b',
                                    },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  // Recent Posts Grid
                  {
                    id: 'recent-posts',
                    type: 'container',
                    name: 'Recent Posts',
                    style: {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '32px',
                    },
                    children: [
                      {
                        id: 'recent-post-1',
                        type: 'card',
                        name: 'Recent Post 1',
                        style: {
                          backgroundColor: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        },
                        children: [
                          {
                            id: 'recent-post-image-1',
                            type: 'image',
                            name: 'Recent Post Image 1',
                            src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
                            style: {
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                            },
                            children: []
                          },
                          {
                            id: 'recent-post-content-1',
                            type: 'container',
                            name: 'Recent Post Content 1',
                            style: {
                              padding: '24px',
                            },
                            children: [
                              {
                                id: 'recent-post-category-1',
                                type: 'container',
                                name: 'Post Category 1',
                                style: {
                                  display: 'inline-block',
                                  backgroundColor: '#f1f5f9',
                                  color: '#64748b',
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                },
                                children: [
                                  {
                                    id: 'category-text-1',
                                    type: 'text',
                                    name: 'Category Text',
                                    content: 'Tutorial',
                                    style: {
                                      fontSize: '12px',
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                id: 'recent-post-title-1',
                                type: 'text',
                                name: 'Recent Post Title 1',
                                content: 'Getting Started with React Hooks',
                                style: {
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                  color: '#1e293b',
                                  marginBottom: '12px',
                                  lineHeight: '1.4',
                                },
                                children: []
                              },
                              {
                                id: 'recent-post-excerpt-1',
                                type: 'text',
                                name: 'Recent Post Excerpt 1',
                                content: 'Learn how to use React Hooks to manage state and side effects in your functional components.',
                                style: {
                                  fontSize: '14px',
                                  color: '#64748b',
                                  lineHeight: '1.6',
                                  marginBottom: '16px',
                                },
                                children: []
                              },
                              {
                                id: 'recent-post-meta-1',
                                type: 'container',
                                name: 'Recent Post Meta 1',
                                style: {
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                },
                                children: [
                                  {
                                    id: 'recent-post-date-1',
                                    type: 'text',
                                    name: 'Recent Post Date 1',
                                    content: 'Mar 10, 2024',
                                    style: {
                                      fontSize: '12px',
                                      color: '#94a3b8',
                                    },
                                    children: []
                                  },
                                  {
                                    id: 'read-more-1',
                                    type: 'text',
                                    name: 'Read More',
                                    content: 'Read →',
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      color: '#3b82f6',
                                      cursor: 'pointer',
                                    },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      // Add more recent posts...
                    ]
                  }
                ]
              },
              // Sidebar
              {
                id: 'blog-sidebar',
                type: 'container',
                name: 'Blog Sidebar',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                },
                children: [
                  // About Card
                  {
                    id: 'about-card',
                    type: 'card',
                    name: 'About Card',
                    style: {
                      padding: '24px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    },
                    children: [
                      {
                        id: 'about-title',
                        type: 'text',
                        name: 'About Title',
                        content: 'About This Blog',
                        style: {
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '16px',
                        },
                        children: []
                      },
                      {
                        id: 'about-content',
                        type: 'text',
                        name: 'About Content',
                        content: 'We share insights, tutorials, and best practices about web development, design, and technology.',
                        style: {
                          fontSize: '14px',
                          color: '#64748b',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                        },
                        children: []
                      },
                      {
                        id: 'subscribe-button',
                        type: 'button',
                        name: 'Subscribe Button',
                        content: 'Subscribe',
                        style: {
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        },
                        children: []
                      }
                    ]
                  },
                  // Categories
                  {
                    id: 'categories-card',
                    type: 'card',
                    name: 'Categories Card',
                    style: {
                      padding: '24px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    },
                    children: [
                      {
                        id: 'categories-title',
                        type: 'text',
                        name: 'Categories Title',
                        content: 'Categories',
                        style: {
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '16px',
                        },
                        children: []
                      },
                      {
                        id: 'categories-list',
                        type: 'container',
                        name: 'Categories List',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        },
                        children: [
                          {
                            id: 'category-item-1',
                            type: 'container',
                            name: 'Category Item 1',
                            style: {
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease',
                            },
                            children: [
                              {
                                id: 'category-name-1',
                                type: 'text',
                                name: 'Category Name 1',
                                content: 'Web Development',
                                style: {
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  color: '#334155',
                                },
                                children: []
                              },
                              {
                                id: 'category-count-1',
                                type: 'text',
                                name: 'Category Count 1',
                                content: '24',
                                style: {
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#3b82f6',
                                  backgroundColor: '#dbeafe',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                },
                                children: []
                              }
                            ]
                          },
                          // Add more categories...
                        ]
                      }
                    ]
                  },
                  // Popular Posts
                  {
                    id: 'popular-posts',
                    type: 'card',
                    name: 'Popular Posts',
                    style: {
                      padding: '24px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    },
                    children: [
                      {
                        id: 'popular-title',
                        type: 'text',
                        name: 'Popular Title',
                        content: 'Popular Posts',
                        style: {
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#1e293b',
                          marginBottom: '16px',
                        },
                        children: []
                      },
                      {
                        id: 'popular-list',
                        type: 'container',
                        name: 'Popular List',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                        },
                        children: [
                          {
                            id: 'popular-item-1',
                            type: 'container',
                            name: 'Popular Item 1',
                            style: {
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'center',
                              cursor: 'pointer',
                            },
                            children: [
                              {
                                id: 'popular-number-1',
                                type: 'container',
                                name: 'Popular Number',
                                style: {
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: '#f1f5f9',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#3b82f6',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                },
                                children: [
                                  {
                                    id: 'number-text-1',
                                    type: 'text',
                                    name: 'Number Text',
                                    content: '1',
                                    style: {
                                      fontSize: '14px',
                                    },
                                    children: []
                                  }
                                ]
                              },
                              {
                                id: 'popular-content-1',
                                type: 'container',
                                name: 'Popular Content',
                                style: {
                                  flex: '1',
                                },
                                children: [
                                  {
                                    id: 'popular-post-title-1',
                                    type: 'text',
                                    name: 'Popular Post Title 1',
                                    content: 'CSS Grid vs Flexbox',
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#334155',
                                      marginBottom: '4px',
                                    },
                                    children: []
                                  },
                                  {
                                    id: 'popular-post-views-1',
                                    type: 'text',
                                    name: 'Popular Post Views 1',
                                    content: '2.4K views',
                                    style: {
                                      fontSize: '12px',
                                      color: '#94a3b8',
                                    },
                                    children: []
                                  }
                                ]
                              }
                            ]
                          },
                          // Add more popular posts...
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const TemplatesPanel = ({ isOpen, onClose, onInsertTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(['hero-modern', 'pricing-three-tier']);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleFavoriteToggle = (templateId) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };
  
  const handleInsert = (template) => {
    onInsertTemplate(template.elements);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full h-full max-w-6xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-4">
            <div className="bg-primary-600 p-3 rounded-xl">
              <FontAwesomeIcon icon={faBoxOpen} className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Template Library</h2>
              <p className="text-slate-400">Choose from professionally designed templates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                List
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 whitespace-nowrap">Filter by:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary-500"
              >
                {TEMPLATE_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="px-6 pt-4 border-b border-slate-800 overflow-x-auto">
          <div className="flex gap-2 pb-4">
            {TEMPLATE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="text-sm" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {filteredTemplates.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faSearch} className="text-3xl text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
              <p className="text-slate-400 text-center max-w-md">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-primary-500 transition-all hover:shadow-2xl hover:shadow-primary-900/20"
                >
                  {/* Template Preview */}
                  <div className="h-48 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full opacity-10" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          template.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                          template.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {template.difficulty}
                        </span>
                        <button
                          onClick={() => handleFavoriteToggle(template.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/50 hover:bg-slate-800"
                        >
                          <FontAwesomeIcon 
                            icon={faHeart} 
                            className={`text-sm ${
                              favorites.includes(template.id) 
                                ? 'text-red-500' 
                                : 'text-slate-500 hover:text-red-400'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
                        <span className="text-xs text-slate-300">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                          <FontAwesomeIcon icon={template.icon} className="text-xl text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{template.category}</span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs text-slate-400">Elements: {template.elements[0].children?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-slate-600 rounded-full border-2 border-slate-800" />
                          <div className="w-8 h-8 bg-slate-600 rounded-full border-2 border-slate-800" />
                          <div className="w-8 h-8 bg-slate-600 rounded-full border-2 border-slate-800" />
                        </div>
                        <span className="text-xs text-slate-500">+1.2K used</span>
                      </div>
                      <button
                        onClick={() => handleInsert(template)}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        Use Template
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <button
                      onClick={() => handleInsert(template)}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                    >
                      <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                      Insert Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className="bg-slate-800 rounded-2xl border border-slate-700 hover:border-primary-500 transition-all p-6"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={template.icon} className="text-2xl text-primary-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-sm text-slate-400">{template.category}</span>
                              <span className="text-sm text-slate-600">•</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                template.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                                template.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-red-900/30 text-red-400'
                              }`}>
                                {template.difficulty}
                              </span>
                              <span className="text-sm text-slate-400">
                                {template.elements[0].children?.length || 0} elements
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleFavoriteToggle(template.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-700"
                            >
                              <FontAwesomeIcon 
                                icon={faHeart} 
                                className={`text-lg ${
                                  favorites.includes(template.id) 
                                    ? 'text-red-500' 
                                    : 'text-slate-500 hover:text-red-400'
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleInsert(template)}
                              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                            >
                              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                              Insert
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-slate-400 mb-4">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                            <span className="text-sm text-slate-300">4.8 rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-slate-500" />
                            <span className="text-sm text-slate-400">1.2K users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="text-slate-500" />
                            <span className="text-sm text-slate-400">Last updated: 2 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              Showing {filteredTemplates.length} of {TEMPLATES.length} templates
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <div className="text-xs text-slate-500">
                Press <kbd className="px-2 py-1 bg-slate-800 rounded">Esc</kbd> to close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};