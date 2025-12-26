
import React from 'react';
import { Difficulty } from '../types';

interface LevelSelectorProps {
  difficulty: Difficulty;
  clearedLevels: { [key: string]: boolean };
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  difficulty, 
  clearedLevels, 
  onSelectLevel,
  onBack,
  isMuted,
  onToggleMute
}) => {
  const levels = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
         <i className="fas fa-paw absolute top-5 left-1/4 text-6xl text-brand/5 rotate-45"></i>
         <i className="fas fa-paw absolute bottom-1/4 right-5 text-8xl text-brand/5 -rotate-12"></i>
         <i className="fas fa-bone absolute top-1/2 left-5 text-5xl text-slate-300/20 rotate-90"></i>
         <i className="fas fa-paw absolute -bottom-5 left-10 text-9xl text-brand/5 rotate-12"></i>
         <i className="fas fa-dog absolute top-20 right-10 text-7xl text-brand/5 rotate-12"></i>
         <i className="fas fa-cloud absolute top-40 left-[-20px] text-8xl text-white/40"></i>
      </div>

      <div className="p-4 border-b border-white/50 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition text-brand shadow-sm border border-transparent hover:border-brand/20">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{difficulty} Levels</h2>
        <button 
          onClick={onToggleMute}
          className="w-10 h-10 rounded-full bg-white/80 border border-white flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand transition-all shadow-sm"
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-transparent z-10 relative">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pb-20">
          {levels.map((level) => {
            const levelKey = `${difficulty}_${level}`;
            const isCleared = clearedLevels[levelKey];
            const previousKey = `${difficulty}_${level - 1}`;
            const isLocked = level > 1 && !clearedLevels[previousKey];

            return (
              <button
                key={level}
                disabled={isLocked}
                onClick={() => onSelectLevel(level)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative shadow-sm transition-all duration-300
                  ${isLocked 
                    ? 'bg-slate-100/80 text-slate-300 cursor-not-allowed border border-slate-200' 
                    : isCleared 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-emerald-300 text-emerald-600 hover:scale-105 active:scale-95 shadow-emerald-200/50' 
                      : 'bg-white border-2 border-brand/50 text-brand hover:border-brand hover:scale-105 active:scale-95 shadow-brand/20'
                  }
                `}
              >
                {isLocked ? (
                  <i className="fas fa-lock text-xl mb-1 opacity-50"></i>
                ) : isCleared ? (
                  <div className="relative">
                    <i className="fas fa-star text-2xl mb-1 text-yellow-400 drop-shadow-sm"></i>
                    <i className="fas fa-check absolute -bottom-1 -right-2 text-xs bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white"></i>
                  </div>
                ) : (
                  <span className="text-2xl font-black mb-1">{level}</span>
                )}
                
                {!isLocked && (
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    {isCleared ? 'Done' : 'Play'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
