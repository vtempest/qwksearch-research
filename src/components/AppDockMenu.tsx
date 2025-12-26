'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * @module AppDockMenu
 * App Dock Menu with zoom animation on hover, and
 * enhances current app with opacity and shine effect.
 * Option: automatically click on hover
 * @property {object[]} listDockApps - List of dock apps
 * @property {(id: string) => void} handleAppDockClick - Called when a dock app is clicked with id
 * @property {boolean} [shouldAutoClickOnHover=true] - Whether to automatically click on hover
 * @property {boolean} [shouldAnimateZoom=true] - Whether to animate zoom effect on hover
 * @property {boolean} [gapBetweenItems=false] - Whether to add gap between items
 * @property {string} [bgColor="#DED8C4"] - Background color for the dock
 * @author [vtempest](https://github.com/vtempest)
 */

interface DockApp {
  id: string;
  title: string;
  icon: ({ size }: { size: number }) => React.ReactNode;
}

interface AppDockMenuProps {
  listDockApps: DockApp[];
  handleAppDockClick: (id: string) => void;
  shouldAutoClickOnHover?: boolean;
  shouldAnimateZoom?: boolean;
  gapBetweenItems?: boolean;
  bgColor?: string;
  className?: string;
  initialActiveId?: string;
}

interface DockItemProps {
  dockItem: DockApp;
  index: number;
  mouseX: MotionValue<number>;
  containerX: MotionValue<number>;
  activeView: string;
  shouldAutoClickOnHover: boolean;
  shouldAnimateZoom: boolean;
  onSetActive: (id: string) => void;
  onUpdatePosition: (index: number, x: number) => void;
}

const DockItem: React.FC<DockItemProps> = ({
  dockItem,
  index,
  mouseX,
  containerX,
  activeView,
  shouldAutoClickOnHover,
  shouldAnimateZoom,
  onSetActive,
  onUpdatePosition,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
      left: 0,
    };

    const XDiffToContainerX = bounds.x - containerX.get();
    const dist = val - bounds.width / 2 - XDiffToContainerX;

    // Update position
    onUpdatePosition(index, bounds.x);

    return dist;
  });

  const widthSync = useTransform(distance, [-125, 0, 125], [44, 85, 44]);
  const width = shouldAnimateZoom
    ? useSpring(widthSync, { stiffness: 400, damping: 25 })
    : widthSync;

  const handleMouseEnter = () => {
    if (shouldAutoClickOnHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        onSetActive(dockItem.id);
      }, 500);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleClick = () => {
    onSetActive(dockItem.id);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      role="button"
      tabIndex={index}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        ref={ref}
        style={{ width }}
        transition={{
          type: 'spring',
          stiffness: 800,
          damping: 300,
          mass: 0.3,
          duration: 0.8,
        }}
        role="button"
        className={cn(
          activeView === dockItem.id
            ? 'active ring-1 ring-slate-300'
            : 'cursor-pointer',
          'group relative p-0.5 flex aspect-square items-center justify-center overflow-hidden rounded-full',
          'transition active:-translate-y-10 duration-500',
          'bg-[#DED8C4]',
          'hover:bg-[#E5DFC9]',
          'shadow-md',
          'before:absolute before:inset-0 before:rounded-full',
          'before:bg-gradient-to-tl',
          'before:from-white/40',
          'before:to-transparent',
          'before:opacity-100',
          'after:absolute after:inset-0 after:rounded-full',
          'after:bg-gradient-to-br',
          'after:from-transparent',
          'after:to-black/10',
          'active:duration-[4000ms] active:ease-out',
          '[&.active]:before:from-white/70',
          '[&.active]:shadow-lg',
          '[&.active]:bg-[linear-gradient(110deg,#DED8C4,45%,#EDE8D5,55%,#DED8C4)]',
          '[&.active]:bg-[length:200%_100%]',
          '[&.active]:animate-shine'
        )}
      >
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-black/5 opacity-50 group-[:has(.active)]:from-white/50"></div>

        <div className="relative z-10 transition-colors duration-300 text-neutral-600 group-hover:text-neutral-800">
          {dockItem?.icon && (
            <div
              className={cn(
                'flex flex-col items-center transition-opacity duration-300',
                activeView === dockItem.id ? 'opacity-100' : 'opacity-60'
              )}
            >
              <div className="h-8 w-10 flex items-center justify-center">
                {dockItem.icon({ size: 32 })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default function AppDockMenu({
  listDockApps,
  handleAppDockClick,
  shouldAutoClickOnHover = true,
  shouldAnimateZoom = true,
  gapBetweenItems = false,
  bgColor = '#DED8C4',
  className,
  initialActiveId,
}: AppDockMenuProps) {
  const [activeView, setActiveView] = useState(
    initialActiveId || listDockApps?.[0]?.id || ''
  );
  const [dockItemPositions, setDockItemPositions] = useState<
    Record<string, number>
  >({});

  const mouseX = useMotionValue(Infinity);
  const containerX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentApp = listDockApps.find((app) => app.id === activeView);
    if (currentApp) {
      document.title = currentApp.title;
    }
    if (activeView) {
      handleAppDockClick(activeView);
    }
  }, [activeView, listDockApps, handleAppDockClick]);

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      containerX.set(rect.x);
    }
  };

  const updateDockItemPosition = (index: number, x: number) => {
    setDockItemPositions((positions) => ({
      ...positions,
      [listDockApps[index].id]: x,
    }));
  };

  return (
    <div style={{ userSelect: 'none' }} className={cn('bottom-4', className)}>
      <motion.div
        ref={containerRef}
        role="toolbar"
        aria-orientation="horizontal"
        aria-label="Dock Menu"
        style={{ userSelect: 'none', backgroundColor: bgColor }}
        tabIndex={0}
        className={cn(
          'h-16 items-end rounded-full border px-3 pb-2 flex shadow-inner shadow-neutral-300/5',
          gapBetweenItems ? 'gap-5' : 'gap-1'
        )}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {listDockApps.map((dockItem, index) => (
          <DockItem
            key={dockItem.id}
            dockItem={dockItem}
            index={index}
            mouseX={mouseX}
            containerX={containerX}
            activeView={activeView}
            shouldAutoClickOnHover={shouldAutoClickOnHover}
            shouldAnimateZoom={shouldAnimateZoom}
            onSetActive={setActiveView}
            onUpdatePosition={updateDockItemPosition}
          />
        ))}
      </motion.div>
    </div>
  );
}
