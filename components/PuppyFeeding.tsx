import React, { useState } from 'react';
import { ThemeConfig } from '../types';

interface PuppyFeedingProps {
  onFeed: () => Promise<{
    success: boolean;
    hintsEarned?: number;
    pointsEarned?: number;
    puppyAge?: number;
    puppySize?: number;
    milestone?: '7days' | '30days' | '1year' | null;
  }>;
  onClose: () => void;
  activeTheme: ThemeConfig;
  puppyAge: number;
  puppySize: number;
  streak: number;
}

// ─── Day 1–7: Growth stages (emoji changes, no badge) ───────────────────────
const GROWTH_STAGES: Record<number, { emoji: string; label: string; scale: number }> = {
  0: { emoji: '🐶', label: 'Newborn Pup',  scale: 0.65 },
  1: { emoji: '🐶', label: 'Newborn Pup',  scale: 0.65 },
  2: { emoji: '🐶', label: 'Baby Pup',     scale: 0.80 },
  3: { emoji: '🐕', label: 'Little Pup',   scale: 0.90 },
  4: { emoji: '🐕', label: 'Medium Dog',   scale: 1.00 },
  5: { emoji: '🐕‍🦺', label: 'Trained Dog', scale: 1.15 },
  6: { emoji: '🦮', label: 'Big Dog',      scale: 1.30 },
  7: { emoji: '🦮', label: 'Fully Grown',  scale: 1.50 },
};

// ─── Day 8–365: Badge system (dog stays 🦮, badge changes) ──────────────────
interface BadgeStage {
  badge: string;       // emoji shown above the dog
  label: string;       // stage name
  glowColor: string;   // CSS color for the glow ring
}

const getBadgeStage = (streak: number): BadgeStage | null => {
  if (streak >= 365) return { badge: '🌟👑🌟', label: 'Puppy Master',   glowColor: 'rgba(255,215,0,0.8)' };
  if (streak >= 180) return { badge: '🌈',     label: 'Legend Dog',     glowColor: 'rgba(168,85,247,0.6)' };
  if (streak >= 90)  return { badge: '👑',     label: 'Royal Dog',      glowColor: 'rgba(250,204,21,0.7)' };
  if (streak >= 60)  return { badge: '💎',     label: 'Diamond Dog',    glowColor: 'rgba(96,165,250,0.6)' };
  if (streak >= 31)  return { badge: '🏆',     label: 'Trophy Dog',     glowColor: 'rgba(234,179,8,0.6)'  };
  if (streak === 30) return { badge: '🥇',     label: 'Gold Champion',  glowColor: 'rgba(234,179,8,0.7)'  };
  if (streak >= 21)  return { badge: '🥈',     label: 'Silver Pup',     glowColor: 'rgba(148,163,184,0.6)'};
  if (streak >= 14)  return { badge: '🏅',     label: 'Medalist',       glowColor: 'rgba(251,146,60,0.6)' };
  if (streak >= 8)   return { badge: '🌟',     label: 'Star Dog',       glowColor: 'rgba(251,191,36,0.6)' };
  return null; // Days 1–7: no badge
};

const getGrowthStage = (day: number) =>
  GROWTH_STAGES[Math.min(Math.max(day, 0), 7)];

