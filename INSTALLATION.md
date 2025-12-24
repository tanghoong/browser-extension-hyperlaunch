# HyperLaunch Installation Guide

## Quick Start

### 1. Install the Extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `browser-extension-hyperlaunch` folder
5. The HyperLaunch icon should appear in your extensions

### 2. Open a New Tab

Open a new tab (Ctrl+T or Cmd+T) and you'll see the HyperLaunch interface!

---

## Getting Started

### Adding Your First Shortcut

1. Click the **"+ Add Shortcut"** button
2. Fill in the form:
   - **Title**: Name of your shortcut (e.g., "Gmail")
   - **URL**: The web address or protocol (e.g., "https://mail.google.com")
   - **Category**: Optional category (e.g., "Work", "Personal", "Hobbies")
   - **Icon Type**: Choose Auto, Color, or Emoji
3. Click **Save**

### Keyboard Shortcuts

- **`ESC` (once)** - Focus the search bar
- **`ESC` (twice)** - Clear search filter
- **`Arrow Keys`** - Navigate between shortcuts
- **`Enter`** - Open the focused shortcut

### Importing Shortcuts (CSV)

1. Prepare a CSV file with columns: `title,url,category,icon_type,icon_text,icon_color,order`
2. Click **Import CSV** button
3. Select your CSV file
4. Shortcuts will be added (duplicates are automatically skipped)

**Example CSV:**
```csv
title,url,category,icon_type,icon_text,icon_color,order
Gmail,https://mail.google.com,Work,color,G,#EA4335,1
GitHub,https://github.com,Work,color,G,#181717,2
YouTube,https://youtube.com,Hobbies,emoji,🎬,,3
```

A `sample.csv` file is included in the project folder for testing.

---

## Features Explained

### Shortcut Types

**Web URLs**
- Standard web addresses: `https://example.com`
- HTTP and HTTPS protocols supported

**WhatsApp Links**
- Direct chat: `https://wa.me/1234567890`
- WhatsApp Web: `https://web.whatsapp.com`
- WhatsApp protocol: `whatsapp://send?phone=1234567890`

**Local Files**
- File paths: `file:///C:/Users/YourName/Documents/file.pdf`
- ⚠️ Requires enabling "Allow access to file URLs" in `chrome://extensions`

**Desktop App Protocols**
- VS Code: `vscode://file/path/to/file`
- Notion: `notion://www.notion.so/page-id`
- Custom protocols: `yourapp://command`

### Icon Types

**Color Icon** (Default)
- First letter of the title with colored background
- Customize both the letter and background color
- Automatic color generation based on title
- Great for all types of shortcuts

**Emoji**
- Use any emoji as the icon
- Perfect for quick visual identification
- Examples: 📧, 🎵, 📁, 💻

### Categories

- Organize shortcuts into custom categories
- Default categories: Personal, Work, Hobbies
- Create new categories by typing a new name
- Filter by category using the category tabs

### Search & Filter

- **Search by title**: Type any part of the shortcut name
- **Search by URL**: Search for specific domains or paths
- **Search by category**: Find shortcuts by their category
- **Real-time filtering**: Results update as you type

---

## Settings

Click the ⚙️ icon to open settings:

### Theme
- **Auto**: Follows your system theme preference
- **Light**: Always use light mode
- **Dark**: Always use dark mode

### Grid Columns
- Adjust how many shortcuts appear per row (3-10 columns)
- Useful for different screen sizes

### Display Options
- **Show category headers**: Group shortcuts under category headings
- **Open in new tab**: Control whether shortcuts open in new or current tab

---

## Advanced Features

### Drag & Drop Reordering

1. Click and hold a shortcut card
2. Drag it to the desired position
3. Drop to reorder

### Editing Shortcuts

1. Hover over a shortcut card
2. Click the ✏️ (edit) button that appears
3. Modify any field
4. Click **Save** or **Delete**

### CSV Export

1. Click **Export CSV** button
2. Your browser will download a CSV file with all shortcuts
3. Use this for:
   - Backup
   - Sharing with others
   - Editing in spreadsheet software
   - Importing to another browser/computer

---

## Internationalization (i18n)

HyperLaunch supports multiple languages:

- **English** (default)
- **简体中文** (Simplified Chinese)
- **繁體中文** (Traditional Chinese)

The extension automatically uses your browser's language setting. You can add more languages by creating additional `messages.json` files in the `_locales/` folder.

---

## Troubleshooting

### Local Files Not Opening

**Problem**: File URLs (`file:///...`) don't work

**Solution**:
1. Go to `chrome://extensions`
2. Find HyperLaunch
3. Click "Details"
4. Enable **"Allow access to file URLs"**

### Extension Not Replacing New Tab

**Problem**: Opening a new tab still shows Chrome's default page

**Solution**:
1. Go to `chrome://extensions`
2. Check that HyperLaunch is enabled
3. Try disabling other new tab extensions
4. Reload the extension (toggle off/on)

### CSV Import Not Working

**Problem**: CSV file import fails or skips entries

**Solution**:
- Ensure CSV has header row: `title,url,category,...`
- Check for proper comma separation
- Verify URL format (must include `http://` or `https://` for web links)
- Duplicate URLs are automatically skipped

---

## Privacy & Security

- ✅ **100% local storage** - All data stored in `chrome.storage.local`
- ✅ **No tracking** - No analytics, no telemetry
- ✅ **No internet required** - Works completely offline
- ✅ **No account needed** - No sign-up, no cloud sync
- ✅ **Open source** - Full transparency, audit the code yourself

---

## Tips & Best Practices

### Organization
- Use consistent category names
- Keep shortcut titles short and descriptive
- Utilize search instead of scrolling through many shortcuts

### Performance
- The extension is optimized for 500+ shortcuts
- For best performance, keep categories balanced
- Use search to quickly find specific items

### Backup
- Export CSV regularly as backup
- Store exported CSV files safely
- Re-import if you reinstall Chrome or the extension

### Customization
- Experiment with grid column settings for your screen size
- Use emojis for quick visual identification
- Organize by usage frequency (put most-used at top)

---

## Development & Contribution

### File Structure
```
browser-extension-hyperlaunch/
├── manifest.json          # Extension configuration
├── index.html            # Main UI structure
├── styles.css            # All styles and themes
├── app.js                # Application logic
├── _locales/             # Internationalization files
│   ├── en/messages.json
│   ├── zh_CN/messages.json
│   └── zh_TW/messages.json
├── assets/               # Icon files
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── sample.csv            # Example import file
└── README.md             # Project documentation
```

### Technology Stack
- **No frameworks** - Pure vanilla JavaScript
- **Chrome Storage API** - Local data persistence
- **Chrome i18n API** - Multi-language support
- **CSS Grid** - Responsive layout
- **CSS Variables** - Theming support

### Contributing
1. Fork the repository
2. Make your changes
3. Test thoroughly in Chrome
4. Submit a pull request
5. Keep changes aligned with project philosophy (local-first, framework-free, simple)

---

## License

MIT License - Free to use, modify, and distribute.

---

## Support

For issues, feature requests, or questions:
- Check existing issues on GitHub
- Open a new issue with details
- Include browser version and error messages if applicable

---

**Enjoy using HyperLaunch! 🚀**
