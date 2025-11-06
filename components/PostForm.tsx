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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mr-3 sm:mr-4 hover-scale flex-shrink-0">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">+</span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">Create New Post</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="title" className="block text-sm font-semibold mb-2 sm:mb-3 text-card-foreground">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input bg-background rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground text-sm sm:text-base"
                placeholder="Enter an engaging post title..."
                required
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label htmlFor="content" className="block text-sm font-semibold mb-2 sm:mb-3 text-card-foreground">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-input bg-background rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 h-32 sm:h-40 lg:h-48 resize-vertical text-foreground placeholder-muted-foreground text-sm sm:text-base"
                placeholder="Share your thoughts in Markdown format..."
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 hover-scale order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover-scale button-press order-1 sm:order-2"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;