/**
 * Clean Google Search - Content Filters Module
 * Responsible for applying CSS data attributes and performing targeted DOM filtering.
 *
 * SAFETY GUARANTEES:
 * 1. Absolute protection for core containers (#search, #rso, #center_col, #rhs, #gb).
 * 2. Never hides elements containing multiple organic search results (div.g > 1).
 * 3. Never hides Wikipedia Knowledge Panels (#rhs about card with wikipedia.org link).
 */

window.CleanSearch = window.CleanSearch || {};

(() => {
    'use strict';

    // IDs that must NEVER be hidden under any circumstances
    const NEVER_HIDE_IDS = new Set([
        'search',
        'rso',
        'rcnt',
        'center_col',
        'rhs',
        'cnt',
        'main',
        'appbar',
        'topstuff',
        'botstuff'
    ]);

    /**
     * Set data attributes on <html> to immediately trigger CSS rules without layout flicker.
     * @param {Object} settings - Current active settings
     */
    CleanSearch.syncDomAttributes = function(settings) {
        const root = document.documentElement;
        if (!root) return;

        const isEnabled = Boolean(settings.enabled);
        root.dataset.cleanEnabled = isEnabled ? 'true' : 'false';
        root.dataset.cleanHideAi = (isEnabled && settings.hideAi) ? 'true' : 'false';
        root.dataset.cleanHideNews = (isEnabled && settings.hideNews) ? 'true' : 'false';
        root.dataset.cleanHideSocial = (isEnabled && settings.hideSocial) ? 'true' : 'false';
        root.dataset.cleanHideRelated = (isEnabled && settings.hideRelated) ? 'true' : 'false';
        root.dataset.cleanHideShorts = (isEnabled && settings.hideShorts) ? 'true' : 'false';
        root.dataset.cleanHideAds = (isEnabled && settings.hideAds) ? 'true' : 'false';
    };

    /**
     * Safely hide an element while rigorously respecting organic results & Wikipedia knowledge panels.
     * GUARANTEE: Never hides an organic search result (div.g) or any container holding organic results.
     * @param {Element} el - DOM element to hide
     */
    CleanSearch.hideElement = function(el) {
        if (!el || CleanSearch.isProtected(el)) return;

        // Never hide main structural containers
        if (NEVER_HIDE_IDS.has(el.id)) return;

        // STRICT GUARANTEE: Never hide an organic search result (div.g) or any container holding organic results
        if (el.matches && el.matches('div.g')) return;
        if (el.querySelector && el.querySelector('div.g')) return;

        // Never hide the Wikipedia Knowledge Panel
        if (el.querySelector && el.querySelector('a[href*="wikipedia.org"]')) {
            return;
        }

        el.style.setProperty('display', 'none', 'important');
    };

    /**
     * Find top-level result block in search hierarchy to cleanly hide an AI/News module.
     * Strictly verifies that the block does not contain ANY organic results (div.g) or Wikipedia.
     *
     * @param {Element} startNode - Node matching a distraction signature
     * @returns {Element|null} - The top-level result block container
     */
    function getTopResultBlock(startNode) {
        if (!startNode || CleanSearch.isProtected(startNode)) return null;

        // Abort immediately if startNode is inside an organic result
        if (startNode.closest && startNode.closest('div.g')) return null;

        let curr = startNode;
        while (curr && curr.parentElement) {
            const p = curr.parentElement;
            const pId = p.id;

            // Stop at main results list container (#rso or #center_col)
            if (pId === 'rso' || pId === 'center_col') {
                if (curr.querySelectorAll('div.g').length === 0 && !curr.querySelector('a[href*="wikipedia.org"]')) {
                    return curr;
                }
                return null;
            }

            // Google section wrapper
            if (curr.tagName.toLowerCase() === 'g-section-with-header') {
                if (curr.querySelectorAll('div.g').length === 0) {
                    return curr;
                }
                return null;
            }

            curr = p;
        }

        const candidate = startNode.closest('g-section-with-header, div[data-hveid]') || startNode;
        if (candidate.matches('div.g') || candidate.querySelector('div.g') || candidate.querySelector('a[href*="wikipedia.org"]')) {
            return null;
        }
        return candidate;
    }

    /**
     * Immediate synchronous scan specifically for AI Overview elements during streaming mutations.
     * Eliminates any visible delay/flash as Google injects the AI card.
     * @param {Object} settings - Current active settings
     */
    CleanSearch.runFastAiCleanup = function(settings) {
        if (!settings.enabled || !settings.hideAi) return;

        const aiDirect = document.querySelectorAll(
            '#aim, #m-x-content, #super-overview, #Odp5De, #eKIzJc, .hdzaWe, .M8OgIe, .GcKpu, .YzCcne, .WAUd4, .OZ9ddf, [jsname="cUzNTd"], ' +
            'div[data-attrid="AIOverview"], div[data-attrid="ai_overview"], div[data-attrid="wa:/description"], ' +
            'div[data-async-type="folsrch"], div[id^="folsrch"], a[href*="p=ai_overviews"]'
        );
        aiDirect.forEach((el) => {
            const block = getTopResultBlock(el);
            if (block) CleanSearch.hideElement(block);
        });
    };

    /**
     * Find the target container for "People also search for" without touching Wikipedia summary.
     * @param {Element} startNode - Node matching PASF heading or signature
     * @returns {Element|null} - The PASF container block
     */
    function getPasfBlock(startNode) {
        if (!startNode || CleanSearch.isProtected(startNode)) return null;

        let curr = startNode;
        let target = startNode;

        while (curr && curr.parentElement && curr.parentElement !== document.body) {
            const p = curr.parentElement;

            // Stop at major column boundaries
            if (p.id === 'rhs' || p.id === 'center_col' || p.id === 'rso') {
                if (!curr.querySelector('a[href*="wikipedia.org"]')) {
                    return curr;
                }
                break;
            }

            // If parent contains the Wikipedia link, curr is the sub-module inside the Knowledge Card
            if (p.querySelector('a[href*="wikipedia.org"]')) {
                if (!curr.querySelector('a[href*="wikipedia.org"]')) {
                    return curr;
                }
                break;
            }

            // Module boundary heuristics
            if (
                curr.classList.contains('mod') ||
                curr.classList.contains('oIk2Cb') ||
                (curr.id && curr.id.startsWith('eob_')) ||
                curr.tagName.toLowerCase() === 'g-section-with-header'
            ) {
                target = curr;
            }

            curr = p;
        }

        return (target && !target.querySelector('a[href*="wikipedia.org"]')) ? target : null;
    }

    /**
     * Remove divider lines (<hr>, separators, border-bottom) preceding or adjacent to a removed block.
     * @param {Element} block - The element being removed
     */
    function removeDividersAround(block) {
        if (!block || !block.parentElement) return;

        // Clean up preceding sibling dividers
        let prev = block.previousElementSibling;
        while (prev) {
            const tag = prev.tagName.toLowerCase();
            const isDivider =
                tag === 'hr' ||
                prev.getAttribute('role') === 'separator' ||
                prev.classList.contains('divider') ||
                (prev.offsetHeight <= 4 && prev.offsetWidth > 20);

            if (isDivider) {
                prev.style.setProperty('display', 'none', 'important');
                prev = prev.previousElementSibling;
            } else {
                // If it's the preceding content block (e.g. Wikipedia snippet), strip its bottom border
                prev.style.setProperty('border-bottom', 'none', 'important');
                break;
            }
        }

        // Clean up any remaining <hr> or separators in the same container card
        const parent = block.parentElement;
        if (parent && parent.id !== 'rhs') {
            parent.querySelectorAll('hr, [role="separator"]').forEach((sep) => {
                sep.style.setProperty('display', 'none', 'important');
            });
        }
    }

    /**
     * Force Google "Web" mode (&udm=14) if enabled, without loop or breaking other tabs.
     * @param {Object} settings - Current active settings
     */
    CleanSearch.handleForceWeb = function(settings) {
        if (!settings.enabled || !settings.forceWeb) return;

        try {
            const url = new URL(window.location.href);
            if (url.pathname === '/search' && url.searchParams.has('q')) {
                // Do not redirect if user intentionally opened Images (tbm=isch), Videos, etc.
                if (url.searchParams.has('tbm')) return;

                const udm = url.searchParams.get('udm');
                if (udm !== '14') {
                    // Do not override other specific udm values if already present
                    if (udm && udm !== '') return;
                    url.searchParams.set('udm', '14');
                    window.location.replace(url.toString());
                }
            }
        } catch {
            // Silently ignore any parsing anomalies
        }
    };

    /**
     * Dynamic DOM cleanup for items requiring contextual, structural, or text checks.
     * Surgically targets distractions while strictly preserving organic results and Wikipedia cards.
     *
     * @param {Object} settings - Current active settings
     */
    CleanSearch.runDynamicCleanup = function(settings) {
        if (!settings.enabled) return;

        // 1. Navigation bar tabs (AI Mode, News, Short videos)
        if (settings.hideAi || settings.hideNews || settings.hideShorts) {
            const navTabs = document.querySelectorAll('div[role="navigation"] a, div[role="listitem"] a, div[role="tab"] a, li a');
            navTabs.forEach((tab) => {
                if (CleanSearch.isProtected(tab)) return;
                const text = tab.textContent.trim().toLowerCase();
                const href = tab.getAttribute('href') || '';
                const container = tab.closest('div[role="listitem"], div[role="tab"], li') || tab;

                if (settings.hideAi && (text.includes('ai mode') || tab.matches('[aria-label*="AI Mode" i]') || href.includes('udm=50'))) {
                    CleanSearch.hideElement(container);
                }
                if (settings.hideNews && (text === 'news' || tab.matches('a[href*="tbm=nws"], a[href*="udm=12"]'))) {
                    CleanSearch.hideElement(container);
                }
                if (settings.hideShorts && (text.includes('short video') || tab.matches('[aria-label*="Short video" i]'))) {
                    CleanSearch.hideElement(container);
                }
            });
        }

        // 2. AI Overview Scanner (Surgical: matches #m-x-content, AIOverview attributes, and AI Overview heading)
        if (settings.hideAi) {
            // Direct attribute / ID match for AI Overview
            const aiDirect = document.querySelectorAll(
                '#aim, #m-x-content, #super-overview, #Odp5De, #eKIzJc, .hdzaWe, .M8OgIe, .GcKpu, .YzCcne, .WAUd4, .OZ9ddf, [jsname="cUzNTd"], ' +
                'div[data-attrid="AIOverview"], div[data-attrid="ai_overview"], div[data-attrid="wa:/description"], ' +
                'div[aria-label="AI Overview"], div[aria-label="AI overview"], div[aria-label*="AI Overview" i], ' +
                'div[data-async-type="folsrch"], div[id^="folsrch"], a[href*="p=ai_overviews"]'
            );
            aiDirect.forEach((el) => {
                const block = getTopResultBlock(el);
                if (block) CleanSearch.hideElement(block);
            });

            // Heading match inside #rso & #center_col
            const aiHeadings = document.querySelectorAll(
                '#rso h1, #rso h2, #rso h3, #rso h4, #rso div[role="heading"], #rso span, ' +
                '#center_col h1, #center_col h2, #center_col div[role="heading"]'
            );
            aiHeadings.forEach((h) => {
                if (CleanSearch.isProtected(h)) return;
                const text = h.textContent.trim().toLowerCase();

                if (text.length > 0 && text.length < 50) {
                    if (text === 'ai overview' || text.startsWith('ai overview')) {
                        const block = getTopResultBlock(h);
                        if (block) CleanSearch.hideElement(block);
                    }
                }
            });
        }

        // 3. News & Top Stories Scanner ("Top stories", "Also in the news", hero news cards)
        if (settings.hideNews) {
            const headings = document.querySelectorAll(
                '#center_col h2, #center_col h3, #center_col div[role="heading"], g-section-with-header'
            );
            headings.forEach((heading) => {
                if (CleanSearch.isProtected(heading)) return;
                const text = heading.textContent.trim().toLowerCase();

                if (text.includes('top stories') || text.includes('also in the news') || text.includes('more news')) {
                    const block = getTopResultBlock(heading) || heading.closest('g-section-with-header');
                    if (block) CleanSearch.hideElement(block);
                }
            });

            // Hero side news cards (Goal.com, CNN next to stats)
            const heroCards = document.querySelectorAll('#center_col div[data-attrid="media_result"]');
            heroCards.forEach((card) => {
                CleanSearch.hideElement(card);
            });
        }

        // 4. Social Discussions & Forums ("What people are saying", Reddit threads)
        if (settings.hideSocial) {
            const socialHeadings = document.querySelectorAll(
                '#center_col h2, #center_col h3, #center_col div[role="heading"]'
            );
            socialHeadings.forEach((h) => {
                if (CleanSearch.isProtected(h)) return;
                const text = h.textContent.trim().toLowerCase();

                if (
                    text.includes('what people are saying') ||
                    text.includes('discussions and forums') ||
                    text.includes('trending posts and discussions')
                ) {
                    const block = getTopResultBlock(h) || h.closest('g-section-with-header');
                    if (block) CleanSearch.hideElement(block);
                }
            });
        }

        // 5. Profiles & "People also search for" in Right Column (#rhs) & Search Results
        // STRICT: Preserves Wikipedia Knowledge Panel (never hides main about card)
        if (settings.hideRelated) {
            // A. Remove Knowledge Panel divider lines & borders globally in #rhs
            const rhsDividers = document.querySelectorAll('#rhs hr, #rhs [role="separator"]');
            rhsDividers.forEach((div) => {
                div.style.setProperty('display', 'none', 'important');
            });

            // Strip bottom & top borders from Wikipedia description cards in #rhs
            const wikiLinks = document.querySelectorAll('#rhs a[href*="wikipedia.org"]');
            wikiLinks.forEach((wLink) => {
                let p = wLink.parentElement;
                for (let i = 0; i < 5; i++) {
                    if (!p || p.id === 'rhs') break;
                    p.style.setProperty('border-bottom', 'none', 'important');
                    p.style.setProperty('border-top', 'none', 'important');
                    p = p.parentElement;
                }
            });

            // Strip divider borders from internal modules in #rhs
            const kpMods = document.querySelectorAll('#rhs .kp-blk .mod, #rhs .kp-blk div[data-attrid]');
            kpMods.forEach((m) => {
                m.style.setProperty('border-bottom', 'none', 'important');
                m.style.setProperty('border-top', 'none', 'important');
            });

            // B. Direct class & attribute matches for "People also search for"
            const pasfDirect = document.querySelectorAll(
                '.oIk2Cb, [id^="eob_"], div[data-attrid*="also_searched_for"], div[data-attrid*="kc:/common/topic:also_searched_for"]'
            );
            pasfDirect.forEach((el) => {
                const block = getPasfBlock(el);
                if (block) {
                    removeDividersAround(block);
                    CleanSearch.hideElement(block);
                }
            });

            // C. Text-based scan for "People also search for" across heading & label elements
            const headingCandidates = document.querySelectorAll(
                '#rhs h2, #rhs h3, #rhs h4, #rhs h5, #rhs [role="heading"], #rhs span, #rhs div, ' +
                '#center_col h2, #center_col h3, #center_col h4, #center_col [role="heading"]'
            );
            headingCandidates.forEach((h) => {
                if (CleanSearch.isProtected(h)) return;
                const text = h.textContent.trim().toLowerCase();

                // Only evaluate concise headings/labels to avoid targeting outer wrapper text
                if (text.length > 0 && text.length < 80) {
                    if (
                        text === 'people also search for' ||
                        text.startsWith('people also search for') ||
                        text.includes('people also search for') ||
                        text.includes('people always search for')
                    ) {
                        const block = getPasfBlock(h);
                        if (block) {
                            removeDividersAround(block);
                            CleanSearch.hideElement(block);
                        }
                    }

                    // Profiles sub-module in #rhs
                    if (text === 'profiles' || text.startsWith('profiles')) {
                        const subBlock = h.closest('div[data-attrid], div[jscontroller], div[data-hveid]') || h.parentElement;
                        if (subBlock && subBlock.id !== 'rhs' && !subBlock.querySelector('a[href*="wikipedia.org"]')) {
                            removeDividersAround(subBlock);
                            CleanSearch.hideElement(subBlock);
                        }
                    }
                }
            });

            // D. Direct attribute matches for Profiles in #rhs
            const profileBoxes = document.querySelectorAll('#rhs div[data-attrid*="profiles"], #rhs div[data-attrid*="social_media_presence"]');
            profileBoxes.forEach((box) => {
                if (!box.querySelector('a[href*="wikipedia.org"]')) {
                    removeDividersAround(box);
                    CleanSearch.hideElement(box);
                }
            });
        }
    };
})();
