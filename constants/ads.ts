// --- GOOGLE AD SENSE CONFIGURATION ---
// ⚠️ IMPORTANT: This component uses GOOGLE ADSENSE (for web), NOT AdMob (for mobile apps)
// 
// AdSense Format: ca-pub-XXXXXXXXXXXXXXXX
// AdMob Format: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX (NOT SUPPORTED - use AdSense instead)
//
// Get your AdSense Publisher ID from: https://www.google.com/adsense/
// Format: ca-pub-XXXXXXXXXXXXXXXX
// Get your Ad Slot IDs from: https://www.google.com/adsense/new/u/0/pub-XXXXXXXXXX/ads

// Use environment variables for production, fallback to your AdSense client ID
export const GOOGLE_AD_CLIENT_ID = import.meta.env.VITE_GOOGLE_AD_CLIENT_ID || "ca-pub-7001992574186232";

// Ad Slot IDs - Use environment variables or defaults
// You can create separate ad units for each placement, or use the same slot ID for all
// To use different slots, create ad units in AdSense and set them in .env file
export const GOOGLE_AD_SLOT_HOME = import.meta.env.VITE_GOOGLE_AD_SLOT_HOME || "3813845166";
export const GOOGLE_AD_SLOT_LEVEL_SELECT = import.meta.env.VITE_GOOGLE_AD_SLOT_LEVEL_SELECT || "3813845166";
export const GOOGLE_AD_SLOT_GAME_RESULT = import.meta.env.VITE_GOOGLE_AD_SLOT_GAME_RESULT || "3813845166";

// Ad Configuration
export const AD_CONFIG = {
  // Enable/disable ads globally
  enabled: import.meta.env.VITE_ADS_ENABLED !== 'false',
  // Ad format: 'auto', 'horizontal', 'vertical', 'rectangle'
  format: 'auto',
  // Full width responsive
  fullWidthResponsive: true,
  // Minimum viewport width to show ads (in pixels)
  minWidth: 320,
} as const;

