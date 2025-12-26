import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KortixLoaderProps {
  size?: "small" | "medium" | "large";
  customSize?: number;
  className?: string;
}

const sizeMap = {
  small: 16,
  medium: 24,
  large: 32,
};

export function KortixLoader({
  size = "medium",
  customSize,
  className,
}: KortixLoaderProps) {
  const loaderSize = customSize || sizeMap[size];

  return (
    <Loader2
      className={cn("animate-spin", className)}
      size={loaderSize}
    />
  );
}
