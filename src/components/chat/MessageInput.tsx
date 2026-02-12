"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { AttachmentMenu } from "./input/AttachmentMenu";
import { ReplyPreview } from "./input/ReplyPreview";
import { VoiceRecorder } from "./input/VoiceRecorder";
import { InputActions } from "./input/InputActions";
import { SendButton } from "./input/SendButton";
import { TextInput } from "./input/TextInput";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
}

export function MessageInput({
  value,
  onChange,
  onSendMessage,
  replyingTo,
  onCancelReply,
  showEmojiPicker,
  setShowEmojiPicker
}: MessageInputProps) {
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock waveform data
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(20));

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.floor(Math.random() * 30) + 5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleSend = () => {
    if (value.trim()) {
      onSendMessage();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (cancel = false) => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    if (!cancel) {
      // Logic to send voice message would go here
      onChange("🎤 Voice message (" + formatTime(recordingTime) + ")");
      setTimeout(onSendMessage, 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-expand logic
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`; // max-h-32 (128px)
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [value]);

  return (
    <footer className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-800/60 p-2.5 md:p-3 z-10">
      <div className="max-w-4xl mx-auto relative">
        <AnimatePresence>
          <AttachmentMenu 
            isOpen={isAttachmentMenuOpen} 
            onClose={() => setIsAttachmentMenuOpen(false)} 
          />
        </AnimatePresence>

        {replyingTo && (
          <ReplyPreview 
            replyingTo={replyingTo} 
            onCancel={onCancelReply || (() => {})} 
          />
        )}
        
        <div className="flex items-end gap-1.5 md:gap-2">
          {!isRecording && (
            <InputActions 
              showEmojiPicker={showEmojiPicker}
              onEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
              isAttachmentMenuOpen={isAttachmentMenuOpen}
              onAttachmentMenuToggle={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
            />
          )}
          
          <div className="flex-1 relative min-w-0">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <VoiceRecorder 
                  recordingTime={recordingTime}
                  waveform={waveform}
                  onCancel={() => stopRecording(true)}
                  formatTime={formatTime}
                />
              ) : (
                <TextInput 
                  textareaRef={textareaRef as any} 
                  value={value} 
                  onChange={handleTextareaChange} 
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSend(); 
                    } 
                  }} 
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mb-0.5">
            <SendButton 
              isRecording={isRecording}
              hasValue={!!value.trim()}
              onSend={handleSend}
              onStartRecording={startRecording}
              onStopRecording={() => stopRecording(false)}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
