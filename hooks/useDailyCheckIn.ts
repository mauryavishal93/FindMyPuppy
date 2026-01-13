import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/db';
import { 
  DailyCheckInData, 
  DailyCheckInState, 
  getTodayDateString, 
  isMoreThanOneDayAgo 
} from '../types/dailyCheckIn';

interface UseDailyCheckInProps {
  username: string | null;
  onHintsUpdated?: (newHints: number) => void;
  onStreakHintsUpdated?: (newStreakHints: number) => void; // Callback for daily streak hints
}

export const useDailyCheckIn = ({ username, onHintsUpdated, onStreakHintsUpdated }: UseDailyCheckInProps) => {
  const [checkInData, setCheckInData] = useState<DailyCheckInData | null>(null);
  const [state, setState] = useState<DailyCheckInState>('ready');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load daily check-in status
  const loadStatus = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await db.getDailyCheckInStatus(username);
      
      if (response.success && response.lastPlayedDate !== undefined) {
        const today = getTodayDateString();
        const data: DailyCheckInData = {
          lastPlayedDate: response.lastPlayedDate,
          currentMissionDay: response.currentMissionDay || 1,
          hintStreak: response.hintStreak || 0,
          totalHints: response.totalHints || 0
        };
        
        setCheckInData(data);
        
        // Determine state
        if (response.lastPlayedDate === today) {
          setState('completed');
        } else if (!response.lastPlayedDate || isMoreThanOneDayAgo(response.lastPlayedDate)) {
          setState('missed');
        } else {
          setState('ready');
        }
      } else {
        setError(response.message || 'Failed to load daily check-in status');
      }
    } catch (err) {
      console.error('Error loading daily check-in status:', err);
      setError('Failed to load daily check-in status');
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Mark daily check-in as started (one chance per day)
  const markAsStarted = useCallback(async (): Promise<boolean> => {
    if (!username) {
      setError('User not logged in');
      return false;
    }

    if (state === 'completed') {
      setError('Daily check-in already played today');
      return false;
    }

    try {
      setError(null);
      const response = await db.markDailyCheckInStarted(username);
      
      if (response.success) {
        // Update local state to mark as played
        const today = getTodayDateString();
        const newData: DailyCheckInData = {
          lastPlayedDate: response.lastPlayedDate || today,
          currentMissionDay: checkInData?.currentMissionDay || 1,
          hintStreak: checkInData?.hintStreak || 0,
          totalHints: checkInData?.totalHints || 0
        };
        
        setCheckInData(newData);
        setState('completed'); // Mark as completed (played) so they can't play again
        
        return true;
      } else {
        setError(response.message || 'Failed to start daily check-in');
        return false;
      }
    } catch (err) {
      console.error('Error marking daily check-in as started:', err);
      setError('Failed to start daily check-in');
      return false;
    }
  }, [username, state, checkInData]);

  // Complete daily check-in (only called on success, gives hints)
  const completeCheckIn = useCallback(async (): Promise<boolean> => {
    if (!username) {
      setError('User not logged in');
      return false;
    }

    try {
      setError(null);
      const response = await db.completeDailyCheckIn(username);
      
      if (response.success) {
        // Update local state with hints
        const newData: DailyCheckInData = {
          lastPlayedDate: response.lastPlayedDate || getTodayDateString(),
          currentMissionDay: response.currentMissionDay || 1,
          hintStreak: response.hintStreak || 0,
          totalHints: response.totalHints || 0
        };
        
        setCheckInData(newData);
        
        // Notify parent about streak hints update (NOT total hints)
        if (onStreakHintsUpdated && response.hintStreak !== undefined) {
          onStreakHintsUpdated(response.hintStreak);
        }
        
        return true;
      } else {
        setError(response.message || 'Failed to complete daily check-in');
        return false;
      }
    } catch (err) {
      console.error('Error completing daily check-in:', err);
      setError('Failed to complete daily check-in');
      return false;
    }
  }, [username, onHintsUpdated]);

  // Load status on mount and when username changes
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Check for date change every minute (to enable button at midnight)
  useEffect(() => {
    if (!username || state !== 'completed') return;

    const interval = setInterval(() => {
      const today = getTodayDateString();
      if (checkInData?.lastPlayedDate && checkInData.lastPlayedDate !== today) {
        // Date changed, reload status
        loadStatus();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [username, state, checkInData?.lastPlayedDate, loadStatus]);

  return {
    checkInData,
    state,
    loading,
    error,
    loadStatus,
    markAsStarted,
    completeCheckIn,
    isReady: state === 'ready',
    isCompleted: state === 'completed',
    isMissed: state === 'missed',
    hintStreak: checkInData?.hintStreak || 0
  };
};
