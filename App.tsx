import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, UserProgress, Puppy, ThemeType, ThemeConfig } from './types';
import { generateLevelTheme, generateLevelImage } from './services/geminiService';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';
import { GameLogo } from './components/GameLogo';

// --- Theme Configuration ---
const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  sunny: {
    id: 'sunny',
    name: 'Sunny Day',
    icon: 'fa-sun',
    background: 'bg-gradient-to-b from-sky-100 via-white to-green-50',
    cardBg: 'bg-white/60 border-white/60',
    text: 'text-slate-800',
    subText: 'text-slate-600',
    accent: 'text-brand',
    button: 'bg-gradient-to-r from-brand to-brand-dark',
    headerBg: 'bg-white/70 border-white/50',
    iconBg: 'bg-white/80 border-white text-slate-600 hover:text-brand'
  },
  night: {
    id: 'night',
    name: 'Starry Night',
    icon: 'fa-moon',
    background: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900',
    cardBg: 'bg-slate-800/60 border-indigo-500/30',
    text: 'text-indigo-50',
    subText: 'text-indigo-300',
    accent: 'text-yellow-300',
    button: 'bg-gradient-to-r from-indigo-600 to-purple-700',
    headerBg: 'bg-slate-900/70 border-slate-700/50',
    iconBg: 'bg-slate-800/80 border-slate-700 text-indigo-300 hover:text-yellow-300'
  },
  candy: {
    id: 'candy',
    name: 'Candy Land',
    icon: 'fa-candy-cane',
    background: 'bg-gradient-to-b from-pink-100 via-purple-50 to-pink-50',
    cardBg: 'bg-white/70 border-pink-200/60',
    text: 'text-purple-900',
    subText: 'text-purple-600',
    accent: 'text-pink-500',
    button: 'bg-gradient-to-r from-pink-400 to-purple-400',
    headerBg: 'bg-white/70 border-pink-100/50',
    iconBg: 'bg-white/80 border-white text-pink-400 hover:text-purple-500'
  },
  forest: {
    id: 'forest',
    name: 'Magic Forest',
    icon: 'fa-tree',
    background: 'bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-50',
    cardBg: 'bg-white/60 border-emerald-200/60',
    text: 'text-emerald-900',
    subText: 'text-emerald-700',
    accent: 'text-teal-600',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    headerBg: 'bg-white/70 border-emerald-100/50',
    iconBg: 'bg-white/80 border-white text-emerald-600 hover:text-teal-700'
  },
  park: {
    id: 'park',
    name: 'Puppy Park',
    icon: 'fa-baseball-ball',
    background: 'bg-gradient-to-b from-green-100 via-lime-50 to-sky-100',
    cardBg: 'bg-white/60 border-lime-300/60',
    text: 'text-emerald-800',
    subText: 'text-emerald-600',
    accent: 'text-lime-600',
    button: 'bg-gradient-to-r from-lime-500 to-green-600',
    headerBg: 'bg-white/70 border-lime-200/50',
    iconBg: 'bg-white/80 border-white text-lime-600 hover:text-green-700'
  },
  bath: {
    id: 'bath',
    name: 'Bubble Bath',
    icon: 'fa-bath',
    background: 'bg-gradient-to-b from-cyan-100 via-blue-50 to-white',
    cardBg: 'bg-white/70 border-cyan-200/60',
    text: 'text-cyan-900',
    subText: 'text-cyan-700',
    accent: 'text-blue-500',
    button: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    headerBg: 'bg-white/70 border-cyan-100/50',
    iconBg: 'bg-white/80 border-white text-cyan-500 hover:text-blue-600'
  },
  toys: {
    id: 'toys',
    name: 'Toy Paradise',
    icon: 'fa-puzzle-piece',
    background: 'bg-gradient-to-b from-yellow-100 via-red-50 to-blue-50',
    cardBg: 'bg-white/70 border-orange-200/60',
    text: 'text-slate-800',
    subText: 'text-slate-600',
    accent: 'text-orange-500',
    button: 'bg-gradient-to-r from-orange-400 to-red-500',
    headerBg: 'bg-white/70 border-yellow-100/50',
    iconBg: 'bg-white/80 border-white text-orange-500 hover:text-red-500'
  }
};

