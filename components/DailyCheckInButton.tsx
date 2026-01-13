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
          label: "Daily",
          subLabel: "Challenge",
          icon: '🎯',
          enabled: true,
          gradient: 'from-purple-500 to-pink-500',
          border: 'border-purple-300',
          glow: 'shadow-purple-500/50'
        };
      case 'completed':
        return {
          label: "Daily",
          subLabel: "Done",
          icon: '✅',
          enabled: false,
          gradient: 'from-gray-400 to-gray-500',
          border: 'border-gray-300',
          glow: 'shadow-gray-500/30'
        };
      case 'missed':
        return {
          label: "Daily",
          subLabel: "New Day",
          icon: '🆕',
          enabled: true,
          gradient: 'from-orange-500 to-red-500',
          border: 'border-orange-300',
          glow: 'shadow-orange-500/50'
        };
      default:
        return {
          label: "Daily",
          subLabel: "Challenge",
          icon: '🎯',
          enabled: true,
          gradient: 'from-purple-500 to-pink-500',
          border: 'border-purple-300',
          glow: 'shadow-purple-500/50'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={onClick}
      disabled={!config.enabled || loading}
      className={`
        relative w-full min-h-[68px] rounded-2xl shadow-2xl transition-all
        bg-gradient-to-br ${config.gradient}
        border-2 ${config.border}
        ${config.glow}
        ${config.enabled && !loading 
          ? 'hover:shadow-3xl hover:-translate-y-1 hover:scale-[1.02] active:scale-95 cursor-pointer' 
          : 'opacity-60 cursor-not-allowed'
        }
        ${loading ? 'animate-pulse' : ''}
        flex items-center justify-between px-4
        overflow-hidden
      `}
      style={{
        boxShadow: '0 10px 24px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.15)',
        transform: 'perspective(1000px) rotateX(2deg)',
      }}
    >
      {/* Enhanced 3D Effect Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-2xl"></div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-transparent to-black/15 rounded-b-2xl"></div>

      {/* Enhanced Animated Background Pattern */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white/15 rounded-full blur-3xl"></div>
        {/* Sparkle effects */}
        <div className="absolute top-2 right-1/4 text-xs opacity-30 animate-pulse">✨</div>
        <div className="absolute bottom-2 left-1/3 text-xs opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>

      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>

      {/* Content - Left Side - Enhanced */}
      <div className="relative z-10 flex items-center gap-3 text-white">
        {/* Main Icon - Animated */}
        <div className="text-4xl drop-shadow-2xl transform hover:scale-125 transition-transform animate-bounce" style={{ animationDuration: '2s' }}>
          {config.icon}
        </div>
        
        {/* Label - Enhanced */}
        <div className="flex flex-col items-start">
          <span className="text-lg font-black leading-none drop-shadow-2xl bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
            {config.label}
          </span>
          <span className="text-sm font-bold leading-none drop-shadow-lg mt-0.5 opacity-95 flex items-center gap-1">
            <span>{config.subLabel}</span>
            <span className="text-xs animate-pulse">🎯</span>
          </span>
        </div>
      </div>

      {/* Right Side - Badge */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Hint Streak Badge - Enhanced */}
        {hintStreak > 0 && (
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 text-white rounded-xl px-3 py-2 flex flex-col items-center justify-center border-2 border-white/60 shadow-2xl transform hover:scale-110 transition-transform"
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.5)',
            }}
          >
            <span className="text-xs font-black leading-none flex items-center gap-1">
              <span>💎</span>
              <span>Hints</span>
            </span>
            <span className="text-xl font-black leading-none mt-0.5 animate-pulse">{hintStreak}</span>
            <span className="text-xs absolute -top-1 -right-1 animate-bounce">✨</span>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-20">
          <div className="animate-spin">
            <i className="fas fa-spinner text-white text-lg"></i>
          </div>
        </div>
      )}

      {/* Completed Checkmark Overlay */}
      {state === 'completed' && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl z-20">
          <div className="text-2xl text-white">✓</div>
        </div>
      )}
    </button>
  );
};
