import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExplorerGuideView } from './views/ExplorerGuideView';
import { THEME_CONFIGS } from './constants/themeConfig';
import { ThemeType } from './types';

// Get default theme (or use 'night' as fallback - Starry Night is the default)
const savedProgress = localStorage.getItem('findMyPuppy_progress');
let defaultThemeType: ThemeType = 'night'; // Default to Starry Night
if (savedProgress) {
  try {
    const parsed = JSON.parse(savedProgress);
    if (parsed.selectedTheme && Object.keys(THEME_CONFIGS).includes(parsed.selectedTheme)) {
      defaultThemeType = parsed.selectedTheme as ThemeType;
    }
  } catch (e) {
    // Use default 'night' if parsing fails
  }
}
const activeTheme = THEME_CONFIGS[defaultThemeType] || THEME_CONFIGS['night'];

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ExplorerGuideView 
      activeTheme={activeTheme}
      onClose={() => {
        // Navigate to home page instead of closing window
        window.location.href = '/';
      }}
    />
  </React.StrictMode>
);
