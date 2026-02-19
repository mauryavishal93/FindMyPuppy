import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { PuppyDesignsModal } from '../components/modals/PuppyDesignsModal';

interface ExplorerGuideViewProps {
  activeTheme: ThemeConfig;
  onClose: () => void;
}

export const ExplorerGuideView: React.FC<ExplorerGuideViewProps> = ({ activeTheme: _theme, onClose }) => {
  const [showPuppyDesigns, setShowPuppyDesigns] = useState(false);

  return (
    <div className="h-full min-h-0 flex flex-col bg-slate-50">
      {showPuppyDesigns && (
        <PuppyDesignsModal onClose={() => setShowPuppyDesigns(false)} />
      )}

      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-book-open text-white text-lg" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-800 truncate">Explorer's Guide</h1>
              <p className="text-xs text-slate-500">How to play & tips</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 pb-12 space-y-8">
          {/* Hero + Video */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 text-base mb-2">Welcome to Find My Puppy</h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">
              Find hidden puppies in magical scenes. Each level is unique — pan, zoom, and tap to spot them. You have <strong>3 lives</strong> and <strong>2 free hints</strong> per level. Progress through 100 levels, choose beautiful themes, and compete on the global leaderboard.
            </p>
            <a
              href="https://www.youtube.com/watch?v=_aBm0CZDCPo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              <i className="fab fa-youtube" />
              Watch video trailer
            </a>
          </section>

          {/* How to Play */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-4 py-2.5">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <i className="fas fa-play" />
                How to play
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-search text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">1. Explore the scene</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Look everywhere — puppies are hidden throughout. <strong>Pan left, right, up, and down</strong> by dragging your finger or mouse. The image is much larger than your screen.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-compress-alt text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">2. Zoom in & out</h3>
                  <p className="text-slate-600 text-xs leading-relaxed"><strong>Pinch to zoom</strong> (mobile) or <strong>Ctrl + Scroll</strong> (desktop). Puppies can be tiny in Hard mode. Zoom out to see the bigger picture.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-hand-pointer text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">3. Tap to find</h3>
                  <p className="text-slate-600 text-xs leading-relaxed"><strong>Tap or click</strong> on any puppy you spot. They’re camouflaged — look carefully. Found puppies bounce and celebrate. Wrong taps cost a life.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-heart text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">4. Watch your lives</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">You have <strong>3 lives</strong>. See remaining lives (🐕 icons) in the top-left. Three wrong taps = game over. Wrong taps show a red ❌ briefly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-lightbulb text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">5. Use hints</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Tap the <strong>💡 hint button</strong> (bottom-right). Each use reveals 1–2 puppies and scrolls to show where they are. You get <strong>2 free hints per level</strong>.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand/15 text-brand flex items-center justify-center">
                  <i className="fas fa-trophy text-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">6. Complete the level</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">Find <strong>all puppies</strong> to clear the level and earn points. Progress through 100 levels; each gets more challenging.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Guest vs Login */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <i className="fas fa-user" />
              Play your way
            </h2>
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <strong className="text-slate-800">Guest mode</strong> — Play instantly with no signup. Perfect for quick fun; progress is saved on this device only.
              </div>
              <div>
                <strong className="text-slate-800">Login</strong> — Save progress to the cloud, appear on the leaderboard, earn daily check-in rewards, buy hint packs, and unlock themes. Sign up or use Google to get the full experience.
              </div>
            </div>
          </section>

          {/* Difficulty */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-4 py-2.5">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <i className="fas fa-layer-group" />
                Difficulty modes
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-4 bg-emerald-50/80">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <i className="fas fa-seedling text-sm" />
                    </div>
                    <span className="font-semibold text-emerald-800 text-sm">Easy</span>
                  </div>
                  <span className="text-slate-600 text-xs">+5 pts / level</span>
                </div>
                <p className="text-xs text-slate-600 pl-12">No timer. 15–25 puppies, easier to spot. Less camouflage. Perfect for beginners.</p>
              </div>
              <div className="p-4 bg-blue-50/80">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <i className="fas fa-fire text-sm" />
                    </div>
                    <span className="font-semibold text-blue-800 text-sm">Medium</span>
                  </div>
                  <span className="text-slate-600 text-xs">+10 pts / level</span>
                </div>
                <p className="text-xs text-slate-600 pl-12">150 seconds (2m 30s). 25–35 puppies, better hidden. For the adventurous.</p>
              </div>
              <div className="p-4 bg-rose-50/80">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-white">
                      <i className="fas fa-skull text-sm" />
                    </div>
                    <span className="font-semibold text-rose-800 text-sm">Hard</span>
                  </div>
                  <span className="text-slate-600 text-xs">+15 pts / level</span>
                </div>
                <p className="text-xs text-slate-600 pl-12">180 seconds (3 min). 40–50 puppies — tiny and nearly invisible. Master challenge.</p>
              </div>
            </div>
          </section>

          {/* Hints (detailed) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <i className="fas fa-lightbulb text-amber-500" />
              Hint system
            </h2>
            <ul className="space-y-2 text-xs text-slate-700">
              <li><strong>Free hints:</strong> 2 free hints every level; they reset when you start a new game. Work for both guest and logged-in players.</li>
              <li><strong>Buy with points:</strong> Spend 10 points to get 2 premium hints (from the hint shop in-game).</li>
              <li><strong>Hint packs:</strong> Purchase larger hint packs with secure payment. Login required so hints are saved to your account.</li>
            </ul>
          </section>

          {/* Controls */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <i className="fas fa-gamepad text-slate-600" />
              Controls & settings
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li><strong>Tap/Click</strong> — Find puppies by tapping on them.</li>
              <li><strong>Pinch / Ctrl+Scroll</strong> — Zoom in and out.</li>
              <li><strong>Drag</strong> — Pan around the large image; explore every corner.</li>
              <li><strong>Hint button (💡)</strong> — Reveals 1–2 puppies per use.</li>
              <li><strong>Lives</strong> — Shown top-left; 3 wrong taps = game over.</li>
              <li><strong>Settings</strong> — Toggle music, sound effects, and haptics (vibration) from the menu.</li>
              <li><strong>Refer friends</strong> — Share your referral code; you and your friend each get 25 bonus hints.</li>
            </ul>
          </section>

          {/* Features (detailed) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-800 px-4 py-2.5">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <i className="fas fa-star" />
                Features
              </h2>
            </div>
            <div className="p-4 space-y-4 text-xs text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Daily check-in</h3>
                <p className="mb-1">Feed your virtual puppy every day. Watch it grow from Day 1 to Day 7. Earn 5 points per day; 7-day streak = 10 bonus hints; 30-day streak = 50 bonus points; 1-year streak = 1000 hints.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Puppy Jump</h3>
                <p className="mb-1">Daily endless runner. Tap or press Space to jump; Down arrow or swipe down to duck. Score 1000+ = 5 hints; 500+ = 2 hints. Your best run is saved on the leaderboard.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Themes</h3>
                <p className="mb-1">Change the look of the game: Sunny Day, Starry Night, Candy Land, Forest, Cosmic, Safari, and more. Pick a theme in Settings.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Hidden puppy designs</h3>
                <p className="mb-2">See all the puppy designs hidden in the game. Each level uses these designs camouflaged in the scene.</p>
                <button
                  type="button"
                  onClick={() => setShowPuppyDesigns(true)}
                  className="text-brand font-semibold hover:underline"
                >
                  View all puppy designs →
                </button>
              </div>
            </div>
          </section>

          {/* Progression & rewards */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <i className="fas fa-chart-line text-indigo-500" />
              Progression & rewards
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li><strong>100 levels</strong> — Unique scenes; progress through Easy, then unlock Medium and Hard.</li>
              <li><strong>Weekly challenges</strong> — Complete goals (e.g. clear 5 levels) to earn extra hints.</li>
              <li><strong>Achievements</strong> — Unlock badges for milestones like First Win or Streak Master.</li>
              <li><strong>Points</strong> — Earn points by completing levels; use them to buy hints in the shop.</li>
              <li><strong>Comeback bonus</strong> — Return after a break to claim 5 free hints.</li>
            </ul>
          </section>

          {/* Pro tips */}
          <section className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <h2 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
              <i className="fas fa-star text-amber-600" />
              Pro tips
            </h2>
            <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
              <li>Puppies often hide near similar objects — check nearby after finding one.</li>
              <li>Look for outlines and shadows; they blend but stay visible.</li>
              <li>In timed modes, stay calm; rushing leads to wrong taps.</li>
              <li>Start on Easy, then move to Medium and Hard.</li>
            </ul>
          </section>

          {/* Android: Google Play + APK */}
          <section className="bg-green-600 text-white rounded-xl p-4">
            <div className="mb-3">
              <p className="font-bold text-sm flex items-center gap-2">
                <i className="fab fa-android" />
                Play on Android
              </p>
              <p className="text-white/90 text-xs">Get the app for haptics, offline play, and updates.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.findmypuppy.app2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-3 py-2 rounded-lg font-bold text-xs hover:bg-green-50 transition-colors"
              >
                <i className="fab fa-google-play" />
                Google Play Store
              </a>
              <a
                href="https://raw.githubusercontent.com/mauryavishal93/FindMyPuppy/main/apk/release/findmypuppy.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/40 px-3 py-2 rounded-lg font-bold text-xs transition-colors"
              >
                Download APK
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-slate-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-3 text-xs">
              <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline">
                Privacy
              </a>
              <span className="text-slate-300">·</span>
              <a href="/delete-account" className="text-red-600 font-medium hover:underline">
                Delete account
              </a>
            </div>
            <p className="text-slate-400 text-[10px]">© 2025–2026 MVTechnology</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
