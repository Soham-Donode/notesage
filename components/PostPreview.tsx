import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';

interface PostPreviewProps {
  id: string;
  title: string;
  content: string;
  user: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  id,
  title,
  content,
  user,
  upvotes,
  downvotes,
  createdAt,
  onUpvote,
  onDownvote,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get preview content (first 200 characters or first paragraph)
  const getPreviewContent = (md: string) => {
    const lines = md.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line => !line.startsWith('#') && line.trim());
    return firstParagraph ? firstParagraph.slice(0, 200) + (firstParagraph.length > 200 ? '...' : '') : md.slice(0, 200) + '...';
  };

  const previewContent = getPreviewContent(content);
  const displayContent = isExpanded ? content : previewContent;

  return (
    <div className="bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
      <div className="flex">
        {/* Voting Section */}
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-l-md min-w-[40px]">
          <button
            onClick={onUpvote}
            className="p-1 hover:bg-orange-100 rounded transition-colors group"
            aria-label="Upvote"
          >
            <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
          </button>
          <span className="text-xs font-bold text-gray-700 py-1">
            {upvotes - downvotes || 0}
          </span>
          <button
            onClick={onDownvote}
            className="p-1 hover:bg-blue-100 rounded transition-colors group"
            aria-label="Downvote"
          >
            <ArrowDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3">
          {/* Post Header */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="font-medium text-gray-700">Posted by u/{user}</span>
            <span className="mx-1">•</span>
            <span>{new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          {/* Post Title */}
          <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight hover:text-blue-600 cursor-pointer">
            {title}
          </h3>

          {/* Post Content Preview */}
          <div className="mb-3">
            <div className="prose prose-sm max-w-none text-gray-800">
              <div className="line-clamp-3">
                <ReactMarkdown components={{
                  p: ({children}) => <p className="mb-2 text-sm leading-relaxed">{children}</p>,
                  h1: ({children}) => <h1 className="text-base font-semibold mb-2">{children}</h1>,
                  h2: ({children}) => <h2 className="text-sm font-semibold mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-sm font-medium mb-2">{children}</h3>,
                  ul: ({children}) => <ul className="mb-2 ml-4 text-sm">{children}</ul>,
                  ol: ({children}) => <ol className="mb-2 ml-4 text-sm">{children}</ol>,
                  li: ({children}) => <li className="mb-1 text-sm">{children}</li>,
                  code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                  blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 pl-3 italic text-sm text-gray-600 mb-2">{children}</blockquote>,
                }}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Post Footer */}
          <div className="flex items-center text-xs text-gray-500">
            <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded transition-colors">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>0 comments</span>
            </button>
            {content.length > 200 && (
              <button className="ml-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors text-blue-600">
                Continue reading
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;