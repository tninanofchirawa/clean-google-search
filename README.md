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

## 📥 Installation Guide

> **Note for Beginners:** You do not need to know any programming, terminal commands, or Git! Since this extension is loaded locally instead of downloaded from the Chrome Web Store, your browser will simply read the project files directly from a folder on your computer.

---

### ⚡ Quick Install (For Experienced Users / Devs)

If you already know how to load unpacked extensions:

1. Clone or download: `git clone https://github.com/tninanofchirawa/clean-google-search.git`
2. Open `chrome://extensions` (or `brave://extensions` / `edge://extensions`).
3. Toggle on **Developer mode** (top-right).
4. Click **Load unpacked** (top-left) and select the root directory (containing `manifest.json`).
5. Pin the extension to your toolbar.

---

### 🟢 Beginner-Friendly Step-by-Step Guide

Supported Browsers: **Google Chrome** | **Brave** | **Microsoft Edge** | **Opera**

#### 📦 Step 1: Download the Files
* What is happening: You are saving a copy of the extension code onto your machine so your browser can use it.
1. Scroll to the top of this GitHub repository page.
2. Click the green **Code** button near the top right.
3. In the dropdown menu, click **Download ZIP**.
4. Wait a few seconds for the file to finish downloading to your computer.

---

#### 📂 Step 2: Unzip (Extract) the Folder
* What is happening: Downloaded files come compressed in a `.zip` archive. Your browser cannot read compressed files directly, so we must extract them into a standard folder.
1. Open your computer's **Downloads** folder.
2. Find the downloaded file (usually named `clean-google-search-main.zip`).
3. **Right-click** the file and choose:
   - On Windows: **Extract All...** → Click **Extract**.
   - On Mac: Double-click the file to expand it automatically.
4. Open the newly created unzipped folder. Make sure you see files like `manifest.json`, `content.css`, and `modules/` inside it. **Leave this folder right where it is** (do not delete or move it later, or the extension will stop working).

---

#### 🌐 Step 3: Open Your Browser's Extensions Dashboard
* What is happening: Browsers keep their addon/extension controls on a dedicated settings screen.
1. Open your preferred web browser.
2. Copy and paste the matching address into your address/URL bar at the top, then hit <kbd>Enter</kbd>:
   - **Chrome:** `chrome://extensions`
   - **Brave:** `brave://extensions`
   - **Edge:** `edge://extensions`
   - **Opera:** `opera://extensions`

---

#### 🛠️ Step 4: Turn On Developer Mode
* What is happening: Regular browser security locks out custom local folders by default. Developer mode is the master switch that allows you to install extensions from your computer.
1. Look at the top-right corner of the Extensions page.
2. Find the toggle switch labeled **Developer mode**.
3. Click it to turn it **ON** (the toggle will slide and light up).

---

#### 🚀 Step 5: Load the Extension
* What is happening: You are telling your browser: "Read and run the extension stored in this specific folder."
1. Look at the top-left corner of the page.
2. Click the button labeled **Load unpacked**.
3. A file browser window will pop up.
4. Navigate to your unzipped folder and select the folder that directly contains `manifest.json`.
5. Click **Select Folder** (or **Open**).

---

#### 📌 Step 6: Pin & Start Searching!
* What is happening: Pinning keeps the extension shortcut always visible next to your address bar for quick access.
1. Look at the top-right toolbar of your browser for the puzzle piece icon (🧩).
2. Click the puzzle icon to open your installed extensions list.
3. Locate **Clean Google Search** and click the **Pin** icon (📌).
4. Head over to [Google](https://www.google.com) and run a search—your clean, decluttered results are ready!

---

### 🔄 Updating or Reloading the Extension

Whenever you download a new update or modify any project files:

1. Return to your extensions dashboard (`chrome://extensions`).
2. Find the **Clean Google Search** card.
3. Click the **Reload** circular arrow button (🔄) on the card.
   * *What this does:* It flushes the browser's stored cache and re-reads the updated files from your disk.
4. Refresh any active Google Search tabs (<kbd>Ctrl</kbd> + <kbd>R</kbd> or <kbd>F5</kbd> on Windows / <kbd>Cmd</kbd> + <kbd>R</kbd> on Mac) to see the new changes in action.
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
