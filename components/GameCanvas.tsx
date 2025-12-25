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

  const handleZoom = (delta: number) => {
    setZoom(prev => {
      const newZoom = prev + delta;
      return Math.min(Math.max(newZoom, 0.5), 2.5); // Min 0.5x, Max 2.5x
    });
  };

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

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
        <button 
          onClick={() => handleZoom(0.25)}
          className="bg-white/90 text-slate-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl font-bold hover:bg-white active:scale-95 transition-all backdrop-blur-sm"
          title="Zoom In"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button 
          onClick={() => setZoom(1)}
          className="bg-white/90 text-slate-600 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-sm font-bold hover:bg-white active:scale-95 transition-all backdrop-blur-sm"
          title="Reset Zoom"
        >
          1x
        </button>
        <button 
          onClick={() => handleZoom(-0.25)}
          className="bg-white/90 text-slate-800 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl font-bold hover:bg-white active:scale-95 transition-all backdrop-blur-sm"
          title="Zoom Out"
        >
          <i className="fas fa-minus"></i>
        </button>
      </div>
    </div>
  );
};