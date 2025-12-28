import React from 'react';
import { GameLogo } from '../components/GameLogo';
import { Button } from '../components/ui/Button';

interface LoginViewProps {
  loginName: string;
  setLoginName: (name: string) => void;
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ loginName, setLoginName, onLogin }) => (
  <div className="flex flex-col h-full items-center justify-center p-8 bg-gradient-to-br from-pink-100 via-white to-blue-100 relative overflow-hidden">
    {/* Creative Background Elements */}
    <div className="absolute inset-0 pointer-events-none">
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-pink-200/40 blur-[80px] rounded-full animate-pulse"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-200/40 blur-[80px] rounded-full animate-pulse delay-700"></div>
       
       <i className="fas fa-paw absolute top-20 left-10 text-6xl text-brand/10 -rotate-12 animate-bounce-short"></i>
       <i className="fas fa-paw absolute bottom-32 right-12 text-7xl text-blue-400/10 rotate-12"></i>
       <i className="fas fa-bone absolute top-1/2 right-8 text-5xl text-yellow-400/20 rotate-45"></i>
       <i className="fas fa-cloud absolute top-16 right-1/4 text-8xl text-white/60"></i>
    </div>

    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm z-10 text-center border-4 border-white/50 relative overflow-y-auto overflow-x-hidden max-h-[90vh] hide-scrollbar">
      <div className="mx-auto mb-6 flex justify-center relative">
        <div className="absolute inset-0 bg-brand-light/30 blur-2xl rounded-full scale-150"></div>
        <GameLogo className="w-32 h-32 relative z-10 drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">FindMyPuppy</h1>
      <p className="text-slate-500 mb-8 font-medium">Join the ultimate hide & seek adventure!</p>
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="What's your name?"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-lg text-center font-bold text-slate-700 bg-white/50"
          maxLength={12}
        />
        <Button onClick={onLogin} disabled={!loginName.trim()} className="w-full bg-gradient-to-r from-brand to-brand-dark text-white shadow-brand/30 hover:shadow-brand/50 hover:scale-[1.02]">
          Start<i className="fas fa-play ml-2 text-sm"></i>
        </Button>
      </div>
    </div>
    
    <div className="absolute bottom-6 w-full text-center pointer-events-none z-10">
        <span className="text-[10px] text-slate-400/80 font-medium">© 2025-2026 MVTechnology</span>
    </div>
  </div>
);

