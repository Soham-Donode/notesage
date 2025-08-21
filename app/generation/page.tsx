"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ArrowRight } from "lucide-react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

export default function NoteSage() {
  const [refactorText, setRefactorText] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[68vh] bg-white p-4 rounded-xl focus:outline-none",
      },
    },
    immediatelyRender: false, // important
    onCreate: () => setStatus("ready"),
  });

  useEffect(() => {
    if (!mounted || !editor) return;
    (async () => {
      try {
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 600));
        editor.commands.setContent(`
          <h2>Generated Notes</h2>
          <p><strong>Key concept 1:</strong> …</p>
          <p><strong>Key concept 2:</strong> …</p>
          <ul>
            <li>Bulleted summary …</li>
            <li>Another point …</li>
          </ul>
          <p><em>Action items:</em> …</p>
        `);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    })();
  }, [mounted, editor]);

  const onRefactor = () => {
    if (!refactorText.trim() || !editor) return;
    editor.chain().focus().insertContent(`<p>${refactorText}</p>`).run();
    setRefactorText("");
  };

  const onExport = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) {
      alert("Export failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

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
                aria-label="Refactor"
                className="flex-1 bg-transparent outline-none h-15 text-sm"
              />
              <button
                onClick={onRefactor}
                aria-label="Send"
                className="h-9 w-9 rounded-full bg-blue-500 text-white grid place-items-center hover:bg-blue-600 transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <div className="relative rounded-2xl bg-slate-100 min-h-[72vh] p-4">
            <div className="absolute right-4 top-4">
              <button
                onClick={onExport}
                disabled={!editor || status !== "ready"}
                className="inline-flex items-center gap-2 rounded-full bg-[#7EB6F0] text-black px-3 py-2 text-sm hover:bg-blue-200 transition disabled:opacity-50"
              >
                <span>📄</span>
                <span>Export as PDF</span>
              </button>
            </div>

            {!mounted || !editor ? (
              <div className="flex items-center justify-center h-[72vh]">
                <p className="text-3xl text-slate-500">Loading editor…</p>
              </div>
            ) : status === "error" ? (
              <div className="flex items-center justify-center h-[72vh]">
                <p className="text-lg text-red-600">Failed to load editor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-2">
                  <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 rounded hover:bg-slate-100">Bold</button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 rounded hover:bg-slate-100">Italic</button>
                  <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 rounded hover:bg-slate-100">Underline</button>
                  <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 rounded hover:bg-slate-100">• List</button>
                  <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 rounded hover:bg-slate-100">1. List</button>
                  <button onClick={() => editor.chain().focus().setParagraph().run()} className="px-2 py-1 rounded hover:bg-slate-100">Paragraph</button>
                  <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 rounded hover:bg-slate-100">H2</button>
                  <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 rounded hover:bg-slate-100">HR</button>
                  <button
                    onClick={() => {
                      const url = prompt("Enter URL");
                      if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Link
                  </button>
                  <button onClick={() => editor.chain().focus().unsetLink().run()} className="px-2 py-1 rounded hover:bg-slate-100">Unlink</button>
                  <button onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2 }).run()} className="px-2 py-1 rounded hover:bg-slate-100">Table</button>
                </div>

                <EditorContent editor={editor} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
