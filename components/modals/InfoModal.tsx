import React from 'react';
import { ModalBase, ModalHeader, ModalContent } from './ModalBase';

interface InfoModalProps {
  onClose: () => void;
  onOpenLeaderboard?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose, onOpenLeaderboard }) => {
  return (
    <>
      <ModalBase isOpen={true} onClose={onClose} maxWidth="md">
        <ModalHeader className="bg-gradient-to-br from-brand-light via-pink-50 to-yellow-50">
          <div className="flex items-center gap-3 pr-0">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-book-open text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Explorer's Guide</h3>
              <p className="text-xs text-slate-600">Quick game overview</p>
            </div>
          </div>
        </ModalHeader>

        <ModalContent className="hide-scrollbar pt-3">
          <div className="space-y-4">
            {/* What it is */}
            <div className="bg-gradient-to-br from-brand-light/80 to-yellow-50 rounded-xl p-3 border border-brand/20">
              <p className="text-slate-700 text-sm leading-snug">
                Find hidden puppies in each scene. <strong>Pan</strong> to explore, <strong>zoom</strong> to look closer, <strong>tap</strong> when you spot one. You have <strong>3 lives</strong>; wrong taps cost a life. Use <strong>2 free hints</strong> per level (💡 button).
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              <a
                href="/explorer-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition active:scale-95"
              >
                <i className="fas fa-compass"></i>
                <span>Full Guide</span>
              </a>
              {onOpenLeaderboard && (
                <button
                  onClick={() => { onOpenLeaderboard(); onClose(); }}
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition active:scale-95"
                >
                  <i className="fas fa-trophy"></i>
                  <span>Leaderboard</span>
                </button>
              )}
              <a
                href="https://www.youtube.com/watch?v=_aBm0CZDCPo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition active:scale-95"
              >
                <i className="fab fa-youtube"></i>
                <span>Video</span>
              </a>
            </div>

            {/* Guest vs Login */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs text-slate-600">
                <strong className="text-slate-800">Guest:</strong> Play instantly. <strong className="text-slate-800">Login:</strong> Save progress, leaderboard, daily rewards, buy hints.
              </p>
            </div>

            {/* Difficulties - compact */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-700 px-3 py-1.5">
                <span className="text-white text-xs font-bold">Difficulty</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-2.5 flex justify-between items-center bg-emerald-50/80">
                  <span className="font-semibold text-emerald-800">Easy</span>
                  <span className="text-slate-600">No timer · 15–25 pups · +5 pts</span>
                </div>
                <div className="p-2.5 flex justify-between items-center bg-blue-50/80">
                  <span className="font-semibold text-blue-800">Medium</span>
                  <span className="text-slate-600">2m 30s · 25–35 pups · +10 pts</span>
                </div>
                <div className="p-2.5 flex justify-between items-center bg-rose-50/80">
                  <span className="font-semibold text-rose-800">Hard</span>
                  <span className="text-slate-600">3 min · 40–50 pups · +15 pts</span>
                </div>
              </div>
            </div>

            {/* Hints & extras - one line each */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <p><strong className="text-slate-700">Hints:</strong> 2 free per level; buy more with points or hint packs (login).</p>
              <p><strong className="text-slate-700">Daily:</strong> Check in for points; 7-day streak = bonus hints.</p>
              <p><strong className="text-slate-700">Puppy Jump:</strong> Daily mini-game for extra hints.</p>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-200 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs font-semibold hover:underline">Privacy</a>
                <span className="text-slate-300">·</span>
                <a href="/delete-account" className="text-red-600 text-xs font-semibold hover:underline">Delete account</a>
              </div>
              <p className="text-[10px] text-slate-400">© 2025–2026 MVTechnology</p>
            </div>
          </div>
        </ModalContent>
      </ModalBase>
    </>
  );
};
