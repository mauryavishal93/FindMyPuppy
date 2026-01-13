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
  onOpenThemeModal: () => void;
  onOpenInfoModal: () => void;
  onOpenHintShop: () => void;
  onOpenPurchaseHistory: () => void;
  onOpenReferModal: () => void;
  onLogout: () => void;
  priceOffer: PriceOffer | null;
  onHintsUpdated?: (newHints: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  activeTheme,
  onSelectDifficulty,
  onToggleMute,
  isMuted,
  onOpenThemeModal,
  onOpenInfoModal,
  onOpenHintShop,
  onOpenPurchaseHistory,
  onOpenReferModal,
  onLogout,
  priceOffer,
  onHintsUpdated
}) => {
  // Use price offer values if available, otherwise fallback to defaults
  const marketPrice = priceOffer?.marketPrice || 99;
  const offerPrice = priceOffer?.offerPrice || 9;
  const hintCount = priceOffer?.hintCount || 100;
  const hasOffer = marketPrice !== offerPrice;
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showDailyGame, setShowDailyGame] = useState(false);

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
      // Update progress with daily streak hints (NOT total hints)
      // Note: This callback is handled by the parent component via onHintsUpdated
      if (onHintsUpdated) {
        onHintsUpdated(newStreakHints);
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

      {/* Floating Puppy Decorations - Smaller */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-16 left-3 text-2xl opacity-15 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
          🐾
        </div>
        <div className="absolute top-24 right-6 text-xl opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          🐕
        </div>
        <div className="absolute bottom-32 left-6 text-xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }}>
          🐶
        </div>
        <div className="absolute top-36 left-1/4 text-lg opacity-8 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>
          🦴
        </div>
        <div className="absolute bottom-24 right-8 text-lg opacity-10 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.5s' }}>
          🎾
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

          <button onClick={onToggleMute} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${activeTheme.iconBg} hover:scale-110 active:scale-95`}>
            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xs ${activeTheme.text}`}></i>
          </button>

          <div className={`backdrop-blur-sm px-2 py-1 rounded-full font-bold flex items-center gap-1 border-2 border-white/80 shadow-sm ${activeTheme.cardBg} ${activeTheme.accent} hover:scale-105 transition-transform`}>
            <span className="text-sm">🏆</span>
            <span className="text-xs">{progress.totalScore}</span>
          </div>
        </div>
      </header>
      
      <main className="mobile-main-content flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden flex flex-col items-center z-10 w-full hide-scrollbar">
        <div className="w-full max-w-sm space-y-2.5">
          {/* Welcome Card with Puppy Theme - Compact */}
          <div className={`flex flex-col items-center text-center p-3 rounded-2xl backdrop-blur-sm shadow-lg border relative overflow-hidden ${activeTheme.cardBg} transform hover:scale-[1.01] transition-transform duration-300`}>
             {/* Animated Top Border */}
             <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60 ${activeTheme.accent} animate-pulse`}></div>
             
             {/* Decorative Paw Prints - Smaller */}
             <div className="absolute top-1 left-2 text-lg opacity-20 rotate-12">🐾</div>
             <div className="absolute top-1 right-2 text-lg opacity-20 -rotate-12">🐾</div>
             
             <div className="relative z-10">
               <GameLogo className="w-12 h-12 mb-1.5 drop-shadow-md transform hover:scale-105 hover:rotate-6 transition-all duration-500" />
               <h2 className={`text-lg font-black tracking-tight ${activeTheme.text} mb-0.5 flex items-center justify-center gap-1.5`}>
                 <span className="text-base">🐕</span>
                 <span>Find My Puppy</span>
                 <span className="text-base">🐶</span>
               </h2>
               <p className={`font-medium text-[10px] mt-0.5 ${activeTheme.subText} flex items-center justify-center gap-1`}>
                 <span>🔍</span>
                 <span>Where are the puppies hiding?</span>
               </p>
             </div>
          </div>
          
          <div className="space-y-2 perspective-1000">
            {/* Daily Check-In Button */}
            {progress.playerName && (
              <DailyCheckInButton
                state={state}
                loading={checkInLoading}
                onClick={handleDailyCheckInClick}
                activeTheme={activeTheme}
                hintStreak={hintStreak}
              />
            )}

            {/* Difficulty Cards with Unique Designs */}
            <div className="space-y-2">
              <DifficultyCard 
                difficulty={Difficulty.EASY} 
                points={5} 
                color={activeTheme.id === 'night' ? "bg-gradient-to-r from-indigo-600 to-blue-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}
                description="100 Levels • Relaxed" 
                onClick={() => onSelectDifficulty(Difficulty.EASY)}
              />
              <DifficultyCard 
                difficulty={Difficulty.MEDIUM} 
                points={10} 
                color={activeTheme.id === 'night' ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-400 to-indigo-500"}
                description="100 Levels • Timed" 
                onClick={() => onSelectDifficulty(Difficulty.MEDIUM)}
              />
              <DifficultyCard 
                difficulty={Difficulty.HARD} 
                points={15} 
                color={activeTheme.id === 'night' ? "bg-gradient-to-r from-pink-700 to-rose-600" : "bg-gradient-to-r from-rose-500 to-pink-600"}
                description="100 Levels • Expert" 
                onClick={() => onSelectDifficulty(Difficulty.HARD)}
              />
            </div>
            
            {/* Buy Hints Shop Card - Compact */}
            <div 
              onClick={onOpenHintShop}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white p-2.5 rounded-xl shadow-lg cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between min-h-[56px] w-full hover:shadow-xl hover:-translate-y-1 mt-1 border-2 border-yellow-300/80 hover:border-yellow-200"
            >
              {/* Animated Background Elements - Smaller */}
              <div className="absolute -left-3 -bottom-3 opacity-20 text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                💡
              </div>
              <div className="absolute top-1 right-1 text-2xl opacity-15 group-hover:scale-110 transition-transform">
                🐕
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="z-10 flex flex-col pl-1.5 flex-1">
                <h3 className="text-base font-black leading-none drop-shadow-md flex items-center gap-1.5">
                  <span>🛒</span>
                  <span>Buy Hints</span>
                </h3>
                <p className="text-white/95 text-[10px] font-semibold mt-0.5 flex items-center gap-1">
                  <span>💎</span>
                  <span>Total: {progress.premiumHints || 0}</span>
                </p>
              </div>

              <div className="z-10 flex flex-col items-end pr-1.5">
                <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg shadow-md border border-white/40">
                  {hasOffer ? (
                    <>
                      <span className="text-[10px] line-through opacity-70 font-medium">₹{marketPrice}</span>
                      <span className="font-black text-sm">₹{offerPrice}</span>
                    </>
                  ) : (
                    <span className="font-black text-sm">₹{offerPrice}</span>
                  )}
                </div>
                <span className="text-[9px] mt-0.5 opacity-95 uppercase font-bold tracking-wider drop-shadow-sm flex items-center gap-0.5">
                  <span>📦</span>
                  <span>{hintCount} Pack</span>
                </span>
              </div>
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

