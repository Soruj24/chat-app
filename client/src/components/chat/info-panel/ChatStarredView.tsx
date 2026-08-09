"use client";

import { ArrowLeft, Star } from "lucide-react";
import { Message, IChat } from "@/lib/types";
import { EmptyState } from "@/components/empty-states";
import { motion } from "framer-motion";

interface ChatStarredViewProps {
  starredMessages?: Message[];
  chat: IChat;
  onBack: () => void;
  onMessageClick?: (messageId: string) => void;
}

function NoStarredIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <path
          d="M32 8L39.5 24.5L58 27L44.5 39.5L47.5 58L32 49.5L16.5 58L19.5 39.5L6 27L24.5 24.5L32 8Z"
          fill="currentColor" opacity="0.1"
        />
        <path
          d="M32 8L39.5 24.5L58 27L44.5 39.5L47.5 58L32 49.5L16.5 58L19.5 39.5L6 27L24.5 24.5L32 8Z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
        />
      </motion.g>
      <motion.circle
        cx="48" cy="14" r="3" fill="currentColor" opacity="0.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], transition: { duration: 2, repeat: Infinity } }}
      />
    </svg>
  );
}

export function ChatStarredView({ starredMessages, chat, onBack, onMessageClick }: ChatStarredViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Starred Messages Header */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">Starred</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{starredMessages?.length || 0} Messages</p>
        </div>
      </div>

      {/* Starred Messages List */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-4">
        {starredMessages && starredMessages.length > 0 ? (
          starredMessages.map((msg) => (
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
                {msg.text || (msg.type === 'image' ? '📷 Photo' : msg.type === 'voice' ? '🎤 Voice' : '📄 File')}
              </p>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              illustration={<NoStarredIllustration />}
              title="No starred messages yet"
              description="Star important messages to find them easily later."
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
