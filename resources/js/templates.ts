// templates.ts
import { ElementType, Template } from '@/types';

export const TEMPLATES: Template[] = [
  {
    name: "SaaS Landing Page",
    elements: [
      {
        id: "template-saas-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "SaaSFlow",
          logoSrc: "https://picsum.photos/40/40?random=1",
          links: [
            { text: "Features", href: "#features" },
            { text: "Pricing", href: "#pricing" },
            { text: "Customers", href: "#customers" },
            { text: "Docs", href: "#docs" }
          ],
          buttonText: "Get Started",
          buttonHref: "#signup"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px 32px",
          margin: "0px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          borderBottom: "1px solid #e5e7eb",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-saas-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Automate Your Business",
          subtitle: "Streamline operations, boost productivity, and drive growth with our AI-powered SaaS platform. Join 10,000+ companies revolutionizing their workflow.",
          cta: "Start Free Trial",
          ctaHref: "#trial"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "120px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#111827",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
        }
      },
      {
        id: "template-saas-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "AI Automation",
            desc: "Intelligent workflows that learn and adapt to your business processes."
          },
          {
            title: "Real-time Analytics",
            desc: "Data-driven insights with customizable dashboards and reports."
          },
          {
            title: "Team Collaboration",
            desc: "Seamless communication and project management for remote teams."
          },
          {
            title: "Enterprise Security",
            desc: "Bank-grade encryption and compliance with industry standards."
          },
          {
            title: "API Integration",
            desc: "Connect with 500+ tools including Slack, Google Workspace, and Salesforce."
          },
          {
            title: "24/7 Support",
            desc: "Dedicated customer success team and comprehensive documentation."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-saas-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Trusted by Industry Leaders\n\nOver 10,000 companies worldwide trust our platform to power their business operations. From startups to Fortune 500 companies, we deliver results that matter.\n\n- **99.9% Uptime Guarantee**\n- **24/7 Customer Support**\n- **GDPR & SOC2 Compliant**\n- **30-day Money Back**",
          right: "## See It In Action\n\nBook a personalized demo with our product experts. See how our platform can transform your business operations in just 30 minutes.\n\n- **No credit card required**\n- **Tailored to your needs**\n- **Implementation support**\n- **Migration assistance**"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f1f5f9",
          padding: "80px 32px",
          margin: "0px",
          gap: "48px",
          color: "#111827"
        }
      },
      {
        id: "template-saas-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Ready to Transform Your Business?",
          buttonText: "Request Demo",
          labels: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Work Email",
            company: "Company Name",
            message: "Tell us about your needs"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-saas-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "SaaSFlow",
          copyright: "© 2024 SaaSFlow Inc. All rights reserved.",
          links: [
            {
              title: "Product",
              items: ["Features", "Pricing", "Integrations", "Roadmap"]
            },
            {
              title: "Resources",
              items: ["Documentation", "Blog", "Tutorials", "API Reference"]
            },
            {
              title: "Company",
              items: ["About", "Careers", "Press", "Contact"]
            },
            {
              title: "Legal",
              items: ["Privacy", "Terms", "Security", "GDPR"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "E-commerce Store",
    elements: [
      {
        id: "template-ecom-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "UrbanStyle",
          logoSrc: "https://picsum.photos/40/40?random=2",
          links: [
            { text: "Men", href: "#men" },
            { text: "Women", href: "#women" },
            { text: "Accessories", href: "#accessories" },
            { text: "Sale", href: "#sale" },
            { text: "New Arrivals", href: "#new" }
          ],
          buttonText: "Cart (0)",
          buttonHref: "#cart"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px 32px",
          margin: "0px",
          boxShadow: "0 2px 4px -1px rgb(0 0 0 / 0.1)",
          borderBottom: "1px solid #e5e7eb",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-ecom-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Summer Collection 2024",
          subtitle: "Discover the latest trends in fashion. Limited edition pieces crafted with premium materials for ultimate comfort and style.",
          cta: "Shop Now",
          ctaHref: "#collection"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#fef3c7",
          backgroundImage: "linear-gradient(to right, #fef3c7, #fde68a)",
          padding: "100px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#92400e"
        }
      },
      {
        id: "template-ecom-productgrid-1",
        type: ElementType.PRODUCT_GRID,
        content: JSON.stringify([
          {
            name: "Classic White Tee",
            price: "$29.99",
            image: "https://picsum.photos/300/400?random=10",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-1"
          },
          {
            name: "Slim Fit Jeans",
            price: "$89.99",
            image: "https://picsum.photos/300/400?random=11",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-2"
          },
          {
            name: "Leather Jacket",
            price: "$149.99",
            image: "https://picsum.photos/300/400?random=12",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-3"
          },
          {
            name: "Running Shoes",
            price: "$119.99",
            image: "https://picsum.photos/300/400?random=13",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-4"
          },
          {
            name: "Backpack",
            price: "$79.99",
            image: "https://picsum.photos/300/400?random=14",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-5"
          },
          {
            name: "Watch",
            price: "$199.99",
            image: "https://picsum.photos/300/400?random=15",
            buttonText: "Add to Cart",
            buttonHref: "#add-to-cart-6"
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "60px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-ecom-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Free Shipping",
            desc: "Free delivery on all orders over $50. Fast shipping worldwide."
          },
          {
            title: "Easy Returns",
            desc: "30-day return policy. No questions asked returns."
          },
          {
            title: "Secure Payment",
            desc: "100% secure payment with SSL encryption. Multiple payment options."
          },
          {
            title: "Quality Guarantee",
            desc: "Premium quality products with 1-year warranty on all items."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f9fafb",
          padding: "60px 32px",
          margin: "0px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-ecom-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=20",
            "https://picsum.photos/400/300?random=21",
            "https://picsum.photos/400/300?random=22",
            "https://picsum.photos/400/300?random=23",
            "https://picsum.photos/400/300?random=24",
            "https://picsum.photos/400/300?random=25"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "60px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-ecom-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "UrbanStyle",
          copyright: "© 2024 UrbanStyle Fashion. All rights reserved.",
          links: [
            {
              title: "Shop",
              items: ["Men", "Women", "Kids", "Accessories", "Sale"]
            },
            {
              title: "Help",
              items: ["Shipping", "Returns", "Size Guide", "Contact Us", "FAQs"]
            },
            {
              title: "About",
              items: ["Our Story", "Careers", "Sustainability", "Press", "Stores"]
            },
            {
              title: "Connect",
              items: ["Instagram", "Facebook", "Twitter", "Pinterest", "TikTok"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#111827",
          color: "#d1d5db",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Portfolio Website",
    elements: [
      {
        id: "template-portfolio-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "Alex Chen",
          logoSrc: "https://picsum.photos/40/40?random=3",
          links: [
            { text: "Work", href: "#work" },
            { text: "About", href: "#about" },
            { text: "Services", href: "#services" },
            { text: "Contact", href: "#contact" }
          ],
          buttonText: "Resume",
          buttonHref: "#resume"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "transparent",
          padding: "32px 48px",
          margin: "0px",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-portfolio-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Designer & Developer",
          subtitle: "I create digital experiences that are beautiful, functional, and user-focused. Based in San Francisco, working with startups and Fortune 500 companies worldwide.",
          cta: "View Projects",
          ctaHref: "#projects"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "120px 48px 80px 48px",
          margin: "0px",
          textAlign: "left",
          color: "#111827",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto"
        }
      },
      {
        id: "template-portfolio-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/600/400?random=30",
            "https://picsum.photos/600/400?random=31",
            "https://picsum.photos/600/400?random=32",
            "https://picsum.photos/600/400?random=33",
            "https://picsum.photos/600/400?random=34",
            "https://picsum.photos/600/400?random=35"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-portfolio-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## My Approach\n\nI believe in creating solutions that are not only visually stunning but also technically sound. Every project begins with understanding the user's needs and business goals.\n\n### Process:\n1. **Discovery** - Research & planning\n2. **Design** - Wireframes & prototypes\n3. **Development** - Clean, efficient code\n4. **Testing** - Quality assurance\n5. **Launch** - Deployment & support",
          right: "## Skills & Tools\n\n### Design\n- UI/UX Design\n- User Research\n- Prototyping\n- Design Systems\n\n### Development\n- React & Next.js\n- TypeScript\n- Tailwind CSS\n- Node.js\n- WordPress\n\n### Tools\n- Figma\n- Adobe Creative Suite\n- VS Code\n- Git & GitHub"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 48px",
          margin: "0px",
          gap: "64px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-portfolio-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Web Design",
            desc: "Creating responsive, accessible, and beautiful websites that work across all devices."
          },
          {
            title: "UI/UX Design",
            desc: "User-centered design solutions that solve real problems and improve conversion rates."
          },
          {
            title: "Frontend Development",
            desc: "Building fast, scalable, and maintainable applications with modern frameworks."
          },
          {
            title: "Consulting",
            desc: "Strategic advice and guidance for startups and established businesses."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-portfolio-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Let's Work Together",
          buttonText: "Send Message",
          labels: {
            firstName: "Name",
            email: "Email",
            company: "Company",
            message: "Project Details"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-portfolio-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "Alex Chen",
          copyright: "© 2024 Alex Chen. All rights reserved.",
          links: [
            {
              title: "Connect",
              items: ["Email", "LinkedIn", "Dribbble", "GitHub", "Twitter"]
            },
            {
              title: "Resources",
              items: ["Case Studies", "Blog", "Free Templates", "Tools"]
            },
            {
              title: "Legal",
              items: ["Privacy Policy", "Terms of Service"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          padding: "60px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Restaurant Website",
    elements: [
      {
        id: "template-restaurant-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "Bella Cucina",
          logoSrc: "https://picsum.photos/40/40?random=4",
          links: [
            { text: "Menu", href: "#menu" },
            { text: "About", href: "#about" },
            { text: "Reservations", href: "#reservations" },
            { text: "Events", href: "#events" }
          ],
          buttonText: "Order Online",
          buttonHref: "#order"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px 32px",
          margin: "0px",
          boxShadow: "0 2px 4px -1px rgb(0 0 0 / 0.1)",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-restaurant-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Authentic Italian Cuisine",
          subtitle: "Family recipes passed down through generations. Fresh ingredients, traditional methods, and modern presentation.",
          cta: "View Menu",
          ctaHref: "#menu"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#dc2626",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://picsum.photos/1600/900?random=40')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "160px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-restaurant-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Fresh Ingredients",
            desc: "Locally sourced produce and imported Italian specialties."
          },
          {
            title: "Handmade Pasta",
            desc: "Daily pasta made fresh in-house using traditional methods."
          },
          {
            title: "Wood-Fired Pizza",
            desc: "Authentic Neapolitan pizza cooked in our imported oven."
          },
          {
            title: "Extensive Wine List",
            desc: "Curated selection of Italian and local wines."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#fef3c7",
          padding: "60px 32px",
          margin: "0px",
          color: "#92400e"
        }
      },
      {
        id: "template-restaurant-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=41",
            "https://picsum.photos/400/300?random=42",
            "https://picsum.photos/400/300?random=43",
            "https://picsum.photos/400/300?random=44",
            "https://picsum.photos/400/300?random=45",
            "https://picsum.photos/400/300?random=46"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "60px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-restaurant-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Hours & Location\n\n**Open Hours:**\nMonday - Thursday: 11am - 10pm\nFriday - Saturday: 11am - 11pm\nSunday: 10am - 9pm\n\n**Brunch:**\nSunday: 10am - 3pm\n\n**Address:**\n123 Main Street\nSan Francisco, CA 94105\n\n**Phone:**\n(555) 123-4567",
          right: "## Private Events\n\nHost your special occasions with us. We offer private dining rooms for parties, corporate events, and celebrations.\n\n- **Capacity:** Up to 100 guests\n- **Full Menu:** Customizable options\n- **Audio/Visual:** Available upon request\n- **Catering:** Off-site catering available\n\nContact our events team to plan your perfect gathering."
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f9fafb",
          padding: "80px 32px",
          margin: "0px",
          gap: "48px",
          color: "#111827"
        }
      },
      {
        id: "template-restaurant-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Make a Reservation",
          buttonText: "Book Table",
          labels: {
            firstName: "Name",
            lastName: "Party Size",
            email: "Email",
            phone: "Phone",
            date: "Date & Time",
            message: "Special Requests"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-restaurant-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "Bella Cucina",
          copyright: "© 2024 Bella Cucina Italian Restaurant. All rights reserved.",
          links: [
            {
              title: "Menu",
              items: ["Appetizers", "Pasta", "Pizza", "Desserts", "Drinks"]
            },
            {
              title: "Visit",
              items: ["Hours", "Location", "Parking", "Accessibility"]
            },
            {
              title: "About",
              items: ["Our Story", "Chef", "Team", "Press", "Careers"]
            },
            {
              title: "Connect",
              items: ["Instagram", "Facebook", "Yelp", "TripAdvisor"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#1c1917",
          color: "#d6d3d1",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Blog & Magazine",
    elements: [
      {
        id: "template-blog-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "The Modern Mind",
          logoSrc: "https://picsum.photos/40/40?random=5",
          links: [
            { text: "Articles", href: "#articles" },
            { text: "Categories", href: "#categories" },
            { text: "Authors", href: "#authors" },
            { text: "Podcast", href: "#podcast" }
          ],
          buttonText: "Subscribe",
          buttonHref: "#subscribe"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px 48px",
          margin: "0px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-blog-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Thoughts on Technology & Society",
          subtitle: "Exploring the intersection of innovation, ethics, and human experience. Weekly essays, interviews, and analysis.",
          cta: "Read Latest",
          ctaHref: "#latest"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          padding: "120px 48px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-blog-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Featured Article\n\n### The Future of AI Ethics\n\nAs artificial intelligence becomes more integrated into our daily lives, ethical considerations are paramount. How do we ensure these systems are fair, transparent, and accountable?\n\n**Key Points:**\n- Algorithmic bias and fairness\n- Transparency in decision-making\n- Privacy concerns in data collection\n- Regulatory frameworks needed\n- Human oversight requirements",
          right: "## Latest Podcast\n\n### Episode 42: Digital Minimalism\n\nIn this episode, we discuss the growing movement toward digital minimalism and how to reclaim your attention in an always-connected world.\n\n**Guests:**\n- Sarah Chen, Digital Wellness Coach\n- Dr. Michael Rodriguez, Cognitive Psychologist\n- James Wilson, Tech Ethics Writer\n\n**Topics Covered:**\n- Notification management\n- Social media boundaries\n- Mindful technology use\n- Digital detox strategies"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 48px",
          margin: "0px",
          gap: "64px",
          color: "#111827"
        }
      },
      {
        id: "template-blog-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Technology",
            desc: "Latest innovations, startups, and industry trends shaping our digital future."
          },
          {
            title: "Society",
            desc: "How technology impacts culture, relationships, and social structures."
          },
          {
            title: "Business",
            desc: "Entrepreneurship, leadership, and the future of work in the digital age."
          },
          {
            title: "Health",
            desc: "Digital health, wellness technology, and the quantified self movement."
          },
          {
            title: "Arts",
            desc: "Digital art, creative technology, and the intersection of art and innovation."
          },
          {
            title: "Education",
            desc: "Edtech, online learning, and the future of knowledge sharing."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-blog-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Join Our Newsletter",
          buttonText: "Subscribe",
          labels: {
            firstName: "Name",
            email: "Email",
            interests: "Topics of Interest",
            frequency: "Email Frequency"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f1f5f9",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-blog-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "The Modern Mind",
          copyright: "© 2024 The Modern Mind Media. All rights reserved.",
          links: [
            {
              title: "Sections",
              items: ["Technology", "Society", "Business", "Health", "Arts", "Education"]
            },
            {
              title: "Resources",
              items: ["Archives", "Newsletter", "Podcast", "Events", "Research"]
            },
            {
              title: "Company",
              items: ["About", "Team", "Contact", "Advertise", "Careers"]
            },
            {
              title: "Legal",
              items: ["Privacy", "Terms", "Cookies", "Accessibility", "Code of Conduct"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Corporate Landing",
    elements: [
      {
        id: "template-corporate-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "InnovateCorp",
          logoSrc: "https://picsum.photos/40/40?random=6",
          links: [
            { text: "Solutions", href: "#solutions" },
            { text: "Industries", href: "#industries" },
            { text: "Case Studies", href: "#cases" },
            { text: "Resources", href: "#resources" }
          ],
          buttonText: "Contact Sales",
          buttonHref: "#contact"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px 48px",
          margin: "0px",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-corporate-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Enterprise Solutions for Modern Business",
          subtitle: "Transform your organization with scalable technology solutions. Trusted by Fortune 500 companies to drive innovation and growth.",
          cta: "Request Demo",
          ctaHref: "#demo"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#1e40af",
          backgroundImage: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
          padding: "140px 48px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-corporate-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Digital Transformation",
            desc: "Comprehensive strategy and implementation for modernizing your business processes."
          },
          {
            title: "Cloud Migration",
            desc: "Secure and efficient migration to cloud infrastructure with minimal disruption."
          },
          {
            title: "Data Analytics",
            desc: "Turn data into actionable insights with advanced analytics and AI-powered tools."
          },
          {
            title: "Cybersecurity",
            desc: "Enterprise-grade security solutions to protect your digital assets and data."
          },
          {
            title: "Custom Development",
            desc: "Tailored software solutions built to meet your specific business requirements."
          },
          {
            title: "24/7 Support",
            desc: "Round-the-clock technical support and maintenance for mission-critical systems."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "100px 48px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-corporate-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=50",
            "https://picsum.photos/400/300?random=51",
            "https://picsum.photos/400/300?random=52",
            "https://picsum.photos/400/300?random=53",
            "https://picsum.photos/400/300?random=54",
            "https://picsum.photos/400/300?random=55"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-corporate-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Industry Leadership\n\nWith over 20 years of experience, we've helped thousands of organizations transform their operations. Our team of experts brings deep industry knowledge and technical expertise to every project.\n\n**Key Statistics:**\n- **98%** Client Retention Rate\n- **500+** Enterprise Clients\n- **24/7** Global Support\n- **99.99%** System Uptime\n- **ISO 27001** Certified",
          right: "## Client Success Stories\n\n### Global Bank\nStreamlined operations across 50+ branches, reducing processing time by 40%.\n\n### Retail Chain\nImplemented AI-powered inventory management, cutting costs by 25%.\n\n### Healthcare Provider\nEnhanced patient data security while improving accessibility for medical staff.\n\n### Manufacturing Giant\nAutomated production lines, increasing output by 30% with existing resources."
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 48px",
          margin: "0px",
          gap: "64px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-corporate-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Schedule a Consultation",
          buttonText: "Contact Us",
          labels: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Business Email",
            company: "Company",
            phone: "Phone",
            message: "Project Requirements"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f1f5f9",
          padding: "100px 48px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-corporate-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "InnovateCorp",
          copyright: "© 2024 InnovateCorp Solutions Inc. All rights reserved.",
          links: [
            {
              title: "Solutions",
              items: ["Digital Transformation", "Cloud Services", "Data Analytics", "Cybersecurity", "Custom Development"]
            },
            {
              title: "Industries",
              items: ["Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Government"]
            },
            {
              title: "Company",
              items: ["About", "Leadership", "Careers", "News", "Investors", "Contact"]
            },
            {
              title: "Resources",
              items: ["Blog", "Whitepapers", "Webinars", "Case Studies", "Documentation", "Support"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          padding: "80px 48px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Real Estate Agency",
    elements: [
      {
        id: "template-realestate-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "Prime Properties",
          logoSrc: "https://picsum.photos/40/40?random=7",
          links: [
            { text: "Buy", href: "#buy" },
            { text: "Sell", href: "#sell" },
            { text: "Rent", href: "#rent" },
            { text: "Neighborhoods", href: "#neighborhoods" }
          ],
          buttonText: "Free Valuation",
          buttonHref: "#valuation"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px 32px",
          margin: "0px",
          boxShadow: "0 2px 4px -1px rgb(0 0 0 / 0.1)",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-realestate-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Find Your Dream Home",
          subtitle: "Luxury properties in premium locations. Expert guidance through every step of your real estate journey.",
          cta: "Browse Properties",
          ctaHref: "#properties"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0c4a6e",
          backgroundImage: "linear-gradient(rgba(12, 74, 110, 0.9), rgba(12, 74, 110, 0.9)), url('https://picsum.photos/1600/900?random=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "140px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-realestate-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Property Search",
            desc: "Advanced search tools to find your perfect home based on location, price, and amenities."
          },
          {
            title: "Market Analysis",
            desc: "Comprehensive market reports and valuation tools for buyers and sellers."
          },
          {
            title: "Expert Agents",
            desc: "Experienced real estate professionals with local market knowledge."
          },
          {
            title: "Financing Help",
            desc: "Assistance with mortgage pre-approval and financing options."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-realestate-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=61",
            "https://picsum.photos/400/300?random=62",
            "https://picsum.photos/400/300?random=63",
            "https://picsum.photos/400/300?random=64",
            "https://picsum.photos/400/300?random=65",
            "https://picsum.photos/400/300?random=66"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-realestate-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## For Buyers\n\n### Our Process\n1. **Initial Consultation** - Understand your needs and budget\n2. **Property Search** - Curated selection based on criteria\n3. **Viewings** - Schedule and attend property tours\n4. **Offer & Negotiation** - Expert guidance on pricing\n5. **Closing** - Assistance through final steps\n\n### Financing Options\n- Traditional mortgages\n- FHA/VA loans\n- Jumbo loans\n- Investment property financing",
          right: "## For Sellers\n\n### Maximize Your Sale Price\n- **Market Analysis** - Determine optimal listing price\n- **Professional Photography** - High-quality marketing materials\n- **Virtual Tours** - Reach buyers remotely\n- **Strategic Marketing** - Targeted advertising campaigns\n- **Open Houses** - Showcase your property\n- **Negotiation** - Get the best possible offer\n\n### Average Results\nOur clients typically sell for **8-12% above** market average."
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          gap: "48px",
          color: "#111827"
        }
      },
      {
        id: "template-realestate-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Schedule a Consultation",
          buttonText: "Contact Agent",
          labels: {
            firstName: "Name",
            email: "Email",
            phone: "Phone",
            type: "Buying or Selling?",
            timeline: "Timeline",
            message: "Additional Information"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#0c4a6e",
          padding: "80px 32px",
          margin: "0px",
          color: "#ffffff"
        }
      },
      {
        id: "template-realestate-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "Prime Properties",
          copyright: "© 2024 Prime Properties Real Estate. All rights reserved.",
          links: [
            {
              title: "Properties",
              items: ["For Sale", "For Rent", "Recently Sold", "Open Houses", "New Listings"]
            },
            {
              title: "Services",
              items: ["Buy", "Sell", "Rent", "Property Management", "Mortgage Services"]
            },
            {
              title: "Company",
              items: ["About", "Agents", "Testimonials", "Careers", "Contact"]
            },
            {
              title: "Resources",
              items: ["Market Reports", "Neighborhood Guides", "Blog", "FAQ", "Glossary"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#1e293b",
          color: "#cbd5e1",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Health & Wellness",
    elements: [
      {
        id: "template-health-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "MindBody Wellness",
          logoSrc: "https://picsum.photos/40/40?random=8",
          links: [
            { text: "Services", href: "#services" },
            { text: "Practitioners", href: "#practitioners" },
            { text: "Classes", href: "#classes" },
            { text: "Blog", href: "#blog" }
          ],
          buttonText: "Book Appointment",
          buttonHref: "#book"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "24px 32px",
          margin: "0px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          position: "relative",
          color: "#111827",
          justifyContent: "space-between",
          alignItems: "center"
        }
      },
      {
        id: "template-health-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Holistic Health & Wellness",
          subtitle: "Integrative approach to health combining traditional wisdom with modern science. Nurturing mind, body, and spirit.",
          cta: "Explore Services",
          ctaHref: "#services"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#10b981",
          backgroundImage: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          padding: "140px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-health-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "Yoga & Meditation",
            desc: "Classes for all levels to improve flexibility, strength, and mental clarity."
          },
          {
            title: "Nutrition Counseling",
            desc: "Personalized nutrition plans to support your health goals and lifestyle."
          },
          {
            title: "Massage Therapy",
            desc: "Therapeutic massage to relieve stress, tension, and promote healing."
          },
          {
            title: "Acupuncture",
            desc: "Traditional Chinese medicine for pain relief and holistic wellness."
          },
          {
            title: "Mindfulness Coaching",
            desc: "One-on-one guidance to develop mindfulness practices for daily life."
          },
          {
            title: "Workshops",
            desc: "Educational workshops on various wellness topics and practices."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-health-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=70",
            "https://picsum.photos/400/300?random=71",
            "https://picsum.photos/400/300?random=72",
            "https://picsum.photos/400/300?random=73",
            "https://picsum.photos/400/300?random=74",
            "https://picsum.photos/400/300?random=75"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f0fdf4",
          padding: "80px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-health-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Our Philosophy\n\nWe believe true wellness comes from addressing the whole person—mind, body, and spirit. Our integrative approach combines:\n\n### Mind\n- Mindfulness practices\n- Stress reduction techniques\n- Cognitive wellness\n- Emotional balance\n\n### Body\n- Physical fitness\n- Nutritional health\n- Restorative therapies\n- Preventive care",
          right: "## What to Expect\n\n### Initial Consultation\nComprehensive assessment of your health history, goals, and lifestyle.\n\n### Personalized Plan\nCustomized wellness plan tailored to your specific needs and preferences.\n\n### Ongoing Support\nRegular check-ins and adjustments to ensure continued progress.\n\n### Community\nAccess to our wellness community for support and inspiration.\n\n### Results\nMost clients report significant improvements in energy, mood, and overall wellbeing within 4-6 weeks."
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          gap: "48px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-health-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Start Your Wellness Journey",
          buttonText: "Book Consultation",
          labels: {
            firstName: "Name",
            email: "Email",
            phone: "Phone",
            interest: "Area of Interest",
            goals: "Health Goals",
            message: "Additional Information"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f0fdf4",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827",
          borderTop: "1px solid #e5e7eb"
        }
      },
      {
        id: "template-health-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "MindBody Wellness",
          copyright: "© 2024 MindBody Wellness Center. All rights reserved.",
          links: [
            {
              title: "Services",
              items: ["Yoga", "Meditation", "Nutrition", "Massage", "Acupuncture", "Coaching"]
            },
            {
              title: "Schedule",
              items: ["Class Schedule", "Book Appointment", "Workshops", "Events", "Retreats"]
            },
            {
              title: "About",
              items: ["Our Team", "Philosophy", "Testimonials", "Blog", "Contact"]
            },
            {
              title: "Resources",
              items: ["Wellness Articles", "Recipes", "Meditation Guides", "FAQ", "Membership"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#064e3b",
          color: "#d1fae5",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  },
  {
    name: "Event Landing Page",
    elements: [
      {
        id: "template-event-navbar-1",
        type: ElementType.NAVBAR,
        content: JSON.stringify({
          brand: "Tech Summit 2024",
          logoSrc: "https://picsum.photos/40/40?random=9",
          links: [
            { text: "Schedule", href: "#schedule" },
            { text: "Speakers", href: "#speakers" },
            { text: "Sponsors", href: "#sponsors" },
            { text: "Venue", href: "#venue" }
          ],
          buttonText: "Get Tickets",
          buttonHref: "#tickets"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "24px 48px",
          margin: "0px",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "1000",
          color: "#ffffff",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(10px)"
        }
      },
      {
        id: "template-event-hero-1",
        type: ElementType.HERO,
        content: JSON.stringify({
          title: "Tech Summit 2024",
          subtitle: "Join industry leaders for 3 days of innovation, networking, and inspiration. The future of technology starts here.",
          cta: "Register Now",
          ctaHref: "#register"
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#4f46e5",
          backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          padding: "160px 32px 120px 32px",
          margin: "0px",
          textAlign: "center",
          color: "#ffffff"
        }
      },
      {
        id: "template-event-features-1",
        type: ElementType.FEATURES,
        content: JSON.stringify([
          {
            title: "50+ Speakers",
            desc: "Industry experts sharing insights on the latest trends and innovations."
          },
          {
            title: "3 Days",
            desc: "Comprehensive program with keynotes, workshops, and networking events."
          },
          {
            title: "1000+ Attendees",
            desc: "Connect with professionals, founders, and innovators from around the world."
          },
          {
            title: "15 Tracks",
            desc: "Specialized tracks covering AI, Web3, Cybersecurity, and more."
          }
        ], null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px",
          color: "#111827"
        }
      },
      {
        id: "template-event-twocol-1",
        type: ElementType.TWO_COL,
        content: JSON.stringify({
          left: "## Event Details\n\n### Date & Time\nNovember 15-17, 2024\n9:00 AM - 6:00 PM Daily\n\n### Location\nSan Francisco Convention Center\n747 Howard Street\nSan Francisco, CA 94103\n\n### Tickets\n- **Early Bird** (Until Oct 15): $299\n- **Regular**: $499\n- **VIP Pass**: $999\n- **Student**: $99 (ID Required)\n\n**Group discounts available for 5+ attendees.**",
          right: "## What to Expect\n\n### Keynote Sessions\nInspirational talks from industry leaders and visionaries.\n\n### Workshops\nHands-on sessions with practical skills and techniques.\n\n### Networking\nMultiple opportunities to connect with peers and potential collaborators.\n\n### Exhibition Hall\nExplore the latest products and services from leading companies.\n\n### After Parties\nEvening events for relaxed networking and socializing."
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#f8fafc",
          padding: "80px 32px",
          margin: "0px",
          gap: "48px",
          color: "#111827"
        }
      },
      {
        id: "template-event-gallery-1",
        type: ElementType.GALLERY,
        content: JSON.stringify({
          images: [
            "https://picsum.photos/400/300?random=80",
            "https://picsum.photos/400/300?random=81",
            "https://picsum.photos/400/300?random=82",
            "https://picsum.photos/400/300?random=83",
            "https://picsum.photos/400/300?random=84",
            "https://picsum.photos/400/300?random=85"
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "80px 32px",
          margin: "0px"
        }
      },
      {
        id: "template-event-contact-1",
        type: ElementType.CONTACT_FORM,
        content: JSON.stringify({
          title: "Register for Tech Summit 2024",
          buttonText: "Submit Registration",
          labels: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            company: "Company",
            ticketType: "Ticket Type",
            dietary: "Dietary Requirements"
          }
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#4f46e5",
          padding: "100px 32px",
          margin: "0px",
          color: "#ffffff"
        }
      },
      {
        id: "template-event-footer-1",
        type: ElementType.FOOTER,
        content: JSON.stringify({
          brand: "Tech Summit 2024",
          copyright: "© 2024 Tech Summit Conference. All rights reserved.",
          links: [
            {
              title: "Event",
              items: ["Schedule", "Speakers", "Sponsors", "Venue", "FAQs"]
            },
            {
              title: "Registration",
              items: ["Buy Tickets", "Group Rates", "Student Tickets", "Cancellation Policy"]
            },
            {
              title: "Connect",
              items: ["Twitter", "LinkedIn", "Instagram", "YouTube", "Slack"]
            },
            {
              title: "Contact",
              items: ["Email", "Phone", "Press", "Sponsorship", "Volunteer"]
            }
          ]
        }, null, 2),
        styles: {
          width: "100%",
          backgroundColor: "#1e1b4b",
          color: "#c7d2fe",
          padding: "80px 32px",
          margin: "0px"
        }
      }
    ]
  }
];