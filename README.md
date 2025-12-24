# HyperLaunch

> A local‑first, open‑source Chrome New Tab launcher.

HyperLaunch turns your **New Tab** into a fast, keyboard‑friendly launcher for **web links, WhatsApp links, local files, and app protocols** — all stored locally, no account, no cloud.

---

## ✨ Core Philosophy

* **Local‑first**: All data stored in `chrome.storage.local`
* **Offline‑ready**: No backend, no API dependency
* **Zero framework**: Pure HTML / CSS / Vanilla JavaScript
* **Fast access**: Keyboard navigation first, mouse optional
* **Internationalized**: Supports multiple languages (English, Chinese Simplified, Chinese Traditional)
* **Open source**: Free to use, modify, and self‑host

---

## 🚀 Features (MVP)

### New Tab Launcher

* Overrides Chrome New Tab page
* One‑page scrolling layout
* Categorized shortcut sections

### Shortcut Types

* Web URLs (`https://`, `http://`)
* WhatsApp links (`https://wa.me/`, `whatsapp://`)
* Local files (`file:///...` – requires Chrome permission)
* Desktop app protocols (`vscode://`, `notion://`, etc.)

### Icons

* **Auto favicon** (via Chrome internal favicon service when possible)
* **Fallback color icon** (generated from title/domain hash)
* First letter as icon text when no favicon available

### Categories

* Default categories: `Personal`, `Work`, `Hobbies`
* User‑defined categories supported
* Fully internationalized (supports multiple languages)
* One‑page scrolling (not tabs, not sidebar)

### Search & Filter

* Top search bar
* Instant filter by:

  * title
  * URL
  * category

### Keyboard Navigation

* Automatic focus on first shortcut
* `Arrow Keys` – move between shortcuts
* `Enter` – open selected shortcut
* `ESC` (once) – focus search input
* `ESC` (twice) – clear search filter

### CSV Import / Export

* Batch import shortcuts via CSV
* Merge mode (no overwrite, skip duplicate URLs)
* Export current shortcuts to CSV

---

## 📂 Project Structure

```text
HyperLaunch/
├─ manifest.json
├─ index.html
├─ styles.css
├─ app.js
├─ _locales/
│  ├─ en/
│  │  └─ messages.json
│  ├─ zh_CN/
│  │  └─ messages.json
│  └─ zh_TW/
│     └─ messages.json
├─ assets/
│  ├─ icon-16.png
│  ├─ icon-48.png
│  └─ icon-128.png
├─ sample.csv
├─ README.md
└─ LICENSE
```

---

## 🧩 CSV Format

### Columns

| Column     | Required | Description                       |
| ---------- | -------- | --------------------------------- |
| title      | ✅        | Shortcut name                     |
| url        | ✅        | Target URL / protocol / file path |
| category   | ❌        | Category name (default: Personal)  |
| icon_type  | ❌        | `color` / `emoji` (default: color)    |
| icon_text  | ❌        | Letter for color icon             |
| icon_color | ❌        | HEX color (e.g. `#2563EB`)        |
| order      | ❌        | Display order                     |
| pinned     | ❌        | Pin to top (`true` / `false`)     |

### Example CSV

```csv
title,url,category,icon_type,icon_text,icon_color,order,pinned
Gmail,https://mail.google.com,Work,color,G,#EA4335,1,true
WhatsApp Web,https://web.whatsapp.com,Work,emoji,📱,,2,false
Client A (WA),https://wa.me/60123456789,Work,color,C,#10B981,3,false
My Notes,notion://www.notion.so,Personal,color,N,#111827,4,true
Local Handbook,file:///C:/Users/Charlie/Documents/handbook.pdf,Work,color,H,#2563EB,5,false
YouTube,https://youtube.com,Hobbies,color,Y,#FF0000,6,false
```

> ⚠️ Windows local files must use `file:///C:/...` format.

---

## 🔐 Permissions & Limitations

### Required Permissions

* `storage`
* `chrome_url_overrides.newtab`

### Known Limitations

* `file://` access requires enabling **Allow access to file URLs** in Chrome Extensions page
* Cannot directly launch `.exe` files (Chrome security restriction)
* Desktop apps must support **custom protocols**

---

## 🧪 Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `HyperLaunch` folder
6. Open a new tab 🎉

---

## 🗺 Roadmap (Next Steps)

### Phase 2 – UX Enhancements

* [x] Light / Dark theme toggle
* [x] Persistent grid column settings
* [ ] Category header collapse / expand
* [ ] Better focus indicator for keyboard users

### Phase 3 – Power Features

* [x] Shortcut add/edit modal UI
* [x] Drag & drop reorder (shortcuts and categories)
* [ ] Advanced search syntax (e.g. `cat:work`)
* [ ] JSON import/export (for power users)

### Phase 4 – Polish

* [ ] Accessibility improvements (ARIA roles)
* [ ] Performance optimization for 500+ shortcuts
* [ ] Minimal onboarding screen

---

## 🧠 Design Decisions (Why This Way)

* **No framework** → faster load, fewer dependencies, easier auditing
* **No cloud sync** → privacy, simplicity, predictable behavior
* **One‑page scrolling categories** → visual clarity, no hidden state
* **Keyboard first** → productivity over decoration

HyperLaunch is intentionally small.

It does **one thing well**: launch what you use most, instantly.

---

## 📜 License

MIT License – free to use, modify, and distribute.

---

## 🙌 Contributions

PRs, issues, and ideas are welcome.

If you extend HyperLaunch, keep it:

* local‑first
* framework‑free
* simple

That constraint *is* the product.