export const PuppyFeeding: React.FC<PuppyFeedingProps> = ({
  onFeed,
  onClose,
  activeTheme,
  puppyAge,
  streak,
}) => {
  const [isFeeding, setIsFeeding] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [hintsEarned, setHintsEarned] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isEating, setIsEating] = useState(false);
  const [floatingBones, setFloatingBones] = useState<{ id: number; x: number }[]>([]);

  // After Day 7 the dog is always 🦮 at full scale; before that it grows
  const isBeyondWeekOne = streak > 7;
  const growthStage = getGrowthStage(puppyAge);
  const badgeStage = getBadgeStage(streak);

  // Dog emoji & scale to display
  const dogEmoji = isBeyondWeekOne ? '🦮' : growthStage.emoji;
  const dogScale = isBeyondWeekOne ? 1.5 : growthStage.scale;
  const stageLabel = badgeStage ? badgeStage.label : growthStage.label;

  // Glow color
  const glowColor = badgeStage
    ? badgeStage.glowColor
    : `rgba(251,191,36,${0.1 + puppyAge * 0.04})`;
  const glowSize = isBeyondWeekOne ? 32 : 8 + puppyAge * 3;

  const handleFeed = async () => {
    // Trigger eating animation immediately on tap
    setIsEating(true);
    const bones = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
    }));
    setFloatingBones(bones);
    setTimeout(() => {
      setIsEating(false);
      setFloatingBones([]);
    }, 1200);

    setIsFeeding(true);
    try {
      const result = await onFeed();
      if (result.success) {
        if (result.hintsEarned && result.hintsEarned > 0) {
          setHintsEarned(result.hintsEarned);
          setRewardMessage(
            (result as { message?: string }).message ||
            `🎉 Amazing! You earned ${result.hintsEarned} hints!`
          );
        } else if (result.pointsEarned && result.pointsEarned > 0) {
          setPointsEarned(result.pointsEarned);
          setRewardMessage(
            (result as { message?: string }).message ||
            `🎉 Amazing! You earned ${result.pointsEarned} points!`
          );
        } else {
          setRewardMessage(
            (result as { message?: string }).message ||
            '🐕 Puppy fed! Keep the streak going!'
          );
        }
        setShowReward(true);
        setTimeout(() => {
          setShowReward(false);
          setTimeout(() => { onClose(); }, 500);
        }, 2500);
      }
    } catch (error) {
      console.error('Error feeding puppy:', error);
    } finally {
      setIsFeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 0.8; transform: translateY(-55px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.7); }
        }
      `}</style>
      <div className={`relative w-full max-w-md ${activeTheme.cardBg} rounded-2xl p-6 border-4 ${activeTheme.accent} shadow-2xl`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-2xl font-bold ${activeTheme.text}`}>
            🍖 Feed Your Puppy
          </h2>
          <button
            onClick={onClose}
            className={`px-3 py-1 ${activeTheme.button} rounded-lg font-bold ${activeTheme.text} hover:opacity-80 transition-opacity`}
          >
            ✕
          </button>
        </div>

        {/* Day 1–7 progress strip (only shown in first week) */}
        {!isBeyondWeekOne && (
          <div className="flex items-end justify-between gap-1 mb-6 px-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const s = getGrowthStage(day);
              const done = puppyAge >= day;
              const current = puppyAge === day;
              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  <span
                    className={`transition-all duration-300 ${current ? 'animate-bounce' : ''}`}
                    style={{
                      fontSize: `${14 + day * 2}px`,
                      opacity: done ? 1 : 0.25,
                      filter: current ? 'drop-shadow(0 0 6px gold)' : 'none',
                    }}
                  >
                    {s.emoji}
                  </span>
                  <div
                    className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                      done ? 'bg-amber-400' : 'bg-gray-300'
                    } ${current ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
                  />
                  <span className={`text-[9px] font-bold ${done ? 'text-amber-500' : 'text-gray-400'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Streak milestone banner (Day 8+) */}
        {isBeyondWeekOne && (
          <div className="flex items-center justify-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-amber-700">{streak}-Day Streak!</span>
            <span className="text-lg">🔥</span>
          </div>
        )}

        {/* Puppy Display */}
        <div className="flex flex-col items-center justify-center mb-5 relative">
          {/* Badge above dog (Day 8+) */}
          {badgeStage && (
            <div
              className="text-3xl mb-1 animate-bounce select-none"
              style={{ filter: 'drop-shadow(0 0 8px gold)' }}
            >
              {badgeStage.badge}
            </div>
          )}

          {/* Glow ring + dog emoji */}
          <div
            className="flex items-center justify-center rounded-full mb-3 transition-all duration-500 relative"
            style={{
              width: 120,
              height: 120,
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
              boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px ${glowColor}`,
            }}
          >
            <span
              className="transition-all duration-500 select-none"
              style={{
                fontSize: `${48 * dogScale}px`,
                lineHeight: 1,
                transform: isEating ? 'scale(1.15) rotate(-8deg)' : 'scale(1) rotate(0deg)',
                transition: 'transform 0.15s ease',
                display: 'inline-block',
              }}
            >
              {isEating ? (dogEmoji === '🐶' ? '🐶' : dogEmoji) : dogEmoji}
            </span>

            {/* Floating bone particles */}
            {floatingBones.map((bone) => (
              <span
                key={bone.id}
                className="absolute select-none pointer-events-none"
                style={{
                  left: `${bone.x}%`,
                  bottom: '60%',
                  fontSize: '18px',
                  animation: 'floatUp 1.1s ease-out forwards',
                }}
              >
                🍖
              </span>
            ))}
          </div>

          {/* Eating label */}
          {isEating && (
            <div className="text-sm font-bold text-amber-500 mb-1 animate-pulse">
              Yum yum! 😋
            </div>
          )}

          {/* Stage label */}
          {!isEating && (
            <div className={`text-base font-bold ${activeTheme.text} mb-1`}>
              {stageLabel}
            </div>
          )}
          <div className={`text-xs ${activeTheme.subText}`}>
            {isBeyondWeekOne
              ? `Streak: ${streak} days 🔥`
              : `Day ${puppyAge} / 7 · Streak: ${streak} days 🔥`}
          </div>
        </div>

        {/* Streak Rewards panel */}
        <div className="mb-5 p-3 rounded-xl bg-black/5 border border-black/10">
          <div className={`text-xs ${activeTheme.subText} space-y-1`}>
            <div className="font-semibold text-[11px] uppercase tracking-wide opacity-60 mb-1">Streak Rewards</div>
            <div className="flex justify-between"><span>🎁 7-day streak</span><span className="font-semibold text-amber-600">+10 Hints</span></div>
            <div className="flex justify-between"><span>🎁 30-day streak</span><span className="font-semibold text-amber-600">+50 Hints</span></div>
            <div className="flex justify-between"><span>🎁 365-day streak</span><span className="font-semibold text-amber-600">+1000 Hints</span></div>
          </div>
        </div>

        {/* Feed Button */}
        <button
          onClick={handleFeed}
          disabled={isFeeding}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 select-none
            ${isFeeding ? 'opacity-50 cursor-wait' : 'hover:scale-105 hover:shadow-2xl cursor-pointer active:scale-95'}
          `}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {isFeeding ? '⏳ Feeding...' : '🍖 Feed Puppy'}
        </button>

        {/* Reward Modal */}
        {showReward && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl z-50">
            <div className={`${activeTheme.cardBg} rounded-2xl p-8 border-4 ${activeTheme.accent} shadow-2xl text-center max-w-sm`}>
              {/* Badge + dog stacked for milestone, plain dog otherwise */}
              <div className="flex flex-col items-center mb-4">
                {badgeStage && (
                  <div className="text-4xl animate-bounce select-none mb-1">
                    {badgeStage.badge}
                  </div>
                )}
                <div className="text-6xl animate-bounce select-none">
                  {hintsEarned > 0 ? '🎁' : pointsEarned > 0 ? '💰' : dogEmoji}
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${activeTheme.text}`}>
                {rewardMessage}
              </h3>
              {(hintsEarned > 0 || pointsEarned > 0) && (
                <p className={`text-lg ${activeTheme.subText}`}>
                  {hintsEarned > 0 && `+${hintsEarned} Hints`}
                  {hintsEarned > 0 && pointsEarned > 0 && ' & '}
                  {pointsEarned > 0 && `+${pointsEarned} Points`}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
