"use client";

import { Message } from "@/lib/types";
import { ImageMessage } from "./ImageMessage";
import { VideoMessage } from "./VideoMessage";
import { VoiceMessage } from "./VoiceMessage";
import { FileIcon, MapPin, User } from "lucide-react";
import React from "react";
import { FormattedText } from "./FormattedText";

interface MessageContentProps {
  message: Message;
  isMe: boolean;
  highlight?: string;
  onImageClick?: (url: string) => void;
  themeColor?: string;
}

export function MessageContent({ message, isMe, highlight, onImageClick, themeColor }: MessageContentProps) {
  return (
    <>
      {/* Media Content */}
      {message.type === "image" && message.mediaUrl && (
        <ImageMessage 
          url={message.mediaUrl} 
          onClick={() => onImageClick?.(message.mediaUrl!)} 
        />
      )}

      {message.type === "video" && message.mediaUrl && (
        <VideoMessage url={message.mediaUrl} />
      )}

      {message.type === "file" && (
        <a 
          href={message.mediaUrl} 
          download={message.fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <FileIcon className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-blue-500 transition-colors">
              {message.fileName || "Unnamed File"}
            </p>
            <p className="text-[10px] opacity-70 uppercase">
              {message.fileSize || "Unknown Size"}
            </p>
          </div>
        </a>
      )}

      {message.type === "voice" && (
        <VoiceMessage 
          url={message.mediaUrl}
          duration={message.duration || "0:00"} 
          messageId={message.id} 
          isMe={isMe} 
          themeColor={themeColor}
        />
      )}

      {message.type === "location" && message.location && (
        <div className="p-3">
          <a 
            href={`https://www.google.com/maps?q=${message.location.latitude},${message.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 group"
          >
            <div className="relative h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
              <MapPin className="w-8 h-8 text-green-500 animate-bounce" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="p-1.5 bg-green-500/10 rounded-lg shrink-0"
                style={!isMe && themeColor ? { backgroundColor: `${themeColor}20` } : {}}
              >
                <MapPin 
                  className="w-4 h-4 text-green-500" 
                  style={!isMe && themeColor ? { color: themeColor } : {}}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span 
                  className="text-sm font-medium text-blue-500 hover:underline block truncate"
                  style={!isMe && themeColor ? { color: themeColor } : {}}
                >
                  {message.location.address || "View Location"}
                </span>
                {message.location.address && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">
                    {message.location.latitude.toFixed(4)}, {message.location.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </a>
        </div>
      )}

      {message.type === "contact" && message.contact && (
        <div className="p-3 min-w-[200px]">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{message.contact.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{message.contact.phoneNumber}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${message.contact?.name}\nTEL:${message.contact?.phoneNumber}\nEND:VCARD`;
              const blob = new Blob([vcard], { type: 'text/vcard' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `${message.contact?.name}.vcf`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="w-full mt-2 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors border border-orange-100 dark:border-orange-900/30"
          >
            Save Contact
          </button>
        </div>
      )}

      {/* Text Content */}
      {message.text && (
        <div className="p-3 pb-1">
          <FormattedText text={message.text} query={highlight} />
        </div>
      )}
    </>
  );
}
