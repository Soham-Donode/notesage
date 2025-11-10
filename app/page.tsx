"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import PromptBox from "@/components/PromptBox";
import SearchOverlay from "@/components/SearchOverlay";

export default function Home() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleGenerate = ({ text, role }: { text: string; role: string }) => {
    if (!text.trim()) return;

    // Immediately navigate with query parameters for instant feedback
    router.push(`/generation?prompt=${encodeURIComponent(text)}&role=${role}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background to-muted">
      <header>
        <NavBar onSearchClick={() => setIsSearchOpen(true)} />
        <PromptBox onGenerate={handleGenerate} />
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}