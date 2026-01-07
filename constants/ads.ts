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

// ⚠️ IMPORTANT: Replace these with your ACTUAL AdSense Ad Slot IDs
// Get them from: https://www.google.com/adsense/new/u/0/pub-7001992574186232/ads
// Steps:
// 1. Go to AdSense dashboard → Ads → By ad unit
// 2. Click "Create ad unit" for each placement (Home, Level Select, Game Result)
// 3. Copy the Ad Unit ID (just the numbers, e.g., "1234567890")
// 4. Add them to your .env file or replace the defaults below
export const GOOGLE_AD_SLOT_HOME = import.meta.env.VITE_GOOGLE_AD_SLOT_HOME || "";
export const GOOGLE_AD_SLOT_LEVEL_SELECT = import.meta.env.VITE_GOOGLE_AD_SLOT_LEVEL_SELECT || "";
export const GOOGLE_AD_SLOT_GAME_RESULT = import.meta.env.VITE_GOOGLE_AD_SLOT_GAME_RESULT || "";

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

