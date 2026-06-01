"use client";

import { useState } from "react";
import { X, FileText, File, Download, Eye, Image as ImageIcon, Video, Music, FileQuestion } from "lucide-react";
import Image from "next/image";

interface FilePreviewProps {
  file: {
    url: string;
    name: string;
    type: string;
    size?: number;
  };
  onClose: () => void;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type.includes("pdf") || type.includes("document") || type.includes("word")) return FileText;
  return File;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const isImage = file.type.startsWith("image/");
  const FileIcon = getFileIcon(file.type);

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000]/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#ffffff] dark:bg-[#18222d] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6e8ec] dark:border-[#2b3142]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#effdde] dark:bg-[#2b4a40] flex items-center justify-center flex-shrink-0">
              <FileIcon className="w-5 h-5 text-[#34c759]" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#000000] dark:text-[#ffffff] truncate max-w-[250px]">
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-[#8e8e93]">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={file.url}
              download={file.name}
              className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[#2b3142] rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-[#000000] dark:text-[#ffffff]" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#f5f5f5] dark:hover:bg-[#2b3142] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#000000] dark:text-[#ffffff]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {isImage ? (
            <div className="flex items-center justify-center">
              <Image
                src={file.url}
                alt={file.name}
                width={800}
                height={600}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                onLoad={() => setIsLoading(false)}
                unoptimized
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 rounded-2xl bg-[#f5f5f5] dark:bg-[#242f3d] flex items-center justify-center mb-4">
                <FileIcon className="w-12 h-12 text-[#8e8e93]" />
              </div>
              <p className="text-[#000000] dark:text-[#ffffff] mb-4">
                Preview not available
              </p>
              <a
                href={file.url}
                download={file.name}
                className="flex items-center gap-2 px-4 py-2 bg-[#28a8e8] text-white rounded-lg hover:bg-[#1a99e0] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}