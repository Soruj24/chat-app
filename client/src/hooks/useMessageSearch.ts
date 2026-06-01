"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SearchMessage {
  _id: string;
  content: string;
  chatId: { _id: string; name: string };
  sender: { _id: string; username: string; avatar?: string };
  createdAt: string;
}

interface UseMessageSearchOptions {
  chatId?: string;
}

export function useMessageSearch({ chatId }: UseMessageSearchOptions = {}) {
  const { token } = useSelector((state: RootState) => state.auth);
  const [results, setResults] = useState<SearchMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URLSearchParams({ q: query });
      if (chatId) {
        url.append("chatId", chatId);
      }

      const response = await fetch(`/api/messages/search?${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [token, chatId]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}