"use client";

import { motion } from "framer-motion";

interface TextInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextInput({
  textareaRef,
  value,
  onChange,
  onKeyDown
}: TextInputProps) {
  return (
    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Message"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent rounded-xl px-3.5 py-2 text-[14px] focus:outline-none resize-none max-h-32 text-[#000000] dark:text-[#ffffff] placeholder:text-[#8e8e93] transition-all duration-200 custom-scrollbar overflow-y-auto"
        suppressContentEditableWarning
      />
    </motion.div>
  );
}
