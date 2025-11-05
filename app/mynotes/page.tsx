"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { NavBar } from "@/components/NavBar";
import { useUserData } from "@/lib/useUserData";
import { Search, Edit, Trash2, Share, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface Note {
  _id: string;
  title: string;
  content: string;
  role: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const MyNotesPage = () => {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNotes = async (search = "") => {
    try {
      const url = search ? `/api/notes?search=${encodeURIComponent(search)}` : "/api/notes";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setFilteredNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchNotes(searchQuery);
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userData, userLoading, searchQuery]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleEditNote = (note: Note) => {
    // Store the note data in localStorage to be picked up by the generation page
    localStorage.setItem('editNote', JSON.stringify(note));
    router.push('/generation');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchNotes(searchQuery);
      } else {
        const error = await response.json();
        alert(`Error deleting note: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  const handlePostNote = async (note: Note) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          topic: 'general', // Default topic, could be made configurable
        }),
      });

      if (response.ok) {
        alert('Note posted successfully!');
      } else {
        const error = await response.json();
        alert(`Error posting note: ${error.error}`);
      }
    } catch (error) {
      console.error('Error posting note:', error);
      alert('Error posting note. Please try again.');
    }
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
            <button
              onClick={() => router.push('/generation')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors hover-scale"
            >
              <Plus className="w-4 h-4" />
              Create New Note
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {userLoading || loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your notes...</p>
            </div>
          ) : !userData ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your notes.</p>
              <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No notes found matching your search.' : 'No notes yet.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push('/generation')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-colors hover-scale"
                >
                  Generate Your First Notes
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div key={note._id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow hover-scale">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-card-foreground line-clamp-2">{note.title}</h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit note"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePostNote(note)}
                        className="p-1 text-muted-foreground hover:text-green-600 transition-colors"
                        title="Post to community"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">Role: {note.role}</p>

                  <div className="text-sm text-card-foreground mb-3 line-clamp-3">
                    {note.content.substring(0, 150)}...
                  </div>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                    {note.updatedAt !== note.createdAt && (
                      <span className="ml-2">
                        • Updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!userData && <AuthModal onLogin={handleLogin} onSignup={handleSignup} />}
    </>
  );
};

export default MyNotesPage;