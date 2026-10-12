/**
 * Clean Google Search - Configuration & Constants
 * Defines default settings, protected selectors, and safety utilities.
 */

window.CleanSearch = window.CleanSearch || {};

(() => {
    'use strict';

    // Default extension settings
    CleanSearch.DEFAULT_SETTINGS = {
        enabled: true,         // Master Switch
        forceWeb: false,       // Force "Web" mode (&udm=14)
        hideAi: true,          // Remove AI Overview & AI tabs
        hideNews: true,        // Remove News & Top stories
        hideSocial: true,      // Remove Social Discussions / Forums
        hideRelated: true,     // Remove "People Also Search For" & Profiles
        hideShorts: true,      // Remove Video / Shorts Reels
        hideAds: true,         // Remove Sponsored Ads
        keyNav: true           // Keyboard Navigation (j/k)
    };

    /**
     * Protected Selectors
     * Elements matching these are CRITICAL and must NEVER be touched, hidden, or modified:
     * - #gb: Google Bar (Google Account avatar, name, waffle launcher)
     * - [aria-label*="settings"]: Quick Settings gear button and Settings drawer
     * - [role="dialog"], [role="menu"]: Menus, dropdowns, and settings dialogs
     * - #searchform, #tsf: Google Search input form
     * - #c-b-p: Quick settings side panel
     * - #hdtb-tls, #hdtbMenus: Search tools buttons and dropdowns
     */
    CleanSearch.PROTECTED_SELECTORS = [
        '#gb',
        'header',
        '#searchform',
        '#tsf',
        '[role="banner"]',
        '[role="dialog"]',
        '[role="menu"]',
        '[aria-label*="settings" i]',
        '[aria-label*="Quick settings" i]',
        '[aria-label*="Search settings" i]',
        '#c-b-p',
        '#hdtb-tls',
        '#hdtbMenus'
    ].join(', ');

    /**
     * Absolute safety check to verify if a node is protected.
     * Prevents any accidental interference with Google account or top settings buttons.
     *
     * @param {Element} node - DOM element to check
     * @returns {boolean} - True if protected, false otherwise
     */
    CleanSearch.isProtected = function(node) {
        if (!node || node === document.body || node === document.documentElement) {
            return true;
        }

        // Check if node itself or any parent matches protected selectors
        try {
            return Boolean(node.closest(CleanSearch.PROTECTED_SELECTORS));
        } catch {
            return false;
        }
    };
})();
