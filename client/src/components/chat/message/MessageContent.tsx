"use client";

import { Message } from "@/lib/types";
import { ImageMessage } from "./ImageMessage";
import { VideoMessage } from "./VideoMessage";
import { VoiceMessage } from "./VoiceMessage";
import { FileIcon, MapPin, User, Download } from "lucide-react";
import React from "react";
import { FormattedText } from "./FormattedText";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  message: Message;
  isMe: boolean;
  highlight?: string;
  onImageClick?: (url: string) => void;
  themeColor?: string;
  fontSize?: "small" | "medium" | "large";
}

export function MessageContent({
  message,
  isMe,
  highlight,
  onImageClick,
  themeColor,
  fontSize = "medium",
}: MessageContentProps) {
  const fontSizeClass = {
    small: "text-[13px]",
    medium: "text-[14px]",
    large: "text-[15px]",
  }[fontSize];

  // Image message
  if (message.type === "image" && message.mediaUrl) {
    return (
      <ImageMessage
        message={message}
        isMe={isMe}
        onImageClick={onImageClick}
      />
    );
  }

  // Video message
  if (message.type === "video" && message.mediaUrl) {
    return <VideoMessage url={message.mediaUrl} isMe={isMe} />;
  }

  // Voice message
  if (message.type === "voice") {
    return (
      <VoiceMessage
        url={message.mediaUrl}
        duration={message.duration || "0:00"}
        messageId={message.id}
        isMe={isMe}
        themeColor={themeColor}
      />
    );
  }

  // File message
  if (message.type === "file") {
    return (
      <div className="p-3">
        <a
          href={message.mediaUrl}
          download={message.fileName || "file"}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group max-w-[320px]",
            isMe
              ? "bg-white/10 hover:bg-white/15"
              : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700/50"
          )}
        >
          <div
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              isMe
                ? "bg-white/20 text-white"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
            )}
          >
            <FileIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("font-semibold truncate text-sm", fontSizeClass, isMe ? "text-white" : "text-gray-900 dark:text-gray-100")}>
              {message.fileName || "File"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {message.fileSize && message.fileSize !== "Size Unknown" && (
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {message.fileSize}
                </span>
              )}
              <span className="text-[10px] font-semibold text-blue-500 dark:text-blue-400">
                Download
              </span>
            </div>
          </div>
          <Download className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isMe ? "text-white/60" : "text-gray-400")} />
        </a>
      </div>
    );
  }

  // Location message
  if (message.type === "location" && message.location) {
    return (
      <div className="p-3">
        <a
          href={`https://www.google.com/maps?q=${message.location.latitude},${message.location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-2 group"
        >
          <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
            <MapPin className="w-8 h-8 text-green-500 relative z-10" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/10 rounded-lg shrink-0">
              <MapPin className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <span className={cn("font-medium text-blue-500 hover:underline block truncate text-sm", fontSizeClass)}>
                {message.location.address || "View Location"}
              </span>
              {message.location.address && (
                <span className="text-[10px] text-gray-400 block truncate">
                  {message.location.latitude.toFixed(4)}, {message.location.longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </a>
      </div>
    );
  }

  // Contact message
  if (message.type === "contact" && message.contact) {
    return (
      <div className="p-3 min-w-[220px]">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <div className="w-11 h-11 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("font-bold truncate text-sm", fontSizeClass)}>{message.contact.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.contact.phoneNumber}</p>
          </div>
        </div>
        <button
          onClick={() => {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${message.contact?.name}\nTEL:${message.contact?.phoneNumber}\nEND:VCARD`;
            const blob = new Blob([vcard], { type: "text/vcard" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${message.contact?.name}.vcf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="w-full mt-2 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors border border-orange-100 dark:border-orange-900/30"
        >
          Save Contact
        </button>
      </div>
    );
  }

  // Text message
  if (message.text) {
    return (
      <div className={cn("px-3.5 py-2 break-words", fontSizeClass)}>
        <FormattedText text={message.text} query={highlight} />
      </div>
    );
  }

  return null;
}
