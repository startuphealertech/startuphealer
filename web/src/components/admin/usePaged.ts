"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Paged<T> = { items: T[]; total: number; page: number; pages: number };

// Small data hook for admin tables: filters + pagination + reload.
export function usePaged<T>(endpoint: string, filters: Record<string, string>) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<T> | null>(null);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  // Reset to page 1 whenever filters change
  const filterKey = JSON.stringify(filters);
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const active = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
  const qs = new URLSearchParams({ ...active, page: String(page), limit: "20" }).toString();
  const requestKey = `${endpoint}?${qs}#${tick}`;

  useEffect(() => {
    let alive = true;
    api<Paged<T>>(`${endpoint}?${qs}`)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError("");
      })
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => alive && setLoadedKey(`${endpoint}?${qs}#${tick}`));
    return () => {
      alive = false;
    };
  }, [endpoint, qs, tick]);

  return {
    data,
    loading: loadedKey !== requestKey && !data,
    error,
    page,
    setPage,
    reload: () => setTick((t) => t + 1),
  };
}
