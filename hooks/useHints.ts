import { useState, useCallback } from 'react';
import { UserProgress } from '../types';
import { db } from '../services/db';

interface UseHintsProps {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  playSfx: (type: 'hint') => void;
  onOutOfHints: () => void;
  onHintStreakUpdated?: (newStreak: number) => void; // Callback when streak hints are used
}

export const useHints = ({ progress, setProgress, playSfx, onOutOfHints, onHintStreakUpdated }: UseHintsProps) => {
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
    
    // HINT PRIORITY SEQUENCE (MUST FOLLOW THIS ORDER):
    // 1. Free Hints (2 per game) - Use first
    // 2. Daily Streak Hints (from daily check-in) - Use second
    // 3. Total Hints (premium hints from shop) - Use last
    
    // Get current hint values (handle undefined/null)
    // IMPORTANT: dailyStreakHints comes from DB field hintStreak - this is the hint count available
    const freeHintsRemaining = Math.max(0, 2 - hintsUsedInLevel);
    const dailyStreakHints = (progress.dailyStreakHints ?? 0); // This is hintStreak from DB - use as hint count
    const totalHints = (progress.premiumHints ?? 0);
    
    // Debug: Log available hints
    console.log('[HINTS USE] Available - Free:', freeHintsRemaining, 'Streak (hintStreak):', dailyStreakHints, 'Total:', totalHints);
    
    // STEP 1: Check Free Hints first (0 and 1 are valid for < 2)
    if (freeHintsRemaining > 0) {
      const newFreeCount = freeHintsRemaining - 1;
      console.log('[HINTS] Using free hint. Badge will show:', newFreeCount > 0 ? `${newFreeCount} free` : 'daily streak count');
      setHintsUsedInLevel(prev => prev + 1);
      activateHint();
      return; // Exit early after using free hint
    } 
    
    // STEP 2: Check Daily Streak Hints (from daily check-in hintStreak field) - only after free hints are exhausted
    if (dailyStreakHints > 0) {
      console.log('[HINTS] Using daily streak hint from hintStreak. Before:', dailyStreakHints, 'After:', dailyStreakHints - 1, 'Total hints:', totalHints);
      
      // Update progress state immediately
      setProgress(prev => {
        // Ensure we're using the correct current value from hintStreak
        const currentStreak = prev.dailyStreakHints ?? 0;
        const updatedStreak = Math.max(0, currentStreak - 1);
        
        // IMPORTANT: Update hintStreak in database when streak hint is used
        if (prev.playerName) {
          db.updateHintStreak(prev.playerName, updatedStreak)
            .then(response => {
              if (response.success) {
                console.log('[HINTS] ✅ Database updated: hintStreak =', updatedStreak);
              } else {
                console.error('[HINTS] ❌ Database update failed:', response.message);
              }
            })
            .catch(err => {
              console.error('[HINTS] ❌ Failed to update hintStreak in database:', err);
            });
        }
        
        // Notify parent about streak update
        if (onHintStreakUpdated) {
          onHintStreakUpdated(updatedStreak);
        }
        
        console.log('[HINTS] Updated dailyStreakHints (from hintStreak) from', currentStreak, 'to', updatedStreak);
        return {...prev, dailyStreakHints: updatedStreak};
      });
      
      activateHint();
      return; // Exit early after using daily streak hint
    }
    
    // STEP 3: Check Total Hints (premium hints from shop) - only after free and daily streak are exhausted
    if (totalHints > 0) {
      console.log('[HINTS] Using total/premium hint. Before:', totalHints, 'After:', totalHints - 1);
      
      // Update progress state immediately
      setProgress(prev => {
        // Ensure we're using the correct current value
        const currentHints = prev.premiumHints ?? 0;
        const updatedHints = Math.max(0, currentHints - 1);
        
        // Sync hints to database if user is logged in
        if (prev.playerName) {
          db.updateHints(prev.playerName, updatedHints)
            .then(response => {
              if (response.success) {
                console.log('[HINTS] ✅ Database updated: hints =', updatedHints);
              } else {
                console.error('[HINTS] ❌ Database update failed:', response.message);
              }
            })
            .catch(err => {
              console.error('[HINTS] ❌ Failed to update hints in database:', err);
            });
        }
        
        console.log('[HINTS] Updated premiumHints from', currentHints, 'to', updatedHints);
        return {...prev, premiumHints: updatedHints};
      });
      
      activateHint();
      return; // Exit early after using premium hint
    } 
    
    // Out of hints - all hint types exhausted
    console.log('[HINTS] All hints exhausted. Free:', freeHintsRemaining, 'Streak:', dailyStreakHints, 'Total:', totalHints);
    onOutOfHints();
  }, [showHints, hintsUsedInLevel, progress.dailyStreakHints, progress.premiumHints, progress.playerName, activateHint, setProgress, onOutOfHints, onHintStreakUpdated]);

  const resetHints = useCallback(() => {
    setHintsUsedInLevel(0);
    setShowHints(false);
  }, []);

  // Calculate available hints for display - recalculates on every render
  // This ensures the badge always shows the correct count based on priority
  // IMPORTANT: dailyStreakHints comes from DB field: hintStreak
  // This value should be loaded when user logs in and used as hint count in game
  const freeHintsRemaining = Math.max(0, 2 - hintsUsedInLevel);
  const dailyStreakHintsRemaining = progress.dailyStreakHints ?? 0; // This is loaded from DB hintStreak field
  const totalHintsRemaining = progress.premiumHints ?? 0;
  
  // Verify hintStreak is available
  if (progress.dailyStreakHints !== undefined && progress.dailyStreakHints > 0) {
    console.log('[HINTS INIT] hintStreak loaded as dailyStreakHints:', progress.dailyStreakHints);
  }
  
  // Determine which hint type is currently available (based on priority)
  // This MUST follow the same priority as handleUseHint
  // Badge shows: Free count (2→1) → Daily streak count (from hintStreak) → Total hint count
  let currentHintType: 'free' | 'streak' | 'total' | 'none' = 'none';
  let currentHintCount = 0;
  
  // Priority 1: Free hints (if available) - badge shows: 2, then 1
  if (freeHintsRemaining > 0) {
    currentHintType = 'free';
    currentHintCount = freeHintsRemaining; // Will be 2, then 1
  } 
  // Priority 2: Daily streak hints from hintStreak (only if free hints are exhausted)
  // Badge shows the actual count from hintStreak field (this is the hint count available)
  else if (dailyStreakHintsRemaining > 0) {
    currentHintType = 'streak';
    currentHintCount = dailyStreakHintsRemaining; // Shows hintStreak count from DB - this is the hint count
  } 
  // Priority 3: Total hints (only if both free and daily streak are exhausted)
  // Badge shows total hint count
  else if (totalHintsRemaining > 0) {
    currentHintType = 'total';
    currentHintCount = totalHintsRemaining; // Shows actual total hint count
  }
  
  // Debug logging to verify display logic and badge count
  console.log('[HINTS BADGE] Free:', freeHintsRemaining, 'Streak (hintStreak):', dailyStreakHintsRemaining, 'Total:', totalHintsRemaining, '→ Badge showing:', currentHintType, 'Count:', currentHintCount);

  return {
    hintsUsedInLevel,
    showHints,
    handleUseHint,
    resetHints,
    freeHintsRemaining,
    dailyStreakHintsRemaining,
    totalHintsRemaining,
    currentHintType,
    currentHintCount,
    hasHints: freeHintsRemaining > 0 || dailyStreakHintsRemaining > 0 || totalHintsRemaining > 0,
    hasPremiumHints: totalHintsRemaining > 0
  };
};

