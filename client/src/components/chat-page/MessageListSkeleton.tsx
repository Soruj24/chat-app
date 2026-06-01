"use client";

import React from "react";
import { Skeleton } from "../ui/Skeleton";

export function MessageListSkeleton({ count = 8, groupAvatar = false }: { count?: number; groupAvatar?: boolean; }) {
  const items = Array.from({ length: count });
  return (
    <div className="flex flex-col space-y-3 py-4 px-4">
      {items.map((_, idx) => (
        <div key={idx} className={idx % 2 === 0 ? "flex items-start gap-2" : "flex items-start gap-2 justify-end"}>
          {groupAvatar && idx % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full" />}
          <div className={idx % 2 === 0 ? "flex-1 space-y-1.5" : "flex-1 space-y-1.5 max-w-[70%]"}>
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <Skeleton className={`h-6 ${idx % 2 === 0 ? 'w-1/2' : 'w-full'} rounded-[18px]`} />
          </div>
          {!groupAvatar && idx % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full" />}
        </div>
      ))}
    </div>
  );
}

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#28a8e8] to-[#0ba4e8] flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34c759] rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[#000000] dark:text-[#ffffff] mb-1">
        No messages yet
      </h3>
      <p className="text-sm text-[#8e8e93] max-w-[240px]">
        Send a message to start the conversation
      </p>
    </div>
  );
}
