"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Image, FileText, Film, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  onSend: () => void;
  onCancel: () => void;
}

export function ImagePreview({ files, onRemove, onSend, onCancel }: ImagePreviewProps) {
  if (files.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Film;
    if (type.startsWith("audio/")) return Music;
    return FileText;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <AnimatePresence>
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="overflow-hidden"
        >
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 p-2 bg-[var(--composer-bg)] rounded-xl border border-[var(--border-default)]">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  const preview = getFilePreview(file);

                  return (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative shrink-0 group"
                    >
                      {preview ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-1">
                          <FileIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
                          <span className="text-[8px] text-[var(--text-tertiary)] font-medium truncate max-w-[56px]">
                            {file.name.split(".").pop()?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => onRemove(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 rounded-b-lg">
                        <p className="text-[8px] text-white font-medium truncate">
                          {file.name}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-[var(--border-default)]">
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-danger)]/10 text-[var(--text-tertiary)] hover:text-[var(--color-danger)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSend}
                  className="p-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
