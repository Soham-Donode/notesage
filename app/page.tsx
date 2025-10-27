"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import PromptBox from "@/components/PromptBox";

export default function Home() {
  const router = useRouter();

  const handleGenerate = async ({ text, role }: { text: string; role: string }) => {
    if (!text.trim()) return;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, role }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const { markdown } = await response.json();
      localStorage.setItem("notesData", JSON.stringify({ markdown, timestamp: Date.now() }));
      router.push("/generation");
    } catch (error) {
      console.error("Error generating notes:", error);
      // Consider adding a user-facing notification (e.g., via toast) here
    }
  };

  return (
    <div className="h-screen w-screen">
      <header>
        <NavBar />
        <PromptBox onGenerate={handleGenerate} />
      </header>
    </div>
  );
}