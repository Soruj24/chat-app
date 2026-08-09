"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { AttachmentMenu } from "./input/AttachmentMenu";
import { ReplyPreview } from "./input/ReplyPreview";
import { VoiceRecorder } from "./input/VoiceRecorder";
import { InputActions } from "./input/InputActions";
import { SendButton } from "./input/SendButton";
import { TextInput } from "./input/TextInput";
import { EmojiPicker } from "@/components/chat-page/EmojiPicker";
import { GifPicker } from "./input/GifPicker";
import { MentionPopup } from "./input/MentionPopup";
import { CommandPalette } from "./input/CommandPalette";
import { TypingSuggestions } from "./input/TypingSuggestions";
import { ImagePreview } from "./input/ImagePreview";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onSendMedia?: (file: File) => void;
  onSendLocation?: () => void;
  onSendContact?: () => void;
  onSendVoice?: (file: File) => void;
  onTyping?: (isTyping: boolean) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  themeColor?: string;
  onSendGif?: (url: string) => void;
  users?: User[];
  onCommand?: (command: string) => void;
}

const MAX_CHARS = 4000;

const MARKDOWN_SHORTCUTS: Record<string, { wrap: string; placeholder?: string }> = {
  bold: { wrap: "**" },
  italic: { wrap: "_" },
  code: { wrap: "`" },
};

