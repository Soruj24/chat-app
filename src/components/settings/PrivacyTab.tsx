"use client";

import { ChevronRight } from "lucide-react";

export function PrivacyTab() {
  const items = [
    { label: "Last Seen", value: "Everyone" },
    { label: "Profile Photo", value: "Contacts Only" },
    { label: "Read Receipts", value: "Enabled" },
    { label: "Two-Factor Authentication", value: "Disabled" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.map((item, i) => (
        <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</h4>
            <p className="text-xs text-blue-600 font-medium">{item.value}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
