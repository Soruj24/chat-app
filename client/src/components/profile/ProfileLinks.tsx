"use client";

import { motion } from "framer-motion";
import { Link2, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileLinksProps {
  links: {
    id: string;
    url: string;
    title: string;
    description?: string;
    timestamp: string;
  }[];
}

function getDomainFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

export function ProfileLinks({ links }: ProfileLinksProps) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
          <Link2 className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No shared links yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Links will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link, i) => {
        const favicon = getDomainFavicon(link.url);
        let domain = "";
        try {
          domain = new URL(link.url).hostname;
        } catch {
          domain = link.url;
        }

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 mt-0.5">
              {favicon ? (
                <img
                  src={favicon}
                  alt=""
                  className="w-4 h-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Globe className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                {link.title || link.url}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {domain}
              </p>
              {link.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                  {link.description}
                </p>
              )}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition-colors shrink-0 mt-1" />
          </motion.a>
        );
      })}
    </div>
  );
}
