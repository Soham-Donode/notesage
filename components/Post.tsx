import React from 'react';
import ReactMarkdown from 'react-markdown';

interface PostProps {
  title: string;
  content: string;
  user?: string;
}

const Post: React.FC<PostProps> = ({ title, content, user }) => {
  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="text-lg font-semibold">{title}</h3>
      {user && <p className="text-sm text-gray-600">by {user}</p>}
      <div className="mt-2">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Post;