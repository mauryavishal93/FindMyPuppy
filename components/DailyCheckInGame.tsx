import React, { useState, useEffect, useCallback } from 'react';
import { DailyMission, HiddenObject, getMissionByDay } from '../types/dailyCheckIn';
import { ThemeConfig } from '../types';

interface DailyCheckInGameProps {
  missionDay: number;
  onComplete: () => void | Promise<void>; // Can be sync or async
  onClose: () => void;
  onGameStarted: () => void; // Callback when game starts (marks as played)
  onGameFinished: () => void; // Callback when game finishes (success or failure) - navigates to HOME
  activeTheme: ThemeConfig;
}

const GAME_TIME = 45; // 45 seconds

export const DailyCheckInGame: React.FC<DailyCheckInGameProps> = ({
  missionDay,
  onComplete,
  onClose,
  onGameStarted,
  onGameFinished,
  activeTheme
}) => {
  const mission = getMissionByDay(missionDay);
  const [objects, setObjects] = useState<HiddenObject[]>(
    mission.objects.map(obj => ({ ...obj, found: false }))
  );
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false); // Prevent multiple completion calls
  
  // Loading states
  const [loadingState, setLoadingState] = useState<'loading' | 'complete'>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver || success) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, success]);

  // Check for success
  useEffect(() => {
    if (objects.every(obj => obj.found) && objects.length > 0 && gameStarted && !isCompleting) {
      setSuccess(true);
      setGameOver(true);
      setShowAnimation(true);
      setIsCompleting(true); // Prevent multiple calls
      
      // Mark as complete when success is achieved (only once)
      onComplete().catch(err => {
        console.error('Error completing daily check-in:', err);
        setIsCompleting(false); // Reset on error
      });
      
      // Auto-close after 5 seconds if user doesn't click close button
      const autoCloseTimer = setTimeout(() => {
        onGameFinished();
      }, 5000);
      
      return () => clearTimeout(autoCloseTimer);
    }
  }, [objects, gameStarted, isCompleting, onComplete, onGameFinished]);

  // Load background image and prepare game
  useEffect(() => {
    if (!mission.backgroundImage) {
      setLoadError(true);
      setLoadingState('complete');
      return;
    }

    setLoadingState('loading');
    setLoadingProgress(0);
    setLoadError(false);

    let mounted = true;

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (!mounted) {
        clearInterval(progressInterval);
        return;
      }
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Don't go to 100% until image loads
        return prev + Math.random() * 15; // Increment by 0-15%
      });
    }, 200);

    const handleAssetLoad = (isError: boolean = false) => {
      if (!mounted) return;

      clearInterval(progressInterval);
      
      if (isError) {
        setLoadError(true);
      }

      setLoadingProgress(100);

      // Add a small delay to show 100% progress
      setTimeout(() => {
        if (mounted) {
          setLoadingState('complete');
        }
      }, 300);
    };

    // Load Background Image
    const bgImg = new Image();
    bgImg.src = mission.backgroundImage;
    bgImg.onload = () => {
      if (mounted) {
        setLoadingProgress(100);
        handleAssetLoad(false);
      }
    };
    bgImg.onerror = () => {
      console.error(`Failed to load background: ${mission.backgroundImage}`);
      if (mounted) {
        handleAssetLoad(true);
      }
    };

    return () => {
      mounted = false;
      clearInterval(progressInterval);
    };
  }, [mission.backgroundImage]);

  const handleObjectClick = useCallback((objectId: string) => {
    if (gameOver || success || !gameStarted) return;

    setObjects(prev => 
      prev.map(obj => 
        obj.id === objectId ? { ...obj, found: true } : obj
      )
    );
  }, [gameOver, success, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    // Mark as played when game starts (one chance per day)
    onGameStarted();
  };

  const foundCount = objects.filter(obj => obj.found).length;
  const totalCount = objects.length;
  const progress = (foundCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl h-full max-h-[90vh] ${activeTheme.cardBg} rounded-3xl shadow-2xl overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`${activeTheme.headerBg} p-4 flex items-center justify-between border-b-2 ${activeTheme.accent} border-opacity-30`}>
          <div>
            <h2 className={`text-xl font-black ${activeTheme.text}`}>{mission.title}</h2>
            <p className={`text-sm ${activeTheme.subText}`}>{mission.description}</p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${activeTheme.iconBg} hover:opacity-80 transition-opacity`}
          >
            <i className={`fas fa-times ${activeTheme.text}`}></i>
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative overflow-hidden">
          {loadingState === 'loading' ? (
            // Loading Screen with Progress Bar
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-6xl mb-6 animate-pulse">🐕</div>
              <h3 className={`text-2xl font-black mb-4 ${activeTheme.text}`}>Loading Challenge...</h3>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs mb-4">
                <div className={`h-4 rounded-full ${activeTheme.cardBg} backdrop-blur-md shadow-lg overflow-hidden border-2 ${activeTheme.accent} border-opacity-30`}>
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className={`text-center text-sm mt-2 ${activeTheme.subText}`}>
                  {loadingProgress}%
                </p>
              </div>

              {loadError && (
                <p className={`text-xs ${activeTheme.subText} text-center mt-2`}>
                  ⚠️ Background image failed to load, but you can still play!
                </p>
              )}
            </div>
          ) : !gameStarted ? (
            // Start Screen (shown after loading completes)
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-6xl mb-4">🐕</div>
              <h3 className={`text-3xl font-black mb-2 ${activeTheme.text}`}>Ready to Play?</h3>
              <p className={`text-center mb-6 ${activeTheme.subText}`}>
                Find all {totalCount} hidden objects in {GAME_TIME} seconds!
              </p>
              <button
                onClick={startGame}
                className={`px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all hover:scale-105`}
              >
                Start Challenge
              </button>
            </div>
          ) : showAnimation ? (
            // Success Animation
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-400 to-orange-500">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <div className="text-6xl mb-4 animate-pulse">🐕</div>
              <h3 className="text-4xl font-black text-white mb-2 drop-shadow-lg">Great Job!</h3>
              <p className="text-xl text-white/90 font-bold drop-shadow-md">+5 Hints Added!</p>
              <p className="text-sm text-white/80 mt-2 mb-6">{mission.animation}</p>
              <button
                onClick={async () => {
                  // Only complete if not already completing
                  if (!isCompleting) {
                    setIsCompleting(true);
                    await onComplete();
                  }
                  onGameFinished();
                }}
                className="px-8 py-3 rounded-xl font-black text-white bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all hover:scale-105"
              >
                Close
              </button>
            </div>
          ) : gameOver && !success ? (
            // Failure Screen
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-6xl mb-4">😢</div>
              <h3 className={`text-3xl font-black mb-2 ${activeTheme.text}`}>Time's Up!</h3>
              <p className={`text-center mb-6 ${activeTheme.subText}`}>
                You found {foundCount} out of {totalCount} objects.
              </p>
              <p className={`text-sm mb-4 ${activeTheme.subText} text-center`}>
                Daily check-in complete! You've earned 5 hints for today's game.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    // Only complete if not already completing
                    if (!isCompleting) {
                      setIsCompleting(true);
                      await onComplete();
                    }
                    // Close and return to home screen
                    onGameFinished();
                  }}
                  className={`px-6 py-2 rounded-xl font-bold ${activeTheme.accent} shadow-lg hover:shadow-xl transition-all`}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Game Scene
            <div className="relative w-full h-full overflow-hidden">
              {/* Scene Background */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: loadError 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : `url("${mission.backgroundImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Dark overlay to make objects harder to see */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Hidden Objects */}
                {objects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => handleObjectClick(obj.id)}
                    disabled={obj.found}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2
                      transition-all duration-300 z-10
                      ${obj.found 
                        ? 'opacity-0 scale-0 pointer-events-none' 
                        : 'opacity-50 hover:opacity-70 active:scale-95 cursor-pointer'
                      }
                    `}
                    style={{
                      left: `${obj.x}%`,
                      top: `${obj.y}%`,
                    }}
                    title={obj.name}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      bg-white/40 backdrop-blur-sm border-2 border-white/30
                      shadow-lg hover:shadow-xl
                      transition-all duration-200
                      ${obj.found ? 'hidden' : ''}
                    `}>
                      <span className="text-2xl drop-shadow-lg">{obj.icon}</span>
                    </div>
                    {!obj.found && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${activeTheme.cardBg} ${activeTheme.text} shadow-lg border border-white/30 backdrop-blur-sm`}>
                          {obj.name}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* UI Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                {/* Timer */}
                <div className={`px-4 py-2 rounded-xl ${activeTheme.cardBg} backdrop-blur-md shadow-lg border-2 ${activeTheme.accent} border-opacity-30`}>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock text-lg"></i>
                    <span className={`text-xl font-black ${activeTheme.text}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className={`px-4 py-2 rounded-xl ${activeTheme.cardBg} backdrop-blur-md shadow-lg border-2 ${activeTheme.accent} border-opacity-30`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${activeTheme.text}`}>
                      {foundCount}/{totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className={`h-3 rounded-full ${activeTheme.cardBg} backdrop-blur-md shadow-lg overflow-hidden`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
