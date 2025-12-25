import React, { useState, useEffect, useRef } from 'react';
import { Puppy } from '../types';

interface GameCanvasProps {
  backgroundImage: string | null;
  puppies: Puppy[];
  onPuppyFound: (id: string) => void;
  isLoading: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  backgroundImage, 
  puppies, 
  onPuppyFound,
  isLoading
}) => {
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
  }, [backgroundImage]);

  // Preload image
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => setLoaded(true);
      setLoaded(false);
    }
  }, [backgroundImage]);

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
          // Calculate new zoom with limits (0.5x to 3.0x)
          const newZoom = Math.min(Math.max(touchState.current.initialZoom * scale, 0.5), 3.0);
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

  if (isLoading || !backgroundImage || !loaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 animate-pulse">
        <i className="fas fa-paw text-6xl mb-4 text-brand-light animate-bounce"></i>
        <p className="text-lg font-medium text-brand-dark">Sniffing out a location...</p>
        <p className="text-xs mt-2 text-slate-400">Powered by Gemini AI</p>
      </div>
    );
  }

  // Base map size
  const MAP_SIZE = 1600;

  return (
    <div className="w-full h-full relative">
       {/* Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-auto bg-slate-900 shadow-inner"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* 
          Zoom Container wrapper.
          We explicitly set dimensions to force the scroll container to recognize the size.
        */}
        <div 
           style={{ 
             width: `${MAP_SIZE * zoom}px`, 
             height: `${MAP_SIZE * zoom}px`,
             position: 'relative'
           }}
        >
          {/* 
            Game World Scaled 
            We use CSS transform to scale the inner content (bg + puppies) while keeping the wrapper sizing correct for scrolling.
            transform-origin top-left ensures it scales from the corner matching the wrapper.
          */}
          <div 
            style={{ 
              width: `${MAP_SIZE}px`,
              height: `${MAP_SIZE}px`,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Puppy Layer */}
            {puppies.map((puppy) => {
              // Pose Logic
              const baseSize = Math.max(30, puppy.scale * 120);
              const width = baseSize * (puppy.aspectFactor); // Squash/Stretch Width
              const height = baseSize * (1 / puppy.aspectFactor); // Inverse for Height
              const mirror = puppy.facingLeft ? 'scaleX(-1)' : 'scaleX(1)';
              
              return (
                <div
                  key={puppy.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!puppy.isFound) onPuppyFound(puppy.id);
                  }}
                  className={`absolute transition-all duration-500 cursor-pointer flex items-center justify-center
                    ${puppy.isFound ? 'z-50 pointer-events-none' : 'hover:scale-110 z-10'}
                  `}
                  style={{
                    left: `${puppy.x}%`,
                    top: `${puppy.y}%`,
                    width: `${width}px`, 
                    height: `${height}px`,
                    // Transform: Combine all transforms. Rotation + Mirror + Popup on Find
                    transform: `
                      translate(-50%, -50%) 
                      rotate(${puppy.rotation}deg) 
                      ${mirror}
                      ${puppy.isFound ? 'scale(2.5)' : 'scale(1)'}
                    `,
                    
                    // GLASS / CAMO THEME Implementation:
                    mixBlendMode: puppy.isFound ? 'normal' : 'luminosity', 
                    // Use individual puppy opacity when hidden
                    opacity: puppy.isFound ? 1 : puppy.opacity, 
                    
                    // Filter Logic:
                    filter: puppy.isFound 
                      ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.3)) brightness(1.05)' 
                      : `grayscale(100%) contrast(1.2) drop-shadow(0 0 1px rgba(255,255,255,0.4))`, 
                  }}
                >
                  <img 
                    src={puppy.imageUrl} 
                    alt="puppy"
                    className="w-full h-full object-contain"
                    draggable={false}
                    style={{ filter: 'none' }}
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