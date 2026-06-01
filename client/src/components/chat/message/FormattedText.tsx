"use client";

import React from "react";

interface FormattedTextProps {
  text: string;
  query?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const HASHTAG_REGEX = /(#[^\s#]+)/g;
const MENTION_REGEX = /(@[^\s@]+)/g;

function formatUrls(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const tokens = text.split(URL_REGEX);
  
  tokens.forEach((token, i) => {
    if (i % 2 === 1) {
      const url = token;
      parts.push(
        <a 
          key={`url-${i}`} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#28a8e8] hover:underline"
        >
          {url}
        </a>
      );
    } else if (token) {
      parts.push(token);
    }
  });
  
  return parts;
}

function formatHashtags(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const tokens = text.split(HASHTAG_REGEX);
  
  tokens.forEach((token, i) => {
    if (i % 2 === 1) {
      parts.push(
        <span 
          key={`tag-${i}`} 
          className="text-[#28a8e8] font-medium cursor-pointer hover:underline"
        >
          {token}
        </span>
      );
    } else if (token) {
      parts.push(token);
    }
  });
  
  return parts;
}

function formatMentions(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const tokens = text.split(MENTION_REGEX);
  
  tokens.forEach((token, i) => {
    if (i % 2 === 1) {
      parts.push(
        <span 
          key={`men-${i}`} 
          className="text-[#28a8e8] font-medium cursor-pointer hover:underline"
        >
          {token}
        </span>
      );
    } else if (token) {
      parts.push(token);
    }
  });
  
  return parts;
}

export function FormattedText({ text, query = "" }: FormattedTextProps) {
  let content: (string | React.ReactElement)[] = [text];

  // 1. Handle search highlighting
  if (query.trim()) {
    const newContent: (string | React.ReactElement)[] = [];
    const regex = new RegExp(`(${query})`, "gi");
    content.forEach((part) => {
      if (typeof part === "string") {
        const subParts = part.split(regex);
        subParts.forEach((subPart, i) => {
          if (subPart.toLowerCase() === query.toLowerCase()) {
            newContent.push(
              <span key={`highlight-${i}`} className="bg-[#ffab00]/40 text-[#000000] dark:text-[#ffffff] rounded-sm px-0.5 font-normal">
                {subPart}
              </span>
            );
          } else if (subPart) {
            newContent.push(subPart);
          }
        });
      } else {
        newContent.push(part);
      }
    });
    content = newContent;
  }

  // 2. Handle dynamic text (URLs, hashtags, mentions)
  const formatDynamic = (part: string): (string | React.ReactElement)[] => {
    let parts = formatUrls(part);
    parts = parts.flatMap(p => {
      if (typeof p === 'string') return formatHashtags(p);
      return [p];
    });
    parts = parts.flatMap(p => {
      if (typeof p === 'string') return formatMentions(p);
      return [p];
    });
    return parts;
  };

  // 3. Handle Markdown-like formatting (bold, italic, code)
  const formatMarkdown = (part: string): (string | React.ReactElement)[] => {
    let parts: (string | React.ReactElement)[] = [part];

    // Bold: *text*
    let nextParts: (string | React.ReactElement)[] = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(\*[^*]+\*)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('*') && s.endsWith('*')) {
            nextParts.push(<strong key={`bold-${i}`} className="font-bold">{s.slice(1, -1)}</strong>);
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    // Italic: _text_
    nextParts = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(_[^_]+_)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('_') && s.endsWith('_')) {
            nextParts.push(<em key={`italic-${i}`} className="italic">{s.slice(1, -1)}</em>);
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    // Code: `text`
    nextParts = [];
    parts.forEach(p => {
      if (typeof p === 'string') {
        const sub = p.split(/(`[^`]+`)/g);
        sub.forEach((s, i) => {
          if (s.startsWith('`') && s.endsWith('`')) {
            nextParts.push(
              <code key={`code-${i}`} className="px-1 py-0.5 bg-[#f5f5f5] dark:bg-[#242f3d] rounded font-mono text-[0.9em] text-[#28a8e8]">
                {s.slice(1, -1)}
              </code>
            );
          } else if (s) {
            nextParts.push(s);
          }
        });
      } else {
        nextParts.push(p);
      }
    });
    parts = nextParts;

    return parts;
  };

  const finalContent: (string | React.ReactElement)[] = [];
  content.forEach(part => {
    if (typeof part === 'string') {
      const dynamicParts = formatDynamic(part);
      dynamicParts.forEach(dp => {
        if (typeof dp === 'string') {
          finalContent.push(...formatMarkdown(dp));
        } else {
          finalContent.push(dp);
        }
      });
    } else {
      finalContent.push(part);
    }
  });

  return (
    <span className="text-[15px] leading-relaxed tracking-tight break-words whitespace-pre-wrap font-sans px-3 py-1.5">
      {finalContent}
    </span>
  );
}
