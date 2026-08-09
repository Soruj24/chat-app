import {
  NoChatsIllustration,
  NoMessagesIllustration,
  NoSearchResultsIllustration,
  NoNotificationsIllustration,
  NoFilesIllustration,
  NoInternetIllustration,
  NoWorkspaceIllustration,
  LoadingStateIllustration,
  ErrorIllustration,
} from "./Illustrations";
import type { ReactNode } from "react";

export interface EmptyStatePreset {
  illustration: ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
  };
}

export const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="7" cy="7" r="4" />
    <line x1="10" y1="10" x2="13" y2="13" />
  </svg>
);

export const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 8a6 6 0 0111.5-2.5" />
    <path d="M14 8a6 6 0 01-11.5 2.5" />
    <polyline points="2 3 2 7 6 7" />
    <polyline points="14 13 14 9 10 9" />
  </svg>
);

export const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9" />
    <path d="M14 2L10 14L7 9L2 6L14 2Z" />
  </svg>
);

export const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 10V2" />
    <polyline points="4 5 8 2 12 5" />
    <line x1="3" y1="14" x2="13" y2="14" />
  </svg>
);

export const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6L8 2L14 6V13A1 1 0 0113 14H3A1 1 0 012 13V6Z" />
    <path d="M6 14V8H10V14" />
  </svg>
);

export const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1V3M8 13V15M1 8H3M13 8H15M2.93 2.93L4.34 4.34M11.66 11.66L13.07 13.07M13.07 2.93L11.66 4.34M4.34 11.66L2.93 13.07" />
  </svg>
);

export const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 11V7a2 2 0 014 0v4" />
    <path d="M3 11h10l-1.5-5.5A3.5 3.5 0 008 2.5a3.5 3.5 0 00-3.5 3L3 11z" />
    <line x1="6" y1="14" x2="10" y2="14" />
  </svg>
);

export const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4V12A1 1 0 003 13H13A1 1 0 0014 12V6A1 1 0 0013 5H8L6.5 3H3A1 1 0 002 4Z" />
  </svg>
);

export const WifiOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="2" x2="14" y2="14" />
    <path d="M4.83 4.83A4.5 4.5 0 018 3.5a4.5 4.5 0 013.17 1.33" />
    <path d="M6.59 6.59A2 2 0 018 6a2 2 0 011.41.59" />
    <circle cx="8" cy="10" r="1" />
  </svg>
);

export const InboxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8L4.5 4H11.5L14 8V13A1 1 0 0113 14H3A1 1 0 012 13V8Z" />
    <path d="M6 8H10" />
  </svg>
);

export function noChats(onCompose?: () => void): EmptyStatePreset {
  return {
    illustration: <NoChatsIllustration />,
    title: "No conversations yet",
    description: "Start a new conversation by composing a message or finding someone to chat with.",
    primaryAction: {
      label: "New Conversation",
      onClick: onCompose,
      icon: <SendIcon />,
    },
    secondaryAction: {
      label: "Find People",
      icon: <SearchIcon />,
      variant: "secondary",
    },
  };
}

export function noArchivedChats(): EmptyStatePreset {
  return {
    illustration: <NoChatsIllustration />,
    title: "No archived chats",
    description: "Archived conversations will appear here. Long-press a chat to archive it.",
    secondaryAction: {
      label: "Back to Chats",
      variant: "ghost",
    },
  };
}

export function noMessages(onSend?: () => void): EmptyStatePreset {
  return {
    illustration: <NoMessagesIllustration />,
    title: "No messages yet",
    description: "Say hello! Your conversation will appear here once you send a message.",
    primaryAction: {
      label: "Send a Message",
      onClick: onSend,
      icon: <SendIcon />,
    },
  };
}

export function noSearchResults(onClear?: () => void): EmptyStatePreset {
  return {
    illustration: <NoSearchResultsIllustration />,
    title: "No results found",
    description: "We couldn't find anything matching your search. Try different keywords.",
    primaryAction: {
      label: "Clear Search",
      onClick: onClear,
      variant: "secondary",
    },
  };
}

export function noNotifications(onSettings?: () => void): EmptyStatePreset {
  return {
    illustration: <NoNotificationsIllustration />,
    title: "All caught up",
    description: "No new notifications. We'll let you know when something needs your attention.",
    secondaryAction: {
      label: "Notification Settings",
      onClick: onSettings,
      icon: <SettingsIcon />,
      variant: "ghost",
    },
  };
}

export function noFiles(onUpload?: () => void): EmptyStatePreset {
  return {
    illustration: <NoFilesIllustration />,
    title: "No files shared yet",
    description: "Files shared in this conversation will appear here. Drag and drop or tap to share.",
    primaryAction: {
      label: "Share a File",
      onClick: onUpload,
      icon: <UploadIcon />,
    },
    secondaryAction: {
      label: "Browse Files",
      icon: <FolderIcon />,
      variant: "secondary",
    },
  };
}

export function noInternet(onRetry?: () => void): EmptyStatePreset {
  return {
    illustration: <NoInternetIllustration />,
    title: "No internet connection",
    description: "Check your network settings and try again. Messages will be sent when you're back online.",
    primaryAction: {
      label: "Try Again",
      onClick: onRetry,
      icon: <RefreshIcon />,
    },
    secondaryAction: {
      label: "Network Settings",
      icon: <WifiOffIcon />,
      variant: "ghost",
    },
  };
}

export function noWorkspace(onCreate?: () => void): EmptyStatePreset {
  return {
    illustration: <NoWorkspaceIllustration />,
    title: "No workspace yet",
    description: "Create a workspace to organize your team chats, channels, and files in one place.",
    primaryAction: {
      label: "Create Workspace",
      onClick: onCreate,
      icon: <PlusIcon />,
    },
    secondaryAction: {
      label: "Learn More",
      variant: "ghost",
    },
  };
}

export function loading(): EmptyStatePreset {
  return {
    illustration: <LoadingStateIllustration />,
    title: "Loading...",
    description: "Hang tight while we prepare everything for you.",
  };
}

export function error(onRetry?: () => void): EmptyStatePreset {
  return {
    illustration: <ErrorIllustration />,
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again or contact support if the problem persists.",
    primaryAction: {
      label: "Try Again",
      onClick: onRetry,
      icon: <RefreshIcon />,
    },
    secondaryAction: {
      label: "Go Home",
      icon: <HomeIcon />,
      variant: "secondary",
    },
  };
}
