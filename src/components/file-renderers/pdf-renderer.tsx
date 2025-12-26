"use client";

import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

// Dynamically import the actual PDF renderer with SSR disabled
// This prevents 'canvas' and 'pdfjs-dist' from breaking the build/prerender
const PdfRendererClient = dynamic(
  () => import("./pdf-renderer-client"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/20 min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);

interface PdfRendererProps {
  url: string;
  className?: string;
  compact?: boolean;
}

export function PdfRenderer(props: PdfRendererProps) {
  // Use a stable key wrapper or just pass props through
  // In compact mode, we want to contain layout shifts
  if (props.compact) {
    return (
      <div
        className={cn("w-full h-full relative overflow-hidden", props.className)}
        style={{ contain: "strict" }}
      >
        <PdfRendererClient {...props} />
      </div>
    );
  }

  return <PdfRendererClient {...props} />;
}
