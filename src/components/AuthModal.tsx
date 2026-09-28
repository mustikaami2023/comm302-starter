import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      onSuccess(email);
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2a2e39] p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#2962FF] to-[#9924FF] text-white mb-3 shadow-md">
            <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 36 28">
              <path d="M7 6h5v16H7V6zm8-6h5v28h-5V0zm8 11h5v17h-5V11z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Markets Everywhere
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track 100,000+ instruments, live charts, and community trade setups.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              Welcome to TradingView!
            </div>
            <div className="text-xs text-gray-500">Your personalized session is active.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131722] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#2962FF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#2962FF] to-[#9924FF] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              Continue Free
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <span className="relative bg-white dark:bg-[#1e222d] px-2 text-[11px] text-gray-400 font-semibold">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSuccess('google.user@tradingview.com');
                onClose();
              }}
              className="w-full py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722] transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue with Google</span>
            </button>

            <p className="text-[10px] text-gray-400 text-center leading-tight">
              By proceeding, you agree to TradingView's Terms of Service and Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
