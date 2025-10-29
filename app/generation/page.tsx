"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import html2pdf from "html2pdf.js";
import { NavBar } from "@/components/NavBar";
import { ArrowRight, Download } from "lucide-react";
import { Editable, useEditor } from "@wysimark/react";

export default function NoteSage() {
  const [refactorText, setRefactorText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // Track generation-specific loading

  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const role = searchParams.get("role");

  // Ref for the editor container to capture rendered HTML for PDF
  const contentRef = useRef<HTMLDivElement>(null);
  const editor = useEditor({
    minHeight: "68vh",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initializeData = async () => {
      // Check for fresh generation via query parameters
      if (prompt && role) {
        setIsGenerating(true);
        setLoading(true);
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, role }),
          });

          if (!response.ok) {
            throw new Error("Generation failed");
          }

          const { markdown: generatedMarkdown } = await response.json();
          setMarkdown(generatedMarkdown);
          localStorage.setItem("notesData", JSON.stringify({ markdown: generatedMarkdown, timestamp: Date.now() }));
        } catch (error) {
          console.error("Error generating notes:", error);
          // Optionally, set a fallback markdown or show an error UI
          setMarkdown("# Generation Error\n\nAn error occurred while generating notes. Please try again.");
        } finally {
          setLoading(false);
          setIsGenerating(false);
        }
      } else {
        // Fallback to localStorage for existing sessions
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
      }
    };

    initializeData();
  }, [mounted, prompt, role]);

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

  const handleExport = () => {
    if (!contentRef.current || !markdown.trim()) {
      console.warn("No content available for export.");
      return;
    }

    // Generate timestamped filename
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `notes-${timestamp}.pdf`;

    // html2pdf options: A4 format, high scale for quality, margins in mm
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF from the editor container
    html2pdf().from(contentRef.current).set(opt).save();
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
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <button
                onClick={handleExport}
                disabled={loading || !markdown.trim()}
                aria-label="Export to PDF"
                className="inline-flex relative items-center gap-2 rounded-full z-[9999] px-3 py-2 bg-blue-500 text-white text-sm shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Download size={16} />
                <span>Export to pdf</span>
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[86vh]">
                <p 
                  className={`text-3xl text-slate-500 ${
                    isGenerating ? 'pulse-opacity' : ''
                  }`}
                >
                  {isGenerating ? "Generating your personalised notes" : "Processing..."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div 
                  ref={contentRef}
                  className="prose prose-slate max-w-none bg-white p-4 rounded-xl"
                >
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