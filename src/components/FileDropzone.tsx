"use client";

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept: string;
  fileName?: string;
  disabled?: boolean;
  helperText?: string;
}

export function FileDropzone({
  onFile,
  accept,
  fileName,
  disabled = false,
  helperText = "Audio (mp3, wav, m4a), video (mp4, mov, webm), or PDF transcript",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFile(files[0]);
    },
    [onFile],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={[
        "rounded-2xl border-2 border-dashed bg-surface p-8 text-center transition-colors",
        dragOver ? "border-primary-500 bg-primary-50" : "border-outline-secondary",
        disabled ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
      </div>
      <p className="text-base font-medium text-on-surface">
        {fileName ?? "Drop your file here"}
      </p>
      <p className="mt-1 text-sm text-on-surface-secondary">{helperText}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-outline bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
      >
        {fileName ? "Choose a different file" : "Choose file"}
      </button>
    </div>
  );
}
