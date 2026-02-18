import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExplorerGuideView } from './views/ExplorerGuideView';
import { THEME_CONFIGS } from './constants/themeConfig';
import { ThemeType } from './types';

// Get default theme (or use 'sunny' as fallback)
const defaultThemeType: ThemeType = (localStorage.getItem('findMyPuppy_theme') as ThemeType) || 'sunny';
const activeTheme = THEME_CONFIGS[defaultThemeType] || THEME_CONFIGS['sunny'];

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
