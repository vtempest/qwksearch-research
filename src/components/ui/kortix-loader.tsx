import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KortixLoaderProps {
  className?: string;
  size?: number | "small" | "medium" | "large";
  customSize?: number;
}

/**
 * Simple loading spinner component
 */
export const KortixLoader: React.FC<KortixLoaderProps> = ({
  className,
  size = 24,
  customSize
}) => {
  // Convert string sizes to numbers
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  const numericSize = customSize ?? (typeof size === "string" ? sizeMap[size] : size);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className="animate-spin" size={numericSize} />
    </div>
  );
};
