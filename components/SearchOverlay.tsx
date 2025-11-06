"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  topic: string;
  userDisplayName: string;
  upvotes: number;
  downvotes: number;
  comments: string;
  createdAt: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPosts(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getTopicDisplayName = (slug: string) => {
    const topics = {
      'calculus': 'Calculus',
      'linear-algebra': 'Linear Algebra',
      'classical-mechanics': 'Classical Mechanics',
      'electromagnetism': 'Electromagnetism',
      'organic-chemistry': 'Organic Chemistry',
      'inorganic-chemistry': 'Inorganic Chemistry',
      'data-structures': 'Data Structures',
      'algorithms': 'Algorithms',
    };
    return topics[slug as keyof typeof topics] || slug;
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600/30 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] sm:max-h-[80vh] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts, topics, and content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-base sm:text-lg min-w-0"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground text-sm sm:text-base">Searching...</span>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="text-3xl sm:text-4xl mb-4">🔍</div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search terms or check your spelling.
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  onClick={onClose}
                  className="block p-3 sm:p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 truncate text-sm sm:text-base">
                        {highlightText(post.title, query)}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                        {highlightText(post.content.substring(0, 200), query)}
                        {post.content.length > 200 && '...'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {getTopicDisplayName(post.topic)}
                        </span>
                        <span className="truncate">by {post.userDisplayName}</span>
                        <span className="hidden sm:inline">{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <span className="text-green-600">↑{post.upvotes}</span>
                          <span className="text-red-600">↓{post.downvotes}</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() === '' ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="text-3xl sm:text-4xl mb-4">💡</div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Start searching</h3>
              <p className="text-muted-foreground text-sm">
                Search for posts, topics, or specific content across all subjects.
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;