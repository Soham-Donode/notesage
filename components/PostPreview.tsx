import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { ArrowUp, ArrowDown, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface PostPreviewProps {
  id: string;
  title: string;
  content: string;
  user: string;
  upvotes: number;
  downvotes: number;
  comments?: string;
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
  comments = '[]',
  createdAt,
  onUpvote,
  onDownvote,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentReady, setContentReady] = useState(false);

  // Parse comments to get count
  const getCommentCount = (commentsStr: string) => {
    try {
      const comments = JSON.parse(commentsStr || '[]');
      return comments.length;
    } catch {
      return 0;
    }
  };

  const commentCount = getCommentCount(comments);

  // Get preview content (first 200 characters or first paragraph)
  const getPreviewContent = (md: string) => {
    const lines = md.split('\n').filter(line => line.trim());
    const firstParagraph = lines.find(line => !line.startsWith('#') && line.trim());
    return firstParagraph ? firstParagraph.slice(0, 200) + (firstParagraph.length > 200 ? '...' : '') : md.slice(0, 200) + '...';
  };

  const previewContent = getPreviewContent(content);
  const displayContent = isExpanded ? content : previewContent;

  // Mark content as ready after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Generate snapshot when content is ready
  useEffect(() => {
    if (!contentReady || !contentRef.current || snapshotUrl || isGeneratingSnapshot) return;

    const generateSnapshot = async () => {
      setIsGeneratingSnapshot(true);
      try {
        // Wait for fonts and images to load
        await document.fonts.ready;
        
        const canvas = await html2canvas(contentRef.current!, {
          backgroundColor: '#ffffff',
          scale: 2,
          height: 200,
          width: 320,
          useCORS: true,
          allowTaint: false,
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
        });
        
        const imageUrl = canvas.toDataURL('image/png', 0.8);
        setSnapshotUrl(imageUrl);
      } catch (error) {
        console.warn('Snapshot generation failed:', error);
        setSnapshotUrl('fallback');
      } finally {
        setIsGeneratingSnapshot(false);
      }
    };

    generateSnapshot();
  }, [contentReady, content, snapshotUrl, isGeneratingSnapshot]);

  return (
    <>
      {/* Hidden content for snapshot generation */}
      {contentReady && (
        <div 
          ref={contentRef}
          className="fixed opacity-0 pointer-events-none overflow-hidden z-[-1]"
          style={{ 
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '320px',
            height: '200px'
          }}
          aria-hidden="true"
        >
          <div className="bg-white p-3 h-full overflow-hidden">
            <ReactMarkdown components={{
              h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-gray-900 leading-tight">{children}</h1>,
              h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-gray-800 leading-tight">{children}</h2>,
              h3: ({children}) => <h3 className="text-sm font-medium mb-1 text-gray-700 leading-tight">{children}</h3>,
              p: ({children}) => <p className="mb-2 text-sm text-gray-700 leading-relaxed">{children}</p>,
              ul: ({children}) => <ul className="mb-2 ml-4 text-sm text-gray-700">{children}</ul>,
              ol: ({children}) => <ol className="mb-2 ml-4 text-sm text-gray-700">{children}</ol>,
              li: ({children}) => <li className="mb-1 text-sm text-gray-700">• {children}</li>,
              strong: ({children}) => <strong className="text-gray-900">{children}</strong>,
              em: ({children}) => <em className="text-gray-700">{children}</em>,
              code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
              pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-800 mb-2 whitespace-pre-wrap">{children}</pre>,
              blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 pl-2 italic text-sm text-gray-600 mb-2">{children}</blockquote>,
            }}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Main Post Preview */}
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
            <Link href={`/post/${id}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight hover:text-blue-600 cursor-pointer">
                {title}
              </h3>
            </Link>

            {/* Post Content Preview */}
            <div className="mb-3">
              {snapshotUrl && snapshotUrl !== 'fallback' ? (
                <div className="relative">
                  <img 
                    src={snapshotUrl} 
                    alt="Post content preview" 
                    className="w-full h-32 object-cover rounded border border-gray-200 shadow-sm"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent rounded pointer-events-none"></div>
                </div>
              ) : isGeneratingSnapshot ? (
                <div className="w-full h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <div className="flex items-center text-gray-500 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                    Generating preview...
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-50 rounded border border-gray-200 p-3">
                  <div className="prose prose-sm max-w-none text-gray-800 line-clamp-3">
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
              )}
            </div>

            {/* Post Footer */}
            <div className="flex items-center text-xs text-gray-500">
              <button className="flex items-center hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{commentCount} comments</span>
              </button>
              {!isExpanded && content.length > 200 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors text-blue-600"
                >
                  Continue reading
                </button>
              )}
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ml-2 hover:bg-gray-100 px-2 py-1 rounded transition-colors text-blue-600"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPreview;