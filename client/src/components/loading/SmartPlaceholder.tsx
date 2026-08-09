"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonCircle } from "@/components/ui/Skeleton";

type PlaceholderContext =
  | "chat-list"
  | "message-list"
  | "profile"
  | "search"
  | "media"
  | "settings"
  | "notification"
  | "generic";

interface SmartPlaceholderProps {
  context: PlaceholderContext;
  message?: string;
  className?: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

function ChatListPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i} variants={item} className="flex items-center gap-3 px-3 py-2.5">
          <SkeletonCircle size={44} />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton variant="shimmer" rounded="full" className="h-3.5" style={{ width: `${40 + Math.random() * 30}%` }} />
              <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-8" />
            </div>
            <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${50 + Math.random() * 30}%` }} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function MessageListPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4 px-4 py-6">
      {Array.from({ length: 4 }).map((_, i) => {
        const isMe = i % 2 === 0;
        return (
          <motion.div
            key={i}
            variants={item}
            className={cn("flex items-end gap-2.5", isMe ? "flex-row-reverse" : "flex-row")}
          >
            {!isMe && <SkeletonCircle size={28} className="mb-1" />}
            <div className={cn("max-w-[65%]", isMe ? "items-end" : "items-start", "flex flex-col")}>
              <Skeleton
                variant="shimmer"
                rounded="2xl"
                className={cn(
                  "px-4 py-3",
                  isMe ? "rounded-br-md" : "rounded-bl-md"
                )}
                style={{ width: 120 + Math.random() * 120 }}
              >
                <div className="space-y-1.5">
                  <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${60 + Math.random() * 30}%` }} />
                  {i % 3 === 0 && <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: "40%" }} />}
                </div>
              </Skeleton>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function ProfilePlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6 p-6">
      <motion.div variants={item} className="flex flex-col items-center">
        <SkeletonCircle size={72} className="mb-3" />
        <Skeleton variant="shimmer" rounded="full" className="h-5 w-32 mb-2" />
        <Skeleton variant="shimmer" rounded="full" className="h-3 w-24" />
      </motion.div>
      <motion.div variants={item} className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-16" />
            <Skeleton variant="shimmer" rounded="xl" className="h-10 w-full" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SearchPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3 px-4 py-4">
      <Skeleton variant="shimmer" rounded="xl" className="h-10 w-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div key={i} variants={item} className="flex items-center gap-3">
          <SkeletonCircle size={36} />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="shimmer" rounded="full" className="h-3.5 w-28" />
            <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: "60%" }} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function MediaPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          variants={item}
          className="aspect-square bg-gray-100 dark:bg-gray-800/50 rounded-lg overflow-hidden"
        >
          <Skeleton variant="shimmer" className="w-full h-full rounded-none" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function SettingsPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4 p-6">
      {[1, 2, 3, 4].map((i) => (
        <motion.div key={i} variants={item} className="flex items-center justify-between py-3 border-b border-[var(--border-light)] dark:border-[var(--border-default)]">
          <div className="space-y-1.5">
            <Skeleton variant="shimmer" rounded="full" className="h-3.5 w-24" />
            <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-36" />
          </div>
          <Skeleton variant="shimmer" rounded="full" className="h-6 w-11" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function NotificationPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i} variants={item} className="flex items-start gap-3 px-4 py-3">
          <SkeletonCircle size={36} />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="shimmer" rounded="full" className="h-3.5" style={{ width: `${50 + Math.random() * 30}%` }} />
            <Skeleton variant="shimmer" rounded="full" className="h-3" style={{ width: `${40 + Math.random() * 40}%` }} />
          </div>
          <Skeleton variant="shimmer" rounded="full" className="h-2.5 w-8 shrink-0 mt-1" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function GenericPlaceholder() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4 p-6">
      <motion.div variants={item} className="flex justify-center">
        <Skeleton variant="shimmer" rounded="2xl" className="h-20 w-20" />
      </motion.div>
      <motion.div variants={item} className="space-y-2 text-center">
        <Skeleton variant="shimmer" rounded="full" className="h-5 w-40 mx-auto" />
        <Skeleton variant="shimmer" rounded="full" className="h-3 w-56 mx-auto" />
      </motion.div>
      <motion.div variants={item} className="flex justify-center gap-3">
        <Skeleton variant="shimmer" rounded="xl" className="h-10 w-28" />
        <Skeleton variant="shimmer" rounded="xl" className="h-10 w-28" />
      </motion.div>
    </motion.div>
  );
}

const contextMap: Record<PlaceholderContext, React.FC> = {
  "chat-list": ChatListPlaceholder,
  "message-list": MessageListPlaceholder,
  profile: ProfilePlaceholder,
  search: SearchPlaceholder,
  media: MediaPlaceholder,
  settings: SettingsPlaceholder,
  notification: NotificationPlaceholder,
  generic: GenericPlaceholder,
};

export function SmartPlaceholder({
  context,
  message,
  className,
}: SmartPlaceholderProps) {
  const Placeholder = contextMap[context] || GenericPlaceholder;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Placeholder />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-[var(--text-tertiary)] mt-4 text-center"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
