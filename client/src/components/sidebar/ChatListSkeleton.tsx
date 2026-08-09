"use client";

export function ChatListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="px-2 py-1 space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-ds)]">
          <div className="w-10 h-10 rounded-full bg-[var(--muted)] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-[var(--muted)] rounded-[var(--radius-ds)] animate-pulse w-2/3" />
              <div className="h-3 bg-[var(--muted)] rounded-[var(--radius-ds)] animate-pulse w-10" />
            </div>
            <div className="h-3 bg-[var(--muted)] rounded-[var(--radius-ds)] animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
