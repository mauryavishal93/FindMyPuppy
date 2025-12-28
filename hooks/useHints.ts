import { useState, useCallback } from 'react';
import { UserProgress } from '../types';

interface UseHintsProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  playSfx: (type: 'hint') => void;
  onOutOfHints: () => void;
}

export const useHints = ({ progress, setProgress, playSfx, onOutOfHints }: UseHintsProps) => {
  const [hintsUsedInLevel, setHintsUsedInLevel] = useState(0);
  const [showHints, setShowHints] = useState(false);

  const activateHint = useCallback(() => {
     playSfx('hint');
     setShowHints(true);
     // Hide hints after 3 seconds
     setTimeout(() => setShowHints(false), 3000);
  }, [playSfx]);

  const handleUseHint = useCallback(() => {
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
      onOutOfHints();
    }
  }, [showHints, hintsUsedInLevel, progress.premiumHints, activateHint, setProgress, onOutOfHints]);

  const resetHints = useCallback(() => {
    setHintsUsedInLevel(0);
    setShowHints(false);
  }, []);

  return {
    hintsUsedInLevel,
    showHints,
    handleUseHint,
    resetHints,
    freeHintsRemaining: Math.max(0, 2 - hintsUsedInLevel),
    hasPremiumHints: (progress.premiumHints || 0) > 0
  };
};

