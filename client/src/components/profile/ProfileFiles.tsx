"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileFilesProps {
  files: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    timestamp: string;
  }[];
}

const FILE_ICONS: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
  doc: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  docx: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  xls: { icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  xlsx: { icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  ppt: { icon: FileSpreadsheet, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  pptx: { icon: FileSpreadsheet, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  jpg: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  jpeg: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  png: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  mp4: { icon: FileVideo, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
  mp3: { icon: FileAudio, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  zip: { icon: File, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
};

function getFileConfig(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || { icon: File, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-800" };
}

export function ProfileFiles({ files }: ProfileFilesProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No shared files yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Documents will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file, i) => {
        const config = getFileConfig(file.name);
        const Icon = config.icon;

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
          >
            <div className={cn("p-2 rounded-xl", config.bg)}>
              <Icon className={cn("w-4 h-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {file.size} · {new Date(file.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
