/**
 * Clean Google Search - Popup Controller
 * Manages user preferences and synchronization with chrome.storage.sync.
 */

const DEFAULT_SETTINGS = {
    enabled: true,
    forceWeb: false,
    hideAi: true,
    hideNews: true,
    hideSocial: true,
    hideRelated: true,
    hideShorts: true,
    hideAds: true,
    keyNav: true
};

const settingKeys = Object.keys(DEFAULT_SETTINGS);

function updateStatusBadge(isEnabled) {
    const badge = document.getElementById('statusBadge');
    const text = document.getElementById('statusText');
    if (!badge || !text) return;

    if (isEnabled) {
        badge.classList.remove('disabled');
        text.textContent = 'Active';
    } else {
        badge.classList.add('disabled');
        text.textContent = 'Paused';
    }
}

function applySettingsToUI(settings) {
    settingKeys.forEach((key) => {
        const input = document.getElementById(key);
        if (input) {
            input.checked = Boolean(settings[key]);
        }
    });

    updateStatusBadge(settings.enabled);
}

function initializePopup() {
    // 1. Load current settings from sync storage
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        applySettingsToUI(settings);

        // 2. Attach change listeners to every toggle input
        settingKeys.forEach((key) => {
            const input = document.getElementById(key);
            if (input) {
                input.addEventListener('change', () => {
                    const updatedValue = input.checked;

                    // Update storage
                    chrome.storage.sync.set({ [key]: updatedValue }, () => {
                        if (key === 'enabled') {
                            updateStatusBadge(updatedValue);
                        }
                    });
                });
            }
        });
    });

    // 3. Reset to Defaults button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
                applySettingsToUI(DEFAULT_SETTINGS);
            });
        });
    }
}

// Start popup logic once DOM is ready
document.addEventListener('DOMContentLoaded', initializePopup);