// --- Assets ---
const PUPPY_IMAGES = [
  // Brown Ears
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMjAgTDM1LDQ1IEwxNSw1MCBaIiBmaWxsPSIjRTg3QTI5Ii8+PHBhdGggZD0iTTgwLDIwIEw2NSw0NSBMODUsNTAgWiIgZmlsbD0iI0U4N0EyOSIvPjxwYXRoIGQ9Ik0yMCw1MCBRMTUsODUgNTAsOTAgUTg1LDg1IDgwLDUwIFE4MCwzMCA1MCwzMCBRMjAsMzAgMjAsNTAiIGZpbGw9IiNFODdBMjkiLz48cGF0aCBkPSJNMzUsNTAgUTUwLDQwIDY1LDUwIFE3NSw3MCA1MCw4NSBRMjUsNzAgMzUsNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjUiIHJ5PSIzIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTQ1LDcyIFE1MCw3NSA1NSw3MiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==`,
  // Spotted
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMjAgUTEwLDUwIDI1LDUwIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTgwLDIwIFE5MCw1MCA3NSw1MCIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yNSwzMCBRNTAsMjAgNzUsMzAgUTg1LDUwIDc1LDgwIFE1MCw5MCAyNSw4MCBRMTUsNTAgMjUsMzAiIGZpbGw9IiNGRkYiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjQ1IiByPSI0IiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI0NSIgcj0iNCIgZmlsbD0iIzMzMyIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjYwIiByeD0iNiIgcnk9IjQiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNNDUsNzAgQTUwLDc1IDU1LDcwIiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzNSIgcj0iNiIgZmlsbD0iIzMzMyIgb3BhY2l0eT0iMC4yIi8+PC9nPjwvc3ZnPg==`,
  // Husky
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMTUgTDM1LDQwIEwxNSw0NSBaIiBmaWxsPSIjOUNBM0FGIi8+PHBhdGggZD0iTTgwLDE1IEw2NSw0MCBMODUsNDUgWiIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik0yMCw0NSBRMTAsODUgNTAsOTAgUTg1LDg1IDgwLDQ1IFE4MCwyNSA1MCwyNSBRMjAsMjUgMjAsNDUiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMjAsNDUgQTUwLDI1IDgwLDQ1IFE4MCw1NSA3MCw1NSBRNjAsNTUgNTAsNDUgUTQwLDU1IDMwLDU1IFEyMCw1NSAyMCw0NSIgZmlsbD0iIzlDQTNBRiIgc3Ryb2tlPSJub25lIi8+PGNpcmNsZSBjeD0iMzUiIGN5PSI1MCIgcj0iNCIgZmlsbD0iIzNCODJGNiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjUwIiByPSI0IiBmaWxsPSIjM0I4MkY2IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjY1IiByeD0iNSIgcnk9IjMiIGZpbGw9IiMzMzMiLz48L2c+PC9zdmc+`,
  // Pug/Bulldog
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMzUgTDM1LDMwIEwzMCw1MCBaIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTgwLDM1IEw2NSwzMCBMNzAsNTAgWiIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjI1IiB5PSIzMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjU1IiByeD0iMjUiIGZpbGw9IiVEMkI0OEMiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2MCIgcng9IjE4IiByeT0iMTIiIGZpbGw9IiMzMzMiIG9wYWNpdHk9IjAuOSIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjM4IiBjeT0iNTAiIHI9IjIiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNTAiIHI9IjUiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjYyIiBjeT0iNTAiIHI9IjIiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjYyIiByeD0iNSIgcnk9IjMiIGZpbGw9ImJsYWNrIi8+PC9nPjwvc3ZnPg==`,
  // Golden/Floppy
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMzAgQTEwLDIwIDc1LDMwIFE4NSw1MCA3NSw4MCBRNTAsOTAgMjUsODAgUTE1LDUwIDI1LDMwIiBmaWxsPSIjRkNEMzREIi8+PHBhdGggZD0iTTI1LDM1IFExMCw1MCAyMCw3MCIgZmlsbD0iI0ZDRDM0RCIvPjxwYXRoIGQ9Ik03NSwzNSBROTAsNTAgODAsNzAiIGZpbGw9IiNGQ0QzNEQiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI1MCIgcj0iNCIgZmlsbD0iIzMzMyIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjY1IiByeD0iNiIgcnk9IjQiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNNDUsNzUgQTUwLDgwIDU1LDc1IiBmaWxsPSJub25lIi8+PC9nPjwvc3ZnPg==`,
];

const SOUNDS = {
  // Use local bgmusic.mp3
  ambient: 'https://assets.mixkit.co/active_storage/sfx/689/689-preview.mp3',
  // Pleasant "ding" or pop sound
  found: 'https://assets.mixkit.co/active_storage/sfx/2066/2066-preview.mp3',
  // Success chime
  clear: 'https://assets.mixkit.co/active_storage/sfx/2065/2065-preview.mp3',
  // Hint sound
  hint: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
  // Cash register/Success
  pay: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  // Game Over
  fail: 'https://assets.mixkit.co/active_storage/sfx/2042/2042-preview.mp3'
};

// --- Helper Components ---

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className, disabled }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const DifficultyCard: React.FC<{ 
  difficulty: Difficulty; 
  points: number; 
  color: string; 
  onClick: () => void;
  description: string;
}> = ({ difficulty, points, color, onClick, description }) => (
  <div 
    onClick={onClick}
    className={`${color} text-white p-3 rounded-2xl shadow-md cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between h-16 w-full hover:shadow-xl hover:-translate-y-1`}
  >
    <div className="absolute -left-3 -bottom-3 opacity-20 text-5xl group-hover:scale-110 transition-transform rotate-12">
      <i className="fas fa-paw"></i>
    </div>
    
    <div className="z-10 flex flex-col pl-1">
      <h3 className="text-lg font-black leading-none drop-shadow-sm">{difficulty}</h3>
      <p className="text-white/90 text-[10px] font-medium mt-0.5 opacity-90 shadow-sm">{description}</p>
    </div>

    <div className="z-10 flex flex-col items-end pr-1">
      <div className="flex items-center gap-1 bg-white/25 px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm">
        <i className="fas fa-star text-yellow-300 text-[10px] filter drop-shadow"></i>
        <span className="font-bold text-xs">{points}</span>
      </div>
      <span className="text-[9px] mt-0.5 opacity-90 uppercase font-bold tracking-wider drop-shadow-sm">Points</span>
    </div>
  </div>
);

type PaymentStatus = 'idle' | 'processing' | 'verifying';

const InfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden border-4 border-white hide-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
            <i className="fas fa-book text-brand text-lg"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800">Explorer's Guide</h3>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="space-y-6">
        {/* Objective */}
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
           <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
             <i className="fas fa-search"></i> Objective
           </h4>
           <p className="text-sm text-indigo-800/80 leading-relaxed">
             Embark on a journey through magical AI-generated worlds. Your mission is to rescue all the puppies hiding in plain sight!
             <br/><br/>
             <span className="text-xs font-bold text-indigo-600 mt-2 block bg-indigo-100/50 p-2 rounded-lg">
               <i className="fas fa-exclamation-triangle mr-1"></i> Alert: Every 5 levels, the puppies get smaller and camouflage better!
             </span>
           </p>
        </div>

        {/* Controls */}
        <div>
          <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">How to Play</h4>
          <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-center gap-4 border border-slate-100 shadow-sm">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400">
                <i className="fas fa-hand-pointer text-xl animate-bounce-short"></i>
             </div>
             <span className="text-sm font-bold text-slate-600">Tap the hidden puppies to rescue them!</span>
          </div>
        </div>

        {/* Difficulty Rules */}
        <div>
          <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Difficulty & Rewards</h4>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-100">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                     <i className="fas fa-seedling text-[10px]"></i>
                   </div>
                   <span className="font-bold text-slate-700">Easy</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-500 font-bold">15-25 Pups • Relaxed</div>
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">+10 Points</div>
                </div>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <i className="fas fa-stopwatch text-[10px]"></i>
                   </div>
                   <span className="font-bold text-slate-700">Medium</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-500 font-bold">25-35 Pups • Timed</div>
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-0.5">+20 Points</div>
                </div>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-100">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                     <i className="fas fa-skull text-[10px]"></i>
                   </div>
                   <span className="font-bold text-slate-700">Hard</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-500 font-bold">40-50 Pups • Rush</div>
                  <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-0.5">+50 Points</div>
                </div>
             </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 relative overflow-hidden">
           <i className="fas fa-lightbulb absolute -top-2 -right-2 text-6xl text-orange-200/40 rotate-12"></i>
           <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2 relative z-10">
             <i className="fas fa-star text-orange-500"></i> Pro Tips
           </h4>
           <ul className="text-xs text-orange-800/90 space-y-2 list-disc pl-4 relative z-10 font-medium">
              <li>Puppies love to hide near objects of similar color.</li>
              <li>Look for out-of-place ears, tails, or paws!</li>
              <li>Use the <strong>Pinch Zoom</strong> gesture to scan crowded areas.</li>
              <li>Save your hints for the final few hidden pups.</li>
           </ul>
        </div>
        
        {/* Game Info / Tech */}
        <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
           <i className="fas fa-magic text-purple-400"></i>
           <span className="text-[10px] text-slate-500 font-medium">
             Worlds generated infinitely by <strong>Google Gemini AI</strong>
           </span>
        </div>

        {/* Hints Footer */}
        <div className="border-t border-slate-100 pt-2">
           <p className="text-[10px] text-center text-slate-400">
             You receive 2 free hints every level. Good luck!
           </p>
        </div>

        {/* Copyright Footer - Moved Here */}
        <div className="pt-4 text-center">
             <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto mb-3"></div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">© 2025-2026 MVTechnology</p>
        </div>

      </div>
    </div>
  </div>
);

const ThemeModal: React.FC<{ 
  onClose: () => void; 
  onSelect: (theme: ThemeType) => void; 
  currentTheme: ThemeType 
}> = ({ onClose, onSelect, currentTheme }) => (
  <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl border-4 border-white animate-fade-in max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <i className="fas fa-paint-brush text-brand"></i> Theme
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
          <i className="fas fa-times text-slate-500"></i>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(THEME_CONFIGS) as ThemeType[]).map((themeKey) => {
          const theme = THEME_CONFIGS[themeKey];
          const isSelected = currentTheme === themeKey;
          return (
            <button
              key={themeKey}
              onClick={() => onSelect(themeKey)}
              className={`
                relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                ${isSelected 
                  ? 'border-brand bg-brand-light/20 scale-105 shadow-md' 
                  : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300'
                }
              `}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${
                isSelected ? 'bg-brand text-white' : 'bg-white text-slate-400'
              }`}>
                <i className={`fas ${theme.icon}`}></i>
              </div>
              <span className={`text-sm font-bold ${isSelected ? 'text-brand-dark' : 'text-slate-500'}`}>
                {theme.name}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-brand rounded-full border-2 border-white"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);


