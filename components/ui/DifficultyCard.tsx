import React from 'react';
import { Difficulty } from '../../types';

interface DifficultyCardProps {
  difficulty: Difficulty;
  points: number;
  color: string;
  onClick: () => void;
  description: string;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({ 
  difficulty, 
  points, 
  color, 
  onClick, 
  description 
}) => {
  // Get puppy emoji and unique design based on difficulty with creative puppy-themed icons
  const getCardConfig = () => {
    switch (difficulty) {
      case 'Easy':
        return {
          emoji: '🐕', // Happy puppy
          bgEmoji: '🌳', // Tree/outdoor theme
          shape: 'rounded-2xl', // Soft rounded
          borderStyle: 'border-2 border-white/40',
          icon: '🌱', // Growing/beginner
          pattern: 'diagonal',
          puppyIcon: '🐕‍🦺', // Puppy with vest - safe/easy
          decorative: '🌸' // Flowers - peaceful
        };
      case 'Medium':
        return {
          emoji: '🐶', // Energetic puppy
          bgEmoji: '🏃', // Running theme
          shape: 'rounded-xl', // Medium rounded
          borderStyle: 'border-2 border-white/50 border-dashed',
          icon: '⚡', // Energy
          pattern: 'circular',
          puppyIcon: '🎾', // Ball - active play
          decorative: '⭐' // Stars - achievement
        };
      case 'Hard':
        return {
          emoji: '🐺', // Wolf-like challenge
          bgEmoji: '🔥', // Fire/intense
          shape: 'rounded-lg', // Sharp corners
          borderStyle: 'border-2 border-white/60',
          icon: '💪', // Strength
          pattern: 'zigzag',
          puppyIcon: '🦴', // Bone - challenge reward
          decorative: '⚡' // Lightning - intense
        };
      default:
        return {
          emoji: '🐕',
          bgEmoji: '🐕',
          shape: 'rounded-2xl',
          borderStyle: 'border-2 border-white/40',
          icon: '🌱',
          pattern: 'diagonal',
          puppyIcon: '🐕‍🦺',
          decorative: '🌸'
        };
    }
  };

  const config = getCardConfig();

  return (
    <div 
      onClick={onClick}
      className={`${color} text-white p-3 ${config.shape} shadow-2xl cursor-pointer transition-all relative overflow-hidden group flex flex-col items-center justify-center aspect-square w-full hover:shadow-3xl hover:scale-110 active:scale-95 ${config.borderStyle} hover:border-white/80`}
      style={{
        boxShadow: '0 8px 20px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)',
      }}
    >
      {/* Unique Background Pattern based on difficulty */}
      {config.pattern === 'diagonal' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
        </div>
      )}
      {config.pattern === 'circular' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
        </div>
      )}
      {config.pattern === 'zigzag' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}></div>
        </div>
      )}

      {/* Animated Background Emoji - Different sizes per difficulty */}
      <div className={`absolute -left-1 -bottom-1 opacity-15 ${difficulty === 'Easy' ? 'text-3xl' : difficulty === 'Medium' ? 'text-4xl' : 'text-5xl'} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
        {config.bgEmoji}
      </div>
      
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Unique Decorative Elements per difficulty */}
      {difficulty === 'Easy' && (
        <div className="absolute top-1 right-1 text-sm opacity-25 group-hover:opacity-35 transition-opacity">
          🌿
        </div>
      )}
      {difficulty === 'Medium' && (
        <div className="absolute top-1 right-1 text-sm opacity-25 group-hover:opacity-35 transition-opacity">
          ⚡
        </div>
      )}
      {difficulty === 'Hard' && (
        <div className="absolute top-1 right-1 text-sm opacity-25 group-hover:opacity-35 transition-opacity">
          💥
        </div>
      )}
      
      {/* Main Content - Centered - Enhanced */}
      <div className="z-10 flex flex-col items-center justify-center text-center">
        {/* Creative Puppy Icon - Large with Animation */}
        <div className="text-5xl mb-2 drop-shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all animate-bounce" style={{ animationDuration: '2.5s' }}>
          {config.puppyIcon}
        </div>
        
        {/* Difficulty Name - Enhanced */}
        <h3 className="text-lg font-black leading-none drop-shadow-2xl mb-1.5 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
          {difficulty}
        </h3>
        
        {/* Decorative Element - Animated */}
        <div className="text-xl mb-1.5 opacity-90 animate-pulse">{config.decorative}</div>
        
        {/* Description - Enhanced */}
        <p className="text-white/95 text-xs font-bold flex items-center justify-center gap-1.5 mb-2">
          <span className="text-sm">{config.icon}</span>
          <span>{description}</span>
          <span className="text-xs opacity-80">🎮</span>
        </p>

        {/* Points Badge - Enhanced */}
        <div className="flex items-center gap-1.5 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xl border-2 border-white/50 transform group-hover:scale-110 transition-transform">
          <span className="text-base animate-pulse">⭐</span>
          <span className="font-black text-base">{points}</span>
          <span className="text-xs opacity-80">🏆</span>
        </div>
      </div>
    </div>
  );
};

