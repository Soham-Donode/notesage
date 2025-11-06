"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import PromptBox from "@/components/PromptBox";

export default function Home() {
  const router = useRouter();

  const handleGenerate = ({ text, role }: { text: string; role: string }) => {
    if (!text.trim()) return;

    // Immediately navigate with query parameters for instant feedback
    router.push(`/generation?prompt=${encodeURIComponent(text)}&role=${role}`);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background to-muted">
      <header>
        <NavBar />
        <PromptBox onGenerate={handleGenerate} />
      </header>
    </div>
  );
}