export function MessageInput({
  value,
  onChange,
  onSendMessage,
  onSendMedia,
  onSendLocation,
  onSendContact,
  onSendVoice,
  onTyping,
  replyingTo,
  onCancelReply,
  showEmojiPicker,
  setShowEmojiPicker,
  themeColor,
  onSendGif,
  users = [],
  onCommand,
}: MessageInputProps) {
  // Local state
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showMarkdownBar, setShowMarkdownBar] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Mention state
  const [mentionActive, setMentionActive] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(0);

  // Command state
  const [commandActive, setCommandActive] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);

  // Suggestion state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionVisible, setSuggestionVisible] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const composerRef = useRef<HTMLDivElement>(null);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(20));

  // Typing indicator
  useEffect(() => {
    if (value.trim()) {
      onTyping?.(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onTyping?.(false), 2000);
    } else {
      onTyping?.(false);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [value, onTyping]);

  // Waveform animation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform((prev) => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  // Send
  const handleSend = useCallback(() => {
    if (value.trim()) {
      onSendMessage();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      setSuggestionVisible(false);
    }
  }, [value, onSendMessage]);

  // Handle file upload send
  const handleFileSend = useCallback(() => {
    if (pendingFiles.length > 0) {
      pendingFiles.forEach((file) => onSendMedia?.(file));
      setPendingFiles([]);
    }
  }, [pendingFiles, onSendMedia]);

  // Detect @mention and /commands
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Character limit
    if (newValue.length > MAX_CHARS) return;

    onChange(newValue);

    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;

    // Detect @mention
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionActive(true);
      setMentionQuery(mentionMatch[1]);
      setMentionIndex(0);
      setCommandActive(false);
      setCommandQuery("");
    } else {
      setMentionActive(false);
      setMentionQuery("");
    }

    // Detect /command
    const commandMatch = textBeforeCursor.match(/^\/(\w*)$/);
    if (commandMatch && newValue.length <= 20) {
      setCommandActive(true);
      setCommandQuery(commandMatch[1]);
      setCommandIndex(0);
      setMentionActive(false);
      setMentionQuery("");
    } else if (!mentionMatch) {
      setCommandActive(false);
      setCommandQuery("");
    }

    // Generate typing suggestions
    if (newValue.trim() && newValue.length > 2) {
      const words = newValue.trim().split(" ");
      const lastWord = words[words.length - 1].toLowerCase();
      const quickReplies = ["Ok", "Sure", "Thanks!", "Got it", "Sounds good", "On my way", "Let me check"];
      const filtered = quickReplies.filter((r) => r.toLowerCase().startsWith(lastWord) && r.toLowerCase() !== lastWord);
      setSuggestions(filtered);
      setSuggestionVisible(filtered.length > 0 && words.length <= 3);
    } else {
      setSuggestionVisible(false);
      setSuggestions([]);
    }
  }, [onChange]);

  // Handle key down for mentions, commands, shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Enter to send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // If mention popup is open
      if (mentionActive) {
        const filteredUsers = users.filter((u) =>
          u.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          u.username?.toLowerCase().includes(mentionQuery.toLowerCase())
        ).slice(0, 8);
        if (filteredUsers[mentionIndex]) {
          insertMention(filteredUsers[mentionIndex]);
          return;
        }
      }

      // If command palette is open
      if (commandActive) {
        const commands = ["image", "file", "location", "contact", "gif", "emoji", "bold", "italic", "code", "list", "heading", "mention", "voice"];
        const filtered = commands.filter((c) => c.includes(commandQuery.toLowerCase()));
        if (filtered[commandIndex]) {
          handleCommandSelect(filtered[commandIndex]);
          return;
        }
      }

      handleSend();
      return;
    }

    // Tab to accept suggestion
    if (e.key === "Tab" && suggestionVisible && suggestions.length > 0) {
      e.preventDefault();
      const suggestion = suggestions[0];
      const words = value.split(" ");
      words[words.length - 1] = suggestion;
      onChange(words.join(" ") + " ");
      setSuggestionVisible(false);
      return;
    }

    // Arrow keys for mention/command navigation
    if (e.key === "ArrowDown") {
      if (mentionActive) {
        e.preventDefault();
        setMentionIndex((prev) => prev + 1);
      } else if (commandActive) {
        e.preventDefault();
        setCommandIndex((prev) => prev + 1);
      } else if (suggestionVisible) {
        e.preventDefault();
      }
    }

    if (e.key === "ArrowUp") {
      if (mentionActive) {
        e.preventDefault();
        setMentionIndex((prev) => Math.max(0, prev - 1));
      } else if (commandActive) {
        e.preventDefault();
        setCommandIndex((prev) => Math.max(0, prev - 1));
      }
    }

    // Escape to close popups
    if (e.key === "Escape") {
      setMentionActive(false);
      setCommandActive(false);
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      setIsAttachmentMenuOpen(false);
      setSuggestionVisible(false);
    }

    // Markdown shortcuts
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
      const shortcuts: Record<string, string> = {
        b: "bold",
        i: "italic",
        e: "emoji",
        k: "code",
      };

      const action = shortcuts[e.key];
      if (action === "emoji") {
        e.preventDefault();
        setShowEmojiPicker(!showEmojiPicker);
      } else if (action && MARKDOWN_SHORTCUTS[action]) {
        e.preventDefault();
        applyMarkdown(action);
      }
    }

    // Ctrl+M for markdown bar
    if ((e.metaKey || e.ctrlKey) && e.key === "m") {
      e.preventDefault();
      setShowMarkdownBar(!showMarkdownBar);
    }
  }, [value, onChange, handleSend, mentionActive, mentionQuery, mentionIndex, commandActive, commandQuery, commandIndex, suggestionVisible, suggestions, showEmojiPicker, showMarkdownBar, users]);

  // Insert mention
  const insertMention = useCallback((user: User) => {
    const cursorPos = textareaRef.current?.selectionStart || value.length;
    const textBeforeCursor = value.substring(0, cursorPos);
    const textAfterCursor = value.substring(cursorPos);
    const mentionStart = textBeforeCursor.lastIndexOf("@");
    const newText = textBeforeCursor.substring(0, mentionStart) + `@${user.username || user.name || "user"} ` + textAfterCursor;
    onChange(newText);
    setMentionActive(false);
    setMentionQuery("");
    textareaRef.current?.focus();
  }, [value, onChange]);

  // Handle command select
  const handleCommandSelect = useCallback((commandId: string) => {
    setCommandActive(false);
    setCommandQuery("");
    onChange("");
    onCommand?.(commandId);
  }, [onChange, onCommand]);

  // Apply markdown wrapping
  const applyMarkdown = useCallback((type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const { wrap, placeholder } = MARKDOWN_SHORTCUTS[type];

    if (selectedText) {
      const newText = value.substring(0, start) + wrap + selectedText + wrap + value.substring(end);
      onChange(newText);
    } else {
      const newText = value.substring(0, start) + wrap + (placeholder || "") + wrap + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.selectionStart = start + wrap.length;
        textarea.selectionEnd = start + wrap.length + (placeholder?.length || 0);
      }, 0);
    }
  }, [value, onChange]);

  // Voice recording
  const startRecording = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some((device) => device.kind === "audioinput");
      if (!hasMic) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], "voice_message.webm", { type: "audio/webm" });
        const duration = formatTime(recordingTime);
        (file as File & { duration?: string }).duration = duration;
        onSendVoice?.(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = (cancel = false) => {
    if (!mediaRecorderRef.current) return;
    if (cancel) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // Drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (composerRef.current && !composerRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setPendingFiles((prev) => [...prev, ...files]);
    }
  }, []);

  // Paste handler for images
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter((item) => item.type.startsWith("image/"));

    if (imageItems.length > 0) {
      e.preventDefault();
      const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
      setPendingFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const removePendingFile = useCallback((index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(e.target as Node)) {
        setMentionActive(false);
        setCommandActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <footer
      ref={composerRef}
      className={cn(
        "sticky bottom-0 z-20 transition-all duration-200",
        "composer-glass"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--color-primary)]/5 backdrop-blur-sm rounded-t-2xl"
          >
            <div className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-[var(--color-primary)]/30 rounded-2xl drop-zone-active">
              <svg className="w-10 h-10 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                Drop files here
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Images, videos, and files
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative flex flex-col gap-0">
        {/* Pickers - positioned above */}
        <div className="relative">
          <EmojiPicker
            isOpen={showEmojiPicker}
            onSelect={(emoji) => {
              onChange(value + emoji);
              setShowEmojiPicker(false);
              textareaRef.current?.focus();
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
          <GifPicker
            isOpen={showGifPicker}
            onSelect={(url) => {
              onSendGif?.(url);
              setShowGifPicker(false);
            }}
            onClose={() => setShowGifPicker(false)}
          />
          <AttachmentMenu
            isOpen={isAttachmentMenuOpen}
            onClose={() => setIsAttachmentMenuOpen(false)}
            onFileSelect={(file) => onSendMedia?.(file)}
            onLocationSelect={() => onSendLocation?.()}
            onContactSelect={() => onSendContact?.()}
          />
          <MentionPopup
            isOpen={mentionActive}
            users={users}
            query={mentionQuery}
            selectedIndex={mentionIndex}
            onSelect={insertMention}
            position={{ top: 0, left: 0 }}
          />
          <CommandPalette
            isOpen={commandActive}
            query={commandQuery}
            selectedIndex={commandIndex}
            onSelect={handleCommandSelect}
          />
        </div>

        {/* Reply Preview */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="overflow-hidden"
            >
              <ReplyPreview replyingTo={replyingTo} onCancel={onCancelReply || (() => {})} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image/File Preview */}
        <ImagePreview
          files={pendingFiles}
          onRemove={removePendingFile}
          onSend={handleFileSend}
          onCancel={() => setPendingFiles([])}
        />

        {/* Typing Suggestions */}
        <TypingSuggestions
          suggestions={suggestions}
          visible={suggestionVisible}
          onSelect={(suggestion) => {
            const words = value.split(" ");
            words[words.length - 1] = suggestion;
            onChange(words.join(" ") + " ");
            setSuggestionVisible(false);
            textareaRef.current?.focus();
          }}
          selectedIndex={0}
        />

        {/* Markdown Toolbar */}
        <AnimatePresence>
          {showMarkdownBar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-1 px-3 py-1.5">
                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mr-1">
                  Format
                </span>
                {[
                  { id: "bold", label: "B", title: "Bold (Ctrl+B)" },
                  { id: "italic", label: "I", title: "Italic (Ctrl+I)" },
                  { id: "code", label: "<>", title: "Code (Ctrl+K)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => applyMarkdown(item.id)}
                    title={item.title}
                    className={cn(
                      "md-toolbar-btn",
                      item.id === "bold" && "font-black",
                      item.id === "italic" && "italic",
                      item.id === "code" && "font-mono text-[11px]"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex items-end gap-2 px-3 pb-3 pt-1">
          {!isRecording && (
            <InputActions
              showEmojiPicker={showEmojiPicker}
              onEmojiPickerToggle={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false);
                setIsAttachmentMenuOpen(false);
              }}
              isAttachmentMenuOpen={isAttachmentMenuOpen}
              onAttachmentMenuToggle={() => {
                setIsAttachmentMenuOpen(!isAttachmentMenuOpen);
                setShowEmojiPicker(false);
                setShowGifPicker(false);
              }}
              showGifPicker={showGifPicker}
              onGifPickerToggle={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
                setIsAttachmentMenuOpen(false);
              }}
              themeColor={themeColor}
              showMarkdownBar={showMarkdownBar}
              onMarkdownToggle={() => setShowMarkdownBar(!showMarkdownBar)}
            />
          )}

          <div className={cn(
            "flex-1 relative min-w-0 rounded-[var(--radius-2xl)] border transition-all duration-200",
            "bg-[var(--composer-bg)]",
            "border-[var(--border-default)]",
            "focus-within:border-[var(--composer-border-focus)]",
            "focus-within:bg-[var(--composer-bg-focus)]",
            "focus-within:shadow-[var(--composer-shadow-focus)]",
            "shadow-[var(--composer-shadow)]"
          )}>
            <AnimatePresence mode="wait">
              {isRecording ? (
                <VoiceRecorder
                  key="voice"
                  recordingTime={recordingTime}
                  waveform={waveform}
                  onCancel={() => stopRecording(true)}
                  formatTime={formatTime}
                  themeColor={themeColor}
                />
              ) : (
                <TextInput
                  key="text"
                  textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                  value={value}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />
              )}
            </AnimatePresence>

            {/* Character counter */}
            <AnimatePresence>
              {charCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-1 right-3"
                >
                  <span className={cn(
                    "text-[10px] font-mono font-medium tabular-nums",
                    isOverLimit
                      ? "text-[var(--color-danger)] font-bold"
                      : charCount > MAX_CHARS * 0.8
                        ? "text-[var(--color-warning)]"
                        : "text-[var(--text-tertiary)]"
                  )}>
                    {charCount > MAX_CHARS * 0.8 ? `${charCount}/${MAX_CHARS}` : charCount}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SendButton
            isRecording={isRecording}
            hasValue={!!value.trim() || pendingFiles.length > 0}
            onSend={pendingFiles.length > 0 ? handleFileSend : handleSend}
            onStartRecording={startRecording}
            onStopRecording={() => stopRecording(false)}
            themeColor={themeColor}
          />
        </div>

        {/* Shortcut hints */}
        {!value && !isRecording && !showEmojiPicker && !showGifPicker && (
          <div className="flex items-center gap-3 px-3 pb-2 -mt-1">
            <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
              <span className="kbd-shortcut text-[9px] px-1 py-0">/</span>
              commands
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
              <span className="kbd-shortcut text-[9px] px-1 py-0">@</span>
              mention
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
              <span className="kbd-shortcut text-[9px] px-1 py-0">↑</span>
              markdown
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}
