import React from 'react';
import ReactMarkdown from 'react-markdown';

interface PostProps {
  title: string;
  content: string;
  user?: string;
}

const Post: React.FC<PostProps> = ({ title, content, user }) => {
  return (
    <div className="border border-border bg-card p-6 mb-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover-scale">
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{title}</h3>
      {user && <p className="text-sm text-muted-foreground mb-4">by {user}</p>}
      <div className="mt-4 prose prose-sm max-w-none text-card-foreground">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Post;