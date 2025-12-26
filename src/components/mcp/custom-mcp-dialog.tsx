"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomMCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: any) => Promise<void>;
}

export function CustomMCPDialog({
  open,
  onOpenChange,
  onSave,
}: CustomMCPDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("sse");
  const [config, setConfig] = useState("{}");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const parsedConfig = JSON.parse(config);
      await onSave({
        name,
        type,
        config: parsedConfig,
        enabledTools: [],
      });
      onOpenChange(false);
      // Reset form
      setName("");
      setType("sse");
      setConfig("{}");
    } catch (error) {
      console.error("Error saving custom MCP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom MCP Server</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Custom MCP Server"
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="sse"
            />
          </div>
          <div>
            <Label htmlFor="config">Configuration (JSON)</Label>
            <textarea
              id="config"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              placeholder='{"url": "..."}'
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
