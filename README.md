# 🔍 Clean Google Search

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Privacy: Zero Telemetry](https://img.shields.io/badge/Privacy-Zero%20Telemetry-green.svg)](#-privacy--safety-guarantee)
[![Account Safe](https://img.shields.io/badge/Google%20Account-100%25%20Safe-brightgreen.svg)](#-privacy--safety-guarantee)

A fast, lightweight, and distraction-free browser extension for Google Search. Eliminates AI Overviews, sponsored ads, news carousels, and social widgets while keeping your Google account, top settings gear, and navigation completely untouched.

---

## ✨ Features

- **⚡ Zero-Flicker Filtering**: Uses CSS-driven attribute rules applied at `document_start` so unwanted widgets never flash on screen.
- **🎛️ Master Switch**: Pause or resume the entire extension instantly with a single click.
- **🤖 AI Overview Removal**: Hides AI Overviews, summary boxes, and top-bar "AI Mode" tabs.
- **🚫 Sponsored Ads Filter**: Removes top and bottom paid advertisements and commercial shopping units.
- **📰 News & Top Stories Filter**: Hides story carousels, "Also in the news" sections, and side hero cards.
- **💬 Social Discussions & Forums**: Removes Reddit/forum "What people are saying" boxes.
- **👥 "People Also Search For" & Profiles**: Cleans out related query carousels and social profile links.
- **🎬 Short Videos & Reels**: Removes TikTok and YouTube Shorts carousel grids.
- **🌐 Web-Only Mode (`&udm=14`)**: Optional toggle to load Google's classic text-only web results automatically.
- **⌨️ Keyboard Navigation**: Vim-style navigation (`j`/`k`) to quickly browse and open organic search results.

---

## 🔒 Privacy & Safety Guarantee

Your Google Account and Settings are **100% safe and unaffected**:

1. **Zero Dangerous Permissions**: Only requests `"storage"` to save your toggle settings. Does **not** request `cookies`, `webRequest`, `identity`, or background server access.
2. **Zero Telemetry / Zero Network Requests**: Runs entirely offline in your browser. No queries, user data, or tokens are ever collected or transmitted.
3. **Protected Google Bar (`#gb`)**: Your Google account avatar, username, Google apps waffle menu, and account switcher are strictly isolated and never touched.
4. **Protected Quick Settings Gear**: The Google Settings gear button at top right, as well as the Search Settings slide-out drawer, dialogs, and tools dropdowns (`#hdtbMenus`), are guarded by explicit exclusion rules in both CSS and JavaScript.
5. **Non-Destructive Styling**: Uses display styling rather than deleting DOM nodes, preventing Google's frontend scripts from crashing.

---

## ⌨️ Keyboard Shortcuts

Navigate organic search results effortlessly:

| Key | Action |
| :--- | :--- |
| <kbd>j</kbd> or <kbd>↓</kbd> | Move to next search result |
| <kbd>k</kbd> or <kbd>↑</kbd> | Move to previous search result |
| <kbd>Enter</kbd> | Open selected result in current tab |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>) | Open selected result in background tab |
| <kbd>Esc</kbd> | Clear selection highlight |

*Note: Keyboard navigation automatically pauses whenever you are typing in the search bar or any input field.*

---

## 📥 Installation

### Chrome / Brave / Edge / Opera

1. Download or clone this repository:
   ```bash
   git clone https://github.com/tninanofchirawa/clean-google-search.git
   ```
2. Open your browser and navigate to the Extensions page:
   - **Chrome**: `chrome://extensions`
   - **Brave**: `brave://extensions`
   - **Edge**: `edge://extensions`
3. Enable **Developer mode** (toggle switch in the top right corner).
4. Click the **Load unpacked** button (top left).
5. Select the `clean_google_search` folder.
6. Done! Pin the extension to your toolbar for quick access to search controls.

### 🔄 Reloading After Code Updates
Whenever files are edited or updated:
1. Go to `chrome://extensions` in your browser.
2. Locate the **Clean Google Search** card.
3. Click the **Reload** (circular arrow 🔄) button on the card.
4. Refresh any open Google Search tabs (<kbd>Ctrl</kbd> + <kbd>R</kbd> or <kbd>F5</kbd>)!

---

## 📂 Project Structure

```
clean_google_search/
├── manifest.json            # Extension manifest (MV3)
├── content.css              # Attribute-driven content styles
├── content.js               # Content script orchestrator
├── modules/
│   ├── config.js            # Default settings & safety whitelist
│   ├── filters.js           # DOM filter & safe element hiding
│   └── navigation.js        # Keyboard navigation engine
├── popup/
│   ├── popup.html           # Settings popup layout
│   ├── popup.css            # Dark mode popup styles
│   └── popup.js             # Settings synchronization logic
├── icons/                   # Extension icons (16, 48, 128)
├── HANDBOOK.md              # Detailed developer handbook & recipes
└── README.md                # Project documentation
```

For an in-depth architectural breakdown and step-by-step modification recipes, see [HANDBOOK.md](HANDBOOK.md).

---

## 🤝 Contributing

Contributions and feature suggestions are welcome!
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-filter`).
3. Commit your changes (`git commit -m 'Add amazing filter'`).
4. Push to the branch (`git push origin feature/amazing-filter`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
