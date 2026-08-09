"use client";

import { EmptyState, noSearchResults } from "@/components/empty-states";

interface SearchEmptyStateProps {
  onClear?: () => void;
}

export function SearchEmptyState({ onClear }: SearchEmptyStateProps) {
  const preset = noSearchResults(onClear);
  return (
    <EmptyState
      illustration={preset.illustration}
      title={preset.title}
      description={preset.description}
      primaryAction={preset.primaryAction}
      compact
    />
  );
}
