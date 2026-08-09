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
import { MessageSquare, Users, Search, Settings, Plus } from "lucide-react";
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
  const params = useParams();
  const pathname = usePathname();
  const { activeChatId } = useSelector((state: RootState) => state.chat);
  const mode = useBreakpointMode();

  const activeId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : undefined;

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups" | "archived">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubView, setMobileSubView] = useState<"chats" | "search" | "settings">("chats");

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
    if (activeId && mode === "mobile") {
      setMobileOpen(false);
    }
  }, [activeId, mode]);

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

  // ─── Collapsed sidebar (tablet: 768-1023px) ───────────────────────────
  if (mode === "tablet") {
    return (
      <>
        <aside className="app-sidebar flex flex-col items-center py-3 gap-1 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]">
          {/* User avatar */}
          <CollapsedSidebarAvatar onSettingsOpen={() => setIsSettingsOpen(true)} />

          <div className="h-px bg-[var(--sidebar-border)] w-8 my-2" />

          {/* Icon-only nav */}
          <CollapsedIconButton
            icon={<MessageSquare className="w-5 h-5" />}
            label="Chats"
            active={pathname === "/"}
            onClick={() => {}}
          />
          <CollapsedIconButton
            icon={<Search className="w-5 h-5" />}
            label="Search"
            active={isSearching}
            onClick={() => setIsSearching(!isSearching)}
          />
          <CollapsedIconButton
            icon={<Users className="w-5 h-5" />}
            label="New Group"
            onClick={() => setIsNewGroupOpen(true)}
          />

          <div className="flex-1" />

          <CollapsedIconButton
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

  // ─── Desktop sidebar (>=1024px) ───────────────────────────────────────
  if (mode === "desktop") {
    const sidebarContent = (
      <>
        <SidebarProfile
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
        {!isSearching && allUsers.length > 0 && (
          <OnlineUsers users={allUsers} />
        )}
        {!isSearching && <div className="h-px bg-[var(--sidebar-border)] mx-3" />}
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

    return (
      <>
        <aside className="app-sidebar flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-[var(--elevation-1)]">
          {sidebarContent}
        </aside>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
      </>
    );
  }

  // ─── Mobile sidebar (<768px): hamburger + drawer ───────────────────────
  const mobileSidebarContent = (
    <>
      <SidebarProfile
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
      {!isSearching && allUsers.length > 0 && (
        <OnlineUsers users={allUsers} />
      )}
      {!isSearching && <div className="h-px bg-[var(--sidebar-border)] mx-3" />}
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

  return (
    <>
      {/* Hamburger button */}
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
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
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
            {mobileSidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
    </>
  );
}

// ─── Collapsed sidebar sub-components ──────────────────────────────────────

function CollapsedSidebarAvatar({ onSettingsOpen }: { onSettingsOpen: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSettingsOpen}
      className="relative w-10 h-10 shrink-0 rounded-[var(--radius-xl)] overflow-hidden ring-2 ring-[var(--border-default)] hover:ring-[var(--accent)] transition-all duration-200"
    >
      {user?.avatar && user.avatar.trim() ? (
        <img
          src={user.avatar}
          alt={user.name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
      )}
    </motion.button>
  );
}

function CollapsedIconButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={label}
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-200",
        active
          ? "bg-[var(--accent-light)] text-[var(--accent)]"
          : "text-[var(--sidebar-text-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
      )}
    >
      {icon}
    </motion.button>
  );
}
