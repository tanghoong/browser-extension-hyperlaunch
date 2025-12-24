// ========== Storage Key & Initial State ==========
const STORAGE_KEY = "hyperlaunch_data";
const SETTINGS_KEY = "hyperlaunch_settings";

let state = {
  shortcuts: [],
  categories: ["Personal", "Work", "Hobbies"],
  currentFilter: "All"
};

let escapeKeyCount = 0;
let escapeKeyTimer = null;

let settings = {
  theme: "auto",
  gridColumns: 6,
  showCategoryHeaders: true,
  openInNewTab: true
};

let filteredShortcuts = [];
let focusedIndex = 0;
let editingShortcutId = null;

// ========== DOM Elements ==========
const grid = document.getElementById("shortcutGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const categoriesNav = document.getElementById("categoriesNav");

// Buttons
const addShortcutBtn = document.getElementById("addShortcutBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");
const importCsvBtn = document.getElementById("importCsvBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const settingsBtn = document.getElementById("settingsBtn");
const importFile = document.getElementById("importFile");

// Modals
const shortcutModal = document.getElementById("shortcutModal");
const settingsModal = document.getElementById("settingsModal");
const modalClose = document.getElementById("modalClose");
const settingsClose = document.getElementById("settingsClose");

// Form elements
const shortcutForm = document.getElementById("shortcutForm");
const modalTitle = document.getElementById("modalTitle");
const deleteShortcutBtn = document.getElementById("deleteShortcutBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ========== Internationalization ==========
const i18n = {
  getMessage: (key) => {
    return chrome.i18n.getMessage(key) || key;
  },
  init: () => {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = i18n.getMessage(key);
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.placeholder = i18n.getMessage(key);
    });

    // Translate titles
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      el.title = i18n.getMessage(key);
    });
  }
};

// ========== Initialize ==========
async function init() {
  await loadData();
  await loadSettings();
  i18n.init();
  applySettings();
  renderCategoriesNav();
  render();
  setupEventListeners();
}

// ========== Data Management ==========
async function loadData() {
  return new Promise(resolve => {
    chrome.storage.local.get([STORAGE_KEY], result => {
      if (result[STORAGE_KEY]) {
        const loadedState = JSON.parse(result[STORAGE_KEY]);
        // Ensure all shortcuts have pinned property
        if (loadedState.shortcuts) {
          loadedState.shortcuts = loadedState.shortcuts.map(s => ({
            ...s,
            pinned: s.pinned || false
          }));
        }
        state = { ...state, ...loadedState };
      }
      resolve();
    });
  });
}

async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get([SETTINGS_KEY], result => {
      if (result[SETTINGS_KEY]) {
        settings = { ...settings, ...JSON.parse(result[SETTINGS_KEY]) };
      }
      resolve();
    });
  });
}

function saveData() {
  chrome.storage.local.set({ 
    [STORAGE_KEY]: JSON.stringify(state) 
  });
}

function saveSettings() {
  chrome.storage.local.set({ 
    [SETTINGS_KEY]: JSON.stringify(settings) 
  });
}

