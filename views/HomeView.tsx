import React, { useState } from 'react';
import { Difficulty, UserProgress, ThemeConfig } from '../types';
import { DifficultyCard } from '../components/ui/DifficultyCard';
import { GameLogo } from '../components/GameLogo';
import { renderThemeBackground } from '../utils/themeBackground';
import { UserDropdown } from '../components/ui/UserDropdown';
import { PriceOffer } from '../services/db';
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import { DailyCheckInButton } from '../components/DailyCheckInButton';
import { DailyCheckInGame } from '../components/DailyCheckInGame';

interface HomeViewProps {
  progress: UserProgress;
  activeTheme: ThemeConfig;
  onSelectDifficulty: (diff: Difficulty) => void;
  onToggleMute: () => void;
  isMuted: boolean;
  backgroundMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  onToggleBackgroundMusic: () => void;
  onToggleSoundEffects: () => void;
  onOpenThemeModal: () => void;
  onOpenInfoModal: () => void;
  onOpenHintShop: () => void;
  onOpenPurchaseHistory: () => void;
  onOpenReferModal: () => void;
  onLogout: () => void;
  priceOffer: PriceOffer | null;
  onHintsUpdated?: (newHints: number) => void;
  onStreakHintsUpdated?: (newStreakHints: number) => void; // Callback for daily streak hints
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  activeTheme,
  onSelectDifficulty,
  onToggleMute,
  isMuted,
  backgroundMusicEnabled,
  soundEffectsEnabled,
  onToggleBackgroundMusic,
  onToggleSoundEffects,
  onOpenThemeModal,
  onOpenInfoModal,
  onOpenHintShop,
  onOpenPurchaseHistory,
  onOpenReferModal,
  onLogout,
  priceOffer,
  onHintsUpdated,
  onStreakHintsUpdated
}) => {
  // Use price offer values if available, otherwise fallback to defaults
  const marketPrice = priceOffer?.marketPrice || 99;
  const offerPrice = priceOffer?.offerPrice || 9;
  const hintCount = priceOffer?.hintCount || 100;
  const hasOffer = marketPrice !== offerPrice;
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showDailyGame, setShowDailyGame] = useState(false);
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  
  const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
  
  const handleNextDifficulty = () => {
    setCurrentDifficultyIndex((prev) => (prev + 1) % difficulties.length);
  };
  
  const handlePrevDifficulty = () => {
    setCurrentDifficultyIndex((prev) => (prev - 1 + difficulties.length) % difficulties.length);
  };
  
  const handleDifficultySelect = () => {
    onSelectDifficulty(difficulties[currentDifficultyIndex]);
  };
  
  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextDifficulty();
    }
    if (isRightSwipe) {
      handlePrevDifficulty();
    }
  };

  // Daily Check-In Hook
  const {
    checkInData,
    state,
    loading: checkInLoading,
    markAsStarted,
    completeCheckIn,
    hintStreak,
    loadStatus
  } = useDailyCheckIn({
    username: progress.playerName || null,
    onStreakHintsUpdated: (newStreakHints) => {
      // Update progress with daily streak hints (from daily check-in)
      // This updates progress.dailyStreakHints which is used as hint count in game
      if (onStreakHintsUpdated) {
        onStreakHintsUpdated(newStreakHints);
      }
    }
  });

  const handleDailyCheckInClick = () => {
    if (state === 'ready' || state === 'missed') {
      setShowDailyGame(true);
    }
  };

  const handleDailyCheckInGameStarted = async () => {
    // Mark as played when game starts (one chance per day)
    // Don't reload status immediately - wait until game is finished
    // This prevents the modal from closing prematurely
    await markAsStarted();
  };

  const handleDailyCheckInComplete = async () => {
    // Called on both success and failure - marks as complete
    const success = await completeCheckIn();
    // Hints are already updated via the hook's onStreakHintsUpdated callback
    return success;
  };

  const handleDailyCheckInGameFinished = () => {
    // Close the game modal first
    setShowDailyGame(false);
    // Reload status after closing to update button state
    // This ensures the button shows "Come Back Tomorrow!" after playing
    setTimeout(() => {
      loadStatus();
    }, 300);
  };
  return (
    <div className={`flex flex-col h-full ${activeTheme.background} relative overflow-hidden transition-colors duration-500`}>
      
      {/* Decorative Landscape Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {renderThemeBackground(activeTheme.id)}
      </div>

      {/* Enhanced Floating Puppy Decorations - More Kid-Friendly */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        {/* Animated Paw Prints */}
        <div className="absolute top-12 left-4 text-3xl opacity-20 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0s' }}>
          🐾
        </div>
        <div className="absolute top-20 right-8 text-2xl opacity-15 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.8s' }}>
          🐾
        </div>
        <div className="absolute bottom-28 left-8 text-2xl opacity-18 animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1.5s' }}>
          🐾
        </div>
        
        {/* Happy Puppies */}
        <div className="absolute top-28 right-12 text-2xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          🐕
        </div>
        <div className="absolute bottom-36 left-12 text-2xl opacity-18 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '2s' }}>
          🐶
        </div>
        
        {/* Toys & Fun Elements */}
        <div className="absolute top-40 left-1/4 text-xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          🦴
        </div>
        <div className="absolute bottom-20 right-10 text-xl opacity-15 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.8s' }}>
          🎾
        </div>
        <div className="absolute top-1/3 right-1/4 text-lg opacity-12 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '2.5s' }}>
          🎈
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-lg opacity-12 animate-bounce" style={{ animationDuration: '3.6s', animationDelay: '1.2s' }}>
          ⭐
        </div>
        
        {/* Sparkles */}
        <div className="absolute top-16 left-1/2 text-sm opacity-20 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0s' }}>
          ✨
        </div>
        <div className="absolute bottom-40 right-1/3 text-sm opacity-18 animate-pulse" style={{ animationDuration: '2.3s', animationDelay: '1s' }}>
          ✨
        </div>
      </div>

      <header className={`mobile-header ${activeTheme.headerBg} backdrop-blur-md shadow-md flex justify-between z-[100] sticky top-0 border-b shrink-0 relative transition-all duration-500`}>
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-all group"
          >
            <div className={`bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm cursor-pointer group-hover:scale-110 transition-transform relative overflow-hidden`}>
              <span className="relative z-10">{progress.playerName.charAt(0).toUpperCase()}</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-[8px] font-bold uppercase tracking-wider opacity-70 ${activeTheme.text} flex items-center gap-0.5`}>
                <span className="text-[10px]">🐾</span> Player
              </span>
              <span className={`text-xs font-black leading-none drop-shadow-sm ${activeTheme.text}`}>{progress.playerName}</span>
            </div>
          </button>
          
          <UserDropdown
            isOpen={isUserDropdownOpen}
            onClose={() => setIsUserDropdownOpen(false)}
            activeTheme={activeTheme}
            onInfoClick={onOpenInfoModal}
            onThemeClick={onOpenThemeModal}
            onPurchaseHistoryClick={onOpenPurchaseHistory}
            onReferClick={onOpenReferModal}
            onLogout={onLogout}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <a 
            href="https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/findmypuppy.apk"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${activeTheme.iconBg} hover:scale-110 active:scale-95 hover:rotate-12`}
            title="Download Android APK"
          >
            <i className={`fas fa-download text-xs ${activeTheme.text}`}></i>
          </a>

          {/* Music Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)} 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${activeTheme.iconBg} hover:scale-110 active:scale-95 relative z-30`}
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xs ${activeTheme.text}`}></i>
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
                  className={`absolute right-0 top-10 mt-1 w-48 rounded-xl shadow-2xl border-2 ${activeTheme.cardBg} ${activeTheme.text} z-30 overflow-hidden`}
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
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors border-b ${activeTheme.border || 'border-white/20'}`}
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

          <div className={`backdrop-blur-sm px-2 py-1 rounded-full font-bold flex items-center gap-1 border-2 border-white/80 shadow-sm ${activeTheme.cardBg} ${activeTheme.accent} hover:scale-105 transition-transform`}>
            <span className="text-sm">🏆</span>
            <span className="text-xs">{progress.totalScore}</span>
          </div>
        </div>
      </header>
      
      <main className="mobile-main-content flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden flex flex-col items-center z-10 w-full hide-scrollbar">
        <div className="w-full max-w-sm flex flex-col h-full">
          {/* Welcome Card with Puppy Theme - Enhanced Kid-Friendly Design */}
          <div className={`flex flex-col items-center text-center p-3 rounded-2xl backdrop-blur-md shadow-2xl border-2 relative overflow-hidden ${activeTheme.cardBg} transform hover:scale-[1.02] transition-all duration-300 mb-2`}
            style={{
              boxShadow: '0 8px 24px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)',
            }}
          >
             {/* Animated Rainbow Border */}
             <div 
               className="absolute top-0 left-0 w-full h-1.5 opacity-70 animate-pulse"
               style={{
                 background: 'linear-gradient(to right, #f472b6, #fbbf24, #34d399, #60a5fa, #a78bfa)',
               }}
             ></div>
             
             {/* Decorative Elements - More Playful */}
             <div className="absolute top-1 left-2 text-base opacity-25 rotate-12 animate-bounce" style={{ animationDuration: '2s' }}>🐾</div>
             <div className="absolute top-1 right-2 text-base opacity-25 -rotate-12 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🐾</div>
             <div className="absolute bottom-1 left-3 text-sm opacity-20 rotate-45">⭐</div>
             <div className="absolute bottom-1 right-3 text-sm opacity-20 -rotate-45">✨</div>
             
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-5">
               <div className="absolute top-0 left-0 w-full h-full" style={{
                 backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,192,203,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,0,0.3) 0%, transparent 50%)'
               }}></div>
             </div>
             
             <div className="relative z-10">
               <GameLogo className="w-12 h-12 mb-2 drop-shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-500" />
               <h2 className={`text-lg font-black tracking-tight ${activeTheme.text} mb-1 flex items-center justify-center gap-1.5`}>
                 <span className="text-base animate-bounce" style={{ animationDuration: '2s' }}>🐕</span>
                 <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                   Find My Puppy
                 </span>
                 <span className="text-base animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}>🐶</span>
               </h2>
               <p className={`font-semibold text-[10px] ${activeTheme.subText} flex items-center justify-center gap-1 mt-0.5`}>
                 <span className="text-xs animate-pulse">🔍</span>
                 <span>Where are the puppies hiding?</span>
                 <span className="text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>🎯</span>
               </p>
             </div>
          </div>
          
          {/* Fixed Daily Check-In Button - Rectangular 3D */}
          {progress.playerName && (
            <div className="mb-0.5">
              <DailyCheckInButton
                state={state}
                loading={checkInLoading}
                onClick={handleDailyCheckInClick}
                activeTheme={activeTheme}
                hintStreak={hintStreak}
              />
            </div>
          )}

          {/* Difficulty Carousel - Single Card with Navigation */}
          <div className="flex flex-col items-center justify-center mb-0.5">
            <div 
              className="relative w-full max-w-[280px]"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Left Arrow - Medium transparency, more visible on hover */}
              <button
                onClick={handlePrevDifficulty}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full ${activeTheme.cardBg} ${activeTheme.text} shadow-2xl border-2 border-white/60 flex items-center justify-center hover:scale-125 active:scale-95 transition-all backdrop-blur-md opacity-40 hover:opacity-100 active:opacity-100 focus:opacity-100 group`}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4)',
                }}
                aria-label="Previous difficulty"
              >
                <i className="fas fa-chevron-left text-base"></i>
                <span className="absolute text-xs opacity-50">👈</span>
              </button>

              {/* Difficulty Card Carousel */}
              <div className="relative overflow-hidden w-full">
                <div className="relative w-full" style={{ aspectRatio: '1' }}>
                  {difficulties.map((difficulty, index) => {
                    const getDifficultyConfig = () => {
                      switch (difficulty) {
                        case Difficulty.EASY:
                          return {
                            color: activeTheme.id === 'night' ? "bg-gradient-to-r from-indigo-600 to-blue-500" : "bg-gradient-to-r from-emerald-400 to-teal-500",
                            points: 5,
                            description: "100 Levels"
                          };
                        case Difficulty.MEDIUM:
                          return {
                            color: activeTheme.id === 'night' ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-400 to-indigo-500",
                            points: 10,
                            description: "100 Levels"
                          };
                        case Difficulty.HARD:
                          return {
                            color: activeTheme.id === 'night' ? "bg-gradient-to-r from-pink-700 to-rose-600" : "bg-gradient-to-r from-rose-500 to-pink-600",
                            points: 15,
                            description: "100 Levels"
                          };
                      }
                    };
                    const config = getDifficultyConfig();
                    const isActive = index === currentDifficultyIndex;
                    
                    return (
                      <div
                        key={difficulty}
                        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                          isActive 
                            ? 'opacity-100 scale-100 z-10' 
                            : index < currentDifficultyIndex
                            ? 'opacity-0 scale-95 -translate-x-full z-0'
                            : 'opacity-0 scale-95 translate-x-full z-0'
                        }`}
                      >
                        <DifficultyCard 
                          difficulty={difficulty} 
                          points={config.points} 
                          color={config.color}
                          description={config.description} 
                          onClick={handleDifficultySelect}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow - Medium transparency, more visible on hover */}
              <button
                onClick={handleNextDifficulty}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full ${activeTheme.cardBg} ${activeTheme.text} shadow-2xl border-2 border-white/60 flex items-center justify-center hover:scale-125 active:scale-95 transition-all backdrop-blur-md opacity-40 hover:opacity-100 active:opacity-100 focus:opacity-100 group`}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.4)',
                }}
                aria-label="Next difficulty"
              >
                <i className="fas fa-chevron-right text-base"></i>
                <span className="absolute text-xs opacity-50">👉</span>
              </button>

              {/* Dots Indicator - Enhanced with Puppy Icons */}
              <div className="flex justify-center gap-2 mt-1.5">
                {difficulties.map((difficulty, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDifficultyIndex(index)}
                    className={`transition-all transform hover:scale-125 ${
                      index === currentDifficultyIndex 
                        ? 'scale-125' 
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    aria-label={`Go to ${difficulty}`}
                  >
                    <span className="text-2xl">
                      {index === currentDifficultyIndex ? '🐕' : '🐾'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
            
          {/* Fixed Buy Hints Button - Enhanced Kid-Friendly 3D */}
          <div 
            onClick={onOpenHintShop}
            className="text-white p-3 rounded-2xl shadow-2xl cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between min-h-[60px] w-full hover:shadow-3xl hover:-translate-y-1 border-2 border-yellow-300/90 hover:border-yellow-200 mb-3"
            style={{
              background: 'linear-gradient(to right, #facc15, #fb923c, #f472b6, #fb923c)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.15)',
              transform: 'perspective(1000px) rotateX(2deg)',
            }}
          >
            {/* 3D Effect Layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-transparent to-black/10 rounded-b-xl"></div>
            
            {/* Enhanced Animated Background Elements */}
            <div className="absolute -left-3 -bottom-3 opacity-25 text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-bounce" style={{ animationDuration: '3s' }}>
              💡
            </div>
            <div className="absolute top-1 right-1 text-3xl opacity-20 group-hover:scale-125 transition-transform animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
              🐕
            </div>
            <div className="absolute top-1/2 left-1/4 text-2xl opacity-15 group-hover:scale-110 transition-transform animate-pulse">
              ✨
            </div>
            
            {/* Enhanced Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Sparkle Particles */}
            <div className="absolute top-2 left-1/3 text-xs opacity-30 animate-pulse">⭐</div>
            <div className="absolute bottom-2 right-1/4 text-xs opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
            
            <div className="z-10 flex flex-col pl-2 flex-1">
              <h3 className="text-lg font-black leading-none drop-shadow-2xl flex items-center gap-2">
                <span className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>🛒</span>
                <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                  Buy Hints
                </span>
              </h3>
              <p className="text-white/95 text-xs font-bold mt-1 flex items-center gap-1.5">
                <span className="text-sm animate-pulse">💎</span>
                <span>Total: {progress.premiumHints || 0}</span>
                <span className="text-xs opacity-80">✨</span>
              </p>
            </div>

            <div className="z-10 flex flex-col items-end pr-2">
              <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-lg border-2 border-white/40">
                {hasOffer ? (
                  <>
                    <span className="text-[10px] line-through opacity-70 font-medium">₹{marketPrice}</span>
                    <span className="font-black text-sm">₹{offerPrice}</span>
                  </>
                ) : (
                  <span className="font-black text-sm">₹{offerPrice}</span>
                )}
              </div>
              <span className="text-[9px] mt-1 opacity-95 uppercase font-bold tracking-wider drop-shadow-sm flex items-center gap-0.5">
                <span>📦</span>
                <span>{hintCount} Pack</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Daily Check-In Game Modal */}
      {/* Keep modal open even if state changes - only close when game finishes or user clicks close */}
      {showDailyGame && (
        <DailyCheckInGame
          missionDay={checkInData?.currentMissionDay || 1}
          onComplete={handleDailyCheckInComplete}
          onGameStarted={handleDailyCheckInGameStarted}
          onGameFinished={handleDailyCheckInGameFinished}
          onClose={() => {
            setShowDailyGame(false);
            // Reload status after closing to update button state
            setTimeout(() => {
              loadStatus();
            }, 300);
          }}
          activeTheme={activeTheme}
        />
      )}
    </div>
  );
};

