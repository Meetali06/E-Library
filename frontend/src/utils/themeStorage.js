// Theme management with localStorage persistence
const THEME_KEY = 'readerTheme'

export const THEMES = {
  light: {
    name: 'Day Mode',
    icon: '☀️',
    container: '#ffffff',
    text: '#000000',
    toolbar: 'linear-gradient(180deg, #f5f5f5 0%, #eeeeee 100%)',
    toolbarBorder: '#ddd',
    toolbarText: '#333',
    panelBg: '#f8f9fa',
    panelText: '#333',
    panelBorder: '#ddd',
    iframeBg: '#ffffff'
  },
  dark: {
    name: 'Night Mode',
    icon: '🌙',
    container: '#1a1a2e',
    text: '#e0e0e0',
    toolbar: 'linear-gradient(180deg, #2d2d3f 0%, #1e1e2f 100%)',
    toolbarBorder: '#444',
    toolbarText: '#ccc',
    panelBg: '#2a2a3a',
    panelText: '#ddd',
    panelBorder: '#555',
    iframeBg: '#1a1a2e'
  }
}

export function getCurrentTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  return saved && THEMES[saved] ? saved : 'dark'
}

export function getThemeColors(themeName) {
  return THEMES[themeName] || THEMES.dark
}

export function setTheme(themeName) {
  if (THEMES[themeName]) {
    localStorage.setItem(THEME_KEY, themeName)
  }
}

export function toggleTheme() {
  const current = getCurrentTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}
