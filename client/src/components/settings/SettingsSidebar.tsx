"use client";

import { LogOut, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  menuItems: readonly MenuItem[];
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
  onClose,
  menuItems,
}: SettingsSidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  return (
    <div className="w-full md:w-64 bg-[var(--surface-secondary)] border-r border-[var(--border-default)] p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-[var(--fg)] tracking-tight">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 md:hidden hover:bg-[var(--surface-hover)] rounded-[var(--radius-lg)] transition-all duration-200 text-[var(--fg-tertiary)] hover:text-[var(--fg)] active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] text-sm font-semibold transition-all duration-200",
                isActive
                  ? "text-white shadow-[var(--shadow-md)]"
                  : "text-[var(--fg-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)]"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: "var(--accent)",
                      boxShadow: "0 4px 16px var(--accent)33",
                    }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-[var(--danger)] hover:bg-[var(--danger-light)] rounded-[var(--radius-lg)] text-sm font-semibold transition-all duration-200 mt-auto active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
