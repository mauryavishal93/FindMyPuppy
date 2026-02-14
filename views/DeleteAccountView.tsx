import React, { useState } from 'react';
import { GameLogo } from '../components/GameLogo';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';

type Step = 'login' | 'confirm' | 'success';

export const DeleteAccountView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<Step>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await db.login(username.trim(), password);
      if (result.success) {
        setStep('confirm');
        setError(null);
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch {
      setError('Unable to verify. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await db.deleteAccount(username.trim(), password);
      if (result.success) {
        setStep('success');
      } else {
        setError(result.message || 'Failed to delete account.');
      }
    } catch {
      setError('Unable to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('login');
    setError(null);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <GameLogo size={100} />
        </div>

        <div className="bg-white/95 rounded-2xl p-6 shadow-2xl border border-slate-200">
          {step === 'login' && (
            <>
              <h1 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
                <i className="fas fa-user-times text-red-500"></i>
                Delete Account
              </h1>
              <p className="text-sm text-slate-600 mb-4">
                Enter your username and password to verify your identity. You will then be asked to confirm permanent deletion.
              </p>
              <form onSubmit={handleVerifyAndProceed} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </Button>
              </form>
            </>
          )}

          {step === 'confirm' && (
            <>
              <h1 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-amber-500"></i>
                Confirm Deletion
              </h1>
              <p className="text-sm text-slate-600 mb-4">
                Are you sure you want to permanently delete your account <strong>{username}</strong>? This action cannot be undone. All your data will be removed from our database.
              </p>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium mb-4">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
                <Button
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <h1 className="text-xl font-black text-slate-800 mb-1 flex items-center gap-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                Account Deleted
              </h1>
              <p className="text-sm text-slate-600 mb-4">
                Your account has been permanently deleted. We're sorry to see you go!
              </p>
              <Button onClick={handleGoHome} className="w-full bg-brand hover:bg-brand-dark text-white">
                Back to Home
              </Button>
            </>
          )}
        </div>

        <a
          href="/"
          className="block text-center text-sm text-slate-400 hover:text-white mt-4 transition-colors"
        >
          ← Back to Find My Puppy
        </a>
      </div>
    </div>
  );
};
