import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, UserProgress, Puppy } from './types';
import { generateLevelTheme, generateLevelImage } from './services/geminiService';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';

// --- Assets ---
// Cartoon-style Puppy Faces matching the reference image.
const PUPPY_IMAGES = [
  // 1. Corgi / Shiba (Orange, Pointy Ears, Happy)
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUsMjAgTDMwLDQ1IEwxMCw1MCBaIiBmaWxsPSIjRTg3QTI5Ii8+PHBhdGggZD0iTTg1LDIwIEw3MCw0NSBMOTAsNTAgWiIgZmlsbD0iI0U4N0EyOSIvPjxwYXRoIGQ9Ik0xNSw1MCBRMTAsODUgNTAsOTAgUTkwLDg1IDg1LDUwIFE4NSwzMCA1MCwzMCBRMTUsMzAgMTUsNTAiIGZpbGw9IiNFODdBMjkiLz48cGF0aCBkPSJNMzAsNTAgUTUwLDQwIDcwLDUwIFE4MCw3MCA1MCw4NSBRMjAsNzAgMzAsNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2NSIgY3k9IjU1IiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjUiIHJ5PSIzIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTQ1LDcyIFE1MCw3NSA1NSw3MiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==`,
  
  // 2. Husky / Malamute (Grey & White, Mask)
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMTUgTDM1LDQwIEwxNSw0NSBaIiBmaWxsPSIjNUQ2RDdFIi8+PHBhdGggZD0iTTgwLDE1IEw2NSw0MCBMODUsNDUgWiIgZmlsbD0iIzVENkQ3RSIvPjxwYXRoIGQ9Ik0yMCw0NSBRMTUsODUgNTAsOTAgUTg1LDg1IDgwLDQ1IFE4MCwyNSA1MCwyNSBRMjAsMjUgMjAsNDUiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTIwLDQ1IFE1MCwyNSA4MCw0NSBRODAsNTUgNzAsNTUgUTYwLDU1IDUwLDQ1IFE0MCw1NSAzMCw1NSBRMjAsNTUgMjAsNDUiIGZpbGw9IiM1RDZDN0UiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjQiIGZpbGw9IiM4NUMxRTkiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNjUiIGN5PSI1MCIgcj0iNCIgZmlsbD0iIzg1QzFFOSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjUiIHJ5PSIzIiBmaWxsPSIjMzMzIi8+PC9nPjwvc3ZnPg==`,

  // 3. Pug (Tan, Wrinkly, Folded Ears)
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTUsMzUgTDMwLDMwIEwyNSw1MCBaIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTg1LDM1IEw3MCwzMCBMNzUsNTAgWiIgZmlsbD0iIzMzMyIvPjxyZWN0IHg9IjIwIiB5PSIzMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjU1IiByeD0iMjUiIGZpbGw9IiVGNUNCQTciLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2MCIgcng9IjIwIiByeT0iMTUiIGZpbGw9IiMzMzMiIG9wYWNpdHk9IjAuOSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjYiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNTAiIHI9IjMiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNTAiIHI9IjYiIGZpbGw9IiNGRkYiIHN0cm9rZT0ibm9uZSIvPjxjaXJjbGUgY3g9IjY1IiBjeT0iNTAiIHI9IjMiIGZpbGw9IiMzMzMiIHN0cm9rZT0ibm9uZSIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9IjYyIiByeD0iNiIgcnk9IjMiIGZpbGw9ImJsYWNrIi8+PC9nPjwvc3ZnPg==`,

  // 4. Spaniel / Golden (Floppy Ears, Brown)
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiM0RTM0MkUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzAsMzAgQTQwLDQwIDAgMCAxIDcwLDMwIEE1MCw1MCAwIDAgMSA3NSw3MCBBNTAsMzAgMCAwIDEgMjUsNzAgQTQwLDQwIDAgMCAxIDMwLDMwIiBmaWxsPSIjRDM1NDAwIi8+PHBhdGggZD0iTTMwLDM1IFE5LDQwIDE1LDY1IFEyNSw3NSAzMCw2MCIgZmlsbD0iI0EwNDAwMCIvPjxwYXRoIGQ9Ik03MCwzNSBROTEsNDAgODUsNjUgUTc1LDc1IDcwLDYwIiBmaWxsPSIjQTA0MDAwIi8+PHBhdGggZD0iTTQwLDM1IFE1MCw5MCA2MCwzNSIgZmlsbD0iI0Y1Q0JBNyIgc3Ryb2tlPSJub25lIi8+PGVsbGlwc2UgY3g9IjUwIiBjeT0iNjAiIHJ4PSIxMiIgcnk9IjEwIiBmaWxsPSIjRjVDQkE3IiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48cGF0aCBkPSJNNDYsNTggTDU0LDU4IEw1MCw2NCBaIiBmaWxsPSIjMzMzIi8+PC9nPjwvc3ZnPg==`,

  // 5. Dalmatian / Beagle (White, Spots)
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZyBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAsMzAgUTEwLDQwIDIwLDYwIiBmaWxsPSIjMzMzIi8+PHBhdGggZD0iTTc1LDMwIFE5MCw0MCA4MCw2MCIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0yNSwzMCBRNTAsMjAgNzUsMzAgUTg1LDUwIDc1LDc1IFE1MCw4NSAyNSw3NSBRMTUsNTAgMjUsMzAiIGZpbGw9IiNGRkYiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjMzMzIiBzdHJva2U9Im5vbmUiLz48ZWxsaXBzZSBjeD0iNTAiIGN5PSI2NSIgcng9IjYiIHJ5PSI0IiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0MCIgcj0iMiIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMyIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJub25lIi8+PC9nPjwvc3ZnPg==`,
];

// --- Helper Components ---

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
  <button 
    onClick={onClick} 
    className={`px-6 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 ${className}`}
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
    className={`${color} text-white p-6 rounded-3xl shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden group`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl group-hover:scale-110 transition-transform">
      <i className="fas fa-paw"></i>
    </div>
    <h3 className="text-3xl font-black mb-1">{difficulty}</h3>
    <p className="text-white/90 text-sm mb-4 font-medium">{description}</p>
    <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">
      <i className="fas fa-star text-yellow-300"></i>
      <span className="font-bold">{points} Pts / Level</span>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  // State
  const [view, setView] = useState<'HOME' | 'LEVEL_SELECT' | 'GAME' | 'WIN'>('HOME');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  
  // Persisted Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('findMyPuppy_progress');
    return saved ? JSON.parse(saved) : {
      clearedLevels: {},
      totalScore: 0,
      unlockedDifficulties: [Difficulty.EASY]
    };
  });

  // Game Session State
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

  // Persist progress
  useEffect(() => {
    localStorage.setItem('findMyPuppy_progress', JSON.stringify(progress));
  }, [progress]);

  // --- Game Logic ---

  const initLevel = useCallback(async (level: number, diff: Difficulty) => {
    setGameState(prev => ({ ...prev, loading: true, bgImage: null, puppies: [], levelTheme: '' }));
    
    // 1. Determine constraints based on difficulty
    const puppyCount = 25;
    
    // Logic for Scrollable Map (1600x1600)
    // Decreased base opacity for better transparency when hidden
    let baseOpacity = 0.5; 
    let minScale = 0.3; 
    let maxScale = 0.5; 
    
    if (diff === Difficulty.MEDIUM) {
      baseOpacity = 0.45;
      minScale = 0.25;
      maxScale = 0.4;
    } else if (diff === Difficulty.HARD) {
      baseOpacity = 0.4; 
      minScale = 0.15; 
      maxScale = 0.3;
    }

    // 2. Generate Content
    const theme = await generateLevelTheme(level, diff);
    const bgImage = await generateLevelImage(theme);

    // 3. Create Puppies with Collision Detection
    const newPuppies: Puppy[] = [];
    const MAP_SIZE = 1600; // Reference map size for calculation
    
    let safetyCounter = 0; // Prevent infinite loops
    while (newPuppies.length < puppyCount && safetyCounter < 1000) {
      safetyCounter++;
      
      // Random attributes
      const scale = minScale + (Math.random() * (maxScale - minScale));
      const aspectFactor = 0.8 + (Math.random() * 0.5);
      const facingLeft = Math.random() > 0.5;
      
      // Calculate dimensions in px to determine percentage size
      // (Matching the render logic in GameCanvas)
      const baseSize = Math.max(30, scale * 120);
      const pxWidth = baseSize * aspectFactor;
      const pxHeight = baseSize * (1 / aspectFactor);
      
      // Convert to Percentage for position checking
      const wPct = (pxWidth / MAP_SIZE) * 100;
      const hPct = (pxHeight / MAP_SIZE) * 100;
      
      // Random Position (Center) - ensure it stays within bounds
      // Padding half width/height so it doesn't clip off the map edge
      const x = (wPct / 2) + Math.random() * (100 - wPct);
      const y = (hPct / 2) + Math.random() * (100 - hPct);
      
      // Collision Detection
      let overlaps = false;
      for (const p of newPuppies) {
        // Reconstruct dimensions of the existing puppy
        const pBaseSize = Math.max(30, p.scale * 120);
        const pW = ((pBaseSize * p.aspectFactor) / MAP_SIZE) * 100;
        const pH = ((pBaseSize * (1 / p.aspectFactor)) / MAP_SIZE) * 100;
        
        // AABB Collision Check
        // We add a tiny buffer (0.5%) to ensure clear visual separation
        if (
          x - wPct/2 < p.x + pW/2 + 0.5 &&
          x + wPct/2 > p.x - pW/2 - 0.5 &&
          y - hPct/2 < p.y + pH/2 + 0.5 &&
          y + hPct/2 > p.y - pH/2 - 0.5
        ) {
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
          // Random opacity variation around baseOpacity
          opacity: Math.max(0.2, baseOpacity - (Math.random() * 0.15)), 
          hueRotate: Math.random() * 360, 
          imageUrl: PUPPY_IMAGES[Math.floor(Math.random() * PUPPY_IMAGES.length)],
          facingLeft,
          aspectFactor
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
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-puppy-bark-2792.mp3'); // Example sfx
    audio.volume = 0.2;
    audio.play().catch(() => {}); // Ignore auto-play errors

    setGameState(prev => {
      const updatedPuppies = prev.puppies.map(p => 
        p.id === id ? { ...p, isFound: true } : p
      );
      
      const allFound = updatedPuppies.every(p => p.isFound);
      
      if (allFound) {
        // Level Clear Logic
        setTimeout(() => handleLevelClear(), 500);
      }
      
      return { ...prev, puppies: updatedPuppies };
    });
  };

  const handleLevelClear = () => {
    const levelKey = `${selectedDifficulty}_${currentLevelId}`;
    
    // Calculate points only if not already cleared (prevent farming)
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
      // Completed difficulty tier
      setView('HOME');
    }
  };

  // --- Views ---

  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white p-6 shadow-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
             <i className="fas fa-dog"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">FindMyPuppy</h1>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <i className="fas fa-trophy"></i>
          <span>{progress.totalScore}</span>
        </div>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Select Difficulty</h2>
        <div className="space-y-6 max-w-md mx-auto">
          <DifficultyCard 
            difficulty={Difficulty.EASY}
            points={10}
            color="bg-green-400"
            description="25 Small Anime Puppies. Scroll to find them!"
            onClick={() => { setSelectedDifficulty(Difficulty.EASY); setView('LEVEL_SELECT'); }}
          />
          <DifficultyCard 
            difficulty={Difficulty.MEDIUM}
            points={20}
            color="bg-blue-400"
            description="25 Tiny Puppies. Large map, harder hiding spots."
            onClick={() => { setSelectedDifficulty(Difficulty.MEDIUM); setView('LEVEL_SELECT'); }}
          />
          <DifficultyCard 
            difficulty={Difficulty.HARD}
            points={50}
            color="bg-rose-500"
            description="25 Micro Puppies. Extreme challenge!"
            onClick={() => { setSelectedDifficulty(Difficulty.HARD); setView('LEVEL_SELECT'); }}
          />
        </div>
        
        <div className="mt-10 text-center text-slate-400 text-sm p-4 bg-slate-100 rounded-xl">
           <i className="fas fa-info-circle mr-2"></i>
           Game data powered by Gemini AI. Images generated on the fly.
        </div>
      </main>
    </div>
  );

  const renderWin = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
           <i className="fas fa-trophy text-5xl text-white"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Level Cleared!</h2>
        <p className="text-slate-500 mb-8">You found all 25 puppies!</p>
        
        <div className="space-y-3">
          {currentLevelId < 25 ? (
             <Button onClick={nextLevel} className="w-full bg-brand text-white hover:bg-brand-dark">
               Next Level <i className="fas fa-arrow-right ml-2"></i>
             </Button>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl mb-4 font-bold">
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
      {/* Game Header */}
      <div className="bg-slate-900 text-white p-3 flex justify-between items-center z-10 shadow-lg">
        <button onClick={() => setView('LEVEL_SELECT')} className="text-slate-400 hover:text-white transition">
           <i className="fas fa-times text-2xl"></i>
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold text-brand-light uppercase text-xs tracking-wider">{selectedDifficulty} - Level {currentLevelId}</span>
           <span className="text-xs text-slate-400 max-w-[200px] truncate text-center">{gameState.levelTheme || "Loading..."}</span>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full text-sm font-mono text-green-400 border border-slate-700">
          {gameState.puppies.filter(p => p.isFound).length} / {gameState.puppies.length}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden">
        <GameCanvas 
          backgroundImage={gameState.bgImage}
          puppies={gameState.puppies}
          onPuppyFound={handlePuppyFound}
          isLoading={gameState.loading}
        />
        
        {/* Hint overlay */}
        {!gameState.loading && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 z-20">
             <div className="bg-black/50 text-white px-4 py-2 rounded-full text-xs backdrop-blur-md whitespace-nowrap opacity-75">
                Scroll & Zoom to find them!
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen max-w-lg mx-auto bg-white shadow-2xl overflow-hidden relative font-sans">
      {view === 'HOME' && renderHome()}
      {view === 'LEVEL_SELECT' && (
        <LevelSelector 
          difficulty={selectedDifficulty}
          clearedLevels={progress.clearedLevels}
          onSelectLevel={handleLevelSelect}
          onBack={() => setView('HOME')}
        />
      )}
      {view === 'GAME' && renderGame()}
      {view === 'WIN' && renderWin()}
    </div>
  );
}