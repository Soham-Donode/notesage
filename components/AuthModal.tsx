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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md" onClick={handleModalClick}>
      {/* Compact Modal */}
      <div className="w-full max-w-[300px] mx-2 bg-card rounded-3xl shadow-2xl border-1 border-border px-2 py-5 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl text-foreground text-center mb-6">
          You are not logged in:
        </h2>
        
        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleLoginClick}
            className="group relative px-8 py-3 bg-black text-white rounded-2xl font-semibold
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                       overflow-hidden"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            onClick={handleSignupClick}
            className="group relative px-8 py-3 bg-white text-black rounded-2xl font-semibold
                       border-1 border-black
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                       overflow-hidden"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;