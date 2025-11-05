"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import html2pdf from "html2pdf.js";
import { NavBar } from "@/components/NavBar";
import { ArrowRight, Download, Share } from "lucide-react";
import { Editable, useEditor } from "@wysimark/react";
import { useAuth } from "@clerk/nextjs";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";

const topics = [
	{
		name: 'Calculus',
		slug: 'calculus',
		description:
			'Master the fundamentals of differential and integral calculus, limits, derivatives, and integrals.',
		image:
			'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
	},
	{
		name: 'Linear Algebra',
		slug: 'linear-algebra',
		description:
			'Explore vectors, matrices, eigenvalues, and vector spaces in this essential math topic.',
		image:
			'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=250&fit=crop',
	},
	{
		name: 'Classical Mechanics',
		slug: 'classical-mechanics',
		description: 'Learn Newton\'s laws, kinematics, dynamics, and the principles of motion.',
		image:
			'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
	},
	{
		name: 'Electromagnetism',
		slug: 'electromagnetism',
		description:
			'Dive into electric fields, magnetic fields, circuits, and electromagnetic waves.',
		image:
			'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=250&fit=crop',
	},
	{
		name: 'Organic Chemistry',
		slug: 'organic-chemistry',
		description: 'Study carbon compounds, reactions, and the chemistry of life.',
		image:
			'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
	},
	{
		name: 'Inorganic Chemistry',
		slug: 'inorganic-chemistry',
		description:
			'Understand metals, minerals, and non-carbon based chemical compounds.',
		image:
			'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=250&fit=crop',
	},
	{
		name: 'Data Structures',
		slug: 'data-structures',
		description:
			'Learn arrays, linked lists, trees, graphs, and efficient data organization.',
		image:
			'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
	},
	{
		name: 'Algorithms',
		slug: 'algorithms',
		description:
			'Master sorting, searching, dynamic programming, and algorithmic problem-solving.',
		image:
			'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
	},
];

