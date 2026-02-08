import React, { useState, useEffect, useRef } from 'react';
import { Difficulty, UserProgress, ThemeConfig } from '../types';
import { DifficultyCard } from '../components/ui/DifficultyCard';
import { GameLogo } from '../components/GameLogo';
import { renderThemeBackground } from '../utils/themeBackground';
import { UserDropdown } from '../components/ui/UserDropdown';
import { db, PriceOffer } from '../services/db';
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { DailyCheckInButton } from '../components/DailyCheckInButton';
import { PuppyFeeding } from '../components/PuppyFeeding';
import { PuppyEndlessGame } from '../components/PuppyEndlessGame';
import { LeaderboardModal } from '../components/modals/LeaderboardModal';

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
  onOpenAchievements?: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  priceOffer: PriceOffer | null;
  onHintsUpdated?: (newHints: number) => void;
  onPointsUpdated?: (newPoints: number) => void;
  isActiveView?: boolean;
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
  onOpenAchievements,
  onLogout,
  onOpenLogin,
  priceOffer,
  onHintsUpdated,
  onPointsUpdated,
  isActiveView = true
}) => {
  // Use price offer values if available, otherwise fallback to defaults
  const marketPrice = priceOffer?.marketPrice || 99;
  const offerPrice = priceOffer?.offerPrice || 9;
  const hintCount = priceOffer?.hintCount || 100;
  const offerReason = priceOffer?.offerReason || 'Special Offer';
  const hasOffer = marketPrice !== offerPrice;
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const [showPuppyFeeding, setShowPuppyFeeding] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyPuzzle, setShowDailyPuzzle] = useState(false);
  const [comebackEligible, setComebackEligible] = useState(false);
  const [claimingComeback, setClaimingComeback] = useState(false);
  const [weeklyChallenge, setWeeklyChallenge] = useState<{ totalProgress: number; target: number; claimed: boolean } | null>(null);
  const [claimingWeekly, setClaimingWeekly] = useState(false);
  
  const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];

  // Daily Puzzle Hook
  const { hasCompletedToday: dailyPuzzleCompletedToday, loading: dailyPuzzleLoading, completePuzzle } = useDailyPuzzle(progress.playerName || null);

  // Daily Check-In Hook
  const {
    checkInData,
    loading: checkInLoading,
    completeCheckIn
  } = useDailyCheckIn({
    username: progress.playerName || null,
    onPointsUpdated,
    onHintsUpdated
  });

  const handleDailyCheckInClick = () => {
    if (!checkInData?.hasCheckedInToday) {
      setShowPuppyFeeding(true);
    }
  };

  const handleFeedPuppy = async () => {
    return await completeCheckIn();
  };

  const handleDailyGameComplete = async (gameId: string, score: number) => {
    const res = await completePuzzle(gameId, score);
    if (res.success && res.totalHints !== undefined && onHintsUpdated) onHintsUpdated(res.totalHints);
    return res;
  };

  useEffect(() => {
    if (progress.playerName) {
      db.getComebackBonusEligibility(progress.playerName).then((r) => {
        if (r.success && r.eligible) setComebackEligible(true);
      });
      db.getWeeklyChallenge(progress.playerName).then((r) => {
        if (r.success && r.target) setWeeklyChallenge({
          totalProgress: r.totalProgress ?? 0,
          target: r.target.total ?? 5,
          claimed: r.claimed ?? false
        });
      });
    } else {
      setWeeklyChallenge(null);
      setComebackEligible(false);
    }
  }, [progress.playerName, isActiveView]);

  const handleClaimComeback = async () => {
    if (!progress.playerName) return;
    setClaimingComeback(true);
    try {
      const res = await db.claimComebackBonus(progress.playerName);
      if (res.success && res.totalHints !== undefined && onHintsUpdated) {
        onHintsUpdated(res.totalHints);
        setComebackEligible(false);
      }
    } finally {
      setClaimingComeback(false);
    }
  };

  const handleClaimWeekly = async () => {
    if (!progress.playerName) return;
    setClaimingWeekly(true);
    try {
      const res = await db.claimWeeklyChallenge(progress.playerName);
      if (res.success && res.totalHints !== undefined && onHintsUpdated) {
        onHintsUpdated(res.totalHints);
        setWeeklyChallenge((prev) => prev ? { ...prev, claimed: true } : null);
      }
    } finally {
      setClaimingWeekly(false);
    }
  };

  const showReminderBanner = progress.playerName && (
    (!checkInData?.hasCheckedInToday) || (!dailyPuzzleCompletedToday)
  );
  const dailyGameLabel = dailyPuzzleCompletedToday ? '✓ Jump Done' : '🐕 Puppy Jump';
  
  const handleNextDifficulty = () => {
    setPrevIndex(currentDifficultyIndex);
    setSwipeDirection('right');
    setCurrentDifficultyIndex((prev) => (prev + 1) % difficulties.length);
  };
  
  const handlePrevDifficulty = () => {
    setPrevIndex(currentDifficultyIndex);
    setSwipeDirection('left');
    setCurrentDifficultyIndex((prev) => (prev - 1 + difficulties.length) % difficulties.length);
  };
  
  const handleDifficultySelect = () => {
    onSelectDifficulty(difficulties[currentDifficultyIndex]);
  };
  
  // Reset swipe direction and prev index after animation completes
  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null);
        setPrevIndex(null);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [swipeDirection, currentDifficultyIndex]);
  
  // Simple smooth swipe handlers - uses same logic as arrow buttons
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
    
    // Use the same handlers as arrow buttons for consistent animation
    if (isLeftSwipe) {
      handleNextDifficulty(); // Same as clicking right arrow
    } else if (isRightSwipe) {
      handlePrevDifficulty(); // Same as clicking left arrow
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className={`flex flex-col h-full ${activeTheme.background} relative overflow-hidden transition-colors duration-500`}>
      
      {/* Decorative Landscape Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {renderThemeBackground(activeTheme.id)}
      </div>

      {/* Reduced Floating Puppy Decorations - Less Clutter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        {/* Minimal Animated Paw Prints */}
        <div className="absolute top-16 left-4 text-xl opacity-15 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
          🐾
        </div>
        <div className="absolute bottom-32 right-8 text-lg opacity-12 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          🐾
        </div>
        
        {/* Minimal Happy Puppies */}
        <div className="absolute top-32 right-12 text-lg opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>
          🐕
        </div>
      </div>

      <header className={`mobile-header ${activeTheme.headerBg} backdrop-blur-md shadow-sm flex justify-between z-[100] sticky top-0 border-b shrink-0 relative transition-all duration-500 py-2 px-2`}>
        <div className="flex items-center gap-2 relative">
          {progress.playerName ? (
            <>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 hover:opacity-80 transition-all group"
              >
                <div className={`bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border border-white shadow-sm cursor-pointer group-hover:scale-110 transition-transform relative overflow-hidden`}>
                  <span className="relative z-10">{progress.playerName.charAt(0).toUpperCase()}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-bold uppercase tracking-wider opacity-70 ${activeTheme.text} flex items-center gap-0.5`}>
                    <span className="text-xs">🐾</span> Player
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
                onAchievementsClick={onOpenAchievements}
                onLogout={onLogout}
              />
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${activeTheme.cardBg} ${activeTheme.text} border border-white/30 shadow-md hover:scale-105 active:scale-95 transition-all`}
            >
              <i className="fas fa-sign-in-alt"></i>
              Login
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/findmypuppy.apk"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${activeTheme.iconBg} hover:scale-110 active:scale-95 hover:rotate-12`}
            title="Download Android APK"
          >
            <i className={`fas fa-download text-sm ${activeTheme.text}`}></i>
          </a>

          {/* Music Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)} 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${activeTheme.iconBg} hover:scale-110 active:scale-95 relative z-30`}
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-sm ${activeTheme.text}`}></i>
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

          <button
            onClick={() => setShowLeaderboard(true)}
            className={`backdrop-blur-sm px-2 py-1 rounded-full font-bold flex items-center gap-1 border border-white/80 shadow-sm ${activeTheme.cardBg} ${activeTheme.accent} hover:scale-105 transition-transform cursor-pointer`}
          >
            <span className="text-sm">🏆</span>
            <span className="text-xs">{progress.totalScore}</span>
          </button>
        </div>
      </header>
      
      <main className="mobile-main-content flex-1 px-2 py-2 overflow-y-auto overflow-x-hidden flex flex-col items-center z-10 w-full hide-scrollbar">
        <div className="w-full max-w-sm flex flex-col gap-3 pb-4">
          {/* Welcome Card with Logo - Compact Design */}
          <div className={`flex flex-row items-center text-center p-2 rounded-xl backdrop-blur-md shadow-lg border-2 relative overflow-hidden w-full ${activeTheme.cardBg} transition-all duration-300 shrink-0`}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.2)',
            }}
          >
             {/* Animated Rainbow Border */}
             <div 
               className="absolute top-0 left-0 w-full h-1 opacity-60 animate-pulse"
               style={{
                 background: 'linear-gradient(to right, #f472b6, #fbbf24, #34d399, #60a5fa, #a78bfa)',
               }}
             ></div>
             
             {/* Logo Section */}
             <div className="flex-shrink-0 mr-2">
               <GameLogo className="w-10 h-10 drop-shadow-lg" />
             </div>
             
             {/* Text Section */}
             <div className="flex-1 relative z-10 text-left">
               <h2 className={`text-sm font-black tracking-tight ${activeTheme.text} mb-0.5 flex items-center gap-1`}>
                 <span className="text-xs">🐕</span>
                 <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                   Find My Puppy
                 </span>
               </h2>
               <p className={`font-semibold text-[9px] ${activeTheme.subText} flex items-center gap-0.5`}>
                 <span className="text-[10px]">🔍</span>
                 <span>Find hidden puppies!</span>
               </p>
             </div>
          </div>
          
          {/* Comeback bonus banner */}
          {progress.playerName && comebackEligible && (
            <div className="w-full shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-3 text-white shadow-lg border-2 border-amber-300">
              <p className="text-sm font-bold mb-2">Welcome back! 🎉</p>
              <p className="text-xs opacity-95 mb-2">Claim 5 free hints for returning.</p>
              <button
                onClick={handleClaimComeback}
                disabled={claimingComeback}
                className="bg-white text-amber-700 px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {claimingComeback ? 'Claiming...' : 'Claim 5 Hints'}
              </button>
            </div>
          )}

          {/* Reminder banner */}
          {showReminderBanner && !comebackEligible && (
            <div className={`w-full shrink-0 rounded-lg p-2 border-2 ${activeTheme.cardBg} ${activeTheme.text} border-amber-400/50 flex items-center gap-2`}>
              <span className="text-lg">💡</span>
              <span className="text-xs font-bold">Don&apos;t forget: Daily check-in &amp; run available for bonus hints!</span>
            </div>
          )}

          {/* Weekly challenge */}
          {progress.playerName && weeklyChallenge && !weeklyChallenge.claimed && (
            <div className={`w-full shrink-0 rounded-xl p-3 border-2 ${activeTheme.cardBg} ${activeTheme.text} border-indigo-400/50`}>
              <p className="text-sm font-bold flex items-center gap-2">
                <span>📅</span> Weekly: Clear 5 levels
              </p>
              <p className="text-xs mt-1 opacity-90">
                Progress: {weeklyChallenge.totalProgress}/{weeklyChallenge.target}
                {weeklyChallenge.totalProgress >= weeklyChallenge.target && (
                  <button
                    onClick={handleClaimWeekly}
                    disabled={claimingWeekly}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded font-bold text-xs"
                  >
                    {claimingWeekly ? '...' : 'Claim 5 Hints'}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Daily Check-In Button */}
          {progress.playerName && (
            <div className="w-full shrink-0 flex gap-2">
              <div className="flex-1">
                <DailyCheckInButton
                  checkInData={checkInData}
                  loading={checkInLoading}
                  onClick={handleDailyCheckInClick}
                  activeTheme={activeTheme}
                />
              </div>
              <button
                onClick={() => setShowDailyPuzzle(true)}
                disabled={dailyPuzzleCompletedToday || dailyPuzzleLoading}
                className={`flex-1 rounded-lg p-2 border-2 transition-all text-center ${
                  dailyPuzzleCompletedToday
                    ? 'opacity-60 cursor-not-allowed border-purple-300/50 bg-purple-500/20'
                    : 'border-purple-400 bg-gradient-to-br from-purple-500 to-indigo-600 hover:scale-105 active:scale-95 text-white font-bold shadow-lg'
                }`}
              >
                <span className="text-sm block">{dailyGameLabel}</span>
                <span className="text-[10px] block mt-0.5 opacity-90">{dailyPuzzleCompletedToday ? 'Today' : 'Jump & duck · +3 Hints'}</span>
              </button>
            </div>
          )}

          {/* Difficulty Carousel - Single Card with Navigation - Compact */}
          <div className="flex flex-col items-center justify-center w-full shrink-0 py-1">
            <div className="relative w-full overflow-visible">
              {/* Left Arrow - Compact */}
              <button
                onClick={handlePrevDifficulty}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-7 h-7 rounded-full ${activeTheme.cardBg} ${activeTheme.text} shadow-lg border border-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all backdrop-blur-md opacity-40 hover:opacity-100 active:opacity-100 focus:opacity-100`}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)',
                }}
                aria-label="Previous difficulty"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>

              {/* Difficulty Card Carousel - Compact */}
              <div className="relative overflow-visible w-full">
                <div 
                  className="relative w-full" 
                  style={{ 
                    aspectRatio: '2', 
                    minHeight: '100px',
                    touchAction: 'pan-x',
                  }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
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
                    const wasPrevActive = prevIndex !== null && index === prevIndex;
                    
                    // Calculate completed levels for this difficulty
                    // The clearedLevels keys use format: "Easy_1", "Medium_5", "Hard_10", etc.
                    // difficulty is already the enum value: "Easy", "Medium", or "Hard"
                    const getCompletedLevels = () => {
                      // First, try to use clearedLevels object
                      if (progress.clearedLevels && typeof progress.clearedLevels === 'object') {
                        // Use the difficulty enum value directly (e.g., "Easy", "Medium", "Hard")
                        const difficultyPrefix = `${difficulty}_`;
                        const matchingKeys = Object.keys(progress.clearedLevels).filter(
                          key => {
                            const matches = key.startsWith(difficultyPrefix) && progress.clearedLevels[key] === true;
                            return matches;
                          }
                        );
                        return matchingKeys.length;
                      }
                      
                      // Fallback: return 0 if clearedLevels is not available
                      return 0;
                    };
                    const completedLevels = getCompletedLevels();
                    const totalLevels = 100;
                    
                    // Unified animation logic - same for swipe and arrow buttons
                    let animationClass = '';
                    let transformStyle: React.CSSProperties = {};
                    
                    if (isActive) {
                      // Active card - visible and centered
                      animationClass = 'opacity-100 z-10';
                      // Set initial transform for smooth slide-in animation
                      if (swipeDirection === 'right') {
                        // Card sliding in from right (swipe left or click right arrow)
                        transformStyle = { transform: 'translateX(100%)' };
                      } else if (swipeDirection === 'left') {
                        // Card sliding in from left (swipe right or click left arrow)
                        transformStyle = { transform: 'translateX(-100%)' };
                      }
                    } else if (wasPrevActive && swipeDirection === 'right') {
                      // Previous card sliding out to left (swipe left or click right arrow)
                      animationClass = 'opacity-0 -translate-x-full z-0';
                    } else if (wasPrevActive && swipeDirection === 'left') {
                      // Previous card sliding out to right (swipe right or click left arrow)
                      animationClass = 'opacity-0 translate-x-full z-0';
                    } else if (swipeDirection === 'right') {
                      // Non-active cards hidden on left
                      animationClass = 'opacity-0 -translate-x-full z-0';
                    } else if (swipeDirection === 'left') {
                      // Non-active cards hidden on right
                      animationClass = 'opacity-0 translate-x-full z-0';
                    } else {
                      // Default: initial load - no animation
                      animationClass = index < currentDifficultyIndex
                        ? 'opacity-0 -translate-x-full z-0'
                        : 'opacity-0 translate-x-full z-0';
                    }

                    return (
                      <div
                        key={`${difficulty}-${currentDifficultyIndex}`}
                        className={`absolute inset-0 overflow-visible ${animationClass}`}
                        style={{
                          ...transformStyle,
                          transition: swipeDirection ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
                        }}
                        ref={(el) => {
                          // Trigger animation to final position after initial render
                          // Same logic for both swipe and arrow button clicks
                          if (el && isActive && swipeDirection) {
                            requestAnimationFrame(() => {
                              el.style.transform = '';
                            });
                          }
                        }}
                      >
                        <DifficultyCard 
                          difficulty={difficulty} 
                          points={config.points} 
                          color={config.color}
                          description={config.description} 
                          onClick={handleDifficultySelect}
                          completedLevels={completedLevels}
                          totalLevels={totalLevels}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow - Compact */}
              <button
                onClick={handleNextDifficulty}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-7 h-7 rounded-full ${activeTheme.cardBg} ${activeTheme.text} shadow-lg border border-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all backdrop-blur-md opacity-40 hover:opacity-100 active:opacity-100 focus:opacity-100`}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)',
                }}
                aria-label="Next difficulty"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>

              {/* Dots Indicator - Compact */}
              <div className="flex justify-center gap-1.5 mt-2">
                {difficulties.map((difficulty, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDifficultyIndex(index)}
                    className={`transition-all transform hover:scale-110 ${
                      index === currentDifficultyIndex 
                        ? 'scale-110' 
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    aria-label={`Go to ${difficulty}`}
                  >
                    <span className="text-lg">
                      {index === currentDifficultyIndex ? '🐕' : '🐾'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
            
          {/* Buy Hints Button - Compact */}
          <div 
            onClick={onOpenHintShop}
            className="text-white p-2 rounded-xl shadow-lg cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between w-full hover:shadow-xl hover:-translate-y-0.5 border-2 border-yellow-300/90 hover:border-yellow-200 shrink-0"
            style={{
              background: 'linear-gradient(to right, #facc15, #fb923c, #f472b6, #fb923c)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
            }}
          >
            {/* 3D Effect Layers */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent rounded-xl"></div>
            
            {/* Animated Background Elements - Reduced */}
            <div className="absolute -left-2 -bottom-2 opacity-20 text-3xl group-hover:scale-110 transition-transform">
              💡
            </div>
            
            <div className="z-10 flex flex-col pl-2 flex-1">
              <h3 className="text-sm font-black leading-tight drop-shadow-lg flex items-center gap-1">
                <span className="text-base">🛒</span>
                <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                  Buy Hints
                </span>
              </h3>
              <p className="text-white/95 text-[10px] font-bold mt-0.5 flex items-center gap-1">
                <span className="text-xs">💎</span>
                <span>Total: {progress.premiumHints || 0}</span>
              </p>
            </div>

            <div className="z-10 flex flex-col items-end pr-2">
              {hasOffer && offerReason && (
                <span className="text-[8px] mb-0.5 opacity-95 uppercase font-bold tracking-wider drop-shadow-sm">
                  {offerReason}
                </span>
              )}
              <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-md border border-white/40">
                {hasOffer ? (
                  <>
                    <span className="text-[9px] line-through opacity-70 font-medium">₹{marketPrice}</span>
                    <span className="font-black text-xs">₹{offerPrice}</span>
                  </>
                ) : (
                  <span className="font-black text-xs">₹{offerPrice}</span>
                )}
              </div>
              <span className="text-[8px] mt-0.5 opacity-95 uppercase font-bold tracking-wider flex items-center gap-0.5">
                <span>📦</span>
                <span>{hintCount} Pack</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Puppy Endless Run (Daily Game) Modal */}
      {showDailyPuzzle && progress.playerName && (
        <PuppyEndlessGame
          onComplete={handleDailyGameComplete}
          onClose={() => setShowDailyPuzzle(false)}
          activeTheme={activeTheme}
          username={progress.playerName}
          highScore={progress.puppyRunHighScore}
        />
      )}

      {/* Daily Check-In Puppy Feeding Modal */}
        {showPuppyFeeding && checkInData && (
          <PuppyFeeding
            onFeed={handleFeedPuppy}
            onClose={() => setShowPuppyFeeding(false)}
            activeTheme={activeTheme}
            puppyAge={checkInData.puppyAge}
            puppySize={checkInData.puppySize}
            streak={checkInData.checkInStreak}
          />
        )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        activeTheme={activeTheme}
        currentUsername={progress.playerName}
      />
    </div>
  );
};

