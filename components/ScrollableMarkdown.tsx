"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

interface ScrollableMarkdownProps {
  content: string;
  title?: string;
  className?: string;
}

const ScrollableMarkdown: React.FC<ScrollableMarkdownProps> = ({ content, title = "Document", className = "" }) => {
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scrollable Content */}
      <div className="max-h-[800px] overflow-y-auto border border-gray-200 rounded-lg bg-white p-6">
        <div className="prose prose-lg max-w-none text-gray-800">
          <ReactMarkdown components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-gray-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-gray-700">{children}</h3>,
            p: ({ children }) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-3 ml-6 text-gray-700">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 ml-6 text-gray-700">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
            pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 overflow-x-auto mb-3">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
          }}>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as Markdown
        </button>
      </div>
    </div>
  );
};

export default ScrollableMarkdown;