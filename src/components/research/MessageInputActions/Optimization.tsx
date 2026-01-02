import { Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/lib/hooks/useChat';

const Optimization = () => {
  const { optimizationMode, setOptimizationMode } = useChat();

  const isExtendedThinking = optimizationMode === 'balanced' || optimizationMode === 'quality';

  const toggleThinking = () => {
    setOptimizationMode(isExtendedThinking ? 'speed' : 'balanced');
  };

  return (
    <button
      type="button"
      onClick={toggleThinking}
      className={cn(
        'p-2 rounded-xl active:scale-95 transition duration-200 focus:outline-none flex items-center gap-1.5',
        isExtendedThinking
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
      title={isExtendedThinking ? 'Extended thinking enabled' : 'Extended thinking disabled'}
    >
      {isExtendedThinking ? (
        <Brain size={16} className="shrink-0" />
      ) : (
        <Zap size={16} className="shrink-0" />
      )}
    </button>
  );
};

export default Optimization;
