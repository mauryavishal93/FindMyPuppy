import React, { useEffect, useRef, useState } from 'react';
import { AD_CONFIG } from '../constants/ads';

interface AdBannerProps {
  dataAdClient: string;
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  dataAdClient,
  dataAdSlot,
  dataAdFormat = AD_CONFIG?.format || 'auto',
  dataFullWidthResponsive = AD_CONFIG?.fullWidthResponsive ?? true,
  className = '',
  style
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [shouldShowAd, setShouldShowAd] = useState(false);

  useEffect(() => {
    // Safely check if ads are enabled (prevent crashes if AD_CONFIG is undefined)
    if (!AD_CONFIG || !AD_CONFIG.enabled) {
      console.log('[AdBanner] Ads are disabled in configuration');
      return;
    }

    // Validate client ID - check for placeholder values
    if (!dataAdClient || 
        dataAdClient.includes('XXXXXXXXXXXXXXXX') || 
        dataAdClient === 'ca-pub-XXXXXXXXXXXXXXXX' ||
        dataAdClient.trim() === '') {
      console.warn('[AdBanner] Invalid or placeholder AdSense Client ID:', dataAdClient);
      return;
    }

    // Validate ad slot ID - check for placeholder values
    if (!dataAdSlot || 
        dataAdSlot.trim() === '' ||
        dataAdSlot.includes('your-') ||
        dataAdSlot.includes('slot-id') ||
        dataAdSlot === '1234567890' ||
        dataAdSlot === '1234567891' ||
        dataAdSlot === '1234567892') {
      console.error('[AdBanner] ERROR: Invalid or placeholder Ad Slot ID:', dataAdSlot);
      console.error('[AdBanner] Please create ad units in AdSense and get real slot IDs');
      console.error('[AdBanner] Visit: https://www.google.com/adsense/new/u/0/pub-7001992574186232/ads');
      setAdError(true);
      return;
    }

    // Check if using AdMob format instead of AdSense format
    if (dataAdClient.includes('ca-app-pub-')) {
      console.error('[AdBanner] ERROR: You are using AdMob format (ca-app-pub-) but this component uses AdSense (ca-pub-).');
      console.error('[AdBanner] AdSense format should be: ca-pub-XXXXXXXXXXXXXXXX');
      console.error('[AdBanner] Your current ID:', dataAdClient);
      console.error('[AdBanner] Please get your AdSense Publisher ID from: https://www.google.com/adsense/');
      setAdError(true);
      return;
    }

    // Validate AdSense format (should start with ca-pub-)
    if (!dataAdClient.startsWith('ca-pub-')) {
      console.error('[AdBanner] Invalid AdSense Client ID format. Should start with "ca-pub-"');
      console.error('[AdBanner] Your ID:', dataAdClient);
      setAdError(true);
      return;
    }

    // Validate ad slot ID - check for placeholder values
    if (!dataAdSlot || 
        dataAdSlot.trim() === '' ||
        dataAdSlot.includes('your-') ||
        dataAdSlot.includes('slot-id') ||
        dataAdSlot === '1234567890' ||
        dataAdSlot === '1234567891' ||
        dataAdSlot === '1234567892') {
      console.error('[AdBanner] ERROR: Invalid or placeholder Ad Slot ID:', dataAdSlot);
      console.error('[AdBanner] Please create ad units in AdSense and get real slot IDs');
      console.error('[AdBanner] Visit: https://www.google.com/adsense/new/u/0/pub-7001992574186232/ads');
      console.error('[AdBanner] Steps:');
      console.error('[AdBanner] 1. Go to AdSense → Ads → By ad unit');
      console.error('[AdBanner] 2. Click "Create ad unit"');
      console.error('[AdBanner] 3. Copy the Ad Unit ID (just the numbers)');
      console.error('[AdBanner] 4. Add to .env file: VITE_GOOGLE_AD_SLOT_HOME=your-actual-slot-id');
      setAdError(true);
      return;
    }

    // Check if running on localhost (AdSense typically doesn't serve ads on localhost)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
    
    if (isLocalhost) {
      console.warn('[AdBanner] Running on localhost - AdSense ads may not display. Deploy to a production domain to see ads.');
      // Continue anyway - some test ads might work
    }

    // Check minimum width requirement
    const checkWidth = () => {
      const width = window.innerWidth;
      setShouldShowAd(width >= AD_CONFIG.minWidth);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);

    // Load AdSense script if not already loaded
    const loadAdSenseScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) {
        console.log('[AdBanner] AdSense script already loaded');
        // Script already loaded, just initialize ads
        if (window.adsbygoogle) {
          initializeAd();
        } else {
          // Wait for script to initialize
          const checkInterval = setInterval(() => {
            if (window.adsbygoogle) {
              clearInterval(checkInterval);
              initializeAd();
            }
          }, 100);
          
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.adsbygoogle) {
              console.warn('[AdBanner] AdSense script loaded but window.adsbygoogle not initialized');
            }
          }, 5000);
        }
        return;
      }

      console.log('[AdBanner] Loading AdSense script for client:', dataAdClient);
      
      // Create and inject AdSense script
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${dataAdClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('[AdBanner] AdSense script loaded successfully');
        if (window.adsbygoogle) {
          initializeAd();
        } else {
          // Wait a bit for adsbygoogle to initialize
          setTimeout(() => {
            if (window.adsbygoogle) {
              initializeAd();
            } else {
              console.warn('[AdBanner] window.adsbygoogle not available after script load');
              setAdError(true);
            }
          }, 500);
        }
      };
      script.onerror = () => {
        console.error('[AdBanner] Failed to load AdSense script');
        setAdError(true);
      };
      document.head.appendChild(script);
    };

    function initializeAd() {
      if (!adRef.current || !shouldShowAd) {
        console.log('[AdBanner] Skipping ad initialization - ref or width check failed');
        return;
      }

      // Wait for the ad element to be in the DOM (with max retries to prevent infinite loops)
      let retryCount = 0;
      const maxRetries = 50; // 5 seconds max wait
      
      const checkAndInitialize = () => {
        // Safety check - prevent infinite loops
        if (retryCount >= maxRetries) {
          console.warn('[AdBanner] Ad element not found after max retries, marking as error');
          setAdError(true);
          return;
        }

        const adElement = adRef.current?.querySelector('.adsbygoogle') as HTMLElement;
        if (!adElement) {
          retryCount++;
          setTimeout(() => {
            if (adRef.current && shouldShowAd) {
              checkAndInitialize();
            }
          }, 100);
          return;
        }
        
        // Element found, proceed with initialization
        performInitialization(adElement);
      };
      
      // Start checking after a small delay to ensure DOM is ready
      setTimeout(() => checkAndInitialize(), 50);
    }

    function performInitialization(adElement: HTMLElement) {

      try {
        // Initialize adsbygoogle array if it doesn't exist
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }

        console.log('[AdBanner] Initializing ad with slot:', dataAdSlot, 'Client:', dataAdClient);
        
        // Push ad configuration to trigger ad load
        // This must happen AFTER the element is in the DOM
        window.adsbygoogle.push({});

        // Mark as initialized (ad may still be loading)
        setIsAdLoaded(true);
        setAdError(false);
        
        // Try to request ad explicitly using the load method
        try {
          // Use requestAds if available (newer API)
          if ((window as any).adsbygoogle && typeof (window as any).adsbygoogle.requestAds === 'function') {
            (window as any).adsbygoogle.requestAds([adElement]);
            console.log('[AdBanner] Requested ad using requestAds()');
          } 
          // Fallback to load method
          else if ((window as any).adsbygoogle && typeof (window as any).adsbygoogle.load === 'function') {
            (window as any).adsbygoogle.load(adElement);
            console.log('[AdBanner] Requested ad using load()');
          } else {
            console.log('[AdBanner] AdSense auto-loading (push method)');
          }
        } catch (e) {
          // Some browsers don't support explicit load, that's okay - auto-load should work
          console.log('[AdBanner] Could not explicitly load ad, relying on auto-load:', e);
        }

        // Monitor for ad load completion or errors (non-blocking)
        let checkCount = 0;
        const maxChecks = 10;
        const checkAdStatus = setInterval(() => {
          checkCount++;
          if (!adElement || checkCount >= maxChecks) {
            clearInterval(checkAdStatus);
            return;
          }

          // Check if ad has loaded (has content or iframe)
          const hasContent = adElement.children.length > 0 || 
                            adElement.querySelector('iframe') !== null ||
                            adElement.offsetHeight > 50;
          
          if (hasContent) {
            console.log('[AdBanner] Ad content detected');
            clearInterval(checkAdStatus);
          }
        }, 1000);

      } catch (error) {
        console.error('[AdBanner] Error initializing AdSense ad:', error);
        setAdError(true);
      }
    }

    // Start loading script
    loadAdSenseScript();

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, [dataAdClient, dataAdSlot, shouldShowAd]);

  // Additional effect to ensure ad initializes after element is rendered
  useEffect(() => {
    if (!shouldShowAd || !isAdLoaded || adError) return;
    
    // Double-check that ad element exists and try to load if needed
    if (adRef.current) {
      const adElement = adRef.current.querySelector('.adsbygoogle') as HTMLElement;
      if (adElement && window.adsbygoogle) {
        // Check if ad hasn't loaded yet (no children/iframe)
        const hasLoaded = adElement.children.length > 0 || adElement.querySelector('iframe') !== null;
        
        if (!hasLoaded && window.adsbygoogle) {
          // Try to trigger ad load again
          try {
            if (typeof (window as any).adsbygoogle.requestAds === 'function') {
              (window as any).adsbygoogle.requestAds([adElement]);
            } else if (typeof (window as any).adsbygoogle.load === 'function') {
              (window as any).adsbygoogle.load(adElement);
            }
          } catch (e) {
            console.log('[AdBanner] Retry load attempt:', e);
          }
        }
      }
    }
  }, [isAdLoaded, shouldShowAd, adError]);

  // Don't render if ads are disabled (with safe fallback)
  if (!AD_CONFIG || !AD_CONFIG.enabled) {
    return null;
  }

  // Don't render if width requirement not met
  if (!shouldShowAd) {
    return null;
  }

  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

  // Show error placeholder only if there's an actual error
  if (adError) {
    return (
      <div 
        className={`mobile-ad-section ad-banner-container bg-slate-100/50 backdrop-blur-sm border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden min-h-[50px] ${className}`}
        style={style}
      >
        <div className="text-center p-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Advertisement</span>
          <span className="text-[9px] text-slate-300 font-mono">Ad unavailable</span>
        </div>
      </div>
    );
  }

  // Always render the ad element - it needs to be in DOM before initialization
  return (
    <div 
      ref={adRef}
      className={`mobile-ad-section ad-banner-container ${className}`}
      style={style}
    >
      {/* Show loading indicator overlay while ad is loading */}
      {!isAdLoaded && (
        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-sm border border-slate-200 rounded-xl flex items-center justify-center z-10">
          <div className="text-center p-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Advertisement</span>
            {isLocalhost ? (
              <span className="text-[9px] text-slate-300 font-mono">Ads don't work on localhost</span>
            ) : (
              <span className="text-[9px] text-slate-300 font-mono">Loading ad...</span>
            )}
          </div>
        </div>
      )}
      
      {/* AdSense ad element - must be in DOM before initialization */}
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: '50px',
          width: '100%',
          maxWidth: '100%',
          ...style
        }}
        data-ad-client={dataAdClient}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};
