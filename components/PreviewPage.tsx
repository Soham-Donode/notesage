"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, ArrowRight, FileDown, Loader, Sparkles } from 'lucide-react';

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
        <aside className="fixed top-16 left-0 w-full md:w-1/3 lg:w-1/4 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'} ${msg.isError ? 'bg-red-100 text-red-700' : ''}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                         {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                           <Loader className="w-5 h-5 animate-spin text-gray-500" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
                {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Refactor this, explain that..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
                        rows={1}
                    />
                    <button
                        onClick={handleSendPrompt}
                        disabled={isLoading || !prompt.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );

    // Notes Preview Component (Right Side): Displays the generated notes.
    const NotesPreview: React.FC = () => (
        <main className="ml-90 md:ml-1/3 lg:ml-1/4 pt-16 bg-gray-50/50 ">
            <div className="p-6 sm:p-8 md:p-12 min-h-[calc(100vh-4rem)]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={() => window.print()}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FileDown className="w-4 h-4 mr-2" />
                            Export as PDF
                        </button>
                    </div>
                    <div className="bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-lg border border-gray-200 min-h-[70vh]">
                        {generatedNotes ? (
                            <article className="prose lg:prose-xl max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: generatedNotes.replace(/\n/g, '<br />') }} />
                            </article>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <Sparkles className="w-16 h-16 mb-4 text-gray-300" />
                                <h2 className="text-2xl font-semibold">Notes as good as you are...</h2>
                                <p className="mt-2 text-gray-500">Your generated notes will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );

    // Main App Layout
    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            <div className="flex flex-col">
                <ChatPanel />
                <NotesPreview />
            </div>
        </div>
    );
};

export default App;
