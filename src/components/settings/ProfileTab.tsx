"use client";

import { Camera } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

export function ProfileTab() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Image
            src={"/default-avatar.png"}
            alt={user.name}
            className="w-24 h-24 rounded-full ring-4 ring-blue-500/10 shadow-xl object-cover"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-90">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
          <input 
            type="text" 
            defaultValue={user.name}
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Bio</label>
          <textarea 
            defaultValue={(user as { bio?: string }).bio || ""}
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
