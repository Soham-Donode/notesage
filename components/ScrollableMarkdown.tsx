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
      <div className="max-h-[600px] sm:max-h-[800px] overflow-y-auto border border-border rounded-lg bg-card p-4 sm:p-6">
        <div className="prose prose-sm sm:prose-lg max-w-none text-card-foreground">
          <ReactMarkdown components={{
            h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base sm:text-lg font-medium mb-2 text-card-foreground">{children}</h3>,
            p: ({ children }) => <p className="mb-2 sm:mb-3 text-card-foreground leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 sm:mb-3 ml-4 sm:ml-6 text-card-foreground">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 sm:mb-3 ml-4 sm:ml-6 text-card-foreground">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children }) => <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-card-foreground">{children}</code>,
            pre: ({ children }) => <pre className="bg-muted p-3 rounded text-sm font-mono text-card-foreground overflow-x-auto mb-2 sm:mb-3">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-3 sm:pl-4 italic text-muted-foreground mb-2 sm:mb-3">{children}</blockquote>,
          }}>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end mt-3 sm:mt-4">
        <button
          onClick={handleDownload}
          className="flex items-center px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm sm:text-base"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as Markdown
        </button>
      </div>
    </div>
  );
};

export default ScrollableMarkdown;