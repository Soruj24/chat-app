"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check,
  ChevronDown,
  Sparkles,
  Eye,
} from "lucide-react";
import { useDesignSystem } from "@/components/ThemeProvider";
import { themes, type ThemeId, type ThemeDefinition } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSwitcher({ className, compact = false }: ThemeSwitcherProps) {
  const { designTheme, setDesignTheme, themeDef } = useDesignSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null);

  const activeTheme = previewTheme ? themes.find(t => t.id === previewTheme) : themeDef;

  return (
    <div className={cn("relative", className)}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
          "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
          "text-gray-700 dark:text-gray-300",
          isOpen && "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <Palette className="w-4 h-4" />
        {!compact && (
          <>
            <span className="text-sm font-medium">{themeDef.name}</span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => {
                setIsOpen(false);
                setPreviewTheme(null);
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-2 z-50 w-[340px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Design Theme
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Choose a visual style for the interface
                </p>
              </div>

              {/* Theme grid */}
              <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      isActive={designTheme === theme.id}
                      isPreviewing={previewTheme === theme.id}
                      onSelect={() => {
                        setDesignTheme(theme.id);
                        setIsOpen(false);
                        setPreviewTheme(null);
                      }}
                      onHover={() => setPreviewTheme(theme.id)}
                      onLeave={() => setPreviewTheme(null)}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hover to preview · Click to apply</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  isPreviewing,
  onSelect,
  onHover,
  onLeave,
}: {
  theme: ThemeDefinition;
  isActive: boolean;
  isPreviewing: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-3 rounded-xl border-2 transition-all duration-200 text-left",
        isActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      {/* Active checkmark */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Color preview */}
      <div className="flex gap-1.5 mb-2.5">
        <div
          className="w-6 h-6 rounded-lg border border-black/10"
          style={{ backgroundColor: theme.preview.bg }}
        />
        <div
          className="w-6 h-6 rounded-lg border border-black/10"
          style={{ backgroundColor: theme.preview.surface }}
        />
        <div
          className="w-6 h-6 rounded-lg border border-black/10"
          style={{ backgroundColor: theme.preview.accent }}
        />
        <div
          className="w-6 h-6 rounded-lg border border-black/10"
          style={{ backgroundColor: theme.preview.fg }}
        />
      </div>

      {/* Mini preview bar */}
      <div
        className="h-8 rounded-lg mb-2 border border-black/5 overflow-hidden flex"
        style={{ backgroundColor: theme.preview.bg }}
      >
        <div
          className="w-6 h-full"
          style={{ backgroundColor: theme.preview.surface }}
        />
        <div className="flex-1 p-1">
          <div
            className="w-3/4 h-1.5 rounded-full"
            style={{ backgroundColor: theme.preview.fg, opacity: 0.2 }}
          />
          <div
            className="w-1/2 h-1.5 rounded-full mt-1"
            style={{ backgroundColor: theme.preview.fg, opacity: 0.1 }}
          />
        </div>
        <div
          className="w-4 h-4 rounded-full m-1"
          style={{ backgroundColor: theme.preview.accent }}
        />
      </div>

      {/* Label */}
      <p className={cn(
        "text-xs font-semibold",
        isActive
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-700 dark:text-gray-300"
      )}>
        {theme.name}
      </p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
        {theme.description}
      </p>
    </motion.button>
  );
}

/* Quick toggle: cycles through Light → Dark → System */
export function ThemeQuickToggle({ className }: { className?: string }) {
  const { designTheme, setDesignTheme } = useDesignSystem();

  const cycle = () => {
    const order: ThemeId[] = ["light", "dark", "midnight", "glass"];
    const idx = order.indexOf(designTheme);
    setDesignTheme(order[(idx + 1) % order.length]);
  };

  const Icon = designTheme === "light" ? Sun
    : designTheme === "dark" ? Moon
    : designTheme === "midnight" ? Moon
    : designTheme === "glass" ? Sparkles
    : Sun;

  return (
    <button
      onClick={cycle}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
        "dark:text-gray-400",
        className
      )}
      title={`Current: ${designTheme}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
