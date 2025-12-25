import React from 'react';
import { Difficulty } from '../types';

interface LevelSelectorProps {
  difficulty: Difficulty;
  clearedLevels: { [key: string]: boolean };
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  difficulty, 
  clearedLevels, 
  onSelectLevel,
  onBack
}) => {
  const levels = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
         <i className="fas fa-paw absolute top-5 left-1/4 text-6xl text-brand-light/20 rotate-45"></i>
         <i className="fas fa-paw absolute bottom-1/4 right-5 text-8xl text-brand-light/10 -rotate-12"></i>
         <i className="fas fa-bone absolute top-1/2 left-5 text-5xl text-slate-200 rotate-90"></i>
         <i className="fas fa-paw absolute -bottom-5 left-10 text-9xl text-brand-light/20 rotate-12"></i>
         <i className="fas fa-dog absolute top-20 right-10 text-7xl text-brand-light/10"></i>
      </div>

      <div className="p-4 border-b flex items-center justify-between bg-white/90 backdrop-blur-sm shadow-sm z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition text-brand">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-slate-800">{difficulty} Levels</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-transparent z-10 relative">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pb-20">
          {levels.map((level) => {
            const levelKey = `${difficulty}_${level}`;
            const isCleared = clearedLevels[levelKey];
            
            // In a real game, we might lock levels. Here we unlock all for demo, or lock based on previous.
            // Simple logic: level 1 is open, others need previous cleared.
            const previousKey = `${difficulty}_${level - 1}`;
            const isLocked = level > 1 && !clearedLevels[previousKey];

            return (
              <button
                key={level}
                disabled={isLocked}
                onClick={() => onSelectLevel(level)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative shadow-sm transition-all
                  ${isLocked 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : isCleared 
                      ? 'bg-green-100 border-2 border-green-400 text-green-700 hover:scale-105 active:scale-95' 
                      : 'bg-white border-2 border-brand text-brand hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isLocked ? (
                  <i className="fas fa-lock text-xl mb-1"></i>
                ) : isCleared ? (
                  <i className="fas fa-star text-xl mb-1 text-yellow-400"></i>
                ) : (
                  <span className="text-2xl font-bold mb-1">{level}</span>
                )}
                
                {!isLocked && (
                  <span className="text-xs font-medium">
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