export default function NoteSage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [refactorText, setRefactorText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // Track generation-specific loading
  const [showPostModal, setShowPostModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [saving, setSaving] = useState(false); // Track saving state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

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
        // Check if we're editing a note
        const editNoteData = localStorage.getItem('editNote');
        if (editNoteData) {
          try {
            const note = JSON.parse(editNoteData);
            setMarkdown(note.content);
            setEditingNoteId(note._id);
            localStorage.removeItem('editNote'); // Clean up
          } catch (error) {
            console.error('Error parsing edit note data:', error);
          }
        }

        // Check for stored notes data
        const stored = localStorage.getItem("notesData");
        if (stored && !editNoteData) {
          try {
            const { markdown: storedMarkdown } = JSON.parse(stored);
            setMarkdown(storedMarkdown);
          } catch (error) {
            console.error("Error parsing stored notes:", error);
          }
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
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    // Generate PDF from the editor container
    html2pdf().from(contentRef.current).set(opt).save();
  };

  const handlePostToTopic = async (topicSlug: string) => {
    if (!markdown.trim()) {
      console.warn("No content available to post.");
      return;
    }

    setPosting(true);
    try {
      // Extract title from the first heading in markdown
      const lines = markdown.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      const title = titleLine ? titleLine.replace('# ', '').trim() : 'Generated Notes';

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: markdown,
          topic: topicSlug,
        }),
      });

      if (response.ok) {
        alert('Notes posted successfully!');
        setShowPostModal(false);
      } else {
        const error = await response.json();
        alert(`Error posting notes: ${error.error}`);
      }
    } catch (error) {
      console.error('Error posting notes:', error);
      alert('Error posting notes. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!markdown.trim()) {
      console.warn("No content available to save.");
      return;
    }

    setSaving(true);
    try {
      // Extract title from the first heading in markdown
      const lines = markdown.split('\n');
      const titleLine = lines.find(line => line.startsWith('# '));
      const title = titleLine ? titleLine.replace('# ', '').trim() : 'Generated Notes';

      let response;
      if (editingNoteId) {
        // Update existing note
        response = await fetch('/api/notes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingNoteId,
            title,
            content: markdown,
            role: 'Generated Notes',
            tags: ['generated'],
            isPublic: false,
          }),
        });
      } else {
        // Create new note
        response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content: markdown,
            role: 'Generated Notes',
            tags: ['generated'],
            isPublic: false,
          }),
        });
      }

      if (response.ok) {
        alert(editingNoteId ? 'Note updated successfully!' : 'Notes saved successfully!');
        if (editingNoteId) {
          setEditingNoteId(null);
        }
      } else {
        const error = await response.json();
        alert(`Error saving notes: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Error saving notes. Please try again.');
    } finally {
      setSaving(false);
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
    <div className="h-screen w-full min-w-[800px] flex flex-col bg-background text-foreground">
      <NavBar />

      <div className="flex flex-1 min-h-0">
  <aside className="w-100 border-r border-border flex flex-col justify-center bg-card h-full">
  <div className="p-4 flex justify-center">
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 w-full max-w-sm">
      <input
        value={refactorText}
        onChange={(e) => setRefactorText(e.target.value)}
        placeholder="      Refactor"
        aria-label="Refactor prompt"
        className="flex-1 bg-transparent outline-none h-20 text-sm text-foreground placeholder-muted-foreground"
        disabled={loading}
      />
      <button
        onClick={onRefactor}
        disabled={!refactorText.trim() || loading}
        aria-label="Refactor notes"
        className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
</aside>


        <main className="flex-1 overflow-auto p-6">
          {/* Action Buttons Header */}
          <div className="mb-4 flex justify-end gap-3">
            <button
              onClick={handleSaveToNotes}
              disabled={loading || !markdown.trim() || saving}
              aria-label="Save to My Notes"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary text-primary-foreground text-sm shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition hover-scale"
            >
              <span>{saving ? 'Saving...' : editingNoteId ? 'Update Note' : 'Save to My Notes'}</span>
            </button>
            <button
              onClick={() => setShowPostModal(true)}
              disabled={loading || !markdown.trim()}
              aria-label="Post to Topic"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-green-500 text-primary-foreground text-sm shadow hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition hover-scale"
            >
              <Share size={16} />
              <span>Post to Topic</span>
            </button>
            <button
              onClick={handleExport}
              disabled={loading || !markdown.trim()}
              aria-label="Export to PDF"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-blue-500 text-primary-foreground text-sm shadow hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition hover-scale"
            >
              <Download size={16} />
              <span>Export to pdf</span>
            </button>
          </div>

          <div className="relative rounded-2xl bg-card min-h-[72vh] p-4 card-shadow">
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
                  className=" bg-white max-w-none p-4 rounded-xl"
                >
                  {/* Keep the wysimark editor unstyled by our theme utilities.
                      We wrap it in a transparent container so it doesn't inherit
                      .text-card-foreground or .bg-card. The editor itself manages
                      its own appearance. */}
                  <div className="bg-transparent text-inherit">
                    <Editable
                      editor={editor}
                      value={markdown}
                      onChange={(newMarkdown) => {
                        setMarkdown(newMarkdown);
                        // Persist direct edits to localStorage
                        localStorage.setItem("notesData", JSON.stringify({ markdown: newMarkdown, timestamp: Date.now() }));
                      }}
                      placeholder="Your notes will appear here..."
                      className="min-h-[68vh] bg-transparent"
                      throttleInMs={1000}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {!isLoaded ? null : !userId && (
        <AuthModal
          onLogin={() => router.push("/login")}
          onSignup={() => router.push("/signup")}
        />
      )}

      {/* Post to Topic Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Post Notes to Topic</h2>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="text-2xl text-gray-400">×</span>
                </button>
              </div>
              <p className="text-gray-600 mt-2">Choose a topic to share your generated notes with the community</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((topic) => (
                  <button
                    key={topic.slug}
                    onClick={() => handlePostToTopic(topic.slug)}
                    disabled={posting}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {topic.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {posting && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-700">Posting your notes...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}