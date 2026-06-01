"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarFilters } from "./sidebar/SidebarFilters";
import { SettingsModal } from "./chat/SettingsModal";
import { NewGroupModal } from "./chat/NewGroupModal";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { SidebarSearchResults } from "./sidebar/SidebarSearchResults";
import { SidebarChatList } from "./sidebar/SidebarChatList";
import { useSidebar } from "@/hooks/useSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const { activeChatId } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeId = pathname?.startsWith('/chat/') ? pathname.split('/')[2] : undefined;
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups" | "archived">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  
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

  if (pathname === '/auth') return null;

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <aside className={cn(
      "w-full md:w-[380px] lg:w-[400px] h-screen flex flex-col bg-[#ffffff] dark:bg-[#0f0f0f] border-r border-[#e6e8ec] dark:border-[#2b3142] transition-all overflow-hidden",
      "before:absolute before:top-0 before:left-0 before:right-0 before:h-2 before:bg-gradient-to-b before:from-[#5eb2f6]/20 before:to-transparent",
      activeId ? "hidden md:flex" : "flex"
    )}>
      {/* Sidebar Header Section */}
      <div className="p-3 flex flex-col gap-3 bg-[#ffffff] dark:bg-[#0f0f0f] sticky top-0 z-10">
        <div className="flex items-center gap-3 px-3 pt-2">
          <h1 className="text-xl font-bold text-[#000000] dark:text-[#ffffff] tracking-tight">Messages</h1>
        </div>
        
        <SidebarHeader 
          mounted={mounted}
          theme={theme}
          setTheme={setTheme}
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onNewGroupOpen={() => setIsNewGroupOpen(true)}
        />

        <div className="px-2">
          <SidebarSearch 
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setIsSearching(val.length > 0);
            }}
            onClear={clearSearch}
          />
        </div>

        {!isSearching && (
          <SidebarFilters 
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        )}
      </div>

      {/* Main Content Area - Telegram-style chat list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f5f5f5] dark:bg-[#18222d]">
        {isSearching ? (
          <SidebarSearchResults results={searchResults} activeId={activeId} />
        ) : (
          <SidebarChatList 
            pinnedChats={pinnedChats}
            otherChats={otherChats}
            allUsers={allUsers}
            activeId={activeId}
            loading={loadingChats}
            onPin={handleTogglePin}
            onMute={handleToggleMute}
            onArchive={handleToggleArchive}
            onDelete={handleDeleteChat}
          />
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewGroupModal isOpen={isNewGroupOpen} onClose={() => setIsNewGroupOpen(false)} />
    </aside>
  );
}
