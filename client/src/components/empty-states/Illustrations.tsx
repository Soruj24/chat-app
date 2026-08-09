"use client";

import { motion } from "framer-motion";

export function NoChatsIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <rect x="12" y="14" width="32" height="24" rx="6" fill="currentColor" opacity="0.15" />
        <rect x="12" y="14" width="32" height="24" rx="6" stroke="currentColor" strokeWidth="2" />
        <path d="M20 38L16 46L24 38" fill="currentColor" opacity="0.15" />
        <path d="M20 38L16 46L24 38" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="22" cy="26" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="28" cy="26" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="34" cy="26" r="2" fill="currentColor" opacity="0.3" />
      </motion.g>
      <motion.circle
        cx="48" cy="16" r="4"
        fill="currentColor" opacity="0.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </svg>
  );
}

export function NoMessagesIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <rect x="8" y="16" width="28" height="20" rx="5" fill="currentColor" opacity="0.12" />
        <rect x="8" y="16" width="28" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <path d="M14 36L10 42L18 36" fill="currentColor" opacity="0.12" />
        <path d="M14 36L10 42L18 36" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <line x1="16" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="16" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
      >
        <rect x="28" y="28" width="28" height="20" rx="5" fill="currentColor" opacity="0.08" />
        <rect x="28" y="28" width="28" height="20" rx="5" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="42" cy="38" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />
        <line x1="39" y1="38" x2="45" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </motion.g>
    </svg>
  );
}

export function NoSearchResultsIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <circle cx="28" cy="28" r="14" fill="currentColor" opacity="0.08" />
        <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="2.5" />
        <line x1="38" y1="38" x2="50" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        style={{ transformOrigin: "28px 28px" }}
      >
        <line x1="22" y1="22" x2="34" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="34" y1="22" x2="22" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </motion.g>
      <motion.circle
        cx="46" cy="14" r="3"
        fill="currentColor" opacity="0.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </svg>
  );
}

export function NoNotificationsIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <path
          d="M32 8C32 8 18 12 18 28V40L12 48H52L46 40V28C46 12 32 8 32 8Z"
          fill="currentColor" opacity="0.1"
        />
        <path
          d="M32 8C32 8 18 12 18 28V40L12 48H52L46 40V28C46 12 32 8 32 8Z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
        />
        <path d="M26 48C26 51.3137 28.6863 54 32 54C35.3137 54 38 51.3137 38 48" stroke="currentColor" strokeWidth="2" />
      </motion.g>
      <motion.g
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <line x1="30" y1="24" x2="30" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="34" y1="28" x2="34" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      </motion.g>
    </svg>
  );
}

export function NoFilesIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <rect x="14" y="8" width="36" height="48" rx="4" fill="currentColor" opacity="0.08" />
        <rect x="14" y="8" width="36" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M14 20H50" stroke="currentColor" strokeWidth="2" opacity="0.2" />
        <rect x="22" y="28" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
        <rect x="22" y="35" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.15" />
        <rect x="22" y="42" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.1" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
        style={{ transformOrigin: "45px 9px" }}
      >
        <path
          d="M40 4L50 14H44C41.7909 14 40 12.2091 40 10V4Z"
          fill="currentColor" opacity="0.15"
        />
        <path
          d="M40 4L50 14H44C41.7909 14 40 12.2091 40 10V4Z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

export function NoInternetIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <circle cx="32" cy="32" r="20" fill="currentColor" opacity="0.06" />
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
        <path
          d="M18 20C22.5 16 27 14 32 14C37 14 41.5 16 46 20"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"
        />
        <path
          d="M22 26C25 23.5 28.5 22 32 22C35.5 22 39 23.5 42 26"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"
        />
        <path
          d="M26 32C28 30.5 30 30 32 30C34 30 36 30.5 38 32"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"
        />
        <circle cx="32" cy="36" r="2" fill="currentColor" opacity="0.6" />
      </motion.g>
      <motion.line
        x1="16" y1="48" x2="48" y2="16"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </svg>
  );
}

export function NoWorkspaceIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <rect x="8" y="18" width="48" height="32" rx="6" fill="currentColor" opacity="0.08" />
        <rect x="8" y="18" width="48" height="32" rx="6" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="18" width="48" height="10" rx="6" fill="currentColor" opacity="0.06" />
        <path d="M8 28H56" stroke="currentColor" strokeWidth="2" opacity="0.15" />
        <circle cx="16" cy="23" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="22" cy="23" r="2" fill="currentColor" opacity="0.2" />
        <circle cx="28" cy="23" r="2" fill="currentColor" opacity="0.15" />
      </motion.g>
      <motion.g
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
        style={{ transformOrigin: "32px 40px" }}
      >
        <rect x="24" y="34" width="16" height="12" rx="3" fill="currentColor" opacity="0.1" />
        <rect x="24" y="34" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="28" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </motion.g>
    </svg>
  );
}

export function LoadingStateIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={20 + i * 8}
          cy="32"
          r="3"
          fill="currentColor"
          animate={{
            y: [0, -8, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut" as const,
          }}
        />
      ))}
      <motion.path
        d="M16 44C16 44 24 48 32 48C40 48 48 44 48 44"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </svg>
  );
}

export function ErrorIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <circle cx="32" cy="32" r="22" fill="currentColor" opacity="0.08" />
        <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2" />
        <path
          d="M32 20V36"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="32" cy="44" r="2.5" fill="currentColor" opacity="0.8" />
      </motion.g>
      <motion.g
        animate={{ x: [-1, 1, -1] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <line x1="20" y1="20" x2="26" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        <line x1="44" y1="20" x2="38" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </motion.g>
    </svg>
  );
}
