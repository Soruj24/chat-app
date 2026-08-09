"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { SidebarProfile } from "./sidebar/SidebarProfile";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarFilters } from "./sidebar/SidebarFilters";
import { SidebarChatList } from "./sidebar/SidebarChatList";
import { SidebarSearchResults } from "./sidebar/SidebarSearchResults";
import { OnlineUsers } from "./sidebar/OnlineUsers";
import { SettingsModal } from "./chat/SettingsModal";
import { NewGroupModal } from "./chat/NewGroupModal";
import { useSidebar } from "@/hooks/useSidebar";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  const activeId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : undefined;

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups" | "archived">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Sidebar data
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

  // Close mobile sidebar when navigating to a chat
  useEffect(() => {
    if (activeId && isMobile) {
      setMobileOpen(false);
    }
  }, [activeId, isMobile]);

  // Close mobile sidebar on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  if (pathname === "/auth") return null;

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const sidebarContent = (
    <>
      {/* Profile section */}
      <SidebarProfile
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onNewGroupOpen={() => setIsNewGroupOpen(true)}
      />

      {/* Search */}
      <SidebarSearch
        value={searchQuery}
        onChange={(val) => {
          setSearchQuery(val);
          setIsSearching(val.length > 0);
        }}
        onClear={clearSearch}
      />

      {/* Filters (only when not searching) */}
      {!isSearching && (
        <SidebarFilters activeFilter={filter} onFilterChange={setFilter} />
      )}

      {/* Online Users (only when not searching and has users) */}
      {!isSearching && allUsers.length > 0 && (
        <OnlineUsers users={allUsers} />
      )}

      {/* Divider */}
      {!isSearching && <div className="h-px bg-[var(--sidebar-border)] mx-3" />}

      {/* Chat list or search results */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {isSearching ? (
          <SidebarSearchResults results={searchResults} activeId={activeId} />
        ) : (
          <SidebarChatList
            pinnedChats={pinnedChats}
            otherChats={otherChats}
            activeId={activeId}
            loading={loadingChats}
            filter={filter}
            onPin={handleTogglePin}
            onMute={handleToggleMute}
            onArchive={handleToggleArchive}
            onDelete={handleDeleteChat}
          />
        )}
      </div>
    </>
  );

  // Desktop sidebar
  if (!isMobile) {
    return (
      <>
        <aside
          className="w-[var(--sidebar-width)] h-screen flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shrink-0 shadow-[var(--elevation-1)]"
          style={{ width: "var(--sidebar-width)" }}
        >
          {sidebarContent}
        </aside>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
      </>
    );
  }

  // Mobile sidebar with hamburger trigger and drawer
  return (
    <>
      {/* Hamburger button - fixed on mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-xl bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        <motion.div
          animate={mobileOpen ? "open" : "closed"}
          className="w-5 h-4 flex flex-col justify-between"
        >
          <motion.span
            variants={{
              open: { rotate: 45, y: 6 },
              closed: { rotate: 0, y: 0 },
            }}
            className="w-full h-0.5 bg-[var(--sidebar-text)] block origin-center"
          />
          <motion.span
            variants={{
              open: { opacity: 0 },
              closed: { opacity: 1 },
            }}
            className="w-full h-0.5 bg-[var(--sidebar-text)] block"
          />
          <motion.span
            variants={{
              open: { rotate: -45, y: -6 },
              closed: { rotate: 0, y: 0 },
            }}
            className="w-full h-0.5 bg-[var(--sidebar-text)] block origin-center"
          />
        </motion.div>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 sidebar-overlay md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[360px] flex flex-col bg-[var(--sidebar-bg)] shadow-2xl md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
    </>
  );
}
