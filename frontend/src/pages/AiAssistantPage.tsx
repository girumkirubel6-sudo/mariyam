import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiApi } from '../api/aiApi';
import { Sparkles, Send, Bot, User, BookOpen, Scroll, Shield, Loader2, RotateCcw } from 'lucide-react';
import { parseApiError } from '../api/config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Greetings (ሰላም)! I am the Wemezekr Cultural & Philological AI Assistant. I specialize in Ethiopian classical literature, Ge'ez codicology, imperial state archives, monastic scriptoriums, and preservation standards. How may I assist your historical or paleographic inquiries today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>(initialQuery || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What are the historical origins of the 5th-century Abba Garima Gospels?",
    "Explain the philosophical themes in the 17th-century Hatata of Zera Yacob.",
    "What is the significance of the Treaty of Wuchale and the 1896 Battle of Adwa archives?",
    "Recommend preservation and climate control protocols for 14th-century parchment vellum.",
    "What is the difference between Ge'ez Uncial (ቁም ፊደል) and cursive script?",
    "Summarize the literary impact of 'Fikir Eske Meqabir' by Haddis Alemayehu.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiApi.askQuestion(prompt);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const parsed = parseApiError(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an issue connecting to the AI knowledge base: ${parsed.message}. If you are developing locally, please ensure the backend or Demo Mode is available.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ethiopic Philological Intelligence</span>
          </div>
          <h1 className="font-serif font-black text-3xl text-stone-900">
            Wemezekr Heritage AI Assistant
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Scholarly guidance on Ethiopian literature, ancient Ge'ez manuscripts, imperial archives, and codex preservation.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content:
                  "Greetings (ሰላም)! I am the Wemezekr Cultural & Philological AI Assistant. How may I assist your historical or paleographic inquiries today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Dialogue
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Curated Academic Queries
        </p>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-left text-xs bg-white hover:bg-[#FAF6EB] border border-stone-200 hover:border-[#D4AF37] px-3.5 py-2 rounded-xl text-stone-700 hover:text-[#0C3823] transition-all shadow-2xs"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Dialogue Window */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#0C3823] text-white'
                      : 'bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 font-ethiopic'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : 'ወ'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#0C3823] text-white rounded-tr-none'
                      : 'bg-[#FAF8F5] text-stone-800 border border-stone-200/80 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span
                    className={`block mt-2 text-[10px] ${
                      isUser ? 'text-emerald-200 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6EB] text-[#856404] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 font-ethiopic text-xs">
                ወ
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 rounded-tl-none flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Consulting Wemezekr scholarly archives and philological databases...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-stone-200 bg-[#FAF8F5] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Ethiopian manuscripts, classical authors, or archival records..."
            className="flex-1 py-3 px-4 rounded-2xl border border-stone-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C3823] text-stone-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-[#0C3823] text-[#D4AF37] hover:bg-[#124f33] disabled:opacity-40 transition-all shrink-0 shadow-xs"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
