import React, { useState } from 'react';
import { WorkspaceConnector } from '@/lib/config/types';
import ConnectorCard from './ConnectorCard';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

const WorkspaceConnectors = ({
  values,
}: {
  values: WorkspaceConnector[];
}) => {
  const [connectors, setConnectors] = useState<WorkspaceConnector[]>(values);

  const handleToggleConnector = async (connector: WorkspaceConnector) => {
    try {
      const res = await fetch(`/api/workspace-connectors/${connector.id}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to toggle connector');
      }

      const updatedConnector = await res.json();

      setConnectors((prev) =>
        prev.map((c) => (c.id === connector.id ? updatedConnector : c))
      );

      toast.success(
        `${connector.name} ${updatedConnector.enabled ? 'enabled' : 'disabled'}`
      );
    } catch (error) {
      console.error('Error toggling connector:', error);
      throw error;
    }
  };

  return (
    <div className="flex-1 space-y-6 overflow-y-auto py-6">
      <div className="flex flex-col gap-y-3 px-6">
        <div className="flex flex-col gap-y-1">
          <p className="text-sm font-medium text-black dark:text-white">
            Workspace AI Connectors
          </p>
          <p className="text-xs text-black/70 dark:text-white/70">
            Connect all your team's knowledge, across all apps you use for work.
          </p>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
          <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-black/70 dark:text-white/70">
            These connectors integrate with your Composio account. Make sure you have configured the Composio MCP Server in the MCP Servers section with your API key.
          </p>
        </div>
      </div>
      <div className="border-t border-light-200 dark:border-dark-200" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
        {connectors.map((connector) => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            onToggle={handleToggleConnector}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkspaceConnectors;
