"use client";

import { useId, type ChangeEvent } from "react";

interface YouTubeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function YouTubeInput({ value, onChange, disabled = false }: YouTubeInputProps) {
  const id = useId();
  return (
    <div className="rounded-2xl border border-outline-secondary bg-surface p-5">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-on-surface">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-error">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.7-1.7C18.3 5 12 5 12 5s-6.3 0-7.9.5A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.7 1.7C5.7 19 12 19 12 19s6.3 0 7.9-.5a2.5 2.5 0 0 0 1.7-1.7C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5 3-5 3z" />
        </svg>
        Paste a YouTube link
      </label>
      <p className="mt-1 text-xs text-on-surface-secondary">
        We&apos;ll fetch the audio and use it as the source.
      </p>
      <input
        id={id}
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder="https://www.youtube.com/watch?v=…"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-3 block w-full rounded-lg border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-placeholder focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-700/20 disabled:opacity-60"
      />
    </div>
  );
}
