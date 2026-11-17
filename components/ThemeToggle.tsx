"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_KEY, type ThemePreference } from "@/lib/theme";

export default function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const selected = useRef<ThemePreference>("system");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = selected.current === "system"
        ? (media.matches ? "dark" : "light") : selected.current;
    };
    try {
      const saved = localStorage.getItem(THEME_KEY);
      selected.current = saved === "light" || saved === "dark" ? saved : "system";
    } catch { /* Device preference still works when storage is unavailable. */ }
    setPreference(selected.current);
    apply();
    const sync = (event: StorageEvent) => {
      if (event.key !== THEME_KEY && event.key !== null) return;
      selected.current = event.newValue === "light" || event.newValue === "dark"
        ? event.newValue : "system";
      setPreference(selected.current);
      apply();
    };
    media.addEventListener("change", apply);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function choose(value: ThemePreference) {
    selected.current = value;
    setPreference(value);
    try { localStorage.setItem(THEME_KEY, value); } catch { /* Keep this session usable. */ }
    document.documentElement.dataset.theme = value === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : value;
  }

  return (
    <div className="theme-control">
      <span id="theme-label" className="eyebrow">Appearance</span>
      <div className="theme-options" role="group" aria-labelledby="theme-label">
        {([ ["system", Monitor], ["light", Sun], ["dark", Moon] ] as const).map(([value, Icon]) => (
          <button key={value} type="button" aria-pressed={preference === value} onClick={() => choose(value)}>
            <Icon size={14} aria-hidden="true" />{value === "system" ? "System" : value === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>
      <span className="theme-hint">System follows your device</span>
    </div>
  );
}
