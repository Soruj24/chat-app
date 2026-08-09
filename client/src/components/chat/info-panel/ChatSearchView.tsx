"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import { Message, IChat } from "@/lib/types";
import { useState, useMemo } from "react";
import { EmptyState, noSearchResults } from "@/components/empty-states";

interface ChatSearchViewProps {
  messages: Message[];
  chat: IChat;
  onBack: () => void;
  onMessageClick?: (messageId: string) => void;
}

function SearchPromptIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="2" />
      <line x1="38" y1="38" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function ChatSearchView({ messages, chat, onBack, onMessageClick }: ChatSearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return messages.filter(msg => 
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    ).reverse(); // Show latest first
  }, [messages, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Search Messages</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in chat..."
            autoFocus
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-4">
        {!searchQuery ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              illustration={<SearchPromptIllustration />}
              title="Search for messages"
              description="Find specific messages in this conversation."
              compact
            />
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              {filteredMessages.length} Results Found
            </p>
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => onMessageClick?.(msg.id)}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                    {msg.isMe ? "You" : chat.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium group-hover:text-blue-500 transition-colors">{msg.timestamp}</span>
                </div>
                <p className="text-[13px] text-gray-700 dark:text-gray-300 line-clamp-3">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              {...noSearchResults(() => setSearchQuery(""))}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
