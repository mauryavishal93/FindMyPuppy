# Google AdSense Integration Guide

This application includes Google AdSense integration for displaying advertisement banners. Follow this guide to set up and configure ads.

## 📋 Prerequisites

1. **Google AdSense Account**: You need an active Google AdSense account
   - Sign up at: https://www.google.com/adsense/
   - Get approved by Google (this may take a few days to weeks)

2. **AdSense Publisher ID**: Format: `ca-pub-XXXXXXXXXXXXXXXX`
   - Found in your AdSense dashboard under "Account" → "Account information"

3. **Ad Slot IDs**: Create ad units in your AdSense dashboard
   - Go to "Ads" → "By ad unit" → "Create ad unit"
   - Create separate ad units for different placements:
     - Home screen banner
     - Level select banner
     - Game result screens banner

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google AdSense Configuration
VITE_GOOGLE_AD_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_GOOGLE_AD_SLOT_HOME=1234567890
VITE_GOOGLE_AD_SLOT_LEVEL_SELECT=1234567891
VITE_GOOGLE_AD_SLOT_GAME_RESULT=1234567892

# Enable/Disable Ads (set to 'false' to disable)
VITE_ADS_ENABLED=true
```

### Ad Placements

Ads are displayed in the following locations:

1. **Home Screen** (`GOOGLE_AD_SLOT_HOME`)
   - Sticky footer banner
   - Always visible when on home screen

2. **Level Select Screen** (`GOOGLE_AD_SLOT_LEVEL_SELECT`)
   - Bottom of level grid
   - Scrollable with content

3. **Game Result Screens** (`GOOGLE_AD_SLOT_GAME_RESULT`)
   - Win screen (after completing a level)
   - Game Over screen (time's up)
   - Game Lost screen (3 wrong attempts)

## 🎨 Ad Configuration

Ad settings can be customized in `constants/ads.ts`:

```typescript
export const AD_CONFIG = {
  enabled: true,              // Enable/disable ads globally
  format: 'auto',             // Ad format: 'auto', 'horizontal', 'vertical', 'rectangle'
  fullWidthResponsive: true,  // Full width responsive ads
  minWidth: 320,              // Minimum viewport width to show ads (pixels)
};
```

## 🚀 Setup Steps

1. **Get Your AdSense Publisher ID**
   - Log into Google AdSense
   - Navigate to "Account" → "Account information"
   - Copy your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

2. **Create Ad Units**
   - Go to "Ads" → "By ad unit" → "Create ad unit"
   - Create 3 ad units:
     - Name: "Home Banner" → Copy the Ad Slot ID
     - Name: "Level Select Banner" → Copy the Ad Slot ID
     - Name: "Game Result Banner" → Copy the Ad Slot ID

3. **Configure Environment Variables**
   - Create `.env` file in project root
   - Add your Publisher ID and Ad Slot IDs
   - Set `VITE_ADS_ENABLED=true`

4. **Test the Integration**
   - Run the development server: `npm run dev`
   - Check browser console for any AdSense errors
   - Verify ads appear in all configured locations

## 📱 Ad Formats

The implementation uses **responsive ads** that automatically adjust to:
- Screen size
- Device type (mobile/desktop)
- Available ad inventory

## ⚠️ Important Notes

1. **AdSense Approval**: Ads will only show after your AdSense account is approved by Google
2. **Localhost Limitation**: **Ads will NOT work on localhost** (`localhost`, `127.0.0.1`). Google AdSense requires a proper domain name. You need to:
   - Deploy to a production/staging domain (e.g., `yourdomain.com`, `staging.yourdomain.com`)
   - Use a service like Vercel, Netlify, or Render for hosting
   - Test ads on the deployed version, not localhost
3. **Testing**: Use Google's AdSense test mode or wait for approval to see real ads
4. **Policy Compliance**: Ensure your app content complies with Google AdSense policies
5. **Performance**: Ads are loaded asynchronously to not block page rendering
6. **Error Handling**: If ads fail to load, a placeholder is shown instead
7. **Client ID Format**: Use AdSense format `ca-pub-XXXXXXXXXXXXXXXX` (NOT AdMob's `ca-app-pub-` format)

## 🐛 Troubleshooting

### Ads Not Showing

1. **Localhost Issue (Most Common)**
   - **Ads DO NOT work on localhost** - This is a Google AdSense limitation
   - Deploy to a production domain to test ads
   - Check browser console for: `"Running on localhost - AdSense ads may not display"`
   - Solution: Deploy your app to Vercel, Netlify, Render, or any hosting service

2. **Check Environment Variables**
   - Verify `.env` file exists and has correct values
   - Restart development server after changing `.env`
   - Check browser console for: `"Invalid or placeholder AdSense Client ID"`

3. **Check AdSense Account**
   - Ensure account is approved (can take days/weeks)
   - Verify ad units are active in AdSense dashboard
   - Check for any policy violations

4. **Browser Console**
   - Open browser DevTools (F12) → Console tab
   - Look for `[AdBanner]` log messages
   - Check for AdSense errors or network failures
   - Look for errors loading `adsbygoogle.js`

5. **Ad Blockers**
   - Disable ad blockers for testing (uBlock Origin, AdBlock Plus, etc.)
   - Some browsers/extensions block ads by default
   - Try incognito/private mode

6. **Client ID Format**
   - Ensure you're using AdSense format: `ca-pub-XXXXXXXXXXXXXXXX`
   - NOT AdMob format: `ca-app-pub-XXXXXXXXXX`
   - Check browser console for format warnings

### Common Errors

- **"ca-pub-XXXXXXXXXXXXXXXX"**: Replace with your actual Publisher ID
- **"Ad slot not found"**: Verify Ad Slot IDs are correct
- **"AdSense script not loaded"**: Check internet connection and AdSense service status

## 📊 Best Practices

1. **Ad Placement**: Ads are placed in non-intrusive locations that don't interfere with gameplay
2. **User Experience**: Ads load asynchronously and don't block game functionality
3. **Responsive Design**: Ads automatically adapt to different screen sizes
4. **Performance**: Script loading is optimized to minimize impact on app performance

## 🔒 Privacy & Compliance

- This implementation follows Google AdSense policies
- User data is handled according to Google's privacy requirements
- No personal information is collected by the ad implementation

## 📚 Additional Resources

- [Google AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense API Documentation](https://developers.google.com/adsense)

---

**Note**: Replace all placeholder values (`XXXXXXXXXXXXXXXX`, `1234567890`, etc.) with your actual AdSense credentials before deploying to production.

