"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

interface AuthModalProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onClose?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onSignup, onClose }) => {
  const { isLoaded, isSignedIn } = useUser();

  const handleLoginClick = () => {
    onLogin?.();
  };

  const handleSignupClick = () => {
    onSignup?.();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md" onClick={handleModalClick}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Verifying login status...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleModalClick}>
      {/* Compact Modal */}
      <div className="w-full max-w-[320px] mx-2 bg-white rounded-3xl shadow-2xl border border-gray-200 px-6 py-8 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to NoteSage
          </h2>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLoginClick}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold
                       shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-blue-600 hover:to-purple-600
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       overflow-hidden flex-1"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            onClick={handleSignupClick}
            className="group relative px-8 py-3 bg-white text-gray-700 rounded-2xl font-semibold
                       border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                       overflow-hidden flex-1"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;