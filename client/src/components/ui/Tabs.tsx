"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
});

function Tabs({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-[var(--radius-ds)] bg-[var(--muted)] p-1 text-[var(--muted-foreground)]",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value: triggerValue,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value, onValueChange } = React.useContext(TabsContext);

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-ds)] px-3 py-1 text-sm font-medium ring-offset-[var(--background)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        value === triggerValue
          ? "bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
          : "",
        className
      )}
      onClick={() => onValueChange(triggerValue)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  value: contentValue,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value } = React.useContext(TabsContext);

  if (value !== contentValue) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
