"use client";

import { useSyncExternalStore } from "react";

// Client-only so the prerendered (static) shell doesn't depend on the current date.
const subscribe = () => () => {};
export default function CurrentYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => 2026);
  return <>{year}</>;
}
