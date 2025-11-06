"use client";
import React, { useState } from "react";
import { Pencil, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";

interface GenerateProps {
  text: string;
  role: string;
}

interface PromptBoxProps {
  onGenerate?: (props: GenerateProps) => void;
}

export default function PromptBox({
  onGenerate = () => {},
}: PromptBoxProps) {
  const [text, setText] = useState("");
  const [role, setRole] = useState("student"); // Default to "student" for better UX
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleGenerateClick = () => {
    if (!text.trim()) return; // Early return for empty input

    if (!isLoaded) {
      return; // Wait for auth check to complete
    }

    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    onGenerate({ text, role });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateClick();
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    router.push("/login");
  };

  const handleSignup = () => {
    setShowAuthModal(false);
    router.push("/signup");
  };

  return (
    <>
      <div className="flex justify-center items-start w-full pt-[100px] sm:pt-[150px]">
        <div className="w-full max-w-2xl px-4 sm:px-6">
          {/* Hero Text */}
          <h1 className="text-center text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
            Notes tailored to your taste
          </h1>

          {/* Main Card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 hover-scale">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the topic"
              className="w-full resize-none h-24 sm:h-28 text-base sm:text-lg font-mono text-foreground placeholder-muted-foreground bg-transparent outline-none"
              disabled={!isLoaded}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <label htmlFor="role" className="text-sm text-muted-foreground">
                  I am a:
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-sm border border-input bg-background rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                  disabled={!isLoaded}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="researcher">Researcher</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateClick}
                  disabled={!isLoaded || !text.trim()}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-primary text-primary-foreground text-sm shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed hover-scale button-press"
                >
                  <span>Generate</span>
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Action */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 border border-border rounded-full px-4 sm:px-6 py-2 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover-scale text-sm"
            >
              <span>Check out notes communities</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onLogin={handleLogin} onSignup={handleSignup} onClose={handleCloseModal} />
      )}
    </>
  );
}