
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, UserProgress, Puppy } from './types';
import { generateLevelTheme, generateLevelImage } from './services/geminiService';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';
import { GameLogo } from './components/GameLogo';

// --- Assets ---
const PUPPY_IMAGES = [
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUsMjAgTDMwLDQ1IEwxMCw1MCBaIiBmaWxsPSIjRTg3QTI5Ii8+PHBhdGggZD0iTTg1LDIwIEw3MCw0NSBMOTAsNTAgWiIgZmlsbD0iI0U4N0EyOSIvPjxwYXRoIGQ9Ik0xNSw1MCBRMTAsODUgNTAsOTAgUTkwLDg1IDg1LDUwIFE4NSwzMCA1MCwzMCBRMTUsMzAgMTUsNTAiIGZpbGw9IiNFODdBMjkiLz48cGF0aCBkPSJNMzAsNTAgUTUwLDQwIDcwLDUwIFE4MCw3MCA1MCw4NSBRMjAsNzAgMzAsNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjUiIHJ5PSIzIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTQ1LDcyIFE1MCw3NSA1NSw3MiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==`,
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMTUgTDM1LDQwIEwxNSw0NSBaIiBmaWxsPSIjNUQ2RDdFIi8+PHBhdGggZD0iTTgwLDE1IEw2NSw0MCBMODUsNDUgWiIgZmlsbD0iIzVENkQ3RSIvPjxwYXRoIGQ9Ik0yMCw0NSBRMTAsODUgNTAsOTAgUTg1LDg1IDgwLDQ1IFE4MCwyNSA1MCwyNSBRMjAsMjUgMjAsNDUiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTIwLDQ1IFE1MCwyNSA4MCw0NSBRODAsNTUgNzAsNTUgUTYwLDU1IDUwLDQ1IFE0MCw1NSAzMCw1NSBRMjAsNTUgMjAsNDUiIGZpbGw9IiM1RDZDN0UiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjQiIGZpbGw9IiM4NUMxRTkiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI1MCIgcj0iMCIgZmlsbD0iIzg1QzFFOSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjUiIHJ5PSIzIiBmaWxsPSIjMzMzIi8+PC9nPjwvc3ZnPg==`,
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUsMzUgTDMwLDMwIEwyNSw1MCBaIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTg1LDM1IEw3MCwzMCBMNzUsNTAgWiIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSIzMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjU1IiByeD0iMjUiIGZpbGw9IiVGNUNCQTciLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2MCIgcng9IjIwIiByeT0iMTUiIGZpbGw9IiMzMzMiIG9wYWNpdHk9IjAuOSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjYiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjMiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNTAiIHI9IjYiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNTAiIHI9IjMiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjYyIiByeD0iNiIgcnk9IjMiIGZpbGw9ImJsYWNrIi8+PC9nPjwvc3ZnPg==`,
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiM0RTM0MkUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzAsMzAgQTQwLDQwIDAgMCAxIDcwLDMwIEE1MCw1MCAwIDAgMSA3NSw3MCBBNTAsMzAgMCAwIDEgMjUsNzAgQTQwLDQwIDAgMCAxIDMwLDMwIiBmaWxsPSIjRDM1NDAwIi8+PHBhdGggZD0iTTMwLDM1IFE1MCw5MCA2MCwzNSIgZmlsbD0iI0Y1Q0JBNyIgc3Ryb2tlPSJub25lIi8+PGVsbGlwc2UgY3g9IjUwIiBjeT0iNjAiIHJ4PSIxMiIgcnk9IjEwIiBmaWxsPSIjRjVDQkE3IiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQ4IiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ4IiByPSIxLjUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48cGF0aCBkPSJNNDYsNTggTDU0LDU4IEw1MCw2NCBaIiBmaWxsPSIjMzMzIi8+PC9nPjwvc3ZnPg==`,
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMzAgUTEwLDQwIDIwLDYwIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTc1LDMwIFE5MCw0MCA4MCw2MCIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0yNSwzMCBRNTAsMjAgNzUsMzAgUTg1LDUwIDc1LDc1IFE1MCw4NSAyNSw3NSBRMTUsNTAgMjUsMzAiIGZpbGw9IiNGRkYiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjYiIHJ5PSI0IiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMyIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PC9nPjwvc3ZnPg==`,
];

const SOUNDS = {
  // Use local bgmusic.mp3
  ambient: 'https://assets.mixkit.co/active_storage/sfx/689/689-preview.mp3',
  // Pleasant "ding" or pop sound
  found: 'https://assets.mixkit.co/active_storage/sfx/2066/2066-preview.mp3',
  // Success chime
  clear: 'https://assets.mixkit.co/active_storage/sfx/2065/2065-preview.mp3',
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
    className={`${color} text-white p-4 rounded-2xl shadow-md cursor-pointer transition-all relative overflow-hidden group flex items-center justify-between h-20 w-full`}
  >
    <div className="absolute -left-4 -bottom-4 opacity-20 text-6xl group-hover:scale-110 transition-transform rotate-12">
      <i className="fas fa-paw"></i>
    </div>
    
    <div className="z-10 flex flex-col pl-2">
      <h3 className="text-2xl font-black leading-none">{difficulty}</h3>
      <p className="text-white/90 text-xs font-medium mt-1 opacity-90">{description}</p>
    </div>

    <div className="z-10 flex flex-col items-end pr-1">
      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
        <i className="fas fa-star text-yellow-300 text-xs"></i>
        <span className="font-bold text-sm">{points}</span>
      </div>
      <span className="text-[10px] mt-1 opacity-80 uppercase font-bold tracking-wider">Points</span>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'LOGIN' | 'HOME' | 'LEVEL_SELECT' | 'GAME' | 'WIN'>('LOGIN');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [loginName, setLoginName] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('findMyPuppy_progress');
    return saved ? JSON.parse(saved) : {
      playerName: '',
      clearedLevels: {},
      totalScore: 0,
      unlockedDifficulties: [Difficulty.EASY]
    };
  });

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

  const toggleMute = () => setIsMuted(prev => !prev);

  const playSfx = (type: 'found' | 'clear') => {
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

  const initLevel = useCallback(async (level: number, diff: Difficulty) => {
    setGameState(prev => ({ ...prev, loading: true, bgImage: null, puppies: [], levelTheme: '' }));
    
    const puppyCount = 25;
    let baseOpacity = 0.5; 
    let minScale = 0.3; 
    let maxScale = 0.5; 
    
    if (diff === Difficulty.MEDIUM) {
      baseOpacity = 0.4;
      minScale = 0.25;
      maxScale = 0.4;
    } else if (diff === Difficulty.HARD) {
      baseOpacity = 0.3; 
      minScale = 0.2; 
      maxScale = 0.35;
    }

    // Get the textual theme for this level
    const theme = await generateLevelTheme(level, diff);
    
    // Generate the image on the fly using Gemini
    const bgImage = await generateLevelImage(theme, level);

    const newPuppies: Puppy[] = [];
    while (newPuppies.length < puppyCount) {
      const scale = minScale + (Math.random() * (maxScale - minScale));
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      let overlaps = false;
      for (const p of newPuppies) {
        const dx = x - p.x;
        const dy = y - p.y;
        if (Math.sqrt(dx*dx + dy*dy) < 6) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        newPuppies.push({
          id: `pup-${newPuppies.length}-${Date.now()}`,
          x,
          y,
          rotation: Math.random() * 360,
          scale,
          isFound: false,
          opacity: Math.max(0.3, baseOpacity - (Math.random() * 0.1)), 
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
        setTimeout(() => handleLevelClear(), 800);
      }
      return { ...prev, puppies: updatedPuppies };
    });
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

  const nextLevel = () => {
    if (currentLevelId < 25) {
      handleLevelSelect(currentLevelId + 1);
    } else {
      setView('HOME');
    }
  };

  const renderLogin = () => (
    <div className="flex flex-col h-full items-center justify-center p-8 bg-brand-light/30 relative overflow-hidden">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm z-10 text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <GameLogo className="w-28 h-28" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">FindMyPuppy</h1>
        <p className="text-slate-500 mb-6">Join the hide & seek adventure!</p>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="What's your name?"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-brand text-lg text-center font-bold text-slate-700 bg-slate-50"
            maxLength={12}
          />
          <Button onClick={handleLogin} disabled={!loginName.trim()} className="w-full bg-brand text-white">
            Start Playing
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <header className="bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-indigo-200">
             {progress.playerName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Player</span>
            <span className="text-lg font-black text-slate-800 leading-none">{progress.playerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
          </button>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full font-bold flex items-center gap-2 border border-yellow-200">
            <i className="fas fa-trophy text-yellow-500"></i>
            <span>{progress.totalScore}</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 px-6 py-6 overflow-y-auto flex flex-col items-center z-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center mb-6">
             <GameLogo className="w-24 h-24 mb-4" />
             <h2 className="text-2xl font-bold text-slate-800">Select Difficulty</h2>
          </div>
          <div className="space-y-3">
            <DifficultyCard 
              difficulty={Difficulty.EASY} points={10} color="bg-gradient-to-r from-green-400 to-green-500" 
              description="25 Puppies • Simple" onClick={() => { setSelectedDifficulty(Difficulty.EASY); setView('LEVEL_SELECT'); }}
            />
            <DifficultyCard 
              difficulty={Difficulty.MEDIUM} points={20} color="bg-gradient-to-r from-blue-400 to-blue-500" 
              description="25 Puppies • Tricky" onClick={() => { setSelectedDifficulty(Difficulty.MEDIUM); setView('LEVEL_SELECT'); }}
            />
            <DifficultyCard 
              difficulty={Difficulty.HARD} points={50} color="bg-gradient-to-r from-rose-500 to-rose-600" 
              description="25 Puppies • Extreme" onClick={() => { setSelectedDifficulty(Difficulty.HARD); setView('LEVEL_SELECT'); }}
            />
          </div>
        </div>
      </main>
    </div>
  );

  const renderWin = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white">
           <i className="fas fa-trophy text-5xl text-white"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Level Cleared!</h2>
        <p className="text-slate-500 mb-8 font-medium">Amazing job, {progress.playerName}!</p>
        <div className="space-y-3">
          {currentLevelId < 25 ? (
             <Button onClick={nextLevel} className="w-full bg-brand text-white hover:bg-brand-dark">
               Next Level <i className="fas fa-arrow-right ml-2"></i>
             </Button>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl mb-4 font-bold border border-yellow-200">
              🎉 Difficulty Completed!
            </div>
          )}
          <Button onClick={() => setView('LEVEL_SELECT')} className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            Back to Levels
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="bg-slate-900 text-white p-3 flex justify-between items-center z-10 shadow-lg border-b border-slate-800">
        <button onClick={() => setView('LEVEL_SELECT')} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
           <i className="fas fa-times text-xl"></i>
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold text-brand-light uppercase text-xs tracking-wider">{selectedDifficulty} • Level {currentLevelId}</span>
           <span className="text-xs text-slate-400 max-w-[150px] truncate text-center">{gameState.levelTheme || "Loading..."}</span>
        </div>
        <button 
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <GameCanvas 
          backgroundImage={gameState.bgImage}
          puppies={gameState.puppies}
          onPuppyFound={handlePuppyFound}
          isLoading={gameState.loading}
          difficulty={selectedDifficulty}
        />
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-mono text-green-400 border border-slate-700 flex items-center gap-2 pointer-events-none">
          <i className="fas fa-paw text-xs"></i>
          <span>{gameState.puppies.filter(p => p.isFound).length}/{gameState.puppies.length}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen max-w-lg mx-auto bg-white shadow-2xl overflow-hidden relative font-sans">
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
        />
      )}
      {view === 'GAME' && renderGame()}
      {view === 'WIN' && renderWin()}
    </div>
  );
}
