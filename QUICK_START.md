# 🚀 HyperLaunch - Quick Start Guide

## ⚡ 3-Minute Setup

### Step 1: Load Extension (1 minute)
1. Open Chrome
2. Type in address bar: `chrome://extensions`
3. Click the **Developer mode** toggle (top-right)
4. Click **Load unpacked** button
5. Select the `browser-extension-hyperlaunch` folder
6. Done! ✅

### Step 2: Try It (1 minute)
1. Open a new tab (Ctrl+T or Cmd+T)
2. You'll see HyperLaunch!
3. Click **Import CSV**
4. Select the `sample.csv` file from the extension folder
5. Now you have 24 example shortcuts! 🎉

### Step 3: Customize (1 minute)
1. Click the **⚙️ Settings** icon
2. Choose your theme (Auto/Light/Dark)
3. Adjust grid columns for your screen
4. Click **+ Add Shortcut** to add your own
5. You're all set! 🎊

---

## 🎹 Essential Keyboard Shortcuts

- **`ESC`** → Focus search (press once) or clear search (press twice)
- **Arrow Keys** → Navigate shortcuts  
- **Enter** → Open shortcut

---

## 📋 Quick Reference

### Adding a Shortcut
```
Title:    Gmail
URL:      https://mail.google.com
Category: Work
```

### Importing CSV
Create a file with this format:
```csv
title,url,category,icon_type,icon_text,icon_color,order
Gmail,https://mail.google.com,Work,color,G,#EA4335,1
Slack,https://slack.com,Work,emoji,💬,,2
```

### Supported URL Types
- **Web**: `https://example.com`
- **WhatsApp**: `https://wa.me/1234567890`
- **Local File**: `file:///C:/Users/Name/file.pdf`
- **App**: `vscode://` or `notion://`

### Icon Types
- **Color Icon**: First letter with custom color (default)
- **Emoji**: Any emoji character

---

## 🌍 Language Support

The extension automatically uses your browser's language:
- English (Default)
- 简体中文 (Simplified Chinese)  
- 繁體中文 (Traditional Chinese)

Change in Chrome Settings → Languages

---

## ❓ Common Issues

### Problem: Local files don't open
**Fix**: Enable "Allow access to file URLs" in `chrome://extensions`

### Problem: New tab still shows Chrome default
**Fix**: Disable other new tab extensions, reload HyperLaunch

### Problem: Icons not loading
**Fix**: Clear browser cache or use Color/Emoji icon type

---

## 📚 Documentation

- **README.md** - Full feature list and philosophy
- **INSTALLATION.md** - Detailed guide and troubleshooting  
- **PROJECT_SUMMARY.md** - Technical details and architecture

---

## 🎯 Pro Tips

1. **Organize**: Use categories (Personal, Work, Hobbies)
2. **Search**: Type `/` then search instead of scrolling
3. **Backup**: Export to CSV regularly
4. **Reorder**: Drag and drop shortcuts
5. **Emoji**: Use emojis for quick visual recognition

---

## ✨ You're Ready!

**That's it!** You now have a powerful, privacy-focused new tab launcher.

Need more help? Check [INSTALLATION.md](INSTALLATION.md)

**Happy launching!** 🚀
