import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CustomMCPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: CustomMCPConfig) => Promise<void>;
}

export interface CustomMCPConfig {
  name: string;
  type: string;
  config: Record<string, any>;
  enabledTools?: string[];
}

export function CustomMCPDialog({
  open,
  onOpenChange,
  onSave,
}: CustomMCPDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("sse");
  const [configJson, setConfigJson] = useState("{}");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      // Validate name
      if (!name.trim()) {
        toast.error("Please enter a name for the MCP server");
        return;
      }

      // Validate and parse config JSON
      let config: Record<string, any>;
      try {
        config = JSON.parse(configJson);
      } catch (error) {
        toast.error("Invalid JSON configuration");
        return;
      }

      setIsSaving(true);

      const customConfig: CustomMCPConfig = {
        name: name.trim(),
        type,
        config,
        enabledTools: [],
      };

      await onSave(customConfig);

      // Reset form
      setName("");
      setType("sse");
      setConfigJson("{}");
      onOpenChange(false);

      toast.success("Custom MCP server added successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save MCP server"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setName("");
    setType("sse");
    setConfigJson("{}");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Custom MCP Server</DialogTitle>
          <DialogDescription>
            Configure a custom Model Context Protocol (MCP) server to extend
            your agent&apos;s capabilities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              placeholder="My Custom MCP Server"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Server Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select server type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sse">SSE (Server-Sent Events)</SelectItem>
                <SelectItem value="stdio">STDIO</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="config">Configuration (JSON)</Label>
            <Textarea
              id="config"
              placeholder='{"url": "http://localhost:3000/mcp", "apiKey": "..."}'
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter the server configuration in JSON format
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Adding..." : "Add Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
