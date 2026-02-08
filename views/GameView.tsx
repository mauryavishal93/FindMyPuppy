import React, { useState } from 'react';
import { Difficulty, Puppy, UserProgress, ThemeType } from '../types';
import { GameCanvas } from '../components/GameCanvas';
import { THEME_CONFIGS } from '../constants/themeConfig';

interface GameViewProps {
  gameState: {
    puppies: Puppy[];
    bgImage: string | null;
    loading: boolean;
  };
  selectedDifficulty: Difficulty;
  currentLevelId: number;
  timeLeft: number | null;
  formatTime: (seconds: number) => string;
  showHints: boolean;
  freeHintsRemaining: number;
  totalHintsRemaining: number;
  currentHintType: 'free' | 'total' | 'none';
  currentHintCount: number;
  hasHints: boolean;
  hasPremiumHints: boolean;
  isMuted: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  onPuppyFound: (id: string) => void;
  onImageLoaded: () => void;
  onUseHint: () => void;
  onToggleMute: () => void;
  onToggleBackgroundMusic: () => void;
  onToggleSoundEffects: () => void;
  onBack: () => void;
  onWrongClick: () => void;
  wrongAttempts: number;
  wrongTapLimit: number;
  currentTheme: ThemeType;
}

export const GameView: React.FC<GameViewProps> = ({
  gameState,
  selectedDifficulty,
  currentLevelId,
  timeLeft,
  formatTime,
  showHints,
  freeHintsRemaining,
  totalHintsRemaining,
  currentHintType,
  currentHintCount,
  hasHints,
  hasPremiumHints,
  isMuted,
  backgroundMusicEnabled,
  soundEffectsEnabled,
  onPuppyFound,
  onImageLoaded,
  onUseHint,
  onToggleMute,
  onToggleBackgroundMusic,
  onToggleSoundEffects,
  onBack,
  onWrongClick,
  wrongAttempts,
  wrongTapLimit = 3,
  currentTheme
}) => {
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const activeTheme = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.night;
  // Timer Color Logic
  let timerColorClass = 'bg-slate-800 text-white';
  if (timeLeft !== null && timeLeft <= 10) timerColorClass = 'bg-red-500 text-white animate-pulse';
  else if (timeLeft !== null && timeLeft <= 30) timerColorClass = 'bg-orange-500 text-white';
  
  return (
    <div className="mobile-game-container flex flex-col h-full bg-slate-900 absolute inset-0 z-0">
      <div className="mobile-header bg-slate-900/90 backdrop-blur text-white flex justify-between z-10 shadow-lg border-b border-slate-800 shrink-0">
        <button onClick={onBack} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
           <i className="fas fa-times text-lg sm:text-xl"></i>
        </button>
        
        <div className="flex items-center gap-4">
           {timeLeft !== null && (
               <div className={`px-3 py-1 rounded-full font-mono font-bold text-sm sm:text-base shadow-sm border border-white/20 flex items-center gap-2 ${timerColorClass}`}>
                  <i className="fas fa-clock text-xs"></i>
                  {formatTime(timeLeft)}
               </div>
           )}
           <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-brand-light border border-slate-700 flex flex-col items-center shadow-lg min-w-[80px] sm:min-w-[100px]">
              <span className="uppercase text-[9px] sm:text-[10px] tracking-widest">{selectedDifficulty} MODE</span>
              <span className="text-[10px] sm:text-xs text-slate-400 opacity-80">Level {currentLevelId}</span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Music Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative z-30"
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
            </button>
            
            {/* Dropdown Menu */}
            {isMusicDropdownOpen && (
              <>
                {/* Backdrop to close dropdown on outside click */}
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsMusicDropdownOpen(false)}
                ></div>
                
                {/* Dropdown Content */}
                <div 
                  className={`absolute right-0 top-10 mt-1 w-48 rounded-xl shadow-2xl border-2 border-white/20 ${activeTheme.cardBg} ${activeTheme.text} z-30 overflow-hidden`}
                  style={{
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.1)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Background Music Option */}
                  <button
                    onClick={() => {
                      onToggleBackgroundMusic();
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors border-b border-white/20`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fas fa-volume-up text-base ${activeTheme.text}`}></i>
                      <span className="text-sm font-semibold">Background Music</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-all ${backgroundMusicEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${backgroundMusicEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </div>
                  </button>
                  
                  {/* Sound Effects Option */}
                  <button
                    onClick={() => {
                      onToggleSoundEffects();
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fas fa-music text-base ${activeTheme.text}`}></i>
                      <span className="text-sm font-semibold">Sound Effects</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-all ${soundEffectsEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${soundEffectsEnabled ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <GameCanvas 
          backgroundImage={gameState.bgImage}
          puppies={gameState.puppies}
          onPuppyFound={onPuppyFound}
          isLoading={gameState.loading}
          difficulty={selectedDifficulty}
          showHints={showHints}
          onImageLoaded={onImageLoaded}
          onWrongClick={onWrongClick}
        />
        
        {/* HUD Elements */}
        {/* Puppies Count - Right Top */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-mono text-brand-light border border-slate-700 flex items-center gap-2 shadow-lg">
            <i className="fas fa-paw text-[10px] sm:text-xs"></i>
            <span className="font-bold">{gameState.puppies.filter(p => p.isFound).length} / {gameState.puppies.length}</span>
          </div>
        </div>
        
        {/* Wrong Attempts Indicator - Left Top (aligned with puppies count) */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 pointer-events-none">
          <div className="bg-red-900/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white border border-red-700 flex items-center gap-2 shadow-lg">
            {/* Creative Puppy Icons showing remaining attempts */}
            <div className="flex items-center gap-1">
              {Array.from({ length: wrongTapLimit }, (_, i) => i + 1).map((attempt) => (
                <i 
                  key={attempt}
                  className={`fas fa-dog text-[10px] sm:text-xs transition-all duration-300 ${
                    attempt > (wrongTapLimit - wrongAttempts) 
                      ? 'text-red-300/30 scale-75 opacity-50' 
                      : wrongAttempts >= wrongTapLimit - 1 
                        ? 'text-red-300 animate-pulse' 
                        : wrongAttempts >= 1 
                          ? 'text-yellow-300' 
                          : 'text-white'
                  }`}
                ></i>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-tighter">Lifes</span>
              <span className={`${wrongAttempts >= wrongTapLimit - 1 ? 'text-red-300 animate-pulse' : wrongAttempts >= 1 ? 'text-yellow-300' : 'text-white'}`}>
                {wrongTapLimit - wrongAttempts}
              </span>
            </span>
          </div>
        </div>
        
        {/* Hint Button */}
        <div className="absolute bottom-20 sm:bottom-24 right-6 z-[60] pb-[env(safe-area-inset-bottom)] transition-all duration-300">
           <button 
             onClick={onUseHint}
             disabled={gameState.loading || showHints}
             className={`
               w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 flex items-center justify-center transition-all duration-300 active:scale-95
               ${showHints ? 'bg-yellow-400 border-yellow-200 scale-110' : 'bg-slate-800/90 border-slate-600 hover:bg-slate-700'}
             `}
           >
             <i className={`fas fa-lightbulb text-xl sm:text-2xl ${showHints ? 'text-white animate-pulse' : 'text-yellow-400'}`}></i>
             
             {/* Badge for remaining hints - shows current available hint count */}
             <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-white">
                {hasHints ? currentHintCount : '+'}
             </div>
           </button>
        </div>
      </div>
    </div>
  );
};

