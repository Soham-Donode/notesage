"use client";
import React, { useState } from "react";
import { Pencil, Link as LinkIcon, ChevronRight } from "lucide-react";

interface GenerateProps {
  text: string;
  role: string;
}

interface PromptBoxProps {
  onGenerate?: (props: GenerateProps) => void;
  navbarHeight?: number;
}

export default function PromptBox({
  onGenerate = () => {},
  navbarHeight = 64,
}: PromptBoxProps) {
  const [text, setText] = useState("");
  const [role, setRole] = useState("student"); // Default to "student" for better UX

  const handleGenerateClick = () => {
    if (!text.trim()) return; // Early return for empty input
    onGenerate({ text, role });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateClick();
    }
  };

  return (
    <div className="flex justify-center items-start w-full pt-[calc(var(--navbar-height,64px)+2rem)]">
      <div className="w-full max-w-2xl px-4">
        {/* Hero Text */}
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Notes tailored to your taste
        </h1>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the topic"
            className="w-full resize-none h-28 text-lg font-mono text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="role" className="text-sm text-gray-500">
                I am a:
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="researcher">Researcher</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Attach link"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 shadow-sm hover:bg-gray-100"
              >
                <LinkIcon size={14} />
              </button>
              <button
                type="button"
                onClick={handleGenerateClick}
                disabled={!text.trim()}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-blue-500 text-white text-sm shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Generate</span>
                <Pencil size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Action */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-6 py-2 bg-white shadow-sm hover:bg-gray-50"
          >
            <span>Check out notes communities</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}