import React from 'react';
import { APP_VERSION } from '../../constants/appVersion';
import { ModalBase, ModalHeader, ModalContent, ModalFooter } from './ModalBase';

interface SettingsModalProps {
  onClose: () => void;
  backgroundMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  hapticsEnabled: boolean;
  webViewEnabled: boolean;
  onToggleBackgroundMusic: () => void;
  onToggleSoundEffects: () => void;
  onToggleHaptics: () => void;
  onToggleWebView: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  backgroundMusicEnabled,
  soundEffectsEnabled,
  hapticsEnabled,
  webViewEnabled,
  onToggleBackgroundMusic,
  onToggleSoundEffects,
  onToggleHaptics,
  onToggleWebView
}) => {
  return (
    <ModalBase isOpen={true} onClose={onClose} maxWidth="sm">
      <ModalHeader className="bg-gradient-to-r from-slate-100 to-slate-200">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 pr-0">
          <i className="fas fa-cog text-slate-600"></i> Settings
        </h3>
      </ModalHeader>

      <ModalContent className="space-y-6">
          
          {/* Audio Settings */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audio & Feedback</h4>
            
            {/* Music Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${backgroundMusicEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                  <i className="fas fa-music"></i>
                </div>
                <div>
                  <span className="block font-bold text-slate-800">Music</span>
                  <span className="text-xs text-slate-500">Background melody</span>
                </div>
              </div>
              <button 
                onClick={onToggleBackgroundMusic}
                className={`w-12 h-7 rounded-full transition-colors relative ${backgroundMusicEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${backgroundMusicEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>

            {/* SFX Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${soundEffectsEnabled ? 'bg-pink-100 text-pink-600' : 'bg-slate-200 text-slate-400'}`}>
                  <i className="fas fa-volume-up"></i>
                </div>
                <div>
                  <span className="block font-bold text-slate-800">Sound FX</span>
                  <span className="text-xs text-slate-500">Taps and interactions</span>
                </div>
              </div>
              <button 
                onClick={onToggleSoundEffects}
                className={`w-12 h-7 rounded-full transition-colors relative ${soundEffectsEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${soundEffectsEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Haptics Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hapticsEnabled ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-400'}`}>
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div>
                  <span className="block font-bold text-slate-800">Vibration</span>
                  <span className="text-xs text-slate-500">Haptic feedback</span>
                </div>
              </div>
              <button 
                onClick={onToggleHaptics}
                className={`w-12 h-7 rounded-full transition-colors relative ${hapticsEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${hapticsEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display</h4>
            
            {/* Web View Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${webViewEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                  <i className="fas fa-desktop"></i>
                </div>
                <div>
                  <span className="block font-bold text-slate-800">Web View</span>
                  <span className="text-xs text-slate-500">Desktop website mode</span>
                </div>
              </div>
              <button 
                onClick={onToggleWebView}
                className={`w-12 h-7 rounded-full transition-colors relative ${webViewEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${webViewEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h4>
             
             <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group">
               <span className="font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Privacy Policy</span>
               <i className="fas fa-chevron-right text-slate-300 group-hover:text-indigo-400"></i>
             </a>
             
             <div className="flex items-center justify-between p-3">
               <span className="font-medium text-slate-600">Version</span>
               <span className="text-sm font-bold text-slate-400">{APP_VERSION}</span>
             </div>
          </div>

      </ModalContent>
      
      <ModalFooter className="bg-slate-50 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Find My Puppy</p>
      </ModalFooter>
    </ModalBase>
  );
};
