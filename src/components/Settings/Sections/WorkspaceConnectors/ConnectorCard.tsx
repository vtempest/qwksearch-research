import { WorkspaceConnector } from '@/lib/config/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ConnectorCard = ({
  connector,
  onToggle,
}: {
  connector: WorkspaceConnector;
  onToggle: (connector: WorkspaceConnector) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(connector);
    } catch (error) {
      console.error('Error toggling connector:', error);
      toast.error(`Failed to ${connector.enabled ? 'disable' : 'enable'} ${connector.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-4 rounded-lg border border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary hover:border-light-300 dark:hover:border-dark-300 transition-all duration-200">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-light-secondary dark:bg-dark-secondary">
          <span className="text-2xl">{connector.icon}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black dark:text-white">
              {connector.name}
            </span>
            {connector.beta && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Beta
              </span>
            )}
          </div>
          {connector.description && (
            <p className="text-xs text-black/60 dark:text-white/60">
              {connector.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
          connector.enabled
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-light-200 dark:bg-dark-200 text-black/40 dark:text-white/40 hover:bg-light-300 dark:hover:bg-dark-300 hover:text-blue-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Plus
          size={16}
          className={`transition-transform duration-200 ${
            connector.enabled ? 'rotate-45' : ''
          }`}
        />
      </button>
    </div>
  );
};

export default ConnectorCard;
