// Global user prefs in context of the extension content script.
let userPrefs = {};

// Toggle pref IDs as corresponding class names on the <html> element.
// Used by CSS selectors in content.css to tweak the website interface.
function applyPrefs(prefs = {}) {
  userPrefs = { ...DEFAULT_PREFS, ...prefs };
  Object.entries(userPrefs).forEach(([id, pref]) => {
    document.documentElement.classList.toggle(id, pref.value);
  })
}

// Removes the YouTube chat panel
function removeChat() {
  const panel = select('.byt--nochat ytd-live-chat-frame')
  panel && panel.remove();
}

// Get user prefs and apply their class names to the <html> element
// immediately so the CSS tweaks apply as soon as the DOM is generated.
// Waiting for "DOMContentLoaded" will cause a flash of unwanted content.
chrome.storage.sync.get(['userPrefs'], (result) => {
  applyPrefs(result.userPrefs);
  removeChat();
});

// Re-apply user prefs when they're changed.
chrome.storage.onChanged.addListener((changes, area) => {
  const { userPrefs } = changes;
  if (area === "sync" && userPrefs && userPrefs.newValue) {
    applyPrefs(userPrefs.newValue);
    removeChat();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  removeChat();
});
