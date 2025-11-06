"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, ArrowRight, FileDown, Loader, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- Type Definitions ---
// Defines the structure for a single chat message.
interface Message {
    role: 'user' | 'bot';
    content: string;
    isError?: boolean;
}

// Main App Component
const App: React.FC = () => {
    // --- State Management ---
    const [prompt, setPrompt] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [generatedNotes, setGeneratedNotes] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the latest message whenever the messages array updates.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- API Call to Gemini ---
    // This function sends the user's prompt to the Gemini API and updates the state.
    const handleSendPrompt = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError('');
        const userMessage: Message = { role: 'user', content: prompt };
        setMessages(prev => [...prev, userMessage]);
        const currentPrompt = prompt;
        setPrompt('');

        // Implements exponential backoff for retrying failed API requests.
        const maxRetries = 3;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const payload = {
                    contents: [{ role: "user", parts: [{ text: `Generate detailed, well-structured notes based on the following topic: "${currentPrompt}". The notes should be easy to read and suitable for exporting as a PDF.` }] }]
                };
                const apiKey = ""; // API key is handled by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const result = await response.json();
                
                const botResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (botResponseText) {
                    const botMessage: Message = { role: 'bot', content: botResponseText };
                    setMessages(prev => [...prev, botMessage]);
                    setGeneratedNotes(botResponseText);
                } else {
                   throw new Error("Invalid response structure from API.");
                }
                
                setIsLoading(false);
                return; // Exit loop on success

            } catch (err) {
                console.error(`API call failed (attempt ${attempt + 1}):`, err);
                if (attempt >= maxRetries - 1) {
                    const errorMessage = "Failed to generate notes. Please try again later.";
                    setError(errorMessage);
                    setMessages(prev => [...prev, { role: 'bot', content: errorMessage, isError: true }]);
                    setIsLoading(false);
                } else {
                    await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
                }
            }
        }
    };

    // Handles the 'Enter' key press in the textarea to send the prompt.
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendPrompt();
        }
    };
    
    // --- Render Components ---

    // Header Component: Displays navigation and search.
    

    // Chat Panel Component (Left Side): Displays the chat interface.
    const ChatPanel: React.FC = () => (
        <aside className="fixed top-16 left-0 w-full md:w-1/3 lg:w-1/4 h-[calc(100vh-4rem)] bg-card border-r border-border flex flex-col z-10 md:z-auto">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                        )}
                        <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-sm sm:text-base ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-card-foreground rounded-bl-none'} ${msg.isError ? 'bg-destructive/10 text-destructive' : ''}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-muted text-card-foreground rounded-bl-none">
                           <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 sm:p-4 border-t border-border">
                {error && <p className="text-xs text-destructive mb-2">{error}</p>}
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Refactor this, explain that..."
                        className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 bg-muted rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow duration-200 text-sm sm:text-base"
                        rows={1}
                    />
                    <button
                        onClick={handleSendPrompt}
                        disabled={isLoading || !prompt.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );

    // Notes Preview Component (Right Side): Displays the generated notes.
    const NotesPreview: React.FC = () => (
        <main className="ml-0 md:ml-[33.333%] lg:ml-[25%] pt-16 bg-background/50 min-h-screen">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 min-h-[calc(100vh-4rem)]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-end mb-4 sm:mb-6">
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring text-sm sm:text-base"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            Export as PDF
                        </button>
                    </div>
                    <div className="bg-card p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl shadow-lg border border-border min-h-[60vh] sm:min-h-[70vh]">
                        {generatedNotes ? (
                            <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none prose-headings:text-card-foreground prose-p:text-card-foreground prose-strong:text-card-foreground prose-code:text-card-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-card-foreground mb-4 mt-6 first:mt-0">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-card-foreground mb-3 mt-5">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-base sm:text-lg lg:text-xl font-medium text-card-foreground mb-2 mt-4">{children}</h3>,
                                        p: ({ children }) => <p className="text-card-foreground mb-4 leading-relaxed">{children}</p>,
                                        ul: ({ children }) => <ul className="text-card-foreground mb-4 ml-6 list-disc space-y-1">{children}</ul>,
                                        ol: ({ children }) => <ol className="text-card-foreground mb-4 ml-6 list-decimal space-y-1">{children}</ol>,
                                        li: ({ children }) => <li className="text-card-foreground">{children}</li>,
                                        code: ({ children }) => <code className="bg-muted text-card-foreground px-2 py-1 rounded text-sm font-mono">{children}</code>,
                                        pre: ({ children }) => <pre className="bg-muted border border-border p-4 rounded-lg overflow-x-auto mb-4 text-card-foreground">{children}</pre>,
                                        blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
                                        strong: ({ children }) => <strong className="font-semibold text-card-foreground">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-card-foreground">{children}</em>,
                                    }}
                                >
                                    {generatedNotes}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8 sm:py-12">
                                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-muted-foreground/50" />
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Notes as good as you are...</h2>
                                <p className="text-sm sm:text-base text-muted-foreground">Your generated notes will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );

    // Main App Layout
    return (
        <div className="font-sans antialiased text-card-foreground bg-background">
            <div className="flex flex-col md:flex-row">
                <ChatPanel />
                <NotesPreview />
            </div>
        </div>
    );
};

export default App;
