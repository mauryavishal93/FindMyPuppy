import React from 'react';
import { ThemeConfig } from '../types';
import { DailyCheckInState } from '../types/dailyCheckIn';

interface DailyCheckInButtonProps {
  state: DailyCheckInState;
  loading: boolean;
  onClick: () => void;
  activeTheme: ThemeConfig;
  hintStreak?: number;
}

export const DailyCheckInButton: React.FC<DailyCheckInButtonProps> = ({
  state,
  loading,
  onClick,
  activeTheme,
  hintStreak = 0
}) => {
  const getButtonConfig = () => {
    switch (state) {
      case 'ready':
        return {
          label: "Play Today's Challenge",
          icon: '🎯',
          enabled: true,
          gradient: 'from-purple-500 to-pink-500',
          border: 'border-purple-300'
        };
      case 'completed':
        return {
          label: "Come Back Tomorrow!",
          icon: '✅',
          enabled: false,
          gradient: 'from-gray-400 to-gray-500',
          border: 'border-gray-300'
        };
      case 'missed':
        return {
          label: "New Day Available!",
          icon: '🆕',
          enabled: true,
          gradient: 'from-orange-500 to-red-500',
          border: 'border-orange-300'
        };
      default:
        return {
          label: "Play Today's Challenge",
          icon: '🎯',
          enabled: true,
          gradient: 'from-purple-500 to-pink-500',
          border: 'border-purple-300'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={!config.enabled || loading}
      className={`
        relative w-full p-2.5 rounded-xl shadow-md transition-all
        bg-gradient-to-r ${config.gradient}
        border-2 ${config.border}
        min-h-[56px]
        ${config.enabled && !loading 
          ? 'hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer' 
          : 'opacity-60 cursor-not-allowed'
        }
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="text-xl">{config.icon}</div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-black leading-none drop-shadow-sm">
              {config.label}
            </span>
            {hintStreak > 0 && (
              <span className="text-[10px] font-medium mt-0.5 opacity-90">
                Streak: {hintStreak} hints
              </span>
            )}
          </div>
        </div>
        {loading && (
          <div className="animate-spin">
            <i className="fas fa-spinner text-base"></i>
          </div>
        )}
      </div>
      
      {state === 'completed' && (
        <div className="absolute top-1 right-1 text-[10px] font-bold bg-white/30 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          Done
        </div>
      )}
    </button>
  );
};
