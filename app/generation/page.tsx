"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ArrowRight } from "lucide-react";
import { Editable, useEditor } from "@wysimark/react";

export default function NoteSage() {
  const [refactorText, setRefactorText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load from localStorage if available; fallback to placeholder
    const stored = localStorage.getItem("notesData");
    if (stored) {
      const { markdown: storedMarkdown } = JSON.parse(stored);
      setMarkdown(storedMarkdown);
    } else {
      setMarkdown(`# Generated Notes

**Key concept 1:** …

**Key concept 2:** …

- Bulleted summary …
- Another point …

*Action items:* …`);
    }
    setLoading(false);
  }, [mounted]);

  const editor = useEditor({
    minHeight: "68vh",
  });


  const onRefactor = async () => {
    if (!refactorText.trim() || !markdown) return;

    setLoading(true);
    try {
      const response = await fetch("/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentMarkdown: markdown, refactorPrompt: refactorText }),
      });

      if (!response.ok) {
        throw new Error("Refactor operation failed");
      }

      const { markdown: newMarkdown } = await response.json();
      setMarkdown(newMarkdown);
      localStorage.setItem("notesData", JSON.stringify({ markdown: newMarkdown, timestamp: Date.now() }));
      setRefactorText("");
    } catch (error) {
      console.error("Error during refactor:", error);
      // Consider integrating a notification system for user feedback
    } finally {
      setLoading(false);
    }
  };

  if (loading && !mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-xl text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full min-w-[800px] flex flex-col bg-white text-slate-900">
      <NavBar />

      <div className="flex flex-1 min-h-0">
        <aside className="w-100 border-r border-slate-200 flex flex-col justify-between">
          <div className="p-4 text-sm text-slate-500"></div>
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                value={refactorText}
                onChange={(e) => setRefactorText(e.target.value)}
                placeholder="Refactor"
                aria-label="Refactor prompt"
                className="flex-1 bg-transparent outline-none h-15 text-sm"
                disabled={loading}
              />
              <button
                onClick={onRefactor}
                disabled={!refactorText.trim() || loading}
                aria-label="Refactor notes"
                className="h-9 w-9 rounded-full bg-blue-500 text-white grid place-items-center hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <div className="relative rounded-2xl bg-slate-100 min-h-[72vh] p-4">
            <div className="absolute right-4 top-4">
              {/* Export button can be re-added here if needed */}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[72vh]">
                <p className="text-3xl text-slate-500">Processing...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="prose prose-slate max-w-none bg-white p-4 rounded-xl">
                  <Editable
                    editor={editor}
                    value={markdown}
                    onChange={(newMarkdown) => {
                      setMarkdown(newMarkdown);
                      // Persist direct edits to localStorage
                      localStorage.setItem("notesData", JSON.stringify({ markdown: newMarkdown, timestamp: Date.now() }));
                    }}
                    placeholder="Your notes will appear here..."
                    className="min-h-[68vh]"
                    throttleInMs={1000}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}