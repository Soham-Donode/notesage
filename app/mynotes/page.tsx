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
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter((note) =>
          note.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags);
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingNote._id,
          title: editTitle,
          content: editContent,
          role: editingNote.role,
          tags: editTags,
          isPublic: editingNote.isPublic,
        }),
      });

      if (response.ok) {
        await fetchNotes(searchQuery);
        setEditingNote(null);
      } else {
        const error = await response.json();
        alert(`Error updating note: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <button
              onClick={() => router.push('/generation')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Create New Note
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Generate some notes to get started!'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push('/generation')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note) => (
                <div key={note._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{note.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      note.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {note.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">Role: {note.role}</p>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {note.content.substring(0, 150)}...
                  </p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.updatedAt !== note.createdAt && (
                      <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handlePostNote(note)}
                      className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Share size={14} />
                      Post
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags.join(', ')}
                  onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingNote(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!userData && (
        <AuthModal onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </>
  );
};

export default MyNotesPage;