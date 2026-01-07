import React from 'react';

interface InfoModalProps {
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => (
  <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-4 px-4 animate-fade-in overflow-hidden">
    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl relative max-h-[calc(90vh-2rem)] flex flex-col border-4 border-white overflow-hidden">
      {/* Header - Fixed with Gradient */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-brand-light via-pink-50 to-yellow-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center shadow-lg animate-pulse-fast">
              <i className="fas fa-book-open text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">🐾 Explorer's Guide 🐾</h3>
              <p className="text-xs text-slate-600 font-medium">Your Complete Adventure Manual</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 text-slate-400 hover:bg-white hover:text-slate-600 flex items-center justify-center transition-colors shadow-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-4 hide-scrollbar">
        <div className="space-y-6">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-brand-light to-yellow-100 rounded-2xl p-5 border-2 border-brand/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🐶</span>
                <h4 className="text-xl font-black text-slate-800">Welcome to FindMyPuppy!</h4>
              </div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                Embark on an epic adventure through <strong className="text-brand-dark">AI-generated magical worlds</strong> and rescue adorable puppies hiding in plain sight! Each scene is uniquely crafted, making every level a fresh challenge.
              </p>
            </div>
          </div>

          {/* How to Play - Step by Step */}
          <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <i className="fas fa-play text-white"></i>
              </div>
              <h4 className="text-lg font-black text-slate-800">How to Play</h4>
            </div>
            
            {/* YouTube Video Link - Below Title */}
            <div className="mb-4 flex justify-center">
              <a
                href="https://www.youtube.com/watch?v=_aBm0CZDCPo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <i className="fab fa-youtube text-[10px]"></i>
                <span>Watch Video Trailer</span>
              </a>
            </div>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  1
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-search text-blue-500"></i> Explore the Scene
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>Look everywhere!</strong> Puppies are hidden throughout the image. <strong>Pan left, right, up, and down</strong> by dragging your finger or mouse. The image is much larger than your screen!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  2
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-hand-pointer text-blue-500"></i> Zoom In & Out
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>Pinch to zoom</strong> (mobile) or <strong>Ctrl + Scroll</strong> (desktop) to get a closer look. Puppies can be tiny, especially in Hard mode! Zoom out to see the bigger picture.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  3
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-mouse-pointer text-blue-500"></i> Tap to Find
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>Tap or click</strong> on any puppy you spot! They're camouflaged to blend with the scene, so look carefully. Found puppies will bounce and celebrate! 🎉
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  4
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-heart text-red-500"></i> Watch Your Lifes!
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong>You have 3 lifes!</strong> If you tap 3 places where no puppy is hiding, the game ends. Look at the top-left corner to see your remaining lifes (🐕 icons).
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  5
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-lightbulb text-yellow-500"></i> Use Hints Wisely
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Stuck? Tap the <strong>💡 hint button</strong> (bottom-right). It will highlight 1-2 puppies and scroll to show you where they are. You get 2 free hints per level!
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                  ✓
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <i className="fas fa-trophy text-yellow-500"></i> Complete the Level
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Find <strong>all puppies</strong> to clear the level and earn points! Progress through 100 levels, each more challenging than the last!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Modes - Enhanced */}
          <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex justify-between items-center">
              <h4 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-layer-group"></i> Difficulty Modes
              </h4>
              <span className="text-xs text-slate-300 font-bold">Choose Your Challenge</span>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Easy */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-seedling text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-emerald-700 text-base">Easy Mode</h5>
                    <p className="text-xs text-emerald-600">Perfect for beginners!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock text-emerald-500 w-4"></i>
                    <span><strong>No Timer</strong> - Take your time!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-paw text-emerald-500 w-4"></i>
                    <span><strong>15-25 Puppies</strong> - Easier to spot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-yellow-500 w-4"></i>
                    <span><strong>+5 Points</strong> per level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-eye text-emerald-500 w-4"></i>
                    <span><strong>More Visible</strong> - Less camouflage</span>
                  </div>
                </div>
              </div>

              {/* Medium */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-fire text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-blue-700 text-base">Medium Mode</h5>
                    <p className="text-xs text-blue-600">For the adventurous!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock text-blue-500 w-4"></i>
                    <span><strong>150 Seconds</strong> (2m 30s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-paw text-blue-500 w-4"></i>
                    <span><strong>25-35 Puppies</strong> - More to find</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-yellow-500 w-4"></i>
                    <span><strong>+10 Points</strong> per level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-mask text-blue-500 w-4"></i>
                    <span><strong>Better Hidden</strong> - More camouflage</span>
                  </div>
                </div>
              </div>

              {/* Hard */}
              <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center shadow-md">
                    <i className="fas fa-skull text-white"></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-rose-700 text-base">Hard Mode</h5>
                    <p className="text-xs text-rose-600">Master level challenge!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock text-rose-500 w-4"></i>
                    <span><strong>180 Seconds</strong> (3 minutes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-paw text-rose-500 w-4"></i>
                    <span><strong>40-50 Puppies</strong> - TINY!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-yellow-500 w-4"></i>
                    <span><strong>+15 Points</strong> per level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-ghost text-rose-500 w-4"></i>
                    <span><strong>Nearly Invisible</strong> - Expert level!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hint System - Enhanced */}
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-yellow-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/20 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <h4 className="text-lg font-black text-slate-800">💡 Hint System</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-white/80 p-3 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-gift text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-black text-slate-800 mb-1">Free Daily Hints</span>
                      <span className="text-xs text-slate-600 leading-relaxed">
                        You get <strong className="text-green-600">2 FREE hints</strong> every single level! They automatically reset when you start a new game. Use them wisely!
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-coins text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-black text-slate-800 mb-1">Buy with Points</span>
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Out of free hints? Exchange your hard-earned points! <br/>
                        <strong className="text-indigo-600 bg-white/50 px-2 py-1 rounded text-xs">10 Points = 2 Premium Hints</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-shopping-cart text-white text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-black text-slate-800 mb-1">Purchase Hint Packs</span>
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Support the game and get massive hint packs! Available through secure payment options.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Tips */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-100">
              <h5 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
                <i className="fas fa-gamepad text-purple-500"></i> Controls & Tips
              </h5>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <i className="fas fa-hand-pointer text-purple-500 mt-1"></i>
                  <span><strong>Tap/Click:</strong> Find puppies by tapping on them</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-compress-alt text-purple-500 mt-1"></i>
                  <span><strong>Pinch/Zoom:</strong> Pinch on mobile or Ctrl+Scroll on desktop to zoom in/out</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-arrows-alt text-purple-500 mt-1"></i>
                  <span><strong>Pan:</strong> Drag to move around the large image - explore every corner!</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span><strong>Hints:</strong> Tap the lightbulb button to reveal 1-2 puppies</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fas fa-heart text-red-500 mt-1"></i>
                  <span><strong>Lifes:</strong> Watch the top-left - you have 3 lifes before game over!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progression & Features */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border-2 border-indigo-100">
            <h5 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
              <i className="fas fa-chart-line text-indigo-500"></i> Progression & Features
            </h5>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <i className="fas fa-layer-group text-indigo-500 mt-1"></i>
                <span><strong>100 Levels:</strong> Progress through 100 unique levels, each with AI-generated scenes!</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-palette text-indigo-500 mt-1"></i>
                <span><strong>Multiple Themes:</strong> Choose from various beautiful themes to customize your experience</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-star text-yellow-500 mt-1"></i>
                <span><strong>Points System:</strong> Earn points by completing levels - use them to buy hints!</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-users text-indigo-500 mt-1"></i>
                <span><strong>Refer Friends:</strong> Share your referral code and both of you get 25 bonus hints!</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fas fa-trophy text-yellow-500 mt-1"></i>
                <span><strong>Track Progress:</strong> See your cleared levels and unlock new difficulties as you progress</span>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 text-white shadow-lg border-2 border-amber-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-star text-xl"></i>
              </div>
              <div>
                <h5 className="font-black text-white mb-1 text-sm">🌟 Pro Tip!</h5>
                <p className="text-xs text-white/90 leading-relaxed">
                  <strong>Look carefully!</strong> Puppies blend into the background using camouflage. In Hard mode, they're nearly invisible! Use hints strategically, zoom in on suspicious areas, and explore the entire image - puppies can be hiding anywhere, even in the corners!
                </p>
              </div>
            </div>
          </div>
        
          {/* Copyright Footer */}
          <div className="pt-2 text-center">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">
              © 2025-2026 MVTechnology
            </p>
            <p className="text-[9px] text-slate-400 mt-1 opacity-50">
              Made with ❤️ for puppy lovers everywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
