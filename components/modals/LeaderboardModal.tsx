import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../../types';
import { db } from '../../services/db';
import { ModalBase, ModalHeader, ModalContent, ModalFooter } from './ModalBase';

interface LeaderboardEntry {
  username: string;
  rank: number;
  points: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemeConfig;
  currentUsername?: string;
}

interface ReferralEntry {
  username: string;
  rank: number;
  referredCount: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  currentUsername
}) => {
  const [tab, setTab] = useState<'points' | 'referrals'>('points');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [referralLeaderboard, setReferralLeaderboard] = useState<ReferralEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (tab === 'points') loadLeaderboard();
      else loadReferralLeaderboard();
    }
  }, [isOpen, currentUsername, tab]);

  const loadReferralLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await db.getLeaderboardReferrals();
      if (res.success && res.leaderboard) setReferralLeaderboard(res.leaderboard);
      else setReferralLeaderboard([]);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    setCurrentUser(null); // Reset current user
    try {
      const response = await db.getLeaderboard(currentUsername);
      if (response.success && response.leaderboard) {
        setLeaderboard(response.leaderboard);
        // Set current user if they're not in top 10
        // response.currentUser will be set only if user exists and is NOT in top 10
        if (response.currentUser && currentUsername) {
          setCurrentUser(response.currentUser);
        } else {
          setCurrentUser(null);
        }
      } else {
        setError(response.message || 'Failed to load leaderboard');
      }
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Leaderboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} className="bg-white">
      <ModalHeader className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-50 border-amber-200">
        <div className="text-center pr-0">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-2xl font-black mb-1 text-slate-800">Leaderboard</h2>
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => setTab('points')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                tab === 'points' 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg' 
                  : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Points
            </button>
            <button
              onClick={() => setTab('referrals')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                tab === 'referrals' 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg' 
                  : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Top Referrers
            </button>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        {/* Leaderboard Content */}
        {tab === 'referrals' ? (
          loading ? (
            <div className="flex justify-center py-12"><div className="text-3xl animate-spin">🎮</div></div>
          ) : referralLeaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-600">No referrers yet. Share your link to climb!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {referralLeaderboard.map((entry) => (
                <div key={entry.rank} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border-2 border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm bg-white border-2 border-slate-300 text-slate-700">
                    {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </div>
                  <div className="flex-1 font-bold text-sm truncate text-slate-800">{entry.username}</div>
                  <div className="px-3 py-1 rounded-lg font-black text-sm text-purple-700 bg-purple-100 border border-purple-200">
                    {entry.referredCount} referred
                  </div>
                </div>
              ))}
            </div>
          )
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-3xl mb-2 animate-spin">🎮</div>
              <p className="text-sm text-slate-600">Loading leaderboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">😕</div>
            <p className="text-sm text-slate-600 mb-4">{error}</p>
            <button
              onClick={loadLeaderboard}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold hover:scale-105 active:scale-95 transition-transform shadow-md"
            >
              Try Again
            </button>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-slate-600">No players yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {/* Top 10 Leaderboard */}
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.username === currentUsername;
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all border-2 ${
                    isCurrentUser
                      ? `bg-gradient-to-r ${getRankColor(entry.rank)} border-yellow-400 shadow-lg`
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{
                    boxShadow: isCurrentUser 
                      ? '0 4px 12px rgba(255,215,0,0.3)' 
                      : '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                    isCurrentUser
                      ? 'bg-white/30 backdrop-blur-md text-white'
                      : entry.rank <= 3 
                        ? 'bg-white border-2 border-slate-300 text-slate-700'
                        : 'bg-white border-2 border-slate-300 text-slate-700'
                  }`}>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${
                      isCurrentUser ? 'text-white' : 'text-slate-800'
                    }`}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-2 text-xs opacity-90">(You)</span>}
                    </div>
                  </div>

                  {/* Points */}
                  <div className={`flex-shrink-0 px-3 py-1 rounded-lg font-black text-sm ${
                    isCurrentUser 
                      ? 'bg-white/30 text-white border border-white/40' 
                      : 'text-blue-700 bg-blue-100 border border-blue-200'
                  }`}>
                    {entry.points.toLocaleString()} pts
                  </div>
                </div>
              );
            })}

            {/* Divider if current user is shown at bottom */}
            {currentUser && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-slate-300"></div>
                  <div className="text-xs text-slate-500 px-2 font-semibold">Your Rank</div>
                  <div className="flex-1 h-px bg-slate-300"></div>
                </div>

                {/* Current User (Not in Top 10) */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-yellow-300 shadow-lg`}
                  style={{
                    boxShadow: '0 4px 12px rgba(255,215,0,0.3)',
                  }}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm bg-white/30 backdrop-blur-md">
                    #{currentUser.rank}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate text-white">
                      {currentUser.username}
                      <span className="ml-2 text-xs">(You)</span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 px-3 py-1 rounded-lg font-black text-sm bg-white/30 text-white">
                    {currentUser.points.toLocaleString()} pts
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </ModalContent>

      <ModalFooter>
        <p className="text-xs text-slate-500 text-center">
          Rankings are based on total points earned
        </p>
      </ModalFooter>
    </ModalBase>
  );
};
