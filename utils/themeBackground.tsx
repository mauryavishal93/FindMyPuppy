import React from 'react';
import { ThemeType } from '../types';

export const renderThemeBackground = (themeId: ThemeType) => {
  switch (themeId) {
    case 'night':
      return (
        <>
           <i className="fas fa-moon absolute top-10 left-[-20px] text-6xl text-yellow-200/20 animate-pulse"></i>
           <i className="fas fa-star absolute top-24 right-[-40px] text-4xl text-white/20 animate-pulse delay-1000"></i>
           <div className="absolute top-10 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
           <i className="fas fa-paw absolute top-1/4 left-10 text-4xl text-indigo-400/10 -rotate-12"></i>
           <i className="fas fa-meteor absolute top-5 right-1/3 text-6xl text-purple-300/10 rotate-45"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-slate-900 via-indigo-900/50 to-transparent"></div>
           <i className="fas fa-tree absolute bottom-20 left-[-20px] text-8xl text-indigo-900/40"></i>
           <i className="fas fa-tree absolute bottom-32 right-[-30px] text-7xl text-indigo-900/30 transform -scale-x-100"></i>
        </>
      );
    case 'candy':
      return (
        <>
           <i className="fas fa-cloud absolute top-10 left-[-20px] text-8xl text-pink-200/50 animate-[pulse_4s_ease-in-out_infinite]"></i>
           <i className="fas fa-candy-cane absolute top-24 right-[-40px] text-9xl text-pink-400/10 rotate-12"></i>
           <div className="absolute top-10 right-10 w-24 h-24 bg-pink-300/20 rounded-full blur-xl"></div>
           <i className="fas fa-heart absolute top-5 right-5 text-pink-400/20 text-6xl animate-bounce"></i>
           <i className="fas fa-ice-cream absolute bottom-1/2 left-5 text-4xl text-purple-300/20 rotate-12"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-pink-200/50 to-transparent"></div>
           <i className="fas fa-cookie absolute bottom-20 left-10 text-6xl text-yellow-600/10"></i>
        </>
      );
    case 'forest':
       return (
        <>
           <i className="fas fa-leaf absolute top-10 left-[-20px] text-8xl text-emerald-200/50 rotate-45"></i>
           <i className="fas fa-sun absolute top-5 right-5 text-yellow-400/20 text-8xl animate-[spin_60s_linear_infinite]"></i>
           <i className="fas fa-tree absolute top-1/3 right-20 text-3xl text-emerald-700/10 rotate-12"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-emerald-100/50 to-transparent"></div>
           <i className="fas fa-tree absolute bottom-20 left-[-20px] text-9xl text-emerald-800/20"></i>
           <i className="fas fa-frog absolute bottom-10 right-20 text-4xl text-emerald-600/20"></i>
        </>
       );
    case 'park':
       return (
        <>
           <i className="fas fa-sun absolute -top-5 -left-5 text-9xl text-yellow-300/40 animate-[spin_40s_linear_infinite]"></i>
           <i className="fas fa-cloud absolute top-10 right-10 text-8xl text-white/60 animate-pulse"></i>
           <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-300/10 rounded-full blur-2xl"></div>
           <i className="fas fa-baseball-ball absolute top-1/3 right-10 text-5xl text-white/40 rotate-12"></i>
           <i className="fas fa-bone absolute bottom-1/2 left-10 text-6xl text-amber-200/20 -rotate-12"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-lime-200 via-green-100/50 to-transparent"></div>
           <i className="fas fa-dog absolute bottom-10 right-10 text-8xl text-emerald-800/10"></i>
        </>
       );
    case 'bath':
       return (
        <>
           <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-white/20 animate-bounce"></div>
           <div className="absolute top-40 right-20 w-12 h-12 rounded-full border-2 border-white/20 animate-pulse"></div>
           <i className="fas fa-soap absolute top-10 right-10 text-7xl text-pink-200/30 rotate-12"></i>
           <i className="fas fa-shower absolute top-5 left-1/3 text-6xl text-cyan-500/10"></i>
           <div className="absolute bottom-0 w-full h-2/5 bg-gradient-to-t from-cyan-200/50 to-transparent"></div>
           <i className="fas fa-bath absolute bottom-10 left-10 text-9xl text-white/30"></i>
           <i className="fas fa-tint absolute top-1/2 right-1/3 text-5xl text-blue-400/20 animate-bounce"></i>
        </>
       );
    case 'toys':
       return (
        <>
           <i className="fas fa-puzzle-piece absolute top-10 left-10 text-8xl text-red-400/10 -rotate-12"></i>
           <i className="fas fa-gamepad absolute top-20 right-10 text-7xl text-purple-400/10 rotate-12"></i>
           <i className="fas fa-robot absolute bottom-1/2 right-1/4 text-8xl text-blue-400/10"></i>
           <i className="fas fa-shapes absolute top-1/3 left-1/3 text-6xl text-yellow-400/20 animate-spin-slow"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-orange-100/50 to-transparent"></div>
           <i className="fas fa-cube absolute bottom-10 left-10 text-8xl text-orange-400/10"></i>
        </>
       );
    case 'sunny':
    default:
      return (
        <>
           <i className="fas fa-cloud absolute top-10 left-[-20px] text-8xl text-white/80 animate-[pulse_4s_ease-in-out_infinite]"></i>
           <i className="fas fa-cloud absolute top-24 right-[-40px] text-9xl text-white/60 animate-[pulse_5s_ease-in-out_infinite] delay-1000"></i>
           <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl"></div>
           <i className="fas fa-sun absolute top-5 right-5 text-yellow-400/30 text-8xl animate-[spin_60s_linear_infinite]"></i>
           <i className="fas fa-paw absolute top-1/4 left-10 text-4xl text-brand/10 -rotate-12"></i>
           <i className="fas fa-paw absolute top-1/3 right-20 text-3xl text-brand/10 rotate-12"></i>
           <i className="fas fa-bone absolute bottom-1/2 left-5 text-4xl text-slate-400/10 rotate-45"></i>
           <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-100/50 to-transparent"></div>
           <i className="fas fa-tree absolute bottom-20 left-[-20px] text-8xl text-green-200/60"></i>
           <i className="fas fa-tree absolute bottom-32 right-[-30px] text-7xl text-green-200/50 transform -scale-x-100"></i>
           <i className="fas fa-dog absolute bottom-5 right-10 text-9xl text-brand-dark/5 rotate-[-5deg]"></i>
        </>
      );
  }
};

