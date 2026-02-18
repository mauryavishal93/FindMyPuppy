import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../types';
import { db } from '../../services/db';
import { ModalBase, ModalHeader, ModalContent } from './ModalBase';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemeConfig;
  token: string;
  onSuccess: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  token,
  onSuccess
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset token");
    }
  }, [token]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await db.resetPassword(token, newPassword);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} maxWidth="sm" className="bg-white">
      <ModalHeader className="bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-100 border-blue-200">
        <div className="text-center pr-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <i className="fas fa-lock text-white text-xl"></i>
          </div>
          <h2 className="text-xl font-black text-slate-800">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">Choose a new secure password</p>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-4">
          {!success ? (
            <>
              <p className="text-sm text-center text-slate-600 leading-relaxed">
                Enter your new password below. Use at least 6 characters.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all text-base font-semibold text-slate-800 bg-slate-50 placeholder:text-slate-400"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all text-base font-semibold text-slate-800 bg-slate-50 placeholder:text-slate-400"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {error && (
                  <div className="text-red-600 text-xs font-semibold bg-red-50 py-3 px-4 rounded-xl border border-red-200 flex items-center gap-2">
                    <i className="fas fa-exclamation-circle flex-shrink-0"></i>
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!newPassword.trim() || !confirmPassword.trim() || isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 hover:from-blue-600 hover:to-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-indigo-600"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin"></i>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-200">
                <i className="fas fa-check text-2xl text-green-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Password Reset Successful!</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your password has been reset successfully. You can now login with your new password.
                </p>
              </div>
              <button 
                onClick={onSuccess}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/50 hover:from-blue-600 hover:to-indigo-700 transition-all active:scale-95"
              >
                <i className="fas fa-sign-in-alt"></i>
                Go to Login
              </button>
            </div>
          )}
      </ModalContent>
    </ModalBase>
  );
};

