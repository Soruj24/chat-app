"use client";

import React from "react";
import { Skeleton } from "../ui/Skeleton";

export function ChatListSkeleton({ count = 6 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="px-2 space-y-0.5">
      {items.map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl">
          <Skeleton className="w-11 h-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
