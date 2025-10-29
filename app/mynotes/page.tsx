"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { NavBar } from "@/components/NavBar";
import { useUserData } from "@/lib/useUserData";

interface Note {
  _id: string;
  title: string;
  content: string;
  role: string;
  tags: string[];
  createdAt: string;
}

const MyNotesPage = () => {
  const router = useRouter();
  const { userData, loading: userLoading } = useUserData();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      fetchNotes();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userData, userLoading]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  if (userLoading || loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-background p-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Notes</h1>
          <p className="text-muted-foreground">Please log in to view your notes.</p>
        </div>
        <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">My Notes</h1>
        {notes.length === 0 ? (
          <p className="text-muted-foreground">No notes yet. Generate some notes to get started!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note._id} className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">Role: {note.role}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </p>
                <div className="text-sm">
                  {note.content.substring(0, 100)}...
                </div>
                {note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="bg-secondary px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyNotesPage;