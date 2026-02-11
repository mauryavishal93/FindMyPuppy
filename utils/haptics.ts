// Simple haptics utility using standard navigator.vibrate
// Works in most modern browsers and Android WebViews (Capacitor)

export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors (e.g. if user interaction hasn't happened yet)
    }
  }
};

export const HAPTIC_PATTERNS = {
  LIGHT: 5,       // UI feedback (click)
  MEDIUM: 15,     // Interaction (toggle)
  SUCCESS: [10, 30, 10], // Success
  WARNING: [30, 30, 30], // Warning
  ERROR: [50, 50, 50, 50], // Error/Game Over
  JUMP: 8, // Short crisp for jump
  LAND: 12, // Landing
};
