/**
 * Clean Google Search - Content Script Orchestrator
 * Coordinates storage state, DOM observer, filters, and keyboard navigation.
 */

(() => {
    'use strict';

    let currentSettings = { ...CleanSearch.DEFAULT_SETTINGS };
    let debounceTimer = null;

    /**
     * Debounced cleanup callback for MutationObserver.
     */
    function scheduleDynamicCleanup() {
        if (debounceTimer) cancelAnimationFrame(debounceTimer);
        debounceTimer = requestAnimationFrame(() => {
            CleanSearch.runDynamicCleanup(currentSettings);
        });
    }

    /**
     * MutationObserver monitoring streaming results and infinite scroll.
     */
    const observer = new MutationObserver(() => {
        // Immediate synchronous sweep for AI overview to prevent any visible delay/flash
        if (currentSettings.enabled && currentSettings.hideAi) {
            CleanSearch.runFastAiCleanup(currentSettings);
        }
        scheduleDynamicCleanup();
    });

    /**
     * Initialize extension lifecycle.
     */
    function init() {
        // Apply default dataset attributes immediately to prevent flash of content
        CleanSearch.syncDomAttributes(currentSettings);

        // Load persisted settings from Chrome sync storage
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.get(CleanSearch.DEFAULT_SETTINGS, (saved) => {
                currentSettings = { ...CleanSearch.DEFAULT_SETTINGS, ...saved };
                CleanSearch.syncDomAttributes(currentSettings);
                CleanSearch.handleForceWeb(currentSettings);
                CleanSearch.runDynamicCleanup(currentSettings);
            });

            // Listen for popup setting toggles in real time
            chrome.storage.onChanged.addListener((changes) => {
                for (const key in changes) {
                    if (key in currentSettings) {
                        currentSettings[key] = changes[key].newValue;
                    }
                }
                CleanSearch.syncDomAttributes(currentSettings);
                CleanSearch.handleForceWeb(currentSettings);
                CleanSearch.runDynamicCleanup(currentSettings);
            });
        }

        // Start observing DOM mutations
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Run cleanup on key lifecycle checkpoints for dynamic Google hydration
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                CleanSearch.runDynamicCleanup(currentSettings);
            });
        }
        window.addEventListener('load', () => {
            CleanSearch.runDynamicCleanup(currentSettings);
        });

        // Initialize keyboard navigation
        CleanSearch.initKeyboardNav(() => currentSettings);
    }

    // Launch
    init();
})();