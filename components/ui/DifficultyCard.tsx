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
  // Get puppy emoji and unique design based on difficulty
  const getCardConfig = () => {
    switch (difficulty) {
      case 'Easy':
        return {
          emoji: '🐕',
          bgEmoji: '🐕',
          shape: 'rounded-2xl', // Soft rounded
          borderStyle: 'border-2 border-white/40',
          icon: '🌱',
          pattern: 'diagonal'
        };
      case 'Medium':
        return {
          emoji: '🐶',
          bgEmoji: '🐶',
          shape: 'rounded-xl', // Medium rounded
          borderStyle: 'border-2 border-white/50 border-dashed',
          icon: '⚡',
          pattern: 'circular'
        };
      case 'Hard':
        return {
          emoji: '🐾',
          bgEmoji: '🔥',
          shape: 'rounded-lg', // Sharp corners
          borderStyle: 'border-2 border-white/60',
          icon: '💪',
          pattern: 'zigzag'
        };
      default:
        return {
          emoji: '🐕',
          bgEmoji: '🐕',
          shape: 'rounded-2xl',
          borderStyle: 'border-2 border-white/40',
          icon: '🌱',
          pattern: 'diagonal'
        };
    }
  };

  const config = getCardConfig();

  return (
    <div 
      onClick={onClick}
      className={`${color} text-white p-2.5 ${config.shape} shadow-md cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between min-h-[56px] w-full hover:shadow-xl hover:-translate-y-1 active:scale-95 ${config.borderStyle} hover:border-white/70`}
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
      <div className={`absolute -left-1 -bottom-1 opacity-20 ${difficulty === 'Easy' ? 'text-4xl' : difficulty === 'Medium' ? 'text-5xl' : 'text-6xl'} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
        {config.bgEmoji}
      </div>
      
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Unique Decorative Elements per difficulty */}
      {difficulty === 'Easy' && (
        <div className="absolute top-0.5 right-0.5 text-base opacity-25 group-hover:opacity-35 transition-opacity">
          🌿
        </div>
      )}
      {difficulty === 'Medium' && (
        <div className="absolute top-0.5 right-0.5 text-base opacity-25 group-hover:opacity-35 transition-opacity">
          ⚡
        </div>
      )}
      {difficulty === 'Hard' && (
        <div className="absolute top-0.5 right-0.5 text-base opacity-25 group-hover:opacity-35 transition-opacity">
          💥
        </div>
      )}
      
      <div className="z-10 flex flex-col pl-1.5 flex-1">
        <h3 className="text-base font-black leading-none drop-shadow-md flex items-center gap-1.5">
          <span className="text-lg">{config.emoji}</span>
          <span>{difficulty}</span>
        </h3>
        <p className="text-white/95 text-[10px] font-semibold mt-0.5 flex items-center gap-1">
          <span>{config.icon}</span>
          <span>{description}</span>
        </p>
      </div>

      <div className="z-10 flex flex-col items-end pr-1.5">
        <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg shadow-md border border-white/40">
          <span className="text-sm">⭐</span>
          <span className="font-black text-sm">{points}</span>
        </div>
        <span className="text-[9px] mt-0.5 opacity-95 uppercase font-bold tracking-wider drop-shadow-sm flex items-center gap-0.5">
          <span>🏆</span>
          <span>Pts</span>
        </span>
      </div>
    </div>
  );
};

