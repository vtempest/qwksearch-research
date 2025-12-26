import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomMCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
}

/**
 * Custom MCP Dialog stub component
 */
export const CustomMCPDialog: React.FC<CustomMCPDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom MCP Configuration</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Custom MCP configuration dialog (stub implementation)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
