import React from 'react';
import { ThemeConfig } from '../types';
import { DailyCheckInData } from '../types/dailyCheckIn';

interface DailyCheckInButtonProps {
  checkInData: DailyCheckInData | null;
  loading: boolean;
  onClick: () => void;
  activeTheme: ThemeConfig;
}

export const DailyCheckInButton: React.FC<DailyCheckInButtonProps> = ({
  checkInData,
  loading,
  onClick,
  activeTheme
}) => {
  const hasCheckedInToday = checkInData?.hasCheckedInToday || false;
  const streak = checkInData?.checkInStreak || 0;

  const getButtonText = () => {
    if (hasCheckedInToday) {
      return "✓ Checked In Today!";
    }
    return "🎁 Daily Check-In";
  };

  const getStreakText = () => {
    if (streak > 0) {
      return `🔥 ${streak} Day Streak!`;
    }
    return "Start Your Streak!";
  };

  const streakFreezeAvailable = (checkInData as { streakFreezeAvailable?: boolean })?.streakFreezeAvailable;
  const hasUsedFreezeThisWeek = (checkInData as { hasUsedFreezeThisWeek?: boolean })?.hasUsedFreezeThisWeek;

  return (
    <button
      onClick={onClick}
      disabled={hasCheckedInToday || loading}
      className={`
        w-full h-full relative overflow-hidden rounded-lg p-2 border-2 transition-all duration-300
        ${hasCheckedInToday
          ? 'cursor-not-allowed opacity-60'
          : 'hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95'
        }
        ${loading ? 'opacity-50 cursor-wait' : ''}
      `}
      style={{
        background: hasCheckedInToday
          ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        boxShadow: hasCheckedInToday
          ? 'none'
          : '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Decorative icons — pointer-events-none so they never block taps */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1 left-1 text-lg">🐕</div>
        <div className="absolute bottom-1 right-1 text-base">🎁</div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none">
        <div className={`text-sm font-black ${activeTheme.text} text-center`}>
          {loading ? '⏳ Loading...' : getButtonText()}
        </div>
        <div className={`text-xs font-bold ${activeTheme.subText} text-center mt-0.5`}>
          {getStreakText()}
        </div>
        {streakFreezeAvailable && !hasUsedFreezeThisWeek && streak > 0 && (
          <div className="text-[9px] mt-0.5 text-amber-600 dark:text-amber-400 font-bold text-center">🧊 1 freeze this week</div>
        )}
      </div>

      {/* Streak badge — pointer-events-none */}
      {streak > 0 && !hasCheckedInToday && (
        <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black animate-pulse pointer-events-none select-none">
          {streak}
        </div>
      )}

      {/* Checkmark — pointer-events-none */}
      {hasCheckedInToday && (
        <div className="absolute top-1 right-1 text-xl animate-bounce pointer-events-none select-none">✓</div>
      )}
    </button>
  );
};
