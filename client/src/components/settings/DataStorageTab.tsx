"use client";

import { useState } from "react";
import {
  HardDrive,
  Download,
  Trash2,
  Wifi,
  Cloud,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataStorageTabProps {
  accentColor?: string;
}

const STORAGE_ITEMS = [
  { label: "Photos & Videos", size: "245 MB", color: "#8b5cf6" },
  { label: "Documents", size: "89 MB", color: "#3b82f6" },
  { label: "Voice Messages", size: "34 MB", color: "#10b981" },
  { label: "Other", size: "12 MB", color: "#f59e0b" },
];

export function DataStorageTab({ accentColor = "#3b82f6" }: DataStorageTabProps) {
  const [autoDownload, setAutoDownload] = useState(true);
  const [saveToGallery, setSaveToGallery] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalSize = "380 MB";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-4">
      {/* Storage overview */}
      <div>
        <h3 className="text-xs font-black text-[var(--fg-tertiary)] uppercase tracking-widest mb-4">
          Storage Usage
        </h3>
        <div className="bg-[var(--surface-secondary)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${accentColor}15` }}>
                <HardDrive className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--fg)]">{totalSize}</p>
                <p className="text-[10px] text-[var(--fg-tertiary)] uppercase font-bold">Total Used</p>
              </div>
            </div>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" style={{ color: accentColor }}>
              Manage
            </button>
          </div>

          {/* Storage bar */}
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-4">
            <div className="h-full flex">
              {STORAGE_ITEMS.map((item, i) => {
                const widths = [64, 23, 9, 4];
                return (
                  <div
                    key={item.label}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{ width: `${widths[i]}%`, backgroundColor: item.color }}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {STORAGE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-[var(--fg-secondary)]">{item.label}</span>
                <span className="text-[11px] font-bold text-[var(--fg-tertiary)] ml-auto">{item.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network settings */}
      <div>
        <h3 className="text-xs font-black text-[var(--fg-tertiary)] uppercase tracking-widest mb-4">
          Network
        </h3>
        <div className="space-y-2">
          <SettingRow
            icon={<Wifi className="w-4 h-4" />}
            label="Auto-Download Media"
            description="Download photos and videos on Wi-Fi"
            accentColor={accentColor}
            toggle={
              <ToggleSwitch
                checked={autoDownload}
                onChange={setAutoDownload}
                accentColor={accentColor}
              />
            }
          />
          <SettingRow
            icon={<Cloud className="w-4 h-4" />}
            label="Save to Gallery"
            description="Automatically save received media"
            accentColor={accentColor}
            toggle={
              <ToggleSwitch
                checked={saveToGallery}
                onChange={setSaveToGallery}
                accentColor={accentColor}
              />
            }
          />
        </div>
      </div>

      {/* Data usage */}
      <div>
        <h3 className="text-xs font-black text-[var(--fg-tertiary)] uppercase tracking-widest mb-4">
          Data Usage
        </h3>
        <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fg-secondary)]">Sent</span>
            <span className="text-sm font-bold text-[var(--fg)]">1.2 GB</span>
          </div>
          <div className="h-px bg-[var(--border-default)]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fg-secondary)]">Received</span>
            <span className="text-sm font-bold text-[var(--fg)]">3.8 GB</span>
          </div>
          <div className="h-px bg-[var(--border-default)]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fg-secondary)]">Total</span>
            <span className="text-sm font-bold" style={{ color: accentColor }}>5.0 GB</span>
          </div>
        </div>
      </div>

      {/* Clear data */}
      <div>
        <h3 className="text-xs font-black text-[var(--fg-tertiary)] uppercase tracking-widest mb-4">
          Clear Data
        </h3>
        {showClearConfirm ? (
          <div className="bg-[var(--danger-light)] rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[var(--fg)]">Clear all cached media?</p>
                <p className="text-xs text-[var(--fg-secondary)] mt-1">
                  This will remove all downloaded media from your device. Messages will not be affected.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-sm font-bold text-[var(--fg-secondary)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-sm font-bold text-white bg-[var(--danger)] hover:opacity-90 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-3 p-4 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] rounded-2xl transition-colors text-left"
          >
            <div className="p-2 rounded-xl bg-[var(--danger-light)]">
              <Trash2 className="w-4 h-4 text-[var(--danger)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--fg)]">Clear Cache</p>
              <p className="text-[10px] text-[var(--fg-tertiary)] uppercase font-bold">Free up {totalSize}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--fg-muted)]" />
          </button>
        )}
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  description,
  accentColor,
  toggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  accentColor: string;
  toggle: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[var(--surface-secondary)] rounded-2xl">
      <div className="flex items-center gap-3 flex-1 pr-4">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${accentColor}15` }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--fg)]">{label}</p>
          <p className="text-[10px] text-[var(--fg-tertiary)] uppercase font-bold">{description}</p>
        </div>
      </div>
      {toggle}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  accentColor,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
        checked ? "" : "bg-[var(--surface-active)]"
      )}
      style={checked ? { backgroundColor: accentColor } : {}}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
