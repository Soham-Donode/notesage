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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleModalClick}>
      {/* Compact Modal */}
      <div className="w-full max-w-[320px] mx-2 bg-card rounded-3xl shadow-2xl border border-border px-4 sm:px-6 py-6 sm:py-8 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-primary-foreground text-lg sm:text-xl">🔒</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2">
            Welcome to NoteSage
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Please sign in to continue</p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleLoginClick}
            className="group relative px-6 sm:px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl font-semibold
                       shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-primary/90 hover:to-primary/70
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       overflow-hidden flex-1"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            onClick={handleSignupClick}
            className="group relative px-6 sm:px-8 py-3 bg-card text-card-foreground rounded-2xl font-semibold
                       border-2 border-border hover:border-primary hover:text-primary
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       active:translate-y-0 active:shadow-md
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       overflow-hidden flex-1"
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;