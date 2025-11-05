import React, { useState } from 'react';

interface PostFormProps {
  topic: string;
  isOpen: boolean;
  onClose: () => void;
  onPost?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ topic, isOpen, onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, topic }),
      });

      if (response.ok) {
        console.log('Post created successfully!');
        setTitle('');
        setContent('');
        onPost?.();
        onClose();
      } else {
        console.error('Error creating post:', response.status);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-border">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mr-4 hover-scale">
            <span className="text-primary-foreground font-bold text-lg">+</span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">Create New Post</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold mb-3 text-card-foreground">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
              placeholder="Enter an engaging post title..."
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-semibold mb-3 text-card-foreground">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 h-48 resize-vertical text-foreground placeholder-muted-foreground"
              placeholder="Share your thoughts in Markdown format..."
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 hover-scale"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover-scale button-press"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;