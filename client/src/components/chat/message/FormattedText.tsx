"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface FormattedTextProps {
  text: string;
  query?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const HASHTAG_REGEX = /(#[^\s#]+)/g;
const MENTION_REGEX = /(@[^\s@]+)/g;
const BOLD_REGEX = /\*\*(.+?)\*\*/g;
const ITALIC_REGEX = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
const STRIKETHROUGH_REGEX = /~~(.+?)~~/g;
const INLINE_CODE_REGEX = /`([^`]+)`/g;
const CODE_BLOCK_REGEX = /```(\w*)\n?([\s\S]*?)```/g;

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 bg-[#1e1e2e] dark:bg-[#11111b]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 dark:bg-gray-800/30 border-b border-gray-700/50">
        <span className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code className="text-gray-300">{code.trim()}</code>
      </pre>
    </div>
  );
}

function InlineCode({ text }: { text: string }) {
  return (
    <code className="px-1.5 py-0.5 mx-0.5 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded-md text-[0.85em] font-mono font-medium border border-gray-200 dark:border-gray-700">
      {text}
    </code>
  );
}

function formatText(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let key = 0;

  // First extract code blocks
  const codeBlockParts = text.split(CODE_BLOCK_REGEX);
  for (let i = 0; i < codeBlockParts.length; i += 3) {
    const beforeCode = codeBlockParts[i];
    const language = codeBlockParts[i + 1] || "";
    const codeContent = codeBlockParts[i + 2];

    if (beforeCode) {
      elements.push(...formatInlineText(beforeCode, key));
      key += 100;
    }

    if (codeContent !== undefined) {
      elements.push(
        <CodeBlock key={`codeblock-${key++}`} language={language} code={codeContent} />
      );
    }
  }

  return elements;
}

function formatInlineText(text: string, baseKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let key = baseKey;

  // Split by lines to preserve line breaks
  const lines = text.split("\n");

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={`br-${key++}`} />);
    }

    // Process inline code first (highest priority)
    const inlineCodeParts = line.split(INLINE_CODE_REGEX);
    inlineCodeParts.forEach((part, i) => {
      if (i % 2 === 1) {
        elements.push(<InlineCode key={`code-${key++}`} text={part} />);
      } else if (part) {
        // Process other formatting within non-code parts
        elements.push(...formatRichText(part, key));
        key += 50;
      }
    });
  });

  return elements;
}

function formatRichText(text: string, baseKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let key = baseKey;

  while (remaining.length > 0) {
    // Find the earliest match
    const boldMatch = BOLD_REGEX.exec(remaining);
    const italicMatch = ITALIC_REGEX.exec(remaining);
    const strikeMatch = STRIKETHROUGH_REGEX.exec(remaining);
    const urlMatch = URL_REGEX.exec(remaining);
    const hashtagMatch = HASHTAG_REGEX.exec(remaining);
    const mentionMatch = MENTION_REGEX.exec(remaining);

    const matches = [
      boldMatch && { type: "bold", match: boldMatch },
      italicMatch && { type: "italic", match: italicMatch },
      strikeMatch && { type: "strike", match: strikeMatch },
      urlMatch && { type: "url", match: urlMatch },
      hashtagMatch && { type: "hashtag", match: hashtagMatch },
      mentionMatch && { type: "mention", match: mentionMatch },
    ]
      .filter(Boolean)
      .sort((a, b) => a!.match.index - b!.match.index);

    if (matches.length === 0) {
      elements.push(remaining);
      break;
    }

    const first = matches[0]!;
    const matchIndex = first.match.index;

    // Add text before the match
    if (matchIndex > 0) {
      elements.push(remaining.slice(0, matchIndex));
    }

    const matchText = first.match[0];

    switch (first.type) {
      case "bold":
        elements.push(
          <strong key={`bold-${key++}`} className="font-bold">
            {first.match[1]}
          </strong>
        );
        break;
      case "italic":
        elements.push(
          <em key={`italic-${key++}`} className="italic">
            {first.match[1]}
          </em>
        );
        break;
      case "strike":
        elements.push(
          <del key={`strike-${key++}`} className="line-through opacity-60">
            {first.match[1]}
          </del>
        );
        break;
      case "url":
        elements.push(
          <a
            key={`url-${key++}`}
            href={matchText}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-500/60 transition-colors"
          >
            {matchText.length > 40 ? matchText.slice(0, 37) + "..." : matchText}
          </a>
        );
        break;
      case "hashtag":
        elements.push(
          <span
            key={`tag-${key++}`}
            className="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline"
          >
            {matchText}
          </span>
        );
        break;
      case "mention":
        elements.push(
          <span
            key={`men-${key++}`}
            className="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline"
          >
            {matchText}
          </span>
        );
        break;
    }

    remaining = remaining.slice(matchIndex + matchText.length);
  }

  return elements;
}

export function FormattedText({ text, query = "" }: FormattedTextProps) {
  let content = text;

  // Handle search highlighting
  if (query.trim()) {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = content.split(regex);

    return (
      <span className="text-[14px] leading-[1.65] tracking-tight break-words whitespace-pre-wrap font-sans">
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-200/70 dark:bg-amber-500/30 text-inherit rounded-sm px-0.5 -mx-0.5"
            >
              {formatText(part)}
            </mark>
          ) : (
            <React.Fragment key={i}>{formatText(part)}</React.Fragment>
          )
        )}
      </span>
    );
  }

  return (
    <span className="text-[14px] leading-[1.65] tracking-tight break-words whitespace-pre-wrap font-sans">
      {formatText(content)}
    </span>
  );
}
