"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { ArrowLeft, MessageCircle, ArrowUp, ArrowDown, Send } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import AuthModal from '@/components/AuthModal';
import ScrollableMarkdown from '@/components/ScrollableMarkdown';

interface Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  topic: string;
  userDisplayName: string;
  userAvatar?: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  commentCount: number;
  views: number;
  createdAt: string;
}

const PostPage = () => {
  const params = useParams();
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error('Failed to fetch post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!post) return;

    try {
      const response = await fetch('/api/posts/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post._id, voteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(prev => prev ? {
          ...prev,
          upvotes: data.upvotes,
          downvotes: data.downvotes
        } : null);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;

    setSubmittingComment(true);
    try {
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post._id,
          content: commentText.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Comment submitted successfully:', data);
        // Refetch the post data to ensure we have the latest comments
        await fetchPost();
        setCommentText('');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit comment:', errorData);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <p>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/explore/${post.topic}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {post.topic}
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Post Content */}
          <div className="bg-card border border-border rounded-md mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row">
              {/* Voting Section */}
              <div className="flex md:flex-col items-center justify-center p-3 bg-muted rounded-t-md md:rounded-l-md md:rounded-t-none min-h-[50px] md:min-w-[50px] border-b md:border-b-0 md:border-r border-border">
                <button
                  onClick={() => handleVote('upvote')}
                  className="p-1 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded transition-colors group"
                  aria-label="Upvote"
                >
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-orange-500" />
                </button>
                <span className="text-sm font-bold text-foreground py-1 md:py-2 px-2 md:px-0">
                  {post.upvotes - post.downvotes || 0}
                </span>
                <button
                  onClick={() => handleVote('downvote')}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors group"
                  aria-label="Downvote"
                >
                  <ArrowDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-blue-500" />
                </button>
              </div>

              {/* Post Content */}
              <div className="flex-1 p-4 md:p-6">
                {/* Post Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm text-muted-foreground mb-3 gap-1 sm:gap-0">
                  <span className="font-medium text-foreground">Posted by u/{post.userDisplayName}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span>{post.views} views</span>
                </div>

                {/* Post Title */}
                <h1 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 md:mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Post Content */}
                <div className="mb-4">
                  <ScrollableMarkdown content={post.content} title={post.title} />
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-card border border-border rounded-md">
            <div className="p-4 md:p-6 border-b border-border">
              <h2 className="text-lg md:text-xl font-bold text-card-foreground mb-4">
                {post.commentCount} Comments
              </h2>

              {/* Add Comment Form */}
              {userId ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-semibold text-sm">U</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-input bg-background rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground text-sm md:text-base"
                        rows={3}
                        required
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={submittingComment || !commentText.trim()}
                          className="inline-flex items-center px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {submittingComment ? 'Posting...' : 'Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground mb-2 text-sm md:text-base">Please sign in to comment</p>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm md:text-base">
                    Sign In
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {comment.userDisplayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm text-muted-foreground mb-1 gap-1 sm:gap-0">
                        <span className="font-medium text-foreground">{comment.userDisplayName}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-card-foreground text-sm md:text-base mb-2">{comment.content}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <button className="flex items-center hover:bg-muted px-2 py-1 rounded mr-2">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          {comment.upvotes}
                        </button>
                        <button className="flex items-center hover:bg-muted px-2 py-1 rounded">
                          <ArrowDown className="w-3 h-3 mr-1" />
                          {comment.downvotes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {post.comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm md:text-base">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isLoaded ? null : !userId && (
        <AuthModal
          onLogin={() => router.push("/login")}
          onSignup={() => router.push("/signup")}
        />
      )}
    </div>
  );
};

export default PostPage;