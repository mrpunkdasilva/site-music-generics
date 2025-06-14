/**
 * Theme Switcher Module
 * Handles switching between light and dark themes
 */

// Theme constants
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Local storage key
const THEME_STORAGE_KEY = 'the-generics-theme-preference';

// Default theme (system preference)
let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'auto';

/**
 * Initialize the theme switcher
 */
export function initThemeSwitcher() {
  // Create theme toggle button if it doesn't exist
  if (!document.querySelector('.theme-toggle')) {
    createThemeToggle();
  }
  
  // Apply the saved theme or detect system preference
  applyTheme();
  
  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', applyTheme);
}

/**
 * Create the theme toggle button
 */
function createThemeToggle() {
  const header = document.querySelector('.main-nav .nav-list');
  
  if (header) {
    const themeToggleItem = document.createElement('li');
    themeToggleItem.className = 'nav-item theme-toggle-container';
    
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Alternar tema claro/escuro');
    themeToggle.innerHTML = `
      <span class="theme-toggle-icon light-icon" aria-hidden="true">☀️</span>
      <span class="theme-toggle-icon dark-icon" aria-hidden="true">🌙</span>
      <span class="theme-toggle-text">Tema</span>
    `;
    
    themeToggleItem.appendChild(themeToggle);
    header.appendChild(themeToggleItem);
    
    // Add event listener
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  if (currentTheme === THEMES.DARK || (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    currentTheme = THEMES.LIGHT;
  } else {
    currentTheme = THEMES.DARK;
  }
  
  // Save preference
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  
  // Apply the theme
  applyTheme();
}

/**
 * Apply the current theme to the document
 */
function applyTheme() {
  // Check if high contrast mode is enabled
  const isHighContrastEnabled = document.documentElement.classList.contains('high-contrast');
  
  // If high contrast is enabled, don't apply other themes
  if (isHighContrastEnabled) {
    return;
  }
  
  const isDarkMode = 
    currentTheme === THEMES.DARK || 
    (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Apply theme class to document
  if (isDarkMode) {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
    updateThemeToggleState(THEMES.DARK);
    
    // Announce theme change to screen readers
    announceThemeChange('Tema escuro ativado');
  } else {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    updateThemeToggleState(THEMES.LIGHT);
    
    // Announce theme change to screen readers
    announceThemeChange('Tema claro ativado');
  }
}

/**
 * Announce theme change to screen readers
 * @param {string} message - The message to announce
 */
function announceThemeChange(message) {
  // Create a live region if it doesn't exist
  let announcer = document.getElementById('theme-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'theme-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  
  // Set the message
  announcer.textContent = message;
  
  // Clear the message after a short delay
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Update the theme toggle button state
 * @param {string} theme - The current theme
 */
function updateThemeToggleState(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    
    if (theme === THEMES.DARK) {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'inline';
      themeToggle.setAttribute('aria-label', 'Mudar para tema claro');
    } else {
      lightIcon.style.display = 'inline';
      darkIcon.style.display = 'none';
      themeToggle.setAttribute('aria-label', 'Mudar para tema escuro');
    }
  }
}

// Export functions for use in other modules
export default {
  initThemeSwitcher,
  toggleTheme,
  getCurrentTheme: () => currentTheme
};