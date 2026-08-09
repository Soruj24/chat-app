"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSidebar } from "@/hooks/useSidebar";
import { SettingsModal } from "./chat/SettingsModal";
import { NewGroupModal } from "./chat/NewGroupModal";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarFilters } from "./sidebar/SidebarFilters";
import { ConversationList } from "./sidebar/ConversationList";
import { SidebarEmptyState } from "./sidebar/SidebarEmptyState";
import { ChatListSkeleton } from "./sidebar/ChatListSkeleton";
import { X, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type BreakpointMode = "mobile" | "tablet" | "desktop";

function useBreakpointMode(): BreakpointMode {
  const [mode, setMode] = useState<BreakpointMode>("desktop");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setMode("mobile");
      else if (w < 1024) setMode("tablet");
      else setMode("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const mode = useBreakpointMode();
  const activeId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups" | "archived">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    searchResults,
    allUsers,
    pinnedChats,
    otherChats,
    loadingChats,
    handleTogglePin,
    handleToggleArchive,
    handleToggleMute,
    handleDeleteChat,
  } = useSidebar(searchQuery, filter);

  useEffect(() => {
    if (activeId && mode === "mobile") setMobileOpen(false);
  }, [activeId, mode]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  if (pathname === "/auth") return null;

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const hasChats = pinnedChats.length > 0 || otherChats.length > 0;
  const showLoading = loadingChats && !isSearching;
  const showEmpty = !hasChats && !isSearching && !loadingChats;
  const showSearchResults = isSearching;

  const sidebarContent = (
    <>
      <SidebarHeader
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onNewGroupOpen={() => setIsNewGroupOpen(true)}
      />

      <SidebarSearch
        value={searchQuery}
        onChange={(val) => {
          setSearchQuery(val);
          setIsSearching(val.length > 0);
        }}
        onClear={clearSearch}
      />

      {!isSearching && (
        <SidebarFilters activeFilter={filter} onFilterChange={setFilter} />
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {showLoading && <ChatListSkeleton />}
        {showEmpty && <SidebarEmptyState filter={filter} />}
        {showSearchResults ? (
          <ConversationList
            chats={searchResults.chats}
            activeId={activeId}
            onPin={handleTogglePin}
            onMute={handleToggleMute}
            onArchive={handleToggleArchive}
            onDelete={handleDeleteChat}
            searchMode
          />
        ) : (
          <ConversationList
            pinnedChats={pinnedChats}
            otherChats={otherChats}
            activeId={activeId}
            onPin={handleTogglePin}
            onMute={handleToggleMute}
            onArchive={handleToggleArchive}
            onDelete={handleDeleteChat}
          />
        )}
      </div>
    </>
  );

  // Desktop
  if (mode === "desktop") {
    return (
      <>
        <aside className="app-sidebar flex flex-col bg-[var(--background)] border-r border-[var(--border-ds)]">
          {sidebarContent}
        </aside>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
      </>
    );
  }

  // Tablet (collapsed)
  if (mode === "tablet") {
    return (
      <>
        <aside className="app-sidebar flex flex-col items-center py-3 gap-1 bg-[var(--background)] border-r border-[var(--border-ds)]">
          <TabletAvatar onSettingsOpen={() => setIsSettingsOpen(true)} />
          <div className="h-px bg-[var(--border-ds)] w-8 my-2" />
          <TabletIconButton
            icon={<MessageSquarePlus className="w-5 h-5" />}
            label="New Chat"
            onClick={() => setIsNewGroupOpen(true)}
          />
          <div className="flex-1" />
          <TabletIconButton
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            onClick={() => setIsSettingsOpen(true)}
          />
        </aside>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
      </>
    );
  }

  // Mobile
  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-[var(--radius-ds)] bg-[var(--background)] border border-[var(--border-ds)] shadow-[var(--shadow-md)] md:hidden"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-[400px] flex flex-col bg-[var(--background)] shadow-[var(--shadow-2xl)] md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-ds)]">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Chats</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-[var(--radius-ds)] hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
    </>
  );
}

// Tablet collapsed sub-components
import { Settings } from "lucide-react";
import { useSelector as useReduxSelector } from "react-redux";

function TabletAvatar({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  const { user } = useReduxSelector((state: RootState) => state.auth);
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <button
      onClick={onSettingsOpen}
      className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-[var(--border-ds)] hover:ring-[var(--primary)] transition-all duration-200"
    >
      {user?.avatar && user.avatar.trim() ? (
        <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
      )}
    </button>
  );
}

function TabletIconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-ds)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-200"
    >
      {icon}
    </button>
  );
}
