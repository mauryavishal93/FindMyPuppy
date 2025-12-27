import React, { useState, useEffect, useRef } from 'react';
import { Puppy, Difficulty } from '../types';

interface GameCanvasProps {
  backgroundImage: string | null;
  puppies: Puppy[];
  onPuppyFound: (id: string) => void;
  isLoading: boolean;
  difficulty: Difficulty;
  showHints: boolean;
  onImageLoaded?: () => void;
}

// Base map size
const MAP_SIZE = 1600;

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  backgroundImage, 
  puppies, 
  onPuppyFound,
  isLoading,
  difficulty,
  showHints,
  onImageLoaded
}) => {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Start with a very low min zoom to ensure we don't block zooming out before calculation
  const minZoomRef = useRef(0.1); 
  const prevShowHintsRef = useRef(showHints);
  
  // Refs for pinch zoom state
  const touchState = useRef<{
    initialDistance: number;
    initialZoom: number;
    isPinching: boolean;
  }>({ initialDistance: 0, initialZoom: 1, isPinching: false });
  
  const zoomRef = useRef(zoom);

  // Sync zoom ref
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Reset zoom when level changes
  useEffect(() => {
    setZoom(1);
    setLoadError(false);
    setLoaded(false);
  }, [backgroundImage]);

  // Calculate minimum zoom to fit screen using ResizeObserver for robustness
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const updateMinZoom = () => {
      if (scrollContainerRef.current) {
        const { clientWidth, clientHeight } = scrollContainerRef.current;
        const widthRatio = clientWidth / MAP_SIZE;
        const heightRatio = clientHeight / MAP_SIZE;
        // Allow zooming out until the whole image fits strictly
        // We use Math.min to ensure it fits completely within the viewport
        minZoomRef.current = Math.min(widthRatio, heightRatio);
      }
    };

    const observer = new ResizeObserver(() => {
        updateMinZoom();
    });
    
    observer.observe(scrollContainerRef.current);
    updateMinZoom(); // Initial check

    return () => observer.disconnect();
  }, [loaded]);

  // Preload image
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        setLoaded(true);
        setLoadError(false);
        if (onImageLoaded) onImageLoaded();
      };
      // If image fails to load (e.g., file missing), just proceed so we don't hang
      img.onerror = () => {
        console.error(`Failed to load background: ${backgroundImage}`);
        setLoadError(true);
        setLoaded(true); 
        // We still trigger ready so game can be playable even if BG fails (fallback color)
        if (onImageLoaded) onImageLoaded();
      };
    }
  }, [backgroundImage, onImageLoaded]);

  // Center scroll on load
  useEffect(() => {
    if (loaded && scrollContainerRef.current) {
      const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        left: (scrollWidth - clientWidth) / 2,
        top: (scrollHeight - clientHeight) / 2,
        behavior: 'instant'
      });
    }
  }, [loaded]);

  // Auto-scroll to hidden puppies when hint is activated
  useEffect(() => {
    // Check if hint was just activated (transition from false -> true)
    if (showHints && !prevShowHintsRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollTop, scrollLeft, clientWidth, clientHeight } = container;
      
      const hiddenPuppies = puppies.filter(p => !p.isFound);
      
      if (hiddenPuppies.length > 0) {
        // Check if any are visible in the current viewport
        const isAnyVisible = hiddenPuppies.some(p => {
          const px = (p.x / 100) * MAP_SIZE * zoom;
          const py = (p.y / 100) * MAP_SIZE * zoom;
          // Add margin to consider the element visible
          return (
            px >= scrollLeft &&
            px <= scrollLeft + clientWidth &&
            py >= scrollTop &&
            py <= scrollTop + clientHeight
          );
        });

        // If no hidden puppies are visible, scroll to the first one found
        if (!isAnyVisible) {
          const target = hiddenPuppies[0];
          const targetX = (target.x / 100) * MAP_SIZE * zoom;
          const targetY = (target.y / 100) * MAP_SIZE * zoom;

          container.scrollTo({
            left: targetX - clientWidth / 2,
            top: targetY - clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    }
    prevShowHintsRef.current = showHints;
  }, [showHints, puppies, zoom]);

  // Add wheel event listener for trackpad pinch zoom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow pinch-to-zoom on trackpads (Ctrl + Wheel)
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY;
        const sensitivity = 0.005;
        // Use mutable ref for minZoom to ensure fresh value inside event listener
        setZoom(prev => Math.min(Math.max(prev + (delta * sensitivity), minZoomRef.current), 4.0));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Add touch event listeners for pinch zoom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        
        touchState.current = {
          initialDistance: distance,
          initialZoom: zoomRef.current,
          isPinching: true
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchState.current.isPinching) {
        e.preventDefault(); // Prevent default browser actions during pinch
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

        if (touchState.current.initialDistance > 0) {
          const scale = distance / touchState.current.initialDistance;
          // Calculate new zoom with limits
          const newZoom = Math.min(Math.max(touchState.current.initialZoom * scale, minZoomRef.current), 4.0);
          setZoom(newZoom);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
       if (e.touches.length < 2) {
         touchState.current.isPinching = false;
       }
    };

    // Use { passive: false } to allow preventDefault inside touchmove
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []); // Bind once

  if (isLoading || !backgroundImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 animate-pulse">
        <i className="fas fa-paw text-6xl mb-4 text-brand-light animate-bounce"></i>
        <p className="text-lg font-medium text-brand-dark">Sniffing out a location...</p>
      </div>
    );
  }

  // Camouflage logic helper
  const getPuppyStyles = (puppy: Puppy) => {
    // If hints are active and puppy isn't found, make it very visible
    if (showHints && !puppy.isFound) {
      return {
        mixBlendMode: 'normal' as const,
        opacity: 1,
        filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) brightness(1.2)',
        extraClass: 'animate-pulse ring-4 ring-yellow-400 rounded-full'
      };
    }

    if (puppy.isFound) {
      return {
        mixBlendMode: 'normal' as const,
        opacity: 1,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4)) brightness(1.2) saturate(1.3)',
        extraClass: ''
      };
    }

    let mixBlendMode: any = 'luminosity';
    let filter = '';
    let opacity = puppy.opacity;

    switch (difficulty) {
      case Difficulty.EASY:
        filter = `grayscale(20%) contrast(1.1) drop-shadow(0 0 2px rgba(255,255,255,0.3))`;
        opacity = Math.max(0.6, puppy.opacity + 0.2);
        break;
      case Difficulty.MEDIUM:
        mixBlendMode = 'luminosity';
        filter = `grayscale(60%) contrast(1.0) brightness(1.0) hue-rotate(${puppy.hueRotate}deg)`;
        opacity = Math.max(0.45, puppy.opacity + 0.1);
        break;
      case Difficulty.HARD:
        mixBlendMode = 'luminosity'; 
        filter = `grayscale(100%) contrast(1.2) brightness(0.9) hue-rotate(${puppy.hueRotate}deg)`;
        opacity = Math.max(0.35, puppy.opacity);
        break;
    }

    return { mixBlendMode, filter, opacity, extraClass: '' };
  };

  // Determine if content is smaller than viewport for centering
  const isContentSmaller = scrollContainerRef.current && 
    (MAP_SIZE * zoom < scrollContainerRef.current.clientWidth || MAP_SIZE * zoom < scrollContainerRef.current.clientHeight);

  return (
    <div className="w-full h-full relative">
       {/* Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        className={`w-full h-full overflow-auto bg-slate-900 shadow-inner hide-scrollbar ${isContentSmaller ? 'flex items-center justify-center' : ''}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y' // Allow browser panning but let us handle pinch via events
        }}
      >
        <div 
           style={{ 
             width: `${MAP_SIZE * zoom}px`, 
             height: `${MAP_SIZE * zoom}px`,
             position: 'relative',
             flexShrink: 0, // Prevent shrinking in flex container
           }}
        >
          <div 
            style={{ 
              width: `${MAP_SIZE}px`,
              height: `${MAP_SIZE}px`,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              // Use background color as ultimate fallback if image fails
              backgroundColor: '#334155', // Lighter slate for better contrast if image is missing 
              backgroundImage: loadError ? 'none' : `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70 pointer-events-none text-white">
                 <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 text-center">
                   <i className="fas fa-image text-6xl mb-4 text-white/50"></i>
                   <p className="text-xl font-bold mb-2">Background Image Missing</p>
                   <p className="text-sm opacity-80 max-w-xs">We couldn't load the scene, but you can still find the puppies!</p>
                 </div>
              </div>
            )}
            
            {/* Puppy Layer */}
            {puppies.map((puppy) => {
              const baseSize = Math.max(30, puppy.scale * 120);
              const { mixBlendMode, filter, opacity, extraClass } = getPuppyStyles(puppy);
              
              return (
                <div
                  key={puppy.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!puppy.isFound) onPuppyFound(puppy.id);
                  }}
                  className={`absolute transition-all duration-500 cursor-pointer flex items-center justify-center ${extraClass}
                    ${puppy.isFound ? 'z-50 pointer-events-none' : 'hover:scale-110 z-10'}
                  `}
                  style={{
                    left: `${puppy.x}%`,
                    top: `${puppy.y}%`,
                    width: `${baseSize}px`, 
                    height: `${baseSize}px`,
                    transform: `
                      translate(-50%, -50%) 
                      rotate(${puppy.rotation}deg) 
                      ${puppy.isFound ? 'scale(2.5)' : 'scale(1)'}
                    `,
                    mixBlendMode: loadError ? 'normal' : mixBlendMode,
                    opacity: loadError ? 1 : opacity,
                    filter: loadError ? 'none' : filter,
                  }}
                >
                  <img 
                    src={puppy.imageUrl} 
                    alt="puppy"
                    className={`w-full h-full object-contain ${puppy.isFound ? 'animate-bounce' : ''}`}
                    draggable={false}
                    style={!puppy.isFound && !showHints ? { filter: 'none' } : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};