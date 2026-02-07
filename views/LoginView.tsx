
import React, { useState, useEffect, useRef } from 'react';
import { GameLogo } from '../components/GameLogo';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';

// Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

interface LoginViewProps {
  loginName: string;
  setLoginName: (name: string) => void;
  onLogin: (userData?: { username: string; email?: string; hints?: number; points?: number; levelPassedEasy?: number; levelPassedMedium?: number; levelPassedHard?: number }) => void;
  onForgotPassword?: () => void;
  onPlayAsGuest?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ loginName, setLoginName, onLogin, onForgotPassword, onPlayAsGuest }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [googleClientIdConfigured, setGoogleClientIdConfigured] = useState(false);
  const googleSignInButtonRef = useRef<HTMLDivElement>(null);
  const googleSignUpButtonRef = useRef<HTMLDivElement>(null);

  // Auto-detect referral code from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      setIsSignup(true); // Automatically switch to signup if a referral code is present
    }
  }, []);

  // Handle Google OAuth callback
  const handleGoogleSignIn = React.useCallback(async (response: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Handle error notifications from Google OAuth
      if (response && response.error) {
        const errorObj = response.error;
        let errorMessage = "Google sign-in failed. Please try again.";
        
        if (typeof errorObj === 'string') {
          errorMessage = errorObj;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.type) {
          errorMessage = `Google sign-in error: ${errorObj.type}`;
        } else if (typeof errorObj === 'object') {
          errorMessage = errorObj.toString?.() || JSON.stringify(errorObj);
        }
        
        console.error("Google OAuth Error:", errorObj);
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Validate response structure
      if (!response || !response.credential) {
        const errorMsg = "Invalid Google response. Please try again.";
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      const result = await db.signInWithGoogle(response.credential, referralCode.trim() || undefined);
      
      if (result.success && result.user?.username) {
        const user = result.user;
        setSuccessMsg(result.message || "Success!");
        setLoginName(user.username);
        // Pass user data (points, hints, levels) for immediate load
        setTimeout(() => {
          onLogin({
            username: user.username,
            email: user.email,
            hints: user.hints,
            points: user.points,
            levelPassedEasy: user.levelPassedEasy,
            levelPassedMedium: user.levelPassedMedium,
            levelPassedHard: user.levelPassedHard
          });
        }, 500);
      } else {
        // Extract error message properly
        const errorMsg = result.message || "Google sign in failed";
        setError(typeof errorMsg === 'string' ? errorMsg : "Google sign-in failed. Please try again.");
        setIsLoading(false);
      }
    } catch (e: any) {
      // Properly extract error message from error object
      let errorMessage = "An unexpected error occurred";
      if (e) {
        if (typeof e === 'string') {
          errorMessage = e;
        } else if (e.message) {
          errorMessage = e.message;
        } else if (e.error) {
          errorMessage = typeof e.error === 'string' ? e.error : (e.error.message || "Google sign-in error");
        } else if (typeof e === 'object') {
          // Try to extract meaningful error message
          errorMessage = e.toString?.() || JSON.stringify(e);
        }
      }
      console.error("Google Sign In Error:", e);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [referralCode, onLogin, setLoginName]);

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id) return;

      // Google Client ID: env first, then fallback so Sign in with Google works out of the box
      const GOOGLE_CLIENT_ID =
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        '896459680164-aa61o2u96qrscu10ia9g0l40agca0q6i.apps.googleusercontent.com';

      if (!GOOGLE_CLIENT_ID) {
        console.warn('Google OAuth Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
        setGoogleClientIdConfigured(false);
        return;
      }

      setGoogleClientIdConfigured(true);

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });

      // Clear existing buttons
      if (googleSignInButtonRef.current) {
        googleSignInButtonRef.current.innerHTML = '';
      }
      if (googleSignUpButtonRef.current) {
        googleSignUpButtonRef.current.innerHTML = '';
      }

      // Render appropriate button based on mode
      if (!isSignup && googleSignInButtonRef.current) {
        window.google.accounts.id.renderButton(googleSignInButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%',
        });
      } else if (isSignup && googleSignUpButtonRef.current) {
        window.google.accounts.id.renderButton(googleSignUpButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          width: '100%',
        });
      }
    };

    // Wait for Google script to load
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }
  }, [isSignup, handleGoogleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!loginName.trim()) {
      setError("Please enter a username");
      return;
    }
    if (isSignup && !email.trim()) {
      setError("Please enter an email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (isSignup) {
        response = await db.signup(loginName, email, password, referralCode.trim() || undefined);
      } else {
        response = await db.login(loginName, password);
      }

      if (response.success) {
        setSuccessMsg(response.message || "Success!");
        const user = response.user;
        setTimeout(() => {
          if (user) {
            onLogin({
              username: user.username,
              email: user.email,
              hints: user.hints,
              points: user.points,
              levelPassedEasy: user.levelPassedEasy,
              levelPassedMedium: user.levelPassedMedium,
              levelPassedHard: user.levelPassedHard
            });
          } else {
            onLogin();
          }
        }, 1000);
      } else {
        setError(response.message || "Authentication failed");
        setIsLoading(false);
      }
    } catch (e) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-main-content flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-white to-blue-100 relative overflow-hidden transition-colors duration-500">
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
        {/* Play as Guest / Back - when coming from HOME */}
        {onPlayAsGuest && (
          <button
            type="button"
            onClick={onPlayAsGuest}
            className="absolute top-4 left-4 flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors z-20"
          >
            <i className="fas fa-arrow-left"></i>
            Play as Guest
          </button>
        )}
        <div className="mx-auto mb-4 flex justify-center relative">
          <div className="absolute inset-0 bg-brand-light/30 blur-2xl rounded-full scale-150"></div>
          <GameLogo className="w-24 h-24 relative z-10 drop-shadow-lg" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">FindMyPuppy</h1>
        <p className="text-slate-500 mb-6 font-medium text-sm">Join the ultimate hide & seek adventure!</p>

        {/* Auth Tabs */}
        <div className="flex p-1 bg-slate-100/80 rounded-xl mb-6 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isSignup ? 'left-[calc(50%+2px)]' : 'left-1'}`}
          ></div>
          <button 
            type="button"
            onClick={() => { setIsSignup(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${!isSignup ? 'text-brand-dark' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => { setIsSignup(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${isSignup ? 'text-brand-dark' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-3">
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Username"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-base font-bold text-slate-700 bg-white/50"
                maxLength={12}
                disabled={isLoading}
              />
            </div>
            
            {isSignup && (
              <div className="relative animate-fade-in">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-base font-bold text-slate-700 bg-white/50"
                  disabled={isLoading}
                />
              </div>
            )}

              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-base font-bold text-slate-700 bg-white/50"
                  disabled={isLoading}
                />
              </div>

              {isSignup && (
                <div className="relative animate-fade-in">
                  <i className="fas fa-ticket-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Referral Code (Optional)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all text-base font-bold text-slate-700 bg-white/50"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

          {error && (
            <div className="text-red-500 text-xs font-bold bg-red-50 py-2 px-3 rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {successMsg && (
            <div className="text-green-600 text-xs font-bold bg-green-50 py-2 px-3 rounded-lg border border-green-100 flex items-center gap-2">
              <i className="fas fa-check-circle"></i> {successMsg}
            </div>
          )}

          <Button 
            type="submit"
            disabled={!loginName.trim() || !password.trim() || isLoading} 
            className="w-full bg-gradient-to-r from-brand to-brand-dark text-white shadow-brand/30 hover:shadow-brand/50 hover:scale-[1.02] mt-2 h-12 flex items-center justify-center"
          >
            {isLoading ? (
              <i className="fas fa-circle-notch animate-spin"></i>
            ) : (
              <>
                {isSignup ? 'Create Account' : 'Start Playing'}
                <i className="fas fa-arrow-right ml-2 text-sm opacity-80"></i>
              </>
            )}
          </Button>
        </form>

        {/* Forgot Password Link - Only show on Login tab */}
        {!isSignup && onForgotPassword && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-brand-dark hover:text-brand font-bold transition-colors"
            >
              <i className="fas fa-key mr-1"></i>
              Forgot Password?
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-300"></div>
          <span className="px-4 text-xs text-slate-500 font-medium">OR</span>
          <div className="flex-1 border-t border-slate-300"></div>
        </div>

        {/* Google Sign In/Up Buttons - Both divs always in DOM, visibility controlled by CSS */}
        <div className="w-full">
          {googleClientIdConfigured ? (
            <>
              <div 
                ref={googleSignInButtonRef} 
                className={`w-full flex justify-center ${isSignup ? 'hidden' : ''}`}
              ></div>
              <div 
                ref={googleSignUpButtonRef} 
                className={`w-full flex justify-center ${!isSignup ? 'hidden' : ''}`}
              ></div>
            </>
          ) : (
            <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
              <i className="fab fa-google mr-2"></i>
              Google Sign In/Up not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 w-full text-center pointer-events-none z-10">
          <span className="text-[10px] text-slate-400/80 font-medium">© 2025-2026 MVTechnology</span>
      </div>
    </div>
  );
};
