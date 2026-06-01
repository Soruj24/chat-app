"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function TopBar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  if (pathname === "/auth") return null;

  return (
    <div className="h-12 px-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          {user?.name
            ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
            : "U"}
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {user?.name || "User"}
          </span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}