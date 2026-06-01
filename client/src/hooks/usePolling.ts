"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
}

type PollingCallback = () => void | Promise<void>;

export function usePolling(callback: PollingCallback, { interval = 30000, enabled = true }: UsePollingOptions = {}) {
  const savedCallback = useRef<PollingCallback | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const tick = useCallback(async () => {
    if (savedCallback.current) {
      await savedCallback.current();
    }
  }, []);

  const start = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(tick, interval);
  }, [tick, interval]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      start();
      return () => stop();
    }
    stop();
  }, [enabled, start, stop]);

  return { start, stop };
}

export function useAutoRefresh(callback: PollingCallback, deps: unknown[] = []) {
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    Promise.resolve(callback()).then(() => setLastRefresh(Date.now()));
  }, [...deps]);

  const refresh = useCallback(() => {
    Promise.resolve(callback()).then(() => setLastRefresh(Date.now()));
  }, [callback]);

  return { lastRefresh, refresh };
}