/**
 * Clean Google Search - Keyboard Navigation Module
 * Enables Vim-like (j/k) and arrow navigation across organic Google search results.
 */

window.CleanSearch = window.CleanSearch || {};

(() => {
    'use strict';

    let activeLinkIndex = -1;

    /**
     * Query all visible, organic search result link anchors.
     * Compatible with modern (<a href><h3/></a>) and legacy (<h3><a href/></h3>) structures.
     * Excludes protected account navigation, Google tools, and search inputs.
     *
     * @returns {HTMLAnchorElement[]} - Array of visible organic link elements
     */
    function getOrganicResultLinks() {
        const headings = document.querySelectorAll('#search h3, #rso h3, #center_col h3');
        const links = [];
        const seenUrls = new Set();

        headings.forEach((h3) => {
            if (CleanSearch.isProtected(h3)) return;

            // Anchor can be parent of h3 or inside h3
            const anchor = h3.closest('a') || h3.querySelector('a');
            if (!anchor || !anchor.href) return;

            // Filter out internal, account, or non-http links
            if (
                !anchor.href.startsWith('http') ||
                anchor.href.includes('google.com/search') ||
                anchor.href.includes('accounts.google.com')
            ) {
                return;
            }

            // Verify visibility
            if (anchor.offsetParent === null) return;

            if (!seenUrls.has(anchor.href)) {
                seenUrls.add(anchor.href);
                links.push(anchor);
            }
        });

        return links;
    }

    /**
     * Update visual keyboard highlight and scroll smoothly to target.
     * @param {HTMLAnchorElement[]} links - Active list of links
     */
    function updateLinkFocus(links) {
        links.forEach((l) => l.classList.remove('clean-search-active-link'));
        const current = links[activeLinkIndex];
        if (current) {
            current.classList.add('clean-search-active-link');
            current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            current.focus({ preventScroll: true });
        }
    }

    /**
     * Clear current keyboard navigation focus.
     */
    function clearFocus() {
        activeLinkIndex = -1;
        document.querySelectorAll('.clean-search-active-link').forEach((el) => {
            el.classList.remove('clean-search-active-link');
        });
    }

    /**
     * Initialize keyboard navigation event listeners.
     * @param {Function} getSettings - Function returning current settings object
     */
    CleanSearch.initKeyboardNav = function(getSettings) {
        window.addEventListener('keydown', (e) => {
            const settings = getSettings();
            if (!settings.enabled || !settings.keyNav) return;

            // Do not capture keys if user is typing in an input field, search box, or editable area
            const activeTag = document.activeElement ? document.activeElement.tagName.toUpperCase() : '';
            if (['INPUT', 'TEXTAREA'].includes(activeTag) || (document.activeElement && document.activeElement.isContentEditable)) {
                return;
            }

            // Ignore modified keys (e.g. Ctrl+J, Alt+J) except for Enter with modifiers
            if ((e.ctrlKey || e.metaKey || e.altKey) && e.key !== 'Enter') {
                return;
            }

            const links = getOrganicResultLinks();
            if (!links.length) return;

            if (e.key === 'j') {
                e.preventDefault();
                activeLinkIndex = Math.min(activeLinkIndex + 1, links.length - 1);
                updateLinkFocus(links);
            } else if (e.key === 'k') {
                e.preventDefault();
                activeLinkIndex = Math.max(activeLinkIndex - 1, 0);
                updateLinkFocus(links);
            } else if (e.key === 'Enter' && activeLinkIndex >= 0 && activeLinkIndex < links.length) {
                if (e.ctrlKey || e.metaKey) {
                    // Open in background / new tab
                    window.open(links[activeLinkIndex].href, '_blank');
                } else {
                    links[activeLinkIndex].click();
                }
            } else if (e.key === 'Escape') {
                clearFocus();
            }
        });
    };
})();
