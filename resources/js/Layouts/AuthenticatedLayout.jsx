import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';

// --- Data (Navigation items with route names) ---
const navItems = [
    {
        name: 'Dashboard',
        items: [
            { name: 'Dashboard', routeName: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { name: 'Page', routeName: 'pages.index', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
			{ name: 'Setting', routeName: 'settings.index', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        ]
    },
    {
        name: 'Content Management',
        items: [
            { name: 'Tooltips', routeName: 'tooltips.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Theme', routeName: 'templates.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Frontpage', routeName: 'frontpages.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'Home Page Tooltips', routeName: 'hometooltips.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Landing Page', routeName: 'ezfunnellandingpage.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Defaultpage', routeName: 'defaultpages.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'All Funnels', routeName: 'ezfunnels.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            {
                name: 'Default Funnel',
                icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
                children: [
                    { name: 'Default Funnel', routeName: 'funnel-default.edit' },
                    { name: 'Default Ezui', routeName: 'funnel-ui.edit' },
                    { name: 'Default Ezlogo', routeName: 'funnel-logo.edit' },
                    { name: 'Default Ezseo', routeName: 'funnel-seo.edit' },
                ]
            },
            { name: 'Email Design', routeName: 'email-designs.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Emoji Markers', routeName: 'emojimarkers.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        ]
    },
    {
        name: 'Domain & Handle Management',
        items: [
            { name: 'Admindomain', routeName: 'admindomains.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Loadframes', routeName: 'loadframes.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Reserve Handle Brand', routeName: 'reserves.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Domain Transfer', routeName: 'domain-transfers.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        ]
    },
    {
        name: 'EZ$ Token Management',
        items: [
            { name: 'EZ$ Supply', routeName: 'token-info.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'EZ$ Reserve', routeName: 'reserve.dashboard', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'EZ$ Supply Adjustment', routeName: 'supply-adjustments.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'EZ$ Price History', routeName: 'price-history.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'EZ$ Incentives', routeName: 'incentives.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Price String', routeName: 'powerstrings.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        ]
    },
    {
        name: 'Transaction History',
        items: [
            { name: 'EZ$ Purchase History', routeName: 'point-purchases.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Handle Purchase History', routeName: 'handle-purchases.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'EZ$ Transaction History', routeName: 'token-transactions.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Handle Sell History', routeName: 'handle-sales.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Pending Transaction', routeName: 'pending-transfers.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Refund Transaction', routeName: 'refund-transfers.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Bee Transfers', routeName: 'bee-transfers.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        ]
    },
    {
        name: 'User & Promotional',
        items: [
            { name: 'User List', routeName: 'userlist.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Coupons', routeName: 'coupons.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'Coupon Usages', routeName: 'coupon-usages.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Promotion Messages', routeName: 'promotion-messages.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Promotions', routeName: 'promotions.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'All Incentive', routeName: 'incentive-history.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Wiki Pages', routeName: 'wikipages.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'FAQ', routeName: 'faqs.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Domain Transfer Rules', routeName: 'domain-transfer-rules.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Ai Frames', routeName: 'aiframes.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Slug Wall', routeName: 'ai-history.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Ai Setting', routeName: 'ai-settings.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { name: 'Ai Tooltip', routeName: 'ai-tooltips.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'Bio Scraping', routeName: 'bio-link-extractor.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'AI SEARCH RECORD', routeName: 'divination.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'AI NUMEROLOGY RECORD', routeName: 'numerology.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
			{ name: 'AI SEARCH KEYWORD', routeName: 'search-keywords.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        ]
    },
];

// --- Helper Components ---

/**
 * Renders an SVG icon from a path string.
 */
const Icon = ({ path, className = 'h-5 w-5' }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

/**
 * Reusable component for rendering sidebar navigation content.
 */
function SidebarContent({ LinkComponent }) {
    const { url } = usePage();
    const activeItemRef = useRef(null);
    const sidebarRef = useRef(null);
    
    // Helper function to get the actual URL from route name
    const getRouteUrl = (routeName) => {
        try {
            return route(routeName);
        } catch (e) {
            console.error(`Route "${routeName}" not found`);
            return '#';
        }
    };
    
    // Helper function to check if a route is active
    const isRouteActive = (routeName) => {
        if (!routeName) return false;
        
        try {
            // Get the current route name
            const currentRoute = route().current();
            
            // Check for exact match
            if (currentRoute === routeName) {
                return true;
            }
            
            // For resource routes like 'aiframes.index', also check for 'aiframes.create', 'aiframes.edit', etc.
            const baseResource = routeName.split('.')[0];
            
            // If current route starts with the base resource + dot, it's a match
            if (currentRoute && currentRoute.startsWith(baseResource + '.')) {
                return true;
            }
            
            // Also check URL path as a fallback
            const routeUrl = getRouteUrl(routeName);
            if (typeof routeUrl === 'string' && routeUrl !== '#') {
                if (url === routeUrl || url.startsWith(routeUrl + '/')) {
                    return true;
                }
            }
            
            return false;
        } catch (e) {
            return false;
        }
    };
    
    // Determine which dropdown should be open based on active child routes
    const getActiveDropdown = () => {
        for (const group of navItems) {
            for (const item of group.items) {
                if (item.children) {
                    if (item.children.some(child => isRouteActive(child.routeName))) {
                        return item.name;
                    }
                }
            }
        }
        return null;
    };

    const [openDropdown, setOpenDropdown] = useState(getActiveDropdown());

    const handleDropdownToggle = (itemName) => {
        setOpenDropdown(openDropdown === itemName ? null : itemName);
    };

    // Find the active menu item and scroll to it
    const findActiveMenuItem = () => {
        let activeId = null;
        let activeItemIndex = 0;
        let itemCounter = 0;
        
        for (const group of navItems) {
            for (const item of group.items) {
                itemCounter++;
                
                if (item.children) {
                    const hasActiveChild = item.children.some(child => isRouteActive(child.routeName));
                    if (hasActiveChild) {
                        activeId = `menu-item-${itemCounter}`;
                        activeItemIndex = itemCounter;
                        break;
                    }
                } else if (item.routeName && isRouteActive(item.routeName)) {
                    activeId = `menu-item-${itemCounter}`;
                    activeItemIndex = itemCounter;
                    break;
                }
            }
            if (activeId) break;
        }
        
        return { activeId, activeItemIndex };
    };
    
    // Auto-scroll to active menu item on mount and when URL changes
    useEffect(() => {
        setTimeout(() => {
            const { activeId } = findActiveMenuItem();
            
            if (activeId && activeItemRef.current) {
                const activeElement = activeItemRef.current;
                const sidebarElement = sidebarRef.current;
                
                if (sidebarElement && activeElement) {
                    const scrollTop = activeElement.offsetTop - (sidebarElement.clientHeight / 2) + (activeElement.clientHeight / 2);
                    
                    sidebarElement.scrollTo({
                        top: Math.max(0, scrollTop),
                        behavior: 'smooth'
                    });
                }
            }
        }, 100);
    }, [url]);

    let itemCounter = 0;

    return (
        <div ref={sidebarRef} className="flex flex-col flex-grow px-4 py-6 overflow-y-auto">
            <div className="space-y-4">
                {navItems.map((group) => (
                    <div key={group.name}>
                        <h3 className="px-3 text-xs font-semibold uppercase text-indigo-300 tracking-wider">
                            {group.name}
                        </h3>
                        <div className="mt-2 space-y-1">
                            {group.items.map((item) => {
                                itemCounter++;
                                
                                let isActive = false;
                                let hasActiveChild = false;
                                
                                if (item.children) {
                                    hasActiveChild = item.children.some(child => isRouteActive(child.routeName));
                                } else if (item.routeName) {
                                    isActive = isRouteActive(item.routeName);
                                }
                                
                                const menuItemId = `menu-item-${itemCounter}`;
                                const isItemActive = isActive || hasActiveChild;
                                
                                return item.children ? (
                                    <div key={item.name}>
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className={`group w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                hasActiveChild 
                                                    ? 'bg-indigo-600/50 text-white' 
                                                    : 'text-indigo-100 hover:text-white hover:bg-indigo-600/50'
                                            }`}
                                        >
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-colors duration-200 ${
                                                hasActiveChild 
                                                    ? 'bg-indigo-500/50' 
                                                    : 'bg-indigo-600/20 group-hover:bg-indigo-500/50'
                                            }`}>
                                                <Icon path={item.icon} className={`flex-shrink-0 h-5 w-5 ${
                                                    hasActiveChild ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                                                }`} />
                                            </span>
                                            <span className="flex-1 text-left">#{itemCounter} {item.name}</span>
                                            <svg
                                                className={`h-5 w-5 transform transition-transform duration-200 ${
                                                    openDropdown === item.name ? 'rotate-90' : ''
                                                } ${
                                                    hasActiveChild ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {openDropdown === item.name && (
                                            <div className="pl-9 pr-2 mt-1 space-y-1">
                                                {item.children.map((child, childIndex) => {
                                                    const isChildActive = isRouteActive(child.routeName);
                                                    const childUrl = getRouteUrl(child.routeName);
                                                    
                                                    return (
                                                        <LinkComponent
                                                            key={child.name}
                                                            href={childUrl}
                                                            active={isChildActive}
                                                            className="w-full block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            <span className={`${isChildActive ? 'text-white' : 'text-indigo-200 hover:text-white'}`}>
                                                                #{itemCounter}.{childIndex + 1} {child.name}
                                                            </span>
                                                            {isChildActive && (
                                                                <span className="ml-auto w-1.5 h-6 bg-white rounded-full inline-block"></span>
                                                            )}
                                                        </LinkComponent>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        key={item.name}
                                        id={menuItemId}
                                        ref={isItemActive ? activeItemRef : null}
                                    >
                                        <LinkComponent
                                            href={getRouteUrl(item.routeName)}
                                            active={isActive}
                                            className={`group w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-600/50 text-white'
                                                    : 'text-indigo-100 hover:text-white hover:bg-indigo-600/50'
                                            }`}
                                        >
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-colors duration-200 ${
                                                isActive
                                                    ? 'bg-indigo-500/50'
                                                    : 'bg-indigo-600/20 group-hover:bg-indigo-500/50'
                                            }`}>
                                                <Icon path={item.icon} className={`flex-shrink-0 h-5 w-5 ${
                                                    isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                                                }`} />
                                            </span>
                                            #{itemCounter} {item.name}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-6 bg-white rounded-full"></span>
                                            )}
                                        </LinkComponent>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * A dismissible, auto-hiding flash message component.
 */
function FlashMessage({ message, type = 'success' }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const baseClasses = 'px-4 py-3 rounded relative mb-4 flex items-center justify-between';
    const typeClasses = {
        success: 'bg-green-100 border border-green-400 text-green-700',
        error: 'bg-red-100 border border-red-400 text-red-700',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <span>{message}</span>
            <button onClick={() => setVisible(false)} className="ml-4 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-current">
                <Icon path="M6 18L18 6M6 6l12 12" className="h-4 w-4" />
            </button>
        </div>
    );
}

// --- Main Layout Component ---

export default function AuthenticatedLayout({ header, children }) {
    const { flash, auth } = usePage().props;
    const { url } = usePage();
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile sidebar on escape key press
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, []);

    // Helper function to get route URL
    const getRouteUrl = (routeName) => {
        try {
            return route(routeName);
        } catch (e) {
            return '#';
        }
    };

    // Helper function to check if a route is active (for breadcrumb)
    const isRouteActiveForBreadcrumb = (routeName) => {
        if (!routeName) return false;
        
        try {
            const currentRoute = route().current();
            
            if (currentRoute === routeName) {
                return true;
            }
            
            const baseResource = routeName.split('.')[0];
            if (currentRoute && currentRoute.startsWith(baseResource + '.')) {
                return true;
            }
            
            return false;
        } catch (e) {
            return false;
        }
    };

    // Memoize the breadcrumb calculation
    const breadcrumb = useMemo(() => {
        for (const group of navItems) {
            for (const item of group.items) {
                if (item.routeName) {
                    try {
                        if (isRouteActiveForBreadcrumb(item.routeName)) {
                            return { group: group.name, page: item.name };
                        }
                    } catch (e) {}
                }
                if (item.children) {
                    const activeChild = item.children.find(child => {
                        try {
                            return isRouteActiveForBreadcrumb(child.routeName);
                        } catch (e) {
                            return false;
                        }
                    });
                    if (activeChild) {
                        return { group: item.name, page: activeChild.name };
                    }
                }
            }
        }
        return { group: 'Dashboard', page: 'Overview' };
    }, [url]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 shadow-xl">
                    <div className="flex items-center justify-center h-20 px-4 bg-indigo-800">
                        <Link href="/" className="flex items-center space-x-2">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                            <span className="text-xl font-semibold text-white">ez.wiki</span>
                        </Link>
                    </div>
                    <SidebarContent LinkComponent={NavLink} />
                </div>
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-900/60" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="relative flex flex-col w-full max-w-xs bg-gradient-to-b from-indigo-700 to-indigo-800 shadow-xl transform transition-all duration-300 ease-in-out">
                        <div className="flex items-center justify-between h-20 px-4 bg-indigo-800">
                            <Link href="/" className="flex items-center space-x-2">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                                <span className="text-xl font-semibold text-white">ez.wiki</span>
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600/30 focus:outline-none transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Icon path="M6 18L18 6M6 6l12 12" className="h-6 w-6" />
                            </button>
                        </div>
                        <SidebarContent LinkComponent={ResponsiveNavLink} />
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top navigation */}
                <div className="bg-white border-b border-gray-200/70 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200 md:hidden"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Icon path="M4 6h16M4 12h16M4 18h16" className="h-6 w-6" />
                            </button>
                            <div className="hidden md:block ml-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>{breadcrumb.group}</span>
                                    <svg className="mx-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">{breadcrumb.page}</span>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">View notifications</span>
                                <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="h-6 w-6" />
                            </button>
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-indigo-100"
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                                                alt={user.name}
                                            />
                                            <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                                            <svg className="ml-1 h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" width="48">
                                        <Dropdown.Link href={getRouteUrl('profile.edit')} className="text-gray-700 hover:bg-indigo-50">
                                            <div className="flex items-center">
                                                <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={getRouteUrl('logout')} method="post" as="button" className="text-gray-700 hover:bg-indigo-50 w-full text-left">
                                            <div className="flex items-center">
                                                <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="mr-2 h-4 w-4" />
                                                <span>Log Out</span>
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto bg-gray-50/50">
                    {header && (
                        <header className="bg-white shadow-sm">
                            <div className="px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <main className="overflow-y-auto">
                        <div className="px-4 py-5 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {flash?.success && <FlashMessage message={flash.success} type="success" key={Date.now()} />}
                            {flash?.error && <FlashMessage message={flash.error} type="error" key={Date.now()} />}
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}