// ========== Settings Management ==========
function applySettings() {
  // Apply theme
  if (settings.theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (settings.theme === "light") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    // Auto theme based on system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  // Apply grid columns
  document.documentElement.style.setProperty("--grid-columns", settings.gridColumns);
}

// ========== Shortcut CRUD Operations ==========
function addShortcut(shortcut) {
  const id = Date.now().toString();
  const newShortcut = {
    id,
    title: shortcut.title,
    url: shortcut.url,
    category: shortcut.category || "Personal",
    iconType: shortcut.iconType || "color",
    iconText: shortcut.iconText || shortcut.title[0].toUpperCase(),
    iconColor: shortcut.iconColor || generateColor(shortcut.title),
    favicon: null,
    pinned: shortcut.pinned || false,
    order: state.shortcuts.length,
    createdAt: Date.now()
  };

  state.shortcuts.push(newShortcut);
  
  // Add category if new
  if (!state.categories.includes(newShortcut.category)) {
    state.categories.push(newShortcut.category);
  }
  
  cleanupEmptyCategories();
  saveData();
  return newShortcut;
}

function updateShortcut(id, updates) {
  const index = state.shortcuts.findIndex(s => s.id === id);
  if (index !== -1) {
    state.shortcuts[index] = { 
      ...state.shortcuts[index], 
      ...updates 
    };
    
    // Add new category if it doesn't exist
    const newCategory = state.shortcuts[index].category;
    if (newCategory && !state.categories.includes(newCategory)) {
      state.categories.push(newCategory);
    }
    
    cleanupEmptyCategories();
    saveData();
    return state.shortcuts[index];
  }
  return null;
}

function cleanupEmptyCategories() {
  // Remove categories that have no shortcuts
  state.categories = state.categories.filter(category => {
    return state.shortcuts.some(s => s.category === category);
  });
}

function deleteShortcut(id) {
  state.shortcuts = state.shortcuts.filter(s => s.id !== id);
  cleanupEmptyCategories();
  saveData();
}

function togglePin(id) {
  const index = state.shortcuts.findIndex(s => s.id === id);
  if (index !== -1) {
    // Create new object to ensure state change is detected
    state.shortcuts[index] = {
      ...state.shortcuts[index],
      pinned: !state.shortcuts[index].pinned
    };
    saveData();
    render();
  }
}

// ========== Rendering ==========
function render() {
  const query = searchInput.value.toLowerCase();
  const filterCategory = state.currentFilter;

  // Filter shortcuts
  filteredShortcuts = state.shortcuts.filter(s => {
    const matchesSearch = !query || 
      s.title.toLowerCase().includes(query) || 
      s.url.toLowerCase().includes(query) ||
      (s.category && s.category.toLowerCase().includes(query));
    
    let matchesCategory;
    if (filterCategory === "All") {
      matchesCategory = true;
    } else if (filterCategory === "Pinned") {
      matchesCategory = s.pinned === true;
    } else {
      matchesCategory = s.category === filterCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Sort by pinned first, then by order
  filteredShortcuts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  // Clear grid
  grid.innerHTML = "";

  if (filteredShortcuts.length === 0) {
    emptyState.style.display = "block";
    grid.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  grid.style.display = "grid";

  if (settings.showCategoryHeaders && filterCategory === "All") {
    renderWithCategories();
  } else {
    renderFlat();
  }

  // Only auto-focus first card if search input is NOT focused
  if (document.activeElement !== searchInput) {
    setTimeout(() => focusCard(0), 50);
  }
}

function renderFlat() {
  filteredShortcuts.forEach(shortcut => {
    grid.appendChild(createShortcutCard(shortcut));
  });
}

function renderWithCategories() {
  const grouped = {};
  
  filteredShortcuts.forEach(shortcut => {
    const cat = shortcut.category || "Uncategorized";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(shortcut);
  });

  Object.keys(grouped).forEach(category => {
    // Add category header
    const headerTpl = document.getElementById("categoryHeaderTpl").content.cloneNode(true);
    const header = headerTpl.querySelector(".category-header");
    const title = headerTpl.querySelector(".category-title");
    const count = headerTpl.querySelector(".category-count");
    
    title.textContent = category;
    count.textContent = grouped[category].length;
    
    grid.appendChild(header);

    // Add shortcuts
    grouped[category].forEach(shortcut => {
      grid.appendChild(createShortcutCard(shortcut));
    });
  });
}

function createShortcutCard(shortcut) {
  const template = document.getElementById("shortcutCardTpl").content.cloneNode(true);
  const card = template.querySelector(".shortcut-card");
  const icon = template.querySelector(".shortcut-icon");
  const title = template.querySelector(".shortcut-title");
  const editBtn = template.querySelector(".shortcut-edit");
  const pinBtn = template.querySelector(".shortcut-pin");

  card.dataset.shortcutId = shortcut.id;
  title.textContent = shortcut.title;
  
  // Set pinned state
  if (shortcut.pinned) {
    card.classList.add("pinned");
    pinBtn.textContent = "📌";
    pinBtn.title = "Unpin";
  } else {
    pinBtn.textContent = "📍";
    pinBtn.title = "Pin";
  }

  // Set icon - simplified without auto favicon loading
  if (shortcut.iconType === "emoji") {
    icon.textContent = shortcut.iconText || "📌";
    icon.style.background = "transparent";
  } else {
    // Default to color icon with first letter
    icon.textContent = shortcut.iconText || shortcut.title[0].toUpperCase();
    icon.style.background = shortcut.iconColor || generateColor(shortcut.title);
  }

  // Event listeners
  card.addEventListener("click", (e) => {
    if (e.target.closest(".shortcut-edit") || e.target.closest(".shortcut-pin")) return;
    openUrl(shortcut.url);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openUrl(shortcut.url);
  });

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditModal(shortcut);
  });
  
  pinBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePin(shortcut.id);
  });

  // Drag and drop
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragover", handleDragOver);
  card.addEventListener("drop", handleDrop);
  card.addEventListener("dragend", handleDragEnd);

  return card;
}

function renderCategoriesNav() {
  // Always show Pinned filter for consistency
  const categories = ["All", "Pinned", ...state.categories];
  categoriesNav.innerHTML = "";

  categories.forEach(cat => {
    const tab = document.createElement("div");
    tab.className = "category-tab";
    tab.textContent = cat;
    if (cat === state.currentFilter) {
      tab.classList.add("active");
    }
    tab.addEventListener("click", () => {
      state.currentFilter = cat;
      renderCategoriesNav();
      render();
    });
    categoriesNav.appendChild(tab);
  });
}

// ========== URL Handling ==========
function openUrl(url) {
  if (settings.openInNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
}

async function tryLoadFavicon(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return `chrome://favicon/size/64@2x/${urlObj.origin}`;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// ========== Color Generation ==========
function generateColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 65%, 55%)`;
}

// ========== Modal Management ==========
function openAddModal() {
  editingShortcutId = null;
  modalTitle.textContent = i18n.getMessage("addShortcut");
  deleteShortcutBtn.style.display = "none";
  shortcutForm.reset();
  document.getElementById("shortcutIconColor").value = "#6366f1";
  document.getElementById("shortcutPinned").checked = false;
  updateIconFieldsVisibility();
  shortcutModal.style.display = "flex";
  document.getElementById("shortcutTitle").focus();
}

function openEditModal(shortcut) {
  editingShortcutId = shortcut.id;
  modalTitle.textContent = i18n.getMessage("editShortcut") || "Edit Shortcut";
  deleteShortcutBtn.style.display = "block";
  
  document.getElementById("shortcutTitle").value = shortcut.title;
  document.getElementById("shortcutUrl").value = shortcut.url;
  document.getElementById("shortcutCategory").value = shortcut.category || "";
  document.getElementById("shortcutIconType").value = shortcut.iconType || "color";
  document.getElementById("shortcutIconText").value = shortcut.iconText || "";
  document.getElementById("shortcutIconColor").value = shortcut.iconColor || "#6366f1";
  document.getElementById("shortcutPinned").checked = shortcut.pinned || false;
  
  // Update color swatch selection
  document.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.classList.remove("selected");
    if (swatch.dataset.color === shortcut.iconColor) {
      swatch.classList.add("selected");
    }
  });
  
  // Update emoji selection if it matches
  document.querySelectorAll(".emoji-item").forEach(item => {
    item.classList.remove("selected");
    if (item.dataset.emoji === shortcut.iconText) {
      item.classList.add("selected");
    }
  });
  
  updateIconFieldsVisibility();
  shortcutModal.style.display = "flex";
  document.getElementById("shortcutTitle").focus();
}

function closeShortcutModal() {
  shortcutModal.style.display = "none";
  editingShortcutId = null;
}

function openSettingsModal() {
  document.getElementById("themeSelect").value = settings.theme;
  document.getElementById("gridColumns").value = settings.gridColumns;
  document.getElementById("gridColumnsValue").textContent = settings.gridColumns;
  document.getElementById("showCategoryHeaders").checked = settings.showCategoryHeaders;
  document.getElementById("openInNewTab").checked = settings.openInNewTab;
  settingsModal.style.display = "flex";
}

function closeSettingsModal() {
  settingsModal.style.display = "none";
}

function updateIconFieldsVisibility() {
  const iconType = document.getElementById("shortcutIconType").value;
  const iconTextGroup = document.getElementById("iconTextGroup");
  const iconColorGroup = document.getElementById("iconColorGroup");
  
  if (iconType === "emoji") {
    iconTextGroup.style.display = "block";
    iconColorGroup.style.display = "none";
  } else {
    // Color icon - show both text and color
    iconTextGroup.style.display = "block";
    iconColorGroup.style.display = "block";
  }
}

// ========== Event Listeners ==========
function setupEventListeners() {
  // Add/Edit shortcuts
  addShortcutBtn.addEventListener("click", openAddModal);
  emptyAddBtn.addEventListener("click", openAddModal);
  modalClose.addEventListener("click", closeShortcutModal);
  cancelBtn.addEventListener("click", closeShortcutModal);
  
  // Color palette selection
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("color-swatch")) {
      // Remove selected class from all swatches
      document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.classList.remove("selected");
      });
      // Add selected class to clicked swatch
      e.target.classList.add("selected");
      // Update hidden input value
      const color = e.target.dataset.color;
      document.getElementById("shortcutIconColor").value = color;
    }
  });
  
  // Emoji picker selection
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("emoji-item")) {
      // Remove selected class from all emojis
      document.querySelectorAll(".emoji-item").forEach(item => {
        item.classList.remove("selected");
      });
      // Add selected class to clicked emoji
      e.target.classList.add("selected");
      // Update text input value
      const emoji = e.target.dataset.emoji;
      document.getElementById("shortcutIconText").value = emoji;
    }
  });
  
  shortcutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById("shortcutTitle").value.trim(),
      url: document.getElementById("shortcutUrl").value.trim(),
      category: document.getElementById("shortcutCategory").value.trim() || "Personal",
      iconType: document.getElementById("shortcutIconType").value,
      iconText: document.getElementById("shortcutIconText").value.trim(),
      iconColor: document.getElementById("shortcutIconColor").value,
      pinned: document.getElementById("shortcutPinned").checked
    };
    
    if (editingShortcutId) {
      updateShortcut(editingShortcutId, formData);
    } else {
      addShortcut(formData);
    }
    
    closeShortcutModal();
    renderCategoriesNav();
    render();
  });
  
  deleteShortcutBtn.addEventListener("click", () => {
    if (confirm(i18n.getMessage("confirmDelete") || "Are you sure you want to delete this shortcut?")) {
      deleteShortcut(editingShortcutId);
      closeShortcutModal();
      renderCategoriesNav();
      render();
    }
  });
  
  document.getElementById("shortcutIconType").addEventListener("change", updateIconFieldsVisibility);

  // Settings
  settingsBtn.addEventListener("click", openSettingsModal);
  settingsClose.addEventListener("click", closeSettingsModal);
  
  document.getElementById("themeSelect").addEventListener("change", (e) => {
    settings.theme = e.target.value;
    saveSettings();
    applySettings();
  });
  
  document.getElementById("gridColumns").addEventListener("input", (e) => {
    settings.gridColumns = parseInt(e.target.value);
    document.getElementById("gridColumnsValue").textContent = settings.gridColumns;
    saveSettings();
    applySettings();
  });
  
  document.getElementById("showCategoryHeaders").addEventListener("change", (e) => {
    settings.showCategoryHeaders = e.target.checked;
    saveSettings();
    render();
  });
  
  document.getElementById("openInNewTab").addEventListener("change", (e) => {
    settings.openInNewTab = e.target.checked;
    saveSettings();
  });

  // Search - use input event for real-time search
  searchInput.addEventListener("input", (e) => {
    render();
  });

  // CSV Import/Export
  importCsvBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", handleCsvImport);
  exportCsvBtn.addEventListener("click", handleCsvExport);

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboardNav);

  // Close modals on backdrop click
  shortcutModal.addEventListener("click", (e) => {
    if (e.target === shortcutModal) closeShortcutModal();
  });
  
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  // Update categories datalist
  updateCategoriesDatalist();
}

function updateCategoriesDatalist() {
  const datalist = document.getElementById("categoriesList");
  datalist.innerHTML = "";
  state.categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    datalist.appendChild(option);
  });
}

// ========== Keyboard Navigation ==========
function handleKeyboardNav(e) {
  // ESC key handling
  if (e.key === "Escape") {
    // If modal is open, close it
    if (shortcutModal.style.display === "flex" || settingsModal.style.display === "flex") {
      closeShortcutModal();
      closeSettingsModal();
      return;
    }
    
    // ESC key press counter for double ESC
    escapeKeyCount++;
    
    if (escapeKeyTimer) {
      clearTimeout(escapeKeyTimer);
    }
    
    if (escapeKeyCount === 1) {
      // First ESC: Focus search input
      searchInput.focus();
      searchInput.select();
      
      escapeKeyTimer = setTimeout(() => {
        escapeKeyCount = 0;
      }, 500);
    } else if (escapeKeyCount === 2) {
      // Second ESC: Clear filter
      searchInput.value = "";
      searchInput.blur();
      render();
      escapeKeyCount = 0;
      if (escapeKeyTimer) {
        clearTimeout(escapeKeyTimer);
      }
    }
    
    return;
  }

  // Don't handle keyboard nav if user is typing in search or in a modal
  if (document.activeElement === searchInput || 
      document.activeElement.tagName === "INPUT" || 
      document.activeElement.tagName === "TEXTAREA" ||
      document.activeElement.tagName === "SELECT" ||
      document.activeElement.closest(".modal")) {
    return;
  }

  const cards = grid.querySelectorAll(".shortcut-card");
  if (!cards.length) return;

  const cols = settings.gridColumns;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (focusedIndex < cards.length - 1) focusCard(focusedIndex + 1);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (focusedIndex > 0) focusCard(focusedIndex - 1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = focusedIndex + cols;
    if (next < cards.length) focusCard(next);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = focusedIndex - cols;
    if (prev >= 0) focusCard(prev);
  }
}

function focusCard(index) {
  const cards = grid.querySelectorAll(".shortcut-card");
  if (cards[index]) {
    focusedIndex = index;
    cards[index].focus();
    cards[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ========== Drag and Drop ==========
let draggedElement = null;
let draggedShortcut = null;

function handleDragStart(e) {
  draggedElement = e.currentTarget;
  draggedShortcut = state.shortcuts.find(s => s.id === e.currentTarget.dataset.shortcutId);
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  
  const target = e.currentTarget;
  if (target !== draggedElement && target.classList.contains("shortcut-card")) {
    // Remove drag-over from all elements
    document.querySelectorAll(".drag-over").forEach(el => {
      el.classList.remove("drag-over");
    });
    target.classList.add("drag-over");
  }
  return false;
}

function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  
  const target = e.currentTarget;
  
  if (!draggedElement || !target || draggedElement === target) {
    return false;
  }
  
  if (target.classList.contains("shortcut-card")) {
    const draggedId = draggedElement.dataset.shortcutId;
    const targetId = target.dataset.shortcutId;
    
    const draggedIndex = state.shortcuts.findIndex(s => s.id === draggedId);
    const targetIndex = state.shortcuts.findIndex(s => s.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged item from array
      const [removed] = state.shortcuts.splice(draggedIndex, 1);
      
      // Insert it at the target position
      const newTargetIndex = state.shortcuts.findIndex(s => s.id === targetId);
      state.shortcuts.splice(newTargetIndex, 0, removed);
      
      // Update order for all items
      state.shortcuts.forEach((shortcut, index) => {
        shortcut.order = index;
      });
      
      saveData();
      render();
    }
  }
  
  return false;
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
  document.querySelectorAll(".drag-over").forEach(el => {
    el.classList.remove("drag-over");
  });
  draggedElement = null;
  draggedShortcut = null;
}

// ========== CSV Import/Export ==========
async function handleCsvImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  const lines = text.trim().split("\n");
  
  if (lines.length < 2) {
    alert(i18n.getMessage("csvError") || "Invalid CSV file");
    return;
  }

  let imported = 0;
  const header = lines[0].toLowerCase();
  
  lines.slice(1).forEach(line => {
    if (!line.trim()) return;
    
    const values = parseCSVLine(line);
    const title = values[0]?.trim();
    const url = values[1]?.trim();
    
    if (!title || !url) return;
    
    // Skip duplicates
    if (state.shortcuts.some(s => s.url === url)) return;
    
    const category = values[2]?.trim() || "Personal";
    const iconType = values[3]?.trim() || "color";
    const iconText = values[4]?.trim() || title[0].toUpperCase();
    const iconColor = values[5]?.trim() || generateColor(title);
    
    addShortcut({
      title,
      url,
      category,
      iconType,
      iconText,
      iconColor
    });
    
    imported++;
  });

  importFile.value = "";
  renderCategoriesNav();
  render();
  
  alert(`${i18n.getMessage("importSuccess") || "Imported"} ${imported} ${i18n.getMessage("shortcuts") || "shortcuts"}`);
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result.map(v => v.replace(/^"|"$/g, ""));
}

function handleCsvExport() {
  const headers = ["title", "url", "category", "icon_type", "icon_text", "icon_color", "order"];
  const rows = [headers];
  
  state.shortcuts.forEach(s => {
    rows.push([
      s.title,
      s.url,
      s.category || "",
      s.iconType || "auto",
      s.iconText || "",
      s.iconColor || "",
      s.order || ""
    ]);
  });
  
  const csv = rows.map(row => {
    return row.map(value => `"${value}"`).join(",");
  }).join("\n");
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hyperlaunch_export_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ========== Initialize App ==========
init();