const PaymentModal: React.FC<{ 
  onClose: () => void; 
  onPay: () => void; 
  onPayWithPoints: () => void;
  currentPoints: number;
  paymentStatus: PaymentStatus;
  onCancelPayment: () => void;
  title?: string;
  description?: string;
}> = ({ onClose, onPay, onPayWithPoints, currentPoints, paymentStatus, onCancelPayment, title, description }) => {
  
  if (paymentStatus === 'processing' || paymentStatus === 'verifying') {
    return (
      <div className="absolute inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl animate-fade-in mx-4">
           <div className="animate-spin text-4xl text-brand mb-4 mx-auto w-min"><i className="fas fa-circle-notch"></i></div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">
             {paymentStatus === 'verifying' ? 'Verifying...' : 'Processing...'}
           </h3>
           <p className="text-sm text-slate-500 mb-6">
             {paymentStatus === 'verifying' 
               ? 'Confirming payment status.' 
               : 'Redirecting to UPI app...'}
           </p>
           {paymentStatus === 'processing' && (
             <button onClick={onCancelPayment} className="text-slate-400 font-bold text-xs uppercase tracking-wider hover:text-slate-600">
               Cancel
             </button>
           )}
        </div>
      </div>
    );
  }

  // Idle State
  return (
    <div className="absolute inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl relative mx-4 max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 shrink-0">
           <i className="fas fa-lightbulb text-3xl text-brand-dark animate-bounce-short"></i>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-1">{title || "Need a Hint?"}</h3>
        <p className="text-slate-500 text-sm mb-6 font-medium">
          {description || "You're out of free hints for this level."}
        </p>

        {/* Pay with Points */}
        <div className="bg-indigo-50 rounded-2xl p-4 mb-4 border border-indigo-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Use Points</span>
             <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm">
               <i className="fas fa-trophy text-yellow-500 text-xs"></i>
               <span className="text-indigo-900 font-black text-xs">{currentPoints}</span>
             </div>
          </div>
          
          <button 
            onClick={onPayWithPoints}
            disabled={currentPoints < 10}
            className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <div className="flex flex-col items-start leading-none">
               <span className="text-[10px] opacity-80 font-medium">Pay 10 Points</span>
               <span className="text-sm">Get 2 Hints</span>
            </div>
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          {currentPoints < 10 && (
             <p className="text-[10px] text-red-500 mt-2 font-bold flex items-center justify-center gap-1">
               <i className="fas fa-lock"></i> Not enough points
             </p>
          )}
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        {/* Pay Money */}
        <button 
          onClick={onPay}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-yellow-200 hover:scale-105 transition-transform mb-3 flex items-center justify-between px-4 relative overflow-hidden"
        >
          {/* Tag */}
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
             91% OFF
          </div>

          <div className="flex flex-col items-start leading-none">
             <span className="text-[10px] opacity-90 font-bold text-yellow-50 mb-0.5 uppercase tracking-wide">Special Offer</span>
             <div className="flex items-center gap-2">
               <span className="text-xs text-yellow-200/80 line-through decoration-red-500/80 decoration-2 font-medium">₹99</span>
               <span className="text-2xl font-black drop-shadow-sm">₹9</span>
             </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] opacity-90">Get</div>
             <div className="font-black text-lg leading-none">+100 Hints</div>
          </div>
        </button>
        
        <button 
          onClick={onClose}
          className="text-slate-400 text-xs font-bold hover:text-slate-600 uppercase tracking-wide py-2"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'LOGIN' | 'HOME' | 'LEVEL_SELECT' | 'GAME' | 'WIN' | 'GAME_OVER'>('LOGIN');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [loginName, setLoginName] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [paymentModalConfig, setPaymentModalConfig] = useState<{title?: string, description?: string}>({});
  
  // Info Modal State
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Theme Modal State
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Hint State
  const [hintsUsedInLevel, setHintsUsedInLevel] = useState(0);
  const [showHints, setShowHints] = useState(false);
  
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('findMyPuppy_progress');
    const defaultProgress = {
      playerName: '',
      clearedLevels: {},
      totalScore: 0,
      unlockedDifficulties: [Difficulty.EASY],
      premiumHints: 0,
      selectedTheme: 'sunny' as ThemeType
    };
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  });

  const activeTheme = THEME_CONFIGS[progress.selectedTheme || 'sunny'];

  // Handle Background Audio
  useEffect(() => {
    // Initialize audio object once
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio(SOUNDS.ambient);
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.2; // Softer background
    }
    
    // Play logic: Only play if logged in (interacted) and not muted
    const shouldPlay = view !== 'LOGIN' && !isMuted;

    if (shouldPlay) {
      const playPromise = ambientAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          // Auto-resume might happen on next interaction
        });
      }
    } else {
      ambientAudioRef.current.pause();
    }

    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    };
  }, [view, isMuted]);
  
  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft !== null && view === 'GAME') {
        if (timeLeft <= 0) {
            handleGameOver();
        } else {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, view]);

  const toggleMute = () => setIsMuted(prev => !prev);

  const playSfx = (type: 'found' | 'clear' | 'hint' | 'pay' | 'fail') => {
    if (isMuted) return;
    try {
      const sfx = new Audio(SOUNDS[type]);
      sfx.volume = type === 'clear' ? 0.5 : 0.4;
      sfx.play().catch(e => console.warn("SFX play failed", e));
    } catch (e) {
      console.error("Audio Error", e);
    }
  };

  useEffect(() => {
    if (progress.playerName) {
      setView('HOME');
    }
  }, []);

  const [gameState, setGameState] = useState<{
    puppies: Puppy[];
    bgImage: string | null;
    loading: boolean;
    levelTheme: string;
  }>({
    puppies: [],
    bgImage: null,
    loading: false,
    levelTheme: '',
  });

  useEffect(() => {
    localStorage.setItem('findMyPuppy_progress', JSON.stringify(progress));
  }, [progress]);

  const handleLogin = () => {
    if (!loginName.trim()) return;
    setProgress(prev => ({ ...prev, playerName: loginName.trim() }));
    setView('HOME');
    if (ambientAudioRef.current && !isMuted) {
      ambientAudioRef.current.play().catch(() => {});
    }
  };

  const handleThemeChange = (theme: ThemeType) => {
    setProgress(prev => ({ ...prev, selectedTheme: theme }));
    setShowThemeModal(false);
  };

  const initLevel = useCallback(async (level: number, diff: Difficulty) => {
    setGameState(prev => ({ ...prev, loading: true, bgImage: null, puppies: [], levelTheme: '' }));
    setHintsUsedInLevel(0); // Reset hints for new level
    setShowHints(false);
    
    // Difficulty Progression Logic (Harder every 5 levels)
    const progressionStep = Math.floor((level - 1) / 5);
    
    let puppyCount = 15;
    let baseOpacity = 0.5; 
    let minScale = 0.3; 
    let maxScale = 0.5; 
    let timeLimit = null; 
    
    if (diff === Difficulty.EASY) {
        // Easy: 15 -> 25 puppies, Opacity 0.6 -> 0.4
        puppyCount = Math.min(25, 15 + Math.floor(progressionStep / 2)); 
        timeLimit = null; 
        baseOpacity = Math.max(0.4, 0.6 - (progressionStep * 0.01));
    } else if (diff === Difficulty.MEDIUM) {
        // Medium: 25 -> 35 puppies, Opacity 0.4 -> 0.25, Scale reduces, Time reduces 180s -> 120s
        puppyCount = Math.min(35, 25 + Math.floor(progressionStep / 2));
        timeLimit = Math.max(120, 180 - (progressionStep * 3));
        baseOpacity = Math.max(0.25, 0.4 - (progressionStep * 0.01));
        minScale = Math.max(0.15, 0.25 - (progressionStep * 0.005));
        maxScale = Math.max(0.3, 0.4 - (progressionStep * 0.005));
    } else if (diff === Difficulty.HARD) {
        // Hard: 40 -> 50 puppies, Opacity 0.3 -> 0.15, Scale reduces, Time reduces 150s -> 90s
        puppyCount = Math.min(50, 40 + Math.floor(progressionStep / 2));
        timeLimit = Math.max(90, 150 - (progressionStep * 3));
        baseOpacity = Math.max(0.15, 0.3 - (progressionStep * 0.01));
        minScale = Math.max(0.12, 0.2 - (progressionStep * 0.004)); 
        maxScale = Math.max(0.25, 0.35 - (progressionStep * 0.005));
    }
    
    // Initialize Timer
    setTimeLeft(timeLimit);
    setIsTimerRunning(false); // Changed: Start false, enable on image load

    // Get the textual theme for this level
    const theme = await generateLevelTheme(level, diff);
    
    // Generate the image on the fly using Gemini
    const bgImage = await generateLevelImage(theme, level);

    const newPuppies: Puppy[] = [];
    let safetyCounter = 0; // Prevent infinite loops
    while (newPuppies.length < puppyCount && safetyCounter < 1000) {
      safetyCounter++;
      const scale = minScale + (Math.random() * (maxScale - minScale));
      // Added margin to ensure puppies are fully inside the image boundaries
      const margin = 5;
      const x = margin + Math.random() * (100 - (margin * 2));
      const y = margin + Math.random() * (100 - (margin * 2));
      
      let overlaps = false;
      for (const p of newPuppies) {
        const dx = x - p.x;
        const dy = y - p.y;
        if (Math.sqrt(dx*dx + dy*dy) < 6) { // Distance check (squared is faster but sqrt needed for 6 unit check)
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        newPuppies.push({
          id: `pup-${newPuppies.length}-${Date.now()}-${Math.random()}`,
          x,
          y,
          rotation: Math.random() * 360,
          scale,
          isFound: false,
          opacity: Math.max(0.15, baseOpacity - (Math.random() * 0.1)), 
          hueRotate: Math.random() * 360, 
          imageUrl: PUPPY_IMAGES[Math.floor(Math.random() * PUPPY_IMAGES.length)],
        });
      }
    }

    setGameState({
      loading: false,
      bgImage,
      puppies: newPuppies,
      levelTheme: theme,
    });
  }, []);

  const handleLevelSelect = (levelId: number) => {
    setCurrentLevelId(levelId);
    setView('GAME');
    initLevel(levelId, selectedDifficulty);
  };

  const handlePuppyFound = (id: string) => {
    playSfx('found');

    setGameState(prev => {
      const updatedPuppies = prev.puppies.map(p => 
        p.id === id ? { ...p, isFound: true } : p
      );
      
      const allFound = updatedPuppies.every(p => p.isFound);
      if (allFound) {
        setIsTimerRunning(false);
        setTimeout(() => handleLevelClear(), 800);
      }
      return { ...prev, puppies: updatedPuppies };
    });
  };
  
  const handleGameOver = () => {
    setIsTimerRunning(false);
    playSfx('fail');
    setView('GAME_OVER');
  };
  
  const handleRetry = () => {
      initLevel(currentLevelId, selectedDifficulty);
      setView('GAME');
  };

  const handleLevelClear = () => {
    playSfx('clear');
    const levelKey = `${selectedDifficulty}_${currentLevelId}`;
    const isFirstClear = !progress.clearedLevels[levelKey];
    let pointsAwarded = 0;
    
    if (isFirstClear) {
      if (selectedDifficulty === Difficulty.EASY) pointsAwarded = 10;
      if (selectedDifficulty === Difficulty.MEDIUM) pointsAwarded = 20;
      if (selectedDifficulty === Difficulty.HARD) pointsAwarded = 50;
    }

    setProgress(prev => ({
      ...prev,
      clearedLevels: { ...prev.clearedLevels, [levelKey]: true },
      totalScore: prev.totalScore + pointsAwarded
    }));

    setView('WIN');
  };
  
  const activateHint = () => {
     playSfx('hint');
     setShowHints(true);
     // Hide hints after 3 seconds
     setTimeout(() => setShowHints(false), 3000);
  };

  const handleUseHint = () => {
    if (showHints) return; // Already showing
    
    // Check Free Hints first (0 and 1 are valid for < 2)
    if (hintsUsedInLevel < 2) {
      setHintsUsedInLevel(prev => prev + 1);
      activateHint();
    } 
    // Check Premium Hints
    else if (progress.premiumHints && progress.premiumHints > 0) {
      setProgress(prev => ({...prev, premiumHints: prev.premiumHints - 1}));
      activateHint();
    } 
    // Out of hints
    else {
      setPaymentModalConfig({
        title: "Need a Hint?",
        description: "You're out of free hints for this level."
      });
      setPaymentStatus('idle'); // Ensure status is idle when opening
      setShowPaymentModal(true);
    }
  };

  const openHintShop = () => {
    setPaymentModalConfig({
      title: 'Hint Shop',
      description: 'Stock up on hints for the harder levels!'
    });
    setPaymentStatus('idle');
    setShowPaymentModal(true);
  };
  
  // Payment Automation Logic
  
  const handlePayment = () => {
    setPaymentStatus('processing');

    // UPI Configuration
    const upiId = 'mauryavishal93-1@okaxis';
    const payeeName = 'Vishal Maurya';
    const aid = 'uGICAgIDA3qHVVA';
    const transactionNote = '100 Hints Pack';
    const amount = '9.00';
    const currency = 'INR';

    // Construct UPI Deep Link
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&aid=${aid}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;

    // Attempt to open UPI app
    setTimeout(() => {
        window.location.href = upiUrl;
    }, 1000);
  };
  
  // Listen for app return to trigger simulated verification
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && paymentStatus === 'processing') {
         setPaymentStatus('verifying');
         
         // Simulate network verification (Auto-Success)
         setTimeout(() => {
             playSfx('pay');
             setProgress(prev => ({...prev, premiumHints: (prev.premiumHints || 0) + 100}));
             setPaymentStatus('idle');
             setShowPaymentModal(false);
         }, 3000);
      }
    };

    if (paymentStatus === 'processing') {
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [paymentStatus]);

  const handleCancelPayment = () => {
    setPaymentStatus('idle');
  };

  const handlePayWithPoints = () => {
    if (progress.totalScore >= 10) {
      playSfx('pay');
      setProgress(prev => ({
        ...prev,
        totalScore: prev.totalScore - 10,
        premiumHints: prev.premiumHints + 2
      }));
      setShowPaymentModal(false);
    }
  };

  const nextLevel = () => {
    if (currentLevelId < 100) {
      handleLevelSelect(currentLevelId + 1);
    } else {
      setView('HOME');
    }
  };
  
  // Formatting seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderLogin = () => (
    <div className="flex flex-col h-full items-center justify-center p-8 bg-gradient-to-br from-pink-100 via-white to-blue-100 relative overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-pink-200/40 blur-[80px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-200/40 blur-[80px] rounded-full animate-pulse delay-700"></div>
         
         <i className="fas fa-paw absolute top-20 left-10 text-6xl text-brand/10 -rotate-12 animate-bounce-short"></i>
         <i className="fas fa-paw absolute bottom-32 right-12 text-7xl text-blue-400/10 rotate-12"></i>
         <i className="fas fa-bone absolute top-1/2 right-8 text-5xl text-yellow-400/20 rotate-45"></i>
         <i className="fas fa-cloud absolute top-16 right-1/4 text-8xl text-white/60"></i>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm z-10 text-center border-4 border-white/50 relative overflow-y-auto overflow-x-hidden max-h-[90vh] hide-scrollbar">
        <div className="mx-auto mb-6 flex justify-center relative">
          <div className="absolute inset-0 bg-brand-light/30 blur-2xl rounded-full scale-150"></div>
          <GameLogo className="w-32 h-32 relative z-10 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">FindMyPuppy</h1>
        <p className="text-slate-500 mb-8 font-medium">Join the ultimate hide & seek adventure!</p>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="What's your name?"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-lg text-center font-bold text-slate-700 bg-white/50"
            maxLength={12}
          />
          <Button onClick={handleLogin} disabled={!loginName.trim()} className="w-full bg-gradient-to-r from-brand to-brand-dark text-white shadow-brand/30 hover:shadow-brand/50 hover:scale-[1.02]">
            Start<i className="fas fa-play ml-2 text-sm"></i>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-6 w-full text-center pointer-events-none z-10">
          <span className="text-[10px] text-slate-400/80 font-medium">© 2025-2026 MVTechnology</span>
      </div>
    </div>
  );

  const renderHome = () => {
    // Dynamic Theme Rendering
    const renderThemeBackground = () => {
      switch (activeTheme.id) {
        case 'night':
          return (
            <>
               <i className="fas fa-moon absolute top-10 left-[-20px] text-6xl text-yellow-200/20 animate-pulse"></i>
               <i className="fas fa-star absolute top-24 right-[-40px] text-4xl text-white/20 animate-pulse delay-1000"></i>
               <div className="absolute top-10 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
               <i className="fas fa-paw absolute top-1/4 left-10 text-4xl text-indigo-400/10 -rotate-12"></i>
               <i className="fas fa-meteor absolute top-5 right-1/3 text-6xl text-purple-300/10 rotate-45"></i>
               {/* Ground */}
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
               {/* Ground */}
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
               {/* Ground */}
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
               {/* Ground */}
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
               {/* Water */}
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
               {/* Ground */}
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
               {/* Ground */}
               <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-100/50 to-transparent"></div>
               <i className="fas fa-tree absolute bottom-20 left-[-20px] text-8xl text-green-200/60"></i>
               <i className="fas fa-tree absolute bottom-32 right-[-30px] text-7xl text-green-200/50 transform -scale-x-100"></i>
               <i className="fas fa-dog absolute bottom-5 right-10 text-9xl text-brand-dark/5 rotate-[-5deg]"></i>
            </>
          );
      }
    };

    return (
      <div className={`flex flex-col h-full ${activeTheme.background} relative overflow-hidden transition-colors duration-500`}>
        
        {/* Decorative Landscape Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {renderThemeBackground()}
        </div>

        <header className={`${activeTheme.headerBg} backdrop-blur-md px-4 py-2 shadow-sm flex justify-between items-center z-10 sticky top-0 border-b shrink-0 h-16`}>
          <div className="flex items-center gap-2">
            <div className={`bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 w-9 h-9 rounded-full flex items-center justify-center font-black text-lg border-2 border-white shadow-sm`}>
               {progress.playerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] font-bold uppercase tracking-wider opacity-70 ${activeTheme.text}`}>Player</span>
              <span className={`text-sm font-black leading-none drop-shadow-sm ${activeTheme.text}`}>{progress.playerName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {/* Theme Toggle Button */}
            <button 
              onClick={() => setShowThemeModal(true)} 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${activeTheme.iconBg}`}
            >
              <i className="fas fa-paint-brush text-xs"></i>
            </button>

            <button onClick={toggleMute} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${activeTheme.iconBg}`}>
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xs`}></i>
            </button>
            
            <button 
              onClick={() => setShowInfoModal(true)} 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${activeTheme.iconBg}`}
            >
              <i className="fas fa-info text-xs"></i>
            </button>

            <div className={`backdrop-blur-sm px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border-2 border-white shadow-sm ${activeTheme.cardBg} ${activeTheme.accent}`}>
              <i className="fas fa-trophy text-sm drop-shadow-sm"></i>
              <span className="text-sm">{progress.totalScore}</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden flex flex-col items-center z-10 w-full hide-scrollbar">
          <div className="w-full max-w-sm space-y-4">
            <div className={`flex flex-col items-center text-center p-4 rounded-3xl backdrop-blur-sm shadow-sm border relative overflow-hidden ${activeTheme.cardBg}`}>
               <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${activeTheme.accent}`}></div>
               <GameLogo className="w-16 h-16 mb-2 drop-shadow-md transform hover:scale-105 transition-transform duration-500" />
               <h2 className={`text-2xl font-black tracking-tight ${activeTheme.text}`}>Select Difficulty</h2>
               <p className={`font-medium text-xs mt-0.5 ${activeTheme.subText}`}>Where are the puppies hiding today?</p>
            </div>
            
            <div className="space-y-3 perspective-1000">
              <DifficultyCard 
                difficulty={Difficulty.EASY} points={10} color={activeTheme.id === 'night' ? "bg-gradient-to-r from-indigo-600 to-blue-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}
                description="100 Levels • Relaxed" onClick={() => { setSelectedDifficulty(Difficulty.EASY); setView('LEVEL_SELECT'); }}
              />
              <DifficultyCard 
                difficulty={Difficulty.MEDIUM} points={20} color={activeTheme.id === 'night' ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-400 to-indigo-500"}
                description="100 Levels • Timed" onClick={() => { setSelectedDifficulty(Difficulty.MEDIUM); setView('LEVEL_SELECT'); }}
              />
              <DifficultyCard 
                difficulty={Difficulty.HARD} points={50} color={activeTheme.id === 'night' ? "bg-gradient-to-r from-pink-700 to-rose-600" : "bg-gradient-to-r from-rose-500 to-pink-600"}
                description="100 Levels • Expert" onClick={() => { setSelectedDifficulty(Difficulty.HARD); setView('LEVEL_SELECT'); }}
              />
              
              {/* Buy Hints Shop Card */}
              <div 
                onClick={openHintShop}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-2xl shadow-md cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between h-16 w-full hover:shadow-xl hover:-translate-y-1 mt-4 border-2 border-yellow-300"
              >
                <div className="absolute -left-3 -bottom-3 opacity-20 text-5xl group-hover:scale-110 transition-transform rotate-12">
                  <i className="fas fa-lightbulb"></i>
                </div>
                
                <div className="z-10 flex flex-col pl-1">
                  <h3 className="text-lg font-black leading-none drop-shadow-sm">Buy Hints</h3>
                  <p className="text-white/90 text-[10px] font-medium mt-0.5 opacity-90 shadow-sm">
                    {progress.premiumHints} Hints Available
                  </p>
                </div>

                <div className="z-10 flex flex-col items-end pr-1">
                  <div className="flex items-center gap-1 bg-white/25 px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm border border-white/20">
                    <span className="font-black text-sm">₹9</span>
                  </div>
                  <span className="text-[9px] mt-0.5 opacity-90 uppercase font-bold tracking-wider drop-shadow-sm">100 Pack</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderGame = () => {
    // Determine hint button visual state
    const freeHintsRemaining = Math.max(0, 2 - hintsUsedInLevel);
    const hasPremiumHints = progress.premiumHints > 0;
    
    // Timer Color Logic
    let timerColorClass = 'bg-slate-800 text-white';
    if (timeLeft !== null && timeLeft <= 10) timerColorClass = 'bg-red-500 text-white animate-pulse';
    else if (timeLeft !== null && timeLeft <= 30) timerColorClass = 'bg-orange-500 text-white';
    
    return (
      <div className="flex flex-col h-full bg-slate-900 absolute inset-0 z-0">
        <div className="bg-slate-900/90 backdrop-blur text-white p-2 sm:p-3 flex justify-between items-center z-10 shadow-lg border-b border-slate-800 shrink-0">
          <button onClick={() => setView('LEVEL_SELECT')} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
             <i className="fas fa-times text-lg sm:text-xl"></i>
          </button>
          
          <div className="flex items-center gap-4">
             {timeLeft !== null && (
                 <div className={`px-3 py-1 rounded-full font-mono font-bold text-sm sm:text-base shadow-sm border border-white/20 flex items-center gap-2 ${timerColorClass}`}>
                    <i className="fas fa-clock text-xs"></i>
                    {formatTime(timeLeft)}
                 </div>
             )}
             <div className="flex flex-col items-end">
                <span className="font-bold text-brand-light uppercase text-[9px] sm:text-[10px] tracking-widest">{selectedDifficulty} MODE</span>
                <span className="text-[10px] sm:text-xs text-slate-400 max-w-[100px] truncate text-center opacity-80">Level {currentLevelId}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
            </button>
          </div>
        </div>
  
        <div className="flex-1 relative overflow-hidden">
          <GameCanvas 
            backgroundImage={gameState.bgImage}
            puppies={gameState.puppies}
            onPuppyFound={handlePuppyFound}
            isLoading={gameState.loading}
            difficulty={selectedDifficulty}
            showHints={showHints}
            onImageLoaded={() => {
              if (timeLeft !== null) {
                setIsTimerRunning(true);
              }
            }}
          />
          
          {/* HUD Elements */}
          {/* Found Count - Top Right (Optional but helpful) */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 items-end pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-mono text-brand-light border border-slate-700 flex items-center gap-2 shadow-lg">
              <i className="fas fa-paw text-[10px] sm:text-xs"></i>
              <span className="font-bold">{gameState.puppies.filter(p => p.isFound).length} / {gameState.puppies.length}</span>
            </div>
          </div>
          
          {/* Hint Button (Pointer Events Enabled) */}
          <div className="absolute bottom-20 sm:bottom-24 right-6 z-[60] pb-[env(safe-area-inset-bottom)] transition-all duration-300">
             <button 
               onClick={handleUseHint}
               disabled={gameState.loading || showHints}
               className={`
                 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 flex items-center justify-center transition-all duration-300 active:scale-95
                 ${showHints ? 'bg-yellow-400 border-yellow-200 scale-110' : 'bg-slate-800/90 border-slate-600 hover:bg-slate-700'}
               `}
             >
               <i className={`fas fa-lightbulb text-xl sm:text-2xl ${showHints ? 'text-white animate-pulse' : 'text-yellow-400'}`}></i>
               
               {/* Badge for remaining hints */}
               <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center border border-white">
                  {freeHintsRemaining > 0 ? freeHintsRemaining : (hasPremiumHints ? progress.premiumHints : '+')}
               </div>
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-slate-200 flex items-center justify-center overflow-hidden font-sans select-none relative">
      
      {/* PC Background (blurred pattern) */}
      <div className="absolute inset-0 z-0 bg-slate-300 opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200 via-slate-200 to-slate-300">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Phone Frame Container */}
      <div className="w-full h-full sm:w-[400px] sm:h-[850px] sm:max-h-[90vh] bg-slate-50 relative sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden z-10 flex flex-col">
         
        {view === 'LOGIN' && renderLogin()}
        {view === 'HOME' && renderHome()}
        
        {view === 'LEVEL_SELECT' && (
          <LevelSelector 
            difficulty={selectedDifficulty}
            clearedLevels={progress.clearedLevels}
            onSelectLevel={handleLevelSelect}
            onBack={() => setView('HOME')}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            currentTheme={progress.selectedTheme || 'sunny'}
          />
        )}

        {/* Render Game Underneath Modals for better UX */}
        {(view === 'GAME' || view === 'WIN' || view === 'GAME_OVER') && renderGame()}

        {view === 'WIN' && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl relative border-4 border-white">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce-short">
                <i className="fas fa-trophy text-6xl text-yellow-500 drop-shadow-sm"></i>
              </div>
              
              <h2 className="text-3xl font-black text-slate-800 mt-12 mb-2">Level Clear!</h2>
              <p className="text-slate-500 font-medium mb-6">Fantastic job finding all the pups!</p>
              
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex flex-col items-center w-24">
                    <span className="text-xs font-bold text-yellow-600 uppercase">Score</span>
                    <span className="text-2xl font-black text-yellow-500">{progress.totalScore}</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center w-24">
                    <span className="text-xs font-bold text-blue-600 uppercase">Level</span>
                    <span className="text-2xl font-black text-blue-500">{currentLevelId}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={nextLevel} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg shadow-emerald-200">
                  Next Level <i className="fas fa-arrow-right ml-2"></i>
                </Button>
                <button onClick={() => setView('LEVEL_SELECT')} className="text-slate-400 font-bold hover:text-slate-600 transition-colors py-2">
                  Back to Map
                </button>
              </div>
            </div>
            
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute animate-fall" style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}>
                    <i className={`fas fa-square text-xs transform rotate-45 text-${['red','yellow','blue','green','pink'][Math.floor(Math.random()*5)]}-400`}></i>
                  </div>
              ))}
            </div>
          </div>
        )}
        
        {view === 'GAME_OVER' && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl relative border-4 border-red-100">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-red-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <i className="fas fa-times text-5xl text-red-500"></i>
              </div>
              
              <h2 className="text-3xl font-black text-slate-800 mt-10 mb-2">Time's Up!</h2>
              <p className="text-slate-500 font-medium mb-6">Those puppies were too good at hiding.</p>

              <div className="flex flex-col gap-3">
                <Button onClick={handleRetry} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg shadow-blue-200">
                  <i className="fas fa-redo mr-2"></i> Try Again
                </Button>
                <button onClick={() => setView('LEVEL_SELECT')} className="text-slate-400 font-bold hover:text-slate-600 transition-colors py-2">
                  Give Up
                </button>
              </div>
            </div>
          </div>
        )}

        {showThemeModal && (
          <ThemeModal 
            onClose={() => setShowThemeModal(false)}
            onSelect={handleThemeChange}
            currentTheme={progress.selectedTheme || 'sunny'}
          />
        )}

        {showInfoModal && (
          <InfoModal onClose={() => setShowInfoModal(false)} />
        )}

        {showPaymentModal && (
          <PaymentModal 
            onClose={() => { setShowPaymentModal(false); setPaymentStatus('idle'); }}
            onPay={handlePayment}
            onPayWithPoints={handlePayWithPoints}
            currentPoints={progress.totalScore}
            paymentStatus={paymentStatus}
            onCancelPayment={handleCancelPayment}
            title={paymentModalConfig.title}
            description={paymentModalConfig.description}
          />
        )}
      </div>
    </div>
  );
}