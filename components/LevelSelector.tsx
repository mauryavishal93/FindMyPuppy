
import React from 'react';
import { Difficulty, ThemeType } from '../types';

interface LevelSelectorProps {
  difficulty: Difficulty;
  clearedLevels: { [key: string]: boolean };
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTheme: ThemeType;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
  difficulty, 
  clearedLevels, 
  onSelectLevel,
  onBack,
  isMuted,
  onToggleMute,
  currentTheme
}) => {
  // Generate 100 levels
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  // Dynamic Theme Rendering for Background
  const renderBackground = () => {
    switch (currentTheme) {
      case 'night':
        return (
          <>
             <i className="fas fa-moon absolute top-5 right-10 text-6xl text-yellow-200/20 rotate-12"></i>
             <i className="fas fa-star absolute top-1/4 left-10 text-4xl text-white/10 animate-pulse"></i>
             <i className="fas fa-star absolute bottom-1/3 right-20 text-3xl text-white/10"></i>
             <i className="fas fa-meteor absolute top-1/2 left-5 text-5xl text-blue-300/10 rotate-45"></i>
          </>
        );
      case 'candy':
        return (
          <>
             <i className="fas fa-candy-cane absolute top-5 left-10 text-6xl text-pink-400/10 rotate-12"></i>
             <i className="fas fa-ice-cream absolute bottom-20 right-5 text-8xl text-purple-400/10 -rotate-12"></i>
             <i className="fas fa-cookie absolute top-1/2 left-5 text-5xl text-yellow-500/10 rotate-45"></i>
          </>
        );
      case 'forest':
        return (
          <>
             <i className="fas fa-tree absolute top-5 left-5 text-6xl text-emerald-800/10"></i>
             <i className="fas fa-leaf absolute bottom-1/4 right-10 text-8xl text-emerald-600/10 rotate-45"></i>
             <i className="fas fa-feather absolute top-1/2 left-10 text-5xl text-teal-700/10 -rotate-12"></i>
          </>
        );
      case 'park':
        return (
          <>
             <i className="fas fa-baseball-ball absolute top-10 right-20 text-7xl text-lime-600/10 animate-spin-slow"></i>
             <i className="fas fa-bone absolute bottom-20 left-10 text-6xl text-amber-200/40 -rotate-45"></i>
             <i className="fas fa-dog absolute top-1/3 left-1/4 text-8xl text-emerald-700/10"></i>
             <i className="fas fa-sun absolute -top-10 -left-10 text-9xl text-yellow-400/20"></i>
          </>
        );
      case 'bath':
        return (
          <>
             <i className="fas fa-bath absolute bottom-10 right-10 text-8xl text-blue-400/20"></i>
             <i className="fas fa-soap absolute top-20 left-10 text-6xl text-pink-300/20 rotate-12"></i>
             <div className="absolute top-1/4 right-1/4 w-10 h-10 rounded-full border-4 border-white/30"></div>
             <div className="absolute bottom-1/3 left-1/3 w-16 h-16 rounded-full border-4 border-white/20"></div>
             <i className="fas fa-shower absolute top-5 right-5 text-6xl text-cyan-500/20"></i>
          </>
        );
      case 'toys':
        return (
          <>
             <i className="fas fa-puzzle-piece absolute top-10 left-10 text-7xl text-red-400/20 -rotate-12"></i>
             <i className="fas fa-robot absolute bottom-20 right-20 text-8xl text-blue-500/20 rotate-12"></i>
             <i className="fas fa-gamepad absolute top-1/2 left-1/2 text-9xl text-purple-400/10 -translate-x-1/2 -translate-y-1/2"></i>
             <i className="fas fa-shapes absolute top-5 right-5 text-6xl text-yellow-500/20"></i>
          </>
        );
      case 'sunny':
      default:
        return (
          <>
             <i className="fas fa-paw absolute top-5 left-1/4 text-6xl text-brand/5 rotate-45"></i>
             <i className="fas fa-paw absolute bottom-1/4 right-5 text-8xl text-brand/5 -rotate-12"></i>
             <i className="fas fa-bone absolute top-1/2 left-5 text-5xl text-slate-300/20 rotate-90"></i>
             <i className="fas fa-cloud absolute top-40 left-[-20px] text-8xl text-white/40"></i>
          </>
        );
    }
  };

  // Theme-based style variables
  const bgClass = {
    sunny: 'bg-gradient-to-b from-sky-50 via-white to-indigo-50',
    night: 'bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950',
    candy: 'bg-gradient-to-b from-pink-50 via-purple-50 to-pink-100',
    forest: 'bg-gradient-to-b from-emerald-50 via-teal-50 to-green-100',
    park: 'bg-gradient-to-b from-lime-50 via-green-50 to-emerald-100',
    bath: 'bg-gradient-to-b from-cyan-50 via-blue-50 to-sky-100',
    toys: 'bg-gradient-to-b from-yellow-50 via-red-50 to-blue-50'
  }[currentTheme];

  const headerTextClass = {
    sunny: 'text-slate-800',
    night: 'text-indigo-100',
    candy: 'text-purple-900',
    forest: 'text-emerald-900',
    park: 'text-emerald-800',
    bath: 'text-blue-900',
    toys: 'text-slate-800'
  }[currentTheme];

  const headerBgClass = {
    sunny: 'bg-white/80 border-white/50',
    night: 'bg-slate-800/80 border-slate-700/50',
    candy: 'bg-white/80 border-pink-200/50',
    forest: 'bg-white/80 border-emerald-200/50',
    park: 'bg-white/80 border-lime-200/50',
    bath: 'bg-white/80 border-cyan-200/50',
    toys: 'bg-white/80 border-yellow-200/50'
  }[currentTheme];

  const btnBgClass = {
    sunny: 'bg-white/80 border-white text-brand hover:border-brand/20',
    night: 'bg-slate-700/80 border-slate-600 text-yellow-300 hover:border-yellow-300/20',
    candy: 'bg-white/80 border-pink-100 text-pink-500 hover:border-pink-300',
    forest: 'bg-white/80 border-emerald-100 text-emerald-600 hover:border-emerald-300',
    park: 'bg-white/80 border-lime-200 text-lime-600 hover:border-lime-400',
    bath: 'bg-white/80 border-cyan-200 text-cyan-600 hover:border-cyan-400',
    toys: 'bg-white/80 border-orange-200 text-orange-500 hover:border-orange-400'
  }[currentTheme];

  return (
    <div className={`flex flex-col h-full ${bgClass} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
         {renderBackground()}
      </div>

      <div className={`p-4 border-b flex items-center justify-between backdrop-blur-md shadow-sm z-10 sticky top-0 ${headerBgClass}`}>
        <button onClick={onBack} className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition shadow-sm border ${btnBgClass}`}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className={`text-xl font-black tracking-tight ${headerTextClass}`}>{difficulty} Levels</h2>
        <button 
          onClick={onToggleMute}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${btnBgClass}`}
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-transparent z-10 relative hide-scrollbar">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pb-20">
          {levels.map((level) => {
            const levelKey = `${difficulty}_${level}`;
            const isCleared = clearedLevels[levelKey];
            const previousKey = `${difficulty}_${level - 1}`;
            const isLocked = level > 1 && !clearedLevels[previousKey];

            // Card Colors based on theme
            let cardBaseClass = 'bg-white border-2 border-brand/50 text-brand';
            let cardClearedClass = 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-emerald-300 text-emerald-600';
            
            if (currentTheme === 'night') {
                cardBaseClass = 'bg-slate-800 border-2 border-indigo-500/50 text-indigo-300 hover:border-indigo-400';
                cardClearedClass = 'bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-yellow-400/50 text-yellow-300';
            } else if (currentTheme === 'candy') {
                cardBaseClass = 'bg-white border-2 border-pink-300 text-pink-500 hover:border-pink-400';
                cardClearedClass = 'bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-rose-300 text-rose-600';
            } else if (currentTheme === 'forest') {
                cardBaseClass = 'bg-white border-2 border-emerald-300 text-emerald-600 hover:border-emerald-500';
                cardClearedClass = 'bg-gradient-to-br from-lime-100 to-green-100 border-2 border-green-400 text-green-700';
            } else if (currentTheme === 'park') {
                cardBaseClass = 'bg-white border-2 border-lime-400 text-lime-600 hover:border-lime-500';
                cardClearedClass = 'bg-gradient-to-br from-emerald-50 to-lime-100 border-2 border-emerald-400 text-emerald-700';
            } else if (currentTheme === 'bath') {
                cardBaseClass = 'bg-white border-2 border-cyan-300 text-cyan-500 hover:border-cyan-400';
                cardClearedClass = 'bg-gradient-to-br from-sky-50 to-blue-100 border-2 border-blue-400 text-blue-700';
            } else if (currentTheme === 'toys') {
                cardBaseClass = 'bg-white border-2 border-orange-300 text-orange-500 hover:border-orange-400';
                cardClearedClass = 'bg-gradient-to-br from-yellow-50 to-red-50 border-2 border-red-400 text-red-600';
            }

            return (
              <button
                key={level}
                disabled={isLocked}
                onClick={() => onSelectLevel(level)}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center relative shadow-sm transition-all duration-300
                  ${isLocked 
                    ? `bg-black/5 text-slate-400 cursor-not-allowed border border-transparent ${currentTheme === 'night' ? 'bg-white/5 text-slate-600' : ''}`
                    : isCleared 
                      ? `${cardClearedClass} hover:scale-105 active:scale-95 shadow-md` 
                      : `${cardBaseClass} hover:scale-105 active:scale-95 shadow-sm`
                  }
                `}
              >
                {isLocked ? (
                  <i className="fas fa-lock text-xl mb-1 opacity-50"></i>
                ) : isCleared ? (
                  <div className="relative">
                    <i className="fas fa-star text-2xl mb-1 drop-shadow-sm"></i>
                    <i className="fas fa-check absolute -bottom-1 -right-2 text-xs bg-white text-green-600 rounded-full p-0.5 border border-green-200"></i>